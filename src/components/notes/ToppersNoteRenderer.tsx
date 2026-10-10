import React from 'react';
import { Lightbulb, Info, FileText, CheckCircle2 } from 'lucide-react';
import { MermaidDiagram } from './MermaidDiagram';
import katex from 'katex';

interface ToppersNoteRendererProps {
  content: string;
  className?: string;
  isDefinition?: boolean;
}

type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'hr' }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'mermaid'; code: string }
  | { type: 'code'; code: string; language?: string }
  | { type: 'math'; code: string }
  | { type: 'callout'; lines: string[] }
  | { type: 'bullet'; text: string }
  | { type: 'numbered'; num: string; text: string }
  | { type: 'image'; src: string; alt?: string; width?: string; height?: string }
  | { type: 'paragraph'; text: string };

/**
 * Parses markdown text and renders it with an authentic "Topper's Engineering Notebook" aesthetic:
 * - Structured markdown tables parsed into styled, responsive HTML tables
 * - Mermaid diagrams (```mermaid) rendered into interactive vector diagrams
 * - Blockquotes (>) rendered as prominent Examiner's Pro-Tip & Callout cards
 * - Bold text (**...**) rendered with authentic fluorescent highlighter markers
 * - Math formulas ($...$) rendered in clean technical formula chips
 * - Code/hex (`...`) rendered in monospace chips
 * - Wavy topper underlines for crucial valuation keywords
 */
