import { pdfjs } from 'react-pdf';

// Ensure PDF.js worker is configured
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

export interface ExtractedPage {
  pageNumber: number;
  text: string;
  charCount: number;
}

export interface PdfExtractionResult {
  totalPages: number;
  pages: ExtractedPage[];
  totalCharacters: number;
  fullText: string;
}

export interface PdfChunk {
  chunkIndex: number;
  startPage: number;
  endPage: number;
  text: string;
  estimatedWords: number;
}

/**
 * Extracts text page-by-page from a PDF file using client-side PDF.js.
 * Supports large PDFs (100+ pages) without crashing memory.
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (current: number, total: number, status: string) => void,
  startPage = 1,
  endPage?: number
): Promise<PdfExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load PDF document
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
    isEvalSupported: false,
  });

  const pdf = await loadingTask.promise;
  const totalPagesInDoc = pdf.numPages;

  const actualStart = Math.max(1, Math.min(startPage, totalPagesInDoc));
  const actualEnd = Math.min(totalPagesInDoc, endPage && endPage > 0 ? endPage : totalPagesInDoc);

  const pages: ExtractedPage[] = [];
  let totalCharacters = 0;
  let fullText = '';

  for (let pageNum = actualStart; pageNum <= actualEnd; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => (item.str ? item.str : ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      pages.push({
        pageNumber: pageNum,
        text: pageText,
        charCount: pageText.length
      });

      totalCharacters += pageText.length;
      fullText += `\n\n--- [Page ${pageNum}] ---\n${pageText}`;

      if (onProgress) {
        onProgress(
          pageNum - actualStart + 1,
          actualEnd - actualStart + 1,
          `Extracted page ${pageNum} of ${actualEnd}`
        );
      }
    } catch (err) {
      console.warn(`Failed to extract text from page ${pageNum}:`, err);
      pages.push({
        pageNumber: pageNum,
        text: `[Error reading page ${pageNum}]`,
        charCount: 0
      });
    }
  }

  return {
    totalPages: totalPagesInDoc,
    pages,
    totalCharacters,
    fullText
  };
}

/**
 * Splits extracted PDF pages into balanced chunks suitable for LLM prompts.
 * Typically 6–10 pages per chunk (approx. 2,000 - 4,000 words).
 */
export function chunkPdfPages(
  pages: ExtractedPage[],
  targetWordsPerChunk = 2500,
  maxPagesPerChunk = 10
): PdfChunk[] {
  if (pages.length === 0) return [];

  const chunks: PdfChunk[] = [];
  let currentPages: ExtractedPage[] = [];
  let currentWordCount = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageWords = page.text ? page.text.split(/\s+/).length : 0;

    currentPages.push(page);
    currentWordCount += pageWords;

    // Check if chunk threshold reached
    const reachedWordLimit = currentWordCount >= targetWordsPerChunk;
    const reachedPageLimit = currentPages.length >= maxPagesPerChunk;
    const isLastPage = i === pages.length - 1;

    if ((reachedWordLimit || reachedPageLimit) && currentPages.length >= 3 || isLastPage) {
      const startPage = currentPages[0].pageNumber;
      const endPage = currentPages[currentPages.length - 1].pageNumber;

      const chunkText = currentPages
        .map(p => `[Page ${p.pageNumber}]:\n${p.text}`)
        .join('\n\n');

      chunks.push({
        chunkIndex: chunks.length + 1,
        startPage,
        endPage,
        text: chunkText,
        estimatedWords: currentWordCount
      });

      currentPages = [];
      currentWordCount = 0;
    }
  }

  return chunks;
}
