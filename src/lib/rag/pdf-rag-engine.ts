import { extractTextFromPdf, ExtractedPage } from '../pdf/pdf-extractor';
import { GroqClient } from '../ai/groq-client';

export interface RagChunk {
  id: string;
  pageNumber: number;
  pageRange: [number, number];
  content: string;
  charCount: number;
  wordCount: number;
  tokenCount: number;
  terms: Map<string, number>; // Term frequency for BM25 retrieval
}

export interface RagSearchResult {
  chunk: RagChunk;
  score: number;
  pageNumber: number;
  snippet: string;
}

export interface PdfRagIndex {
  documentTitle: string;
  totalPages: number;
  totalChunks: number;
  chunks: RagChunk[];
  averageDocLength: number;
  docFrequency: Map<string, number>; // Inverse Document Frequency table
  tableOfContents: string[];
  suggestedModules: string[];
}

/**
 * Stop words for token filtering to make BM25 retrieval accurate on academic texts
 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
  'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_\-\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Client-Side RAG Engine for Large Documents (100+ pages)
 * Implements BM25 Probabilistic Relevance Ranking for rapid, accurate retrieval.
 */
export class PdfRagEngine {
  private static BM25_K1 = 1.2;
  private static BM25_B = 0.75;

  /**
   * Builds a persistent RAG index from a PDF file.
   * Handles 100+ pages smoothly with progressive progress callbacks.
   */
  static async buildIndexFromPdf(
    file: File,
    onProgress?: (stage: string, progressPercent: number) => void
  ): Promise<PdfRagIndex> {
    onProgress?.('Extracting text from all pages…', 10);

    // 1. Extract text from all pages
    const extraction = await extractTextFromPdf(file, (current, total, status) => {
      const pct = Math.round(10 + (current / total) * 40); // 10% to 50%
      onProgress?.(`Reading PDF: ${status} (${Math.round((current / total) * 100)}%)`, pct);
    });

    onProgress?.('Chunking document into semantic passages…', 55);

    const docTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const index = this.buildIndexFromPages(docTitle, extraction.pages);
    onProgress?.('RAG Index built successfully!', 100);
    return index;
  }

  /**
   * Rebuilds or generates a RAG index instantly from stored page content or text.
   * Enables seamless on-demand synthesis without re-uploading original binary files.
   */
  static buildIndexFromContent(documentTitle: string, fullContent: string): PdfRagIndex {
    if (!fullContent || !fullContent.trim()) {
      return {
        documentTitle,
        totalPages: 1,
        totalChunks: 0,
        chunks: [],
        averageDocLength: 1,
        docFrequency: new Map(),
        tableOfContents: [],
        suggestedModules: []
      };
    }

    const pageChunks = fullContent.split(/(?=\[Page\s+\d+\])/i);
    const pages: ExtractedPage[] = [];

    if (pageChunks.length > 1) {
      for (let i = 0; i < pageChunks.length; i++) {
        const chunk = pageChunks[i];
        const match = chunk.match(/\[Page\s+(\d+)\]:?\s*/i);
        const pageNum = match ? parseInt(match[1], 10) : i + 1;
        const text = chunk.replace(/\[Page\s+\d+\]:?\s*/i, '').trim();
        if (text) {
          pages.push({ pageNumber: pageNum, text, charCount: text.length });
        }
      }
    } else {
      // Split into ~350 word pages
      const words = fullContent.split(/\s+/).filter(Boolean);
      const wordsPerPage = 350;
      let pNum = 1;
      for (let i = 0; i < words.length; i += wordsPerPage) {
        const pageText = words.slice(i, i + wordsPerPage).join(' ');
        pages.push({
          pageNumber: pNum++,
          text: pageText,
          charCount: pageText.length
        });
      }
    }

    return this.buildIndexFromPages(documentTitle, pages);
  }