export const ToppersNoteRenderer: React.FC<ToppersNoteRendererProps> = ({
  content,
  className = '',
  isDefinition = false
}) => {
  if (!content) return null;

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className={`space-y-3 leading-relaxed text-charcoal ${className || ''}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'hr':
            return <hr key={idx} className="my-3 border-line-border/60" />;

          case 'h2':
            return (
              <h3 key={idx} className="font-serif font-bold text-base text-charcoal pt-3 pb-1 border-b border-charcoal/20 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-accent inline-block shrink-0" />
                <span>{renderFormattedInline(block.text, isDefinition)}</span>
              </h3>
            );

          case 'h3':
            return (
              <h4 key={idx} className="font-serif font-bold text-sm text-charcoal pt-2.5 pb-1 border-b border-line-border/80 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full inline-block shrink-0" />
                <span>{renderFormattedInline(block.text, isDefinition)}</span>
              </h4>
            );

          case 'h4':
            return (
              <h5 key={idx} className="font-sans font-bold text-xs text-charcoal uppercase tracking-wider pt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-charcoal inline-block shrink-0" />
                <span>{renderFormattedInline(block.text, isDefinition)}</span>
              </h5>
            );

          case 'table':
            return (
              <div key={idx} className="my-3 overflow-x-auto rounded border border-line-border bg-white shadow-2xs max-w-full">
                <table className="min-w-full divide-y divide-line-border text-left border-collapse">
                  <thead className="bg-paper-dark">
                    <tr>
                      {block.headers.map((h, hIdx) => (
                        <th 
                          key={hIdx} 
                          className="px-3.5 py-2 font-mono text-[11px] font-bold text-charcoal uppercase tracking-wider border-r border-line-border/60 last:border-r-0 whitespace-nowrap"
                        >
                          {renderFormattedInline(h, isDefinition)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-border/60 bg-white">
                    {block.rows.map((row, rIdx) => (
                      <tr 
                        key={rIdx} 
                        className={rIdx % 2 === 0 ? 'bg-white hover:bg-paper-subtle/50' : 'bg-paper-50/60 hover:bg-paper-subtle/60'}
                      >
                        {row.map((cell, cIdx) => (
                          <td 
                            key={cIdx} 
                            className="px-3.5 py-2.5 text-xs text-charcoal border-r border-line-border/40 last:border-r-0 leading-relaxed align-top"
                          >
                            {renderFormattedInline(cell, isDefinition)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'math':
            return (
              <div key={idx} className="my-3 p-3.5 bg-paper-50/80 border border-blue-200/80 rounded-lg text-center overflow-x-auto shadow-2xs">
                <div
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      try {
                        return katex.renderToString(block.code, { displayMode: true, throwOnError: false, output: 'htmlAndMathml' });
                      } catch {
                        return `<pre class="font-mono text-xs text-blue-900">${block.code}</pre>`;
                      }
                    })()
                  }}
                />
              </div>
            );

          case 'mermaid':
            return <MermaidDiagram key={idx} chart={block.code} />;

          case 'code':
            return (
              <div key={idx} className="my-2 p-3 bg-paper-dark border border-line-border rounded font-mono text-[11px] overflow-x-auto text-charcoal shadow-2xs relative">
                <div className="text-[9px] font-mono uppercase text-charcoal-muted font-bold pb-1 mb-1 border-b border-line-border/60 flex items-center justify-between">
                  <span>[TECHNICAL SCHEMATIC / CODE]</span>
                  <span className="text-accent text-[8px] uppercase">{block.language || 'TEXT'}</span>
                </div>
                <pre className="whitespace-pre leading-snug">{block.code}</pre>
              </div>
            );

          case 'callout':
            return (
              <div key={idx} className="my-3 p-3.5 bg-amber-50/90 border-l-4 border-l-amber-500 border border-amber-200 shadow-2xs font-sans text-xs text-amber-950 space-y-1 rounded-r">
                <div className="font-mono text-[10px] font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>EXAMINER'S PRO-TIP & VALUATION INSIGHT</span>
                </div>
                <div className="leading-relaxed pl-5">
                  {block.lines.map((l, lIdx) => (
                    <p key={lIdx}>{renderFormattedInline(l, isDefinition)}</p>
                  ))}
                </div>
              </div>
            );

          case 'bullet':
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-accent font-bold text-sm leading-none mt-1 shrink-0">▸</span>
                <div className="flex-1">
                  {renderFormattedInline(block.text, isDefinition)}
                </div>
              </div>
            );

          case 'numbered':
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="font-mono text-[10px] font-bold bg-amber-100/90 text-amber-950 border border-amber-300 px-1.5 py-0.2 rounded shrink-0 mt-0.5 shadow-2xs">
                  {block.num}
                </span>
                <div className="flex-1">
                  {renderFormattedInline(block.text, isDefinition)}
                </div>
              </div>
            );

          case 'image':
            return (
              <figure key={idx} className="my-4 p-3 bg-white border border-stone-300 rounded shadow-xs flex flex-col items-center">
                <img
                  src={block.src}
                  alt={block.alt || 'Technical Architecture Schematic'}
                  style={{
                    maxWidth: block.width ? (block.width.includes('%') ? block.width : `${block.width}px`) : '100%',
                    maxHeight: block.height ? (block.height.includes('%') ? block.height : `${block.height}px`) : '550px'
                  }}
                  className="rounded object-contain mx-auto shadow-2xs border border-line-border/60"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const fallback = document.createElement('div');
                      fallback.className = 'p-3 bg-paper-dark border border-dashed border-charcoal/30 text-xs font-mono text-charcoal-muted text-center';
                      fallback.innerText = `[Image Reference: ${block.alt || block.src}]`;
                      target.parentElement.appendChild(fallback);
                    }
                  }}
                />
                {block.alt && (
                  <figcaption className="mt-2 text-[11px] font-mono text-charcoal-muted text-center">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );

          case 'paragraph':
          default:
            return (
              <p key={idx} className="leading-relaxed">
                {renderFormattedInline(block.text, isDefinition)}
              </p>
            );
        }
      })}
    </div>
  );
};

/**
 * Parses raw markdown lines into structured blocks
 */
function parseMarkdownBlocks(content: string): Block[] {
  const rawLines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Horizontal divider
    if (trimmed === '---' || trimmed === '***') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // 3. Fenced Code Block / Mermaid Diagram (```)
    if (trimmed.startsWith('```')) {
      const lang = trimmed.replace(/^```/, '').trim().toLowerCase();
      const codeLines: string[] = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
        codeLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length && rawLines[i].trim().startsWith('```')) {
        i++; // skip closing ```
      }
      const codeContent = codeLines.join('\n');

      if (lang === 'mermaid') {
        blocks.push({ type: 'mermaid', code: codeContent });
      } else {
        // Check if text/ascii diagram can be rendered with Mermaid
        const converted = tryConvertAsciiOrTextToMermaid(codeContent);
        if (converted) {
          blocks.push({ type: 'mermaid', code: converted });
        } else {
          blocks.push({ type: 'code', code: codeContent, language: lang });
        }
      }
      continue;
    }

    // 4. Markdown Table (| Header 1 | Header 2 |)
    if (trimmed.startsWith('|') && trimmed.includes('|')) {
      // Check if next line is table separator row (|---|---|)
      const nextLine = (i + 1 < rawLines.length) ? rawLines[i + 1].trim() : '';
      const isSeparator = /^\|?[\s\-:]+(\|[\s\-:]+)+\|?$/.test(nextLine);

      if (isSeparator) {
        // Parse header
        const headers = splitTableRow(trimmed);
        i += 2; // skip header and separator row

        // Parse rows
        const rows: string[][] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith('|')) {
          const rowCells = splitTableRow(rawLines[i].trim());
          if (rowCells.length > 0) {
            rows.push(rowCells);
          }
          i++;
        }

        blocks.push({ type: 'table', headers, rows });
        continue;
      }
    }

    // 5. Blockquote / Callout (> Tip: ...)
    if (trimmed.startsWith('>')) {
      const calloutLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('>')) {
        calloutLines.push(rawLines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'callout', lines: calloutLines });
      continue;
    }

    // 6. Headings
    if (trimmed.startsWith('#### ')) {
      blocks.push({ type: 'h4', text: trimmed.replace(/^####\s+/, '') });
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '') });
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '') });
      i++;
      continue;
    }

    // 7. ASCII Diagram pattern (+---+ or | ... | inside ascii box)
    if (trimmed.startsWith('+---+') || (trimmed.includes('+--') && trimmed.endsWith('+'))) {
      const asciiLines: string[] = [line];
      i++;
      while (i < rawLines.length && (rawLines[i].includes('|') || rawLines[i].includes('+') || rawLines[i].includes('-'))) {
        asciiLines.push(rawLines[i]);
        i++;
      }
      blocks.push({ type: 'code', code: asciiLines.join('\n'), language: 'schematic' });
      continue;
    }

    // 2.5 LaTeX Display Math Blocks (\[ ... \], $$, or \begin{cases} ... \end{cases})
    if (trimmed === '\\[' || (trimmed.startsWith('\\[') && !trimmed.endsWith('\\]'))) {
      const mathLines: string[] = [line.replace(/^\s*\\\[/, '')];
      i++;
      while (i < rawLines.length && !rawLines[i].includes('\\]')) {
        mathLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length && rawLines[i].includes('\\]')) {
        mathLines.push(rawLines[i].replace(/\\\]\s*$/, ''));
        i++;
      }
      const code = mathLines.join('\n').trim();
      if (code) {
        blocks.push({ type: 'math', code });
      }
      continue;
    }

    if (trimmed === '$$' || (trimmed.startsWith('$$') && !trimmed.endsWith('$$') && trimmed.length > 2)) {
      const mathLines: string[] = [line.replace(/^\s*\$\$/, '')];
      i++;
      while (i < rawLines.length && !rawLines[i].includes('$$')) {
        mathLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length && rawLines[i].includes('$$')) {
        mathLines.push(rawLines[i].replace(/\$\$\s*$/, ''));
        i++;
      }
      const code = mathLines.join('\n').trim();
      if (code) {
        blocks.push({ type: 'math', code });
      }
      continue;
    }

    if (trimmed.startsWith('\\begin{') && !trimmed.includes('\\end{')) {
      const envMatch = trimmed.match(/^\\begin\{([^}]+)\}/);
      const endMarker = envMatch ? `\\end{${envMatch[1]}}` : '\\end';
      const mathLines: string[] = [line];
      i++;
      while (i < rawLines.length && !rawLines[i].includes(endMarker)) {
        mathLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length && rawLines[i].includes(endMarker)) {
        mathLines.push(rawLines[i]);
        i++;
      }
      blocks.push({ type: 'math', code: mathLines.join('\n').trim() });
      continue;
    }

    // Heading lines disguised as bullets (e.g. `• ### KTU Exam Focus:` or `- ### KTU Exam Focus:`)
    if (/^[-*•]\s*###\s+/.test(trimmed)) {
      blocks.push({ type: 'h3', text: trimmed.replace(/^[-*•]\s*###\s+/, '') });
      i++;
      continue;
    }
    if (/^[-*•]\s*##\s+/.test(trimmed)) {
      blocks.push({ type: 'h2', text: trimmed.replace(/^[-*•]\s*##\s+/, '') });
      i++;
      continue;
    }

    // 8. Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const bText = trimmed.replace(/^[-*•]\s+/, '');
      if (bText.startsWith('### ')) {
        blocks.push({ type: 'h3', text: bText.replace(/^###\s+/, '') });
      } else if (bText.startsWith('## ')) {
        blocks.push({ type: 'h2', text: bText.replace(/^##\s+/, '') });
      } else {
        blocks.push({ type: 'bullet', text: bText });
      }
      i++;
      continue;
    }

    // 9. Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      blocks.push({ type: 'numbered', num: numMatch[1], text: numMatch[2] });
      i++;
      continue;
    }

    // 10. Image Tag (<img ...>) or Markdown Image (![alt](url))
    const imgHtmlMatch = trimmed.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i);
    const mdImgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgHtmlMatch || mdImgMatch) {
      let src = '';
      let alt = '';
      let width = '';
      let height = '';

      if (imgHtmlMatch) {
        src = imgHtmlMatch[1];
        const altMatch = trimmed.match(/alt=["']([^"']*)["']/i);
        const widthMatch = trimmed.match(/width=["']?(\d+%?|\d+px)?["']?/i);
        const heightMatch = trimmed.match(/height=["']?(\d+%?|\d+px)?["']?/i);
        if (altMatch) alt = altMatch[1];
        if (widthMatch) width = widthMatch[1];
        if (heightMatch) height = heightMatch[1];
      } else if (mdImgMatch) {
        alt = mdImgMatch[1];
        src = mdImgMatch[2];
      }

      if (src) {
        blocks.push({
          type: 'image',
          src,
          alt,
          width,
          height
        });
        i++;
        continue;
      }
    }

    // 11. Regular paragraph
    blocks.push({ type: 'paragraph', text: line });
    i++;
  }

  return blocks;
}

/**
 * Splits a markdown table row by '|' cleanly, discarding empty edge cells
 */
function splitTableRow(rowStr: string): string[] {
  let cleaned = rowStr.trim();
  if (cleaned.startsWith('|')) cleaned = cleaned.substring(1);
  if (cleaned.endsWith('|')) cleaned = cleaned.substring(0, cleaned.length - 1);
  return cleaned.split('|').map(cell => cell.trim());
}

/**
 * Parses inline tokens: **bold** (highlighter), $math$ (chip), `code` (mono), *italic*, <img ...>, ![alt](url)
 */
function renderFormattedInline(text: string, isDefinition = false): React.ReactNode[] {
  const tokenRegex = /(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$|\$[^$\n]+\$|<br\s*\/?>|\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|<img\s+[^>]+>|!\[[^\]]*\]\([^)]+\))/gi;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // 0. Line break <br> or <br/>
    if (/^<br\s*\/?>$/i.test(part)) {
      return <br key={index} className="my-0.5" />;
    }

    // 1. LaTeX Math Formula Display \[...\] or $$...$$
    if ((part.startsWith('\\[') && part.endsWith('\\]')) || (part.startsWith('$$') && part.endsWith('$$'))) {
      const mathInner = part.startsWith('\\[') ? part.slice(2, -2).trim() : part.slice(2, -2).trim();
      try {
        const html = katex.renderToString(mathInner, { displayMode: true, throwOnError: false, output: 'htmlAndMathml' });
        return (
          <span
            key={index}
            className="block my-2 text-center overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return (
          <span key={index} className="font-mono text-[11px] bg-blue-50 text-blue-900 border border-blue-200 px-1.5 py-0.5 rounded mx-0.5 inline-block">
            {mathInner}
          </span>
        );
      }
    }

    // 2. LaTeX Math Formula Inline \(...\) or $...$
    if ((part.startsWith('\\(') && part.endsWith('\\)')) || (part.startsWith('$') && part.endsWith('$'))) {
      const mathInner = part.startsWith('\\(') ? part.slice(2, -2).trim() : part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(mathInner, { displayMode: false, throwOnError: false, output: 'htmlAndMathml' });
        return (
          <span
            key={index}
            className="inline-block align-middle mx-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return (
          <span key={index} className="font-mono text-[11px] bg-blue-50 text-blue-900 border border-blue-200 px-1.5 py-0.5 rounded mx-0.5 inline-block">
            {mathInner}
          </span>
        );
      }
    }

    // 3. Bold text (**text**) -> Fluorescent Highlighter Pen
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      const isHeaderKey = inner.endsWith(':');

      if (isDefinition) {
        return (
          <span 
            key={index}
            className="marker-green text-emerald-950 font-bold px-1.5 py-0.5 rounded-[2px] border-b-2 border-emerald-400 mx-0.5 shadow-2xs inline-block"
          >
            {inner}
          </span>
        );
      }

      if (isHeaderKey) {
        return (
          <span 
            key={index}
            className="marker-yellow text-amber-950 font-extrabold px-2 py-0.5 rounded-[2px] border-b-2 border-amber-400 mr-1.5 shadow-2xs inline-flex items-center gap-1.5 my-0.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block shrink-0" />
            <span>{inner}</span>
          </span>
        );
      }

      return (
        <span 
          key={index}
          className="marker-yellow text-amber-950 font-bold px-1.5 py-0.5 rounded-[2px] border-b-2 border-amber-300 mx-0.5 inline-block"
        >
          {inner}
        </span>
      );
    }

    // 3. Inline Code (`...`) -> Monospace Chip
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeInner = part.slice(1, -1);
      return (
        <code 
          key={index}
          className="font-mono text-[11px] bg-paper-dark border border-line-border px-1.5 py-0.5 rounded text-charcoal font-semibold mx-0.5"
        >
          {codeInner}
        </code>
      );
    }

    // 4. Markdown Link [Title](Url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline decoration-accent/60 underline-offset-2 hover:text-accent/80 font-medium inline-flex items-center gap-0.5"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // 5. Inline Image tag <img ...> or ![alt](url)
    const imgTagMatch = part.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i);
    const mdImgInline = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgTagMatch || mdImgInline) {
      const src = imgTagMatch ? imgTagMatch[1] : (mdImgInline ? mdImgInline[2] : '');
      const altMatch = part.match(/alt=["']([^"']*)["']/i);
      const alt = altMatch ? altMatch[1] : (mdImgInline ? mdImgInline[1] : 'Illustration');
      const widthMatch = part.match(/width=["']?(\d+%?|\d+px)?["']?/i);
      const heightMatch = part.match(/height=["']?(\d+%?|\d+px)?["']?/i);
      const width = widthMatch ? widthMatch[1] : undefined;
      const height = heightMatch ? heightMatch[1] : undefined;

      return (
        <span key={index} className="block my-3 text-center">
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: width ? (width.includes('%') ? width : `${width}px`) : '100%',
              maxHeight: height ? (height.includes('%') ? height : `${height}px`) : '500px'
            }}
            loading="lazy"
            className="rounded object-contain mx-auto shadow-xs border border-line-border/60"
          />
          {alt && <span className="block mt-1 text-[11px] font-mono text-charcoal-muted">{alt}</span>}
        </span>
      );
    }

    // Highlight key valuation words with wavy topper underlines
    return <span key={index}>{applyTopNotesUnderlines(part)}</span>;
  });
}

function applyTopNotesUnderlines(text: string): React.ReactNode {
  const highlightRegex = /\b(worst-case|best-case|average-case|NP-Complete|NP-Hard|provably optimal|strictly|crucial|mandatory|critical|key drawback|advantage|disadvantage|theorem|invariant)\b/gi;
  const chunks = text.split(highlightRegex);

  if (chunks.length === 1) return text;

  return chunks.map((chunk, i) => {
    if (chunk.match(highlightRegex)) {
      return (
        <span 
          key={i} 
          className="underline decoration-wavy decoration-terracotta/70 decoration-2 font-bold text-charcoal"
          title="Topper's Valuation Key"
        >
          {chunk}
        </span>
      );
    }
    return chunk;
  });
}

/**
 * Automatically converts ASCII boxes, flowcharts, or bracketed diagrams into standard Mermaid syntax.
 * Ensures all diagrams look like real interactive vector diagrams instead of raw monospaced text.
 */
function tryConvertAsciiOrTextToMermaid(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // 1. If already valid Mermaid diagram definition
  if (/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph)\b/i.test(trimmed)) {
    return trimmed;
  }

  // 2. Bracket-style linear/branching chains: [Input Data] ---> [Step 1] ---> [Step 2]
  if (trimmed.includes('[') && trimmed.includes(']') && (trimmed.includes('-->') || trimmed.includes('--->') || trimmed.includes('->'))) {
    const lines = trimmed.split('\n');
    const edges: string[] = [];
    let counter = 0;

    lines.forEach(line => {
      const bracketMatches = Array.from(line.matchAll(/\[([^\]]+)\]/g)).map(m => m[1].trim());
      if (bracketMatches.length >= 2 && (line.includes('->') || line.includes('--'))) {
        for (let j = 0; j < bracketMatches.length - 1; j++) {
          const fromId = `N${counter++}`;
          const toId = `N${counter++}`;
          edges.push(`${fromId}["${bracketMatches[j]}"] --> ${toId}["${bracketMatches[j + 1]}"]`);
        }
      }
    });

    if (edges.length > 0) {
      return `graph LR\n  ${edges.join('\n  ')}\n  style N0 fill:#FFF7ED,stroke:#EA580C,stroke-width:2px`;
    }
  }

  // 3. ASCII box art with +----+ and | text |
  if (trimmed.includes('+---') || (trimmed.includes('|') && (trimmed.includes('--->') || trimmed.includes('-->') || trimmed.includes('v') || trimmed.includes('^')))) {
    const rawLines = trimmed.split('\n');
    const boxLabels: string[] = [];

    rawLines.forEach(line => {
      if (line.includes('|')) {
        const parts = line.split('|')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('-') && !s.startsWith('=') && !s.includes('-->') && !s.includes('--->') && s !== 'v' && s !== '^');
        parts.forEach(p => {
          if (p && !boxLabels.includes(p) && p.length > 1) {
            boxLabels.push(p);
          }
        });
      }
    });

    if (boxLabels.length >= 2) {
      const edges: string[] = [];
      for (let j = 0; j < boxLabels.length - 1; j++) {
        edges.push(`B${j}["${boxLabels[j]}"] --> B${j + 1}["${boxLabels[j + 1]}"]`);
      }
      return `graph TD\n  ${edges.join('\n  ')}\n  style B0 fill:#FFF7ED,stroke:#EA580C,stroke-width:2px\n  style B${boxLabels.length - 1} fill:#ECFDF5,stroke:#059669,stroke-width:2px`;
    }
  }

  return null;
}
