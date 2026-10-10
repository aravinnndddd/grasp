export interface NoteSubsection {
  title: string;
  level: number;
}

export interface NoteSection {
  id: string;
  index: number;
  title: string;
  moduleLabel?: string;
  pageRange?: string;
  content: string;
  wordCount: number;
  estimatedMinutes: number;
  subsections: NoteSubsection[];
  hasFormulas: boolean;
  hasDiagrams: boolean;
  hasExamQuestions: boolean;
  summary: string;
}

export interface SectioniseResult {
  title: string;
  totalSections: number;
  totalWords: number;
  sections: NoteSection[];
}

/**
 * Sectioniser Engine: Splits long academic notes (from 100+ page PDFs, RAG guides, or lecture notes)
 * into structured interactive notebook sections.
 */
export function sectioniseNote(rawMarkdown: string, defaultTitle = 'Study Notebook'): SectioniseResult {
  if (!rawMarkdown || !rawMarkdown.trim()) {
    return {
      title: defaultTitle,
      totalSections: 1,
      totalWords: 0,
      sections: [{
        id: 'section-1',
        index: 0,
        title: 'Empty Note',
        content: '# No content available',
        wordCount: 0,
        estimatedMinutes: 1,
        subsections: [],
        hasFormulas: false,
        hasDiagrams: false,
        hasExamQuestions: false,
        summary: 'No content.'
      }]
    };
  }

  const lines = rawMarkdown.split('\n');
  let detectedDocTitle = defaultTitle;

  // Extract first # title if present
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const l = lines[i].trim();
    if (l.startsWith('# ') && !l.startsWith('## ')) {
      detectedDocTitle = l.replace(/^#\s+/, '').replace(/^📚\s*/, '').trim();
      break;
    }
  }

  // Regex for section boundary:
  // 1. `## Heading`
  // 2. `---` followed by `##`
  // 3. `Module X:` or `Chapter X:`
  const sectionChunks: { title: string; lines: string[]; pageRange?: string }[] = [];
  let currentLines: string[] = [];
  let currentTitle = 'Overview & Core Scope';
  let currentPageRange: string | undefined = undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if this line indicates a page marker
    const pageMatch = trimmed.match(/\[(?:From\s+)?Page\s+(\d+)\]/i) || trimmed.match(/---\s*\[Page\s+(\d+)\]\s*---/i);
    if (pageMatch && !currentPageRange) {
      currentPageRange = `Page ${pageMatch[1]}`;
    }

    // Check if this line is a top-level section split (## Heading or Module/Chapter)
    const isHeading2 = trimmed.startsWith('## ') && !trimmed.startsWith('### ');
    const isMajorDivider = (trimmed === '---' || trimmed === '***') && i + 1 < lines.length && lines[i + 1].trim().startsWith('## ');

    if ((isHeading2 || isMajorDivider) && currentLines.length > 0) {
      sectionChunks.push({
        title: currentTitle,
        lines: [...currentLines],
        pageRange: currentPageRange
      });

      currentLines = [];
      currentPageRange = undefined;

      if (isMajorDivider) {
        // Skip divider line, title will be next line
        i++;
        currentTitle = lines[i].trim().replace(/^##\s+/, '');
      } else {
        currentTitle = trimmed.replace(/^##\s+/, '');
      }
      continue;
    }

    currentLines.push(line);
  }

  // Push final section
  if (currentLines.length > 0) {
    sectionChunks.push({
      title: currentTitle,
      lines: currentLines,
      pageRange: currentPageRange
    });
  }

  // If only 1 section was created and content is huge (>1200 words), split by page boundaries or horizontal rules
  let finalChunks = sectionChunks;
  if (finalChunks.length <= 1 && rawMarkdown.length > 4000) {
    const subSplit = splitByPageOrDivider(rawMarkdown, detectedDocTitle);
    if (subSplit.length > 1) {
      finalChunks = subSplit;
    }
  }

  let totalWords = 0;

  const sections: NoteSection[] = finalChunks.map((chunk, idx) => {
    const content = chunk.lines.join('\n').trim();
    const words = content.split(/\s+/).filter(Boolean).length;
    totalWords += words;

    // Detect subsections (###)
    const subsections: NoteSubsection[] = [];
    chunk.lines.forEach(l => {
      const t = l.trim();
      if (t.startsWith('### ')) {
        subsections.push({
          title: t.replace(/^###\s+/, '').trim(),
          level: 3
        });
      }
    });

    // Detect module label (e.g. Module 1, Module 2)
    const modMatch = chunk.title.match(/(?:Module|Unit|Chapter)\s*(\d+|[I|V|X]+)/i);
    const moduleLabel = modMatch ? `Module ${modMatch[1]}` : `Section ${idx + 1}`;

    // Detect page ranges in this section
    const allPageMatches = Array.from(content.matchAll(/(?:Page|Pages)\s*(\d+)(?:\s*(?:to|-)\s*(\d+))?/gi));
    let detectedPageRange = chunk.pageRange;
    if (allPageMatches.length > 0 && !detectedPageRange) {
      const firstP = allPageMatches[0][1];
      const lastP = allPageMatches[allPageMatches.length - 1][1];
      detectedPageRange = firstP === lastP ? `Page ${firstP}` : `Pages ${firstP}–${lastP}`;
    }

    // Feature detections
    const hasFormulas = content.includes('$') || content.includes('```c') || content.includes('```python') || content.includes('```java') || content.includes('O(');
    const hasDiagrams = content.includes('```mermaid') || content.includes('+---+');
    const hasExamQuestions = /3-mark|8-mark|exam takeaway|university question/i.test(content);

    // Summary extraction
    const firstParagraph = chunk.lines.find(l => l.trim().length > 30 && !l.trim().startsWith('#') && !l.trim().startsWith('>'));
    const summary = firstParagraph ? firstParagraph.trim().slice(0, 160) + '…' : 'Detailed lecture study notes.';

    return {
      id: `section-${idx + 1}`,
      index: idx,
      title: chunk.title.replace(/^#+\s*/, ''),
      moduleLabel,
      pageRange: detectedPageRange,
      content,
      wordCount: words,
      estimatedMinutes: Math.max(1, Math.round(words / 180)),
      subsections,
      hasFormulas,
      hasDiagrams,
      hasExamQuestions,
      summary
    };
  });

  return {
    title: detectedDocTitle,
    totalSections: sections.length,
    totalWords,
    sections
  };
}

/**
 * Fallback splitter for documents without explicit ## headers (e.g. long text dumps)
 */
function splitByPageOrDivider(text: string, baseTitle: string): { title: string; lines: string[]; pageRange?: string }[] {
  const parts = text.split(/(?=\n---|\n\[Page\s+\d+\])/i);
  if (parts.length <= 1) return [{ title: baseTitle, lines: text.split('\n') }];

  return parts.map((part, i) => {
    const lines = part.split('\n');
    const firstNonEmpty = lines.find(l => l.trim().length > 0) || `Part ${i + 1}`;
    const cleanTitle = firstNonEmpty.replace(/^[#\-\s\[\]]+/, '').slice(0, 50) || `Section ${i + 1}`;
    return {
      title: cleanTitle,
      lines
    };
  });
}