  /**
   * Core index builder from an array of ExtractedPages.
   */
  static buildIndexFromPages(documentTitle: string, pages: ExtractedPage[]): PdfRagIndex {
    const chunks: RagChunk[] = [];
    const docFrequency = new Map<string, number>();
    let totalWordLength = 0;
    let chunkCounter = 0;
    const chunkSizeWords = 320;
    const overlapWords = 50;

    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      const page = pages[pIdx];
      const pageWords = page.text.split(/\s+/).filter(Boolean);
      if (pageWords.length === 0) continue;

      let wordStart = 0;
      while (wordStart < pageWords.length) {
        const slice = pageWords.slice(wordStart, wordStart + chunkSizeWords);
        const text = slice.join(' ');
        const tokens = tokenize(text);

        // Term frequencies for BM25
        const termFreq = new Map<string, number>();
        const seenInChunk = new Set<string>();

        for (const token of tokens) {
          termFreq.set(token, (termFreq.get(token) || 0) + 1);
          if (!seenInChunk.has(token)) {
            seenInChunk.add(token);
            docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
          }
        }

        chunks.push({
          id: `chunk-${++chunkCounter}`,
          pageNumber: page.pageNumber,
          pageRange: [page.pageNumber, page.pageNumber],
          content: text,
          charCount: text.length,
          wordCount: slice.length,
          tokenCount: tokens.length,
          terms: termFreq
        });

        totalWordLength += slice.length;

        if (wordStart + chunkSizeWords >= pageWords.length) {
          break;
        }
        wordStart += (chunkSizeWords - overlapWords);
      }
    }

    const averageDocLength = chunks.length > 0 ? totalWordLength / chunks.length : 1;

    const firstPagesText = pages
      .slice(0, Math.min(12, pages.length))
      .map(p => `[Page ${p.pageNumber}]: ${p.text.slice(0, 500)}`)
      .join('\n');

    const fullDocText = pages.map(p => p.text).join('\n');
    const suggestedModules = this.detectSyllabusModules(firstPagesText, fullDocText);

    return {
      documentTitle,
      totalPages: pages.length > 0 ? pages[pages.length - 1].pageNumber : 1,
      totalChunks: chunks.length,
      chunks,
      averageDocLength,
      docFrequency,
      tableOfContents: [],
      suggestedModules
    };
  }

  /**
   * Parses all pending module placeholders from markdown text.
   */
  static getPendingModules(markdown: string): { index: number; startPage: number; endPage: number; title: string; rawMarker: string }[] {
    const list: { index: number; startPage: number; endPage: number; title: string; rawMarker: string }[] = [];
    const regex = /<!-- PENDING_SYNTHESIS_START:index=(\d+):startPage=(\d+):endPage=(\d+):title=([^ \n>]+) -->([\s\S]*?)<!-- PENDING_SYNTHESIS_END -->/g;
    let match;
    while ((match = regex.exec(markdown)) !== null) {
      list.push({
        index: parseInt(match[1], 10),
        startPage: parseInt(match[2], 10),
        endPage: parseInt(match[3], 10),
        title: decodeURIComponent(match[4]),
        rawMarker: match[0]
      });
    }
    return list;
  }

  /**
   * BM25 Vector/Term Search over the RAG chunks
   */
  static search(index: PdfRagIndex, query: string, topK = 6): RagSearchResult[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const scores: { chunk: RagChunk; score: number }[] = [];
    const N = index.chunks.length;
    const avgdl = index.averageDocLength;
    const k1 = this.BM25_K1;
    const b = this.BM25_B;

    for (const chunk of index.chunks) {
      let score = 0;
      const D = chunk.wordCount;

      for (const q of queryTokens) {
        const tf = chunk.terms.get(q) || 0;
        if (tf === 0) continue;

        const df = index.docFrequency.get(q) || 1;
        // Robertson-Spärck Jones IDF
        const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
        const numerator = tf * (k1 + 1);
        const denominator = tf + k1 * (1 - b + b * (D / avgdl));
        score += idf * (numerator / denominator);
      }

      if (score > 0) {
        scores.push({ chunk, score });
      }
    }

    scores.sort((a, b) => b.score - a.score);

    return scores.slice(0, topK).map(s => ({
      chunk: s.chunk,
      score: s.score,
      pageNumber: s.chunk.pageNumber,
      snippet: s.chunk.content.slice(0, 200) + '…'
    }));
  }

  /**
   * Synthesizes a single module using BM25 RAG retrieval and strict academic formatting.
   */
  static async synthesizeSingleModuleContent(
    index: PdfRagIndex,
    moduleNumber: number,
    topicTitle: string,
    targetStartPage: number,
    targetEndPage: number
  ): Promise<{ content: string; citedPages: number[] }> {
    const pageChunks = index.chunks.filter(c => c.pageNumber >= targetStartPage && c.pageNumber <= targetEndPage);
    const topSearch = this.search(index, topicTitle, 4);

    const combinedChunks = [...pageChunks.slice(0, 5), ...topSearch.map(s => s.chunk)];
    const uniqueChunks = Array.from(new Map(combinedChunks.map(c => [c.id, c])).values()).slice(0, 7);

    const citedPages = Array.from(new Set(uniqueChunks.map(r => r.pageNumber))).sort((a, b) => a - b);

    const contextBlock = uniqueChunks
      .map(r => `[From Page ${r.pageNumber}]:\n${r.content}`)
      .join('\n\n---\n\n');

    const prompt = `
You are an expert university computer science professor generating exhaustive, high-yield study notes.
Using ONLY the following textbook passages from Pages ${citedPages.join(', ')} of a ${index.totalPages}-page textbook, write a comprehensive study note for:
"Module ${moduleNumber}: ${topicTitle}"

RETRIEVED PASSAGES (Ground Truth):
"""
${contextBlock}
"""

Instructions:
1. Cover ALL concepts, protocols, numbers, algorithms, and definitions present in these passages. Do not omit technical details.
2. Include exact citations: [Page X] after major facts and derivations.
3. Structure clearly with:
   - ## ${topicTitle}
   - ### Core Principles & Formulations (bullet points with in-depth explanations)
   - ### Mathematical Formulas & Derivations
     * For math, cases, and equations, write valid LaTeX: use \\[ ... \\] for display equations or \\begin{cases} ... \\end{cases}, and \\( ... \\) for inline math.
   - ### Technical Architecture & Flowchart Diagram
     * Always provide an interactive vector Mermaid diagram (\`\`\`mermaid ... \`\`\`) illustrating the key architecture, state transition, protocol exchange, or algorithm flowchart for this topic.
   - ### KTU Exam Focus: 3-Mark & 8-Mark Ready Answers
     * In tables or lists, do NOT use literal "<br>" tags. Use natural sentences and clean markdown.
     * Do NOT prefix bullet points with "###".
   - ### Topper's Intuition & Memory Anchor (1-line takeaway)
4. Ground strictly in the excerpts.
`;

    const sectionContent = await GroqClient.chatCompletion(
      [
        { role: 'system', content: 'You are an authoritative academic note creator. Ground all answers strictly in the provided excerpts.' },
        { role: 'user', content: prompt }
      ],
      { temperature: 0.35, maxTokens: 2500 }
    );

    return {
      content: sectionContent.trim(),
      citedPages
    };
  }

  /**
   * Generates initial notes with progressive batching (default first 3 sessions)
   * to strictly protect against AI rate limits (429), while keeping all remaining
   * modules queued and ready for 1-click on-demand synthesis as the student studies.
   */
  static async generateComprehensiveNotes(
    index: PdfRagIndex,
    onProgress?: (status: string, percent: number) => void,
    initialBatchCount: number = 3
  ): Promise<{ notes: string; topicBreakdown: { title: string; pages: number[] }[] }> {
    if (!GroqClient.isConfigured()) {
      throw new Error('Please configure your Groq or OpenRouter API key in AI Settings first.');
    }

    const topics: { title: string; targetStartPage: number; targetEndPage: number }[] = [];
    const totalPages = Math.max(1, index.totalPages);

    if (index.suggestedModules.length >= 4) {
      const step = Math.ceil(totalPages / index.suggestedModules.length);
      index.suggestedModules.forEach((m, idx) => {
        topics.push({
          title: m,
          targetStartPage: idx * step + 1,
          targetEndPage: Math.min(totalPages, (idx + 1) * step)
        });
      });
    } else {
      const numModules = Math.min(8, Math.max(3, Math.ceil(totalPages / 15)));
      const step = Math.ceil(totalPages / numModules);
      for (let m = 0; m < numModules; m++) {
        const startP = m * step + 1;
        const endP = Math.min(totalPages, (m + 1) * step);
        const moduleLabel = m === 0 ? 'Foundations, Architecture & Terminology'
          : m === numModules - 1 ? 'Advanced Concepts, High-Yield Problems & Practice'
          : `Core Systems, Formulations & Protocols (Part ${m})`;
        topics.push({
          title: `${moduleLabel} (Pages ${startP}–${endP})`,
          targetStartPage: startP,
          targetEndPage: endP
        });
      }
    }

    const generatedSections: string[] = [];
    const topicBreakdown: { title: string; pages: number[] }[] = [];

    // Master Header
    generatedSections.push(
      `# 📚 ${index.documentTitle} — Complete Courseware & Study Notes\n` +
      `> **Document Scope:** Full ${index.totalPages} Pages | **Index Resolution:** ${index.totalChunks} Semantic Passages\n` +
      `> **Rate Limit Safe:** Sessions 1–${Math.min(initialBatchCount, topics.length)} synthesized immediately. Remaining sessions ready to synthesize on demand.\n\n` +
      `---\n`
    );

    const totalTopics = topics.length;
    const initialBatch = Math.min(initialBatchCount, totalTopics);

    for (let i = 0; i < totalTopics; i++) {
      const { title: topicTitle, targetStartPage, targetEndPage } = topics[i];

      if (i < initialBatch) {
        // Synthesize full notes immediately for the first batch of 3 sessions
        const stepPct = Math.round(15 + ((i + 1) / initialBatch) * 75);
        onProgress?.(`Synthesizing Initial Session ${i + 1}/${initialBatch}: Pages ${targetStartPage}–${targetEndPage}…`, stepPct);

        try {
          const { content, citedPages } = await this.synthesizeSingleModuleContent(
            index,
            i + 1,
            topicTitle,
            targetStartPage,
            targetEndPage
          );

          generatedSections.push(content);
          topicBreakdown.push({ title: topicTitle, pages: citedPages });

          if (i < initialBatch - 1) {
            await new Promise(r => setTimeout(r, 1200));
          }
        } catch (err: any) {
          console.warn(`Failed initial synthesis for "${topicTitle}":`, err);
          generatedSections.push(`## ${topicTitle}\n\n*Pages ${targetStartPage}–${targetEndPage}*\n\n*(Synthesis paused. You can generate this module in the note view).*`);
        }
      } else {
        // Prepare pending placeholder for subsequent sessions to prevent 429
        const pageChunks = index.chunks.filter(c => c.pageNumber >= targetStartPage && c.pageNumber <= targetEndPage);
        const previewSnippets = pageChunks.slice(0, 3)
          .map(c => `- **Page ${c.pageNumber}:** ${c.content.slice(0, 150).trim()}…`)
          .join('\n');

        const pendingBlock = `## Session ${i + 1}: ${topicTitle}\n\n` +
          `<!-- PENDING_SYNTHESIS_START:index=${i}:startPage=${targetStartPage}:endPage=${targetEndPage}:title=${encodeURIComponent(topicTitle)} -->\n` +
          `> ⚡ **Session ${i + 1} Ready for Progressive Synthesis**  \n` +
          `> **Textbook Scope:** Pages ${targetStartPage} to ${targetEndPage}  \n` +
          `> *Generated initial 3 sessions to protect AI API rate limits. Synthesize this session with 1 click when you are ready to study.*  \n\n` +
          `### 📖 Syllabus & Ground Truth Overview\n` +
          `${previewSnippets || `*Textbook passages for Pages ${targetStartPage}–${targetEndPage} indexed and ready.*`}\n\n` +
          `*(Click "✨ Synthesize This Session" or "✨ Synthesize Next 3 Sessions" to generate full comprehensive lecture notes with Mermaid flowcharts and formulas.)*\n` +
          `<!-- PENDING_SYNTHESIS_END -->`;

        generatedSections.push(pendingBlock);
        topicBreakdown.push({ title: topicTitle, pages: [targetStartPage, targetEndPage] });
      }

      // Add a milestone marker right after initial batch
      if (i === initialBatch - 1 && totalTopics > initialBatch) {
        generatedSections.push(
          `---\n` +
          `> 🎯 **Milestone: First ${initialBatch} Sessions Ready!**  \n` +
          `> *Review and master these core sessions first. You can synthesize the next chapters when ready.*  \n` +
          `---\n`
        );
      }
    }

    onProgress?.('Courseware initialized successfully!', 100);

    const fullMasterNote = generatedSections.join('\n\n---\n\n');
    return {
      notes: fullMasterNote,
      topicBreakdown
    };
  }

  /**
   * Synthesizes the next batch of pending modules (default 3) on demand.
   * Updates existing markdown smoothly while preserving previously generated sections.
   */
  static async synthesizeModuleBatch(
    index: PdfRagIndex,
    currentMarkdown: string,
    startModuleIndex?: number,
    batchCount: number = 3,
    onProgress?: (status: string, percent: number) => void
  ): Promise<{ updatedMarkdown: string; synthesizedCount: number }> {
    const pending = this.getPendingModules(currentMarkdown);
    if (pending.length === 0) {
      return { updatedMarkdown: currentMarkdown, synthesizedCount: 0 };
    }

    // Filter pending modules starting from startModuleIndex or the first available pending module
    const targetPending = startModuleIndex !== undefined
      ? pending.filter(p => p.index >= startModuleIndex).slice(0, batchCount)
      : pending.slice(0, batchCount);

    if (targetPending.length === 0) {
      return { updatedMarkdown: currentMarkdown, synthesizedCount: 0 };
    }

    let updated = currentMarkdown;
    let synthesizedCount = 0;

    for (let idx = 0; idx < targetPending.length; idx++) {
      const item = targetPending[idx];
      const pct = Math.round(15 + ((idx + 1) / targetPending.length) * 75);
      onProgress?.(`Synthesizing Session ${item.index + 1}: ${item.title} (Pages ${item.startPage}–${item.endPage})…`, pct);

      try {
        const { content } = await this.synthesizeSingleModuleContent(
          index,
          item.index + 1,
          item.title,
          item.startPage,
          item.endPage
        );

        // Replace the placeholder comment block with the newly synthesized lecture content
        updated = updated.replace(item.rawMarker, content);
        synthesizedCount++;

        if (idx < targetPending.length - 1) {
          await new Promise(r => setTimeout(r, 1200));
        }
      } catch (err: any) {
        console.error(`Error synthesizing module ${item.index + 1}:`, err);
        throw err;
      }
    }

    onProgress?.('Synthesis complete! Updating notes…', 100);
    return { updatedMarkdown: updated, synthesizedCount };
  }

  /**
   * Interactive RAG Question-Answering for the 100+ page document
   */
  static async answerQuestion(
    index: PdfRagIndex,
    question: string
  ): Promise<{ answer: string; citedPages: number[]; sources: RagSearchResult[] }> {
    const retrieved = this.search(index, question, 6);
    const citedPages = Array.from(new Set(retrieved.map(r => r.pageNumber))).sort((a, b) => a - b);

    if (retrieved.length === 0) {
      return {
        answer: 'No relevant passages found in the uploaded 100-page document for this query.',
        citedPages: [],
        sources: []
      };
    }

    const context = retrieved
      .map(r => `[Page ${r.pageNumber}]: ${r.chunk.content}`)
      .join('\n\n');

    const prompt = `
You are a precise teaching assistant answering student questions about an uploaded ${index.totalPages}-page document.
Answer the student's question based STRICTLY on the retrieved excerpts below. Cite the page numbers [Page X] for every claim.

RETRIEVED DOCUMENT CONTEXT:
"""
${context}
"""

STUDENT QUESTION:
"${question}"

Provide a clear, thorough, exam-ready answer with derivations/formulas where applicable.
`;

    const answer = await GroqClient.chatCompletion(
      [
        { role: 'system', content: 'You are a precise academic tutor. Ground all facts in the retrieved pages and cite them.' },
        { role: 'user', content: prompt }
      ],
      { temperature: 0.25, maxTokens: 2000 }
    );

    return {
      answer,
      citedPages,
      sources: retrieved
    };
  }

  /**
   * Auto-detects main modules or syllabus units from the document
   */
  private static detectSyllabusModules(introText: string, fullText: string): string[] {
    const detected: string[] = [];

    // Check for "Module 1", "Unit 1", "Chapter 1" patterns
    const moduleRegex = /(?:Module|Unit|Chapter)\s*([1-5I|V|X]+)[:\s\-\.]*([A-Za-z0-9\s,\/\(\)]{4,60})/gi;
    let match;
    const seen = new Set<string>();

    while ((match = moduleRegex.exec(introText)) !== null && detected.length < 6) {
      const cleanTitle = match[0].trim().replace(/\s+/g, ' ');
      if (!seen.has(cleanTitle) && cleanTitle.length > 8) {
        seen.add(cleanTitle);
        detected.push(cleanTitle);
      }
    }

    // Fallback: search throughout document headings if intro didn't find clear modules
    if (detected.length < 3) {
      const headingRegex = /(?:^|\n)(?:#+\s*|[0-9]\.[0-9]\s+|[A-Z\s]{5,30}\n)([A-Z][A-Za-z\s]{5,40})/g;
      while ((match = headingRegex.exec(fullText.slice(0, 15000))) !== null && detected.length < 5) {
        const h = match[1].trim();
        if (h.length > 5 && !seen.has(h) && !STOP_WORDS.has(h.toLowerCase())) {
          seen.add(h);
          detected.push(h);
        }
      }
    }

    return detected.length >= 2 ? detected : [
      'Foundations, Core Concepts & Key Terminology',
      'System Architecture, Schematics and Workflows',
      'Algorithms, Protocols and Mathematical Derivations',
      'Evaluation, Case Studies and Comparative Trade-offs',
      'KTU Examination High-Yield Numerical & 8-Mark Questions'
    ];
  }
}
