import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  Award, 
  Lightbulb, 
  Github,
  FileCode,
  FileText
} from 'lucide-react';
import { KuroseChapter } from '../../data/notes/kurose-ross-notes';
import { ToppersNoteRenderer } from './ToppersNoteRenderer';
import { MermaidDiagram } from './MermaidDiagram';
import { resolveDiagram } from '../../lib/diagrams/diagram-resolver';

interface KuroseChapterNotebookSheetProps {
  chapter: KuroseChapter;
  chapterNumber: number;
  totalChapters?: number;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  fontClass?: string;
  showMarginalia?: boolean;
}

export const KuroseChapterNotebookSheet: React.FC<KuroseChapterNotebookSheetProps> = ({
  chapter,
  chapterNumber,
  totalChapters = 6,
  onNextChapter,
  onPrevChapter,
  fontClass = 'font-sans text-xs',
  showMarginalia = true
}) => {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'full_markdown'>('synthesis');
  const [copied, setCopied] = useState<boolean>(false);
  const [liveMarkdown, setLiveMarkdown] = useState<string>('');
  const [isLoadingMarkdown, setIsLoadingMarkdown] = useState<boolean>(false);
  const [markdownError, setMarkdownError] = useState<string | null>(null);

  useEffect(() => {
    // Reset markdown cache when chapter changes
    setLiveMarkdown('');
    setMarkdownError(null);
  }, [chapter.id]);

  useEffect(() => {
    if (activeTab === 'full_markdown' && !liveMarkdown) {
      fetchLiveMarkdown(chapter.rawUrl);
    }
  }, [activeTab, chapter.id]);

  const fetchLiveMarkdown = async (rawUrl: string) => {
    setIsLoadingMarkdown(true);
    setMarkdownError(null);
    try {
      const res = await fetch(rawUrl);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const text = await res.text();
      setLiveMarkdown(text);
    } catch (err: any) {
      console.error('Failed to load raw markdown:', err);
      setMarkdownError('Could not fetch the live markdown from GitHub directly. You can read the structured breakdown below or view the file on GitHub.');
    } finally {
      setIsLoadingMarkdown(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = activeTab === 'full_markdown' && liveMarkdown 
      ? liveMarkdown 
      : `# ${chapter.title}\n\n${chapter.summary}\n\n## Core Topics\n${chapter.coreTopics.map(t => `- ${t}`).join('\n')}\n\n## Key Concepts\n${chapter.keyConcepts.map(c => `### ${c.term}\n${c.explanation}`).join('\n\n')}\n\n## Exam Takeaways\n${chapter.examTakeaways.map(e => `- ${e}`).join('\n')}`;
    
    const blob = new Blob([textToDownload], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chapter.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const chapterDiagram = resolveDiagram(chapter.summary + ' ' + chapter.title, chapter.title);

  return (
    <div className={`space-y-6 ${fontClass}`}>
      
      {/* Marginalia Stamp */}
      {showMarginalia && (
        <div className="absolute -left-12 top-6 hidden md:block font-handwriting text-rose-600 font-bold text-xs -rotate-6 select-none tracking-tight">
          ⭐ KUROSE 8E
        </div>
      )}

      {/* Yellow Post-It Note */}
      <div className="sticky-note-yellow p-4 border border-amber-300 shadow-md max-w-sm ml-auto -rotate-1 hidden sm:block">
        <div className="font-handwriting font-bold text-charcoal text-sm mb-1 text-amber-950 flex items-center gap-1">
          <span>📌 KTU Valuation Anchor:</span>
        </div>
        <p className="font-handwriting text-xs text-amber-900 leading-snug">
          Official KTU PCCST501 questions strictly align with Chapter {chapter.chapterNumber} (Kurose &amp; Ross). Pay close attention to protocol headers, state machines, and calculations!
        </p>
        <div className="mt-2 text-[10px] font-mono text-amber-800 font-bold text-right">
          Direct KTU Module {chapter.ktuModules.join(', ')} Mapping
        </div>
      </div>

      {/* Chapter Sheet Header */}
      <div className="border-b-2 border-charcoal/30 pb-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-charcoal-muted">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-accent text-white font-bold uppercase rounded-xs">
              CHAPTER 0{chapter.chapterNumber} OF {totalChapters}
            </span>
            <span className="font-bold text-charcoal">
              KTU PCCST501 • MODULE {chapter.ktuModules.join(' & ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Author: <strong>Vasanth Vanan</strong></span>
            <span>•</span>
            <span>UMD ENPM694 Notes</span>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
          {chapter.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
            <span className="bg-paper-dark px-2 py-0.5 border border-hairline font-bold text-charcoal">
              Textbook: Computer Networking (A Top-Down Approach 8th Ed)
            </span>
            <a
              href={chapter.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline flex items-center gap-1 font-semibold"
            >
              <span>GitHub Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* View Mode Toggle Pill & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-paper-dark border border-line-border p-0.5 rounded font-mono text-xs">
              <button
                onClick={() => setActiveTab('synthesis')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  activeTab === 'synthesis' ? 'bg-charcoal text-paper font-bold' : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Topper Notes
              </button>
              <button
                onClick={() => setActiveTab('full_markdown')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  activeTab === 'full_markdown' ? 'bg-charcoal text-paper font-bold' : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Full Markdown
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="p-1 hover:bg-paper-dark border border-line-border rounded text-charcoal cursor-pointer"
              title="Download Chapter (.md)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleCopy(activeTab === 'full_markdown' && liveMarkdown ? liveMarkdown : JSON.stringify(chapter, null, 2))}
              className="px-2 py-1 text-xs font-mono border border-line-border hover:border-accent text-charcoal flex items-center gap-1 cursor-pointer bg-paper"
              title="Copy notes"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      {activeTab === 'synthesis' ? (
        <div className="space-y-6">
          
          {/* Executive Summary in Fluorescent Highlighter Box */}
          <div className="p-4 bg-paper/90 border-l-4 border-l-amber-500 border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-amber-800 font-mono text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Executive Conceptual Breakdown</span>
            </div>
            <p className="font-serif text-sm sm:text-base leading-relaxed text-charcoal">
              <span className="marker-yellow px-1">{chapter.summary}</span>
            </p>
          </div>

          {/* Visual Architecture Diagram Rendered via Mermaid */}
          <div className="p-4 bg-white/95 border border-stone-300 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-line-border/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-accent inline-block" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal">
                  {chapterDiagram.title}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-accent font-bold uppercase">
                Vector Schematic
              </span>
            </div>

            <div className="overflow-x-auto py-2 flex justify-center bg-paper-50/70 border border-line-border/40 rounded">
              <MermaidDiagram chart={chapterDiagram.code} className="w-full max-w-3xl" />
            </div>

            <p className="text-[11px] font-mono text-charcoal-muted leading-relaxed">
              <strong>Architecture Note:</strong> {chapterDiagram.caption}
            </p>
          </div>

          {/* Core Syllabus Topics */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-charcoal border-b border-charcoal/20 pb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <span>Core Syllabus Topics Covered</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {chapter.coreTopics.map((topic, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-paper/80 border border-stone-200 text-xs font-mono text-charcoal shadow-2xs">
                  <span className="text-accent font-bold font-mono">[{idx + 1}]</span>
                  <span className="leading-relaxed">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Mechanisms & Protocols */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-charcoal border-b border-charcoal/20 pb-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              <span>First-Principles Mechanisms &amp; Protocols</span>
            </h3>
            <div className="space-y-3">
              {chapter.keyConcepts.map((concept, idx) => (
                <div key={idx} className="p-4 bg-paper/90 border-l-4 border-l-accent border border-stone-200 shadow-2xs">
                  <h4 className="font-serif font-bold text-charcoal text-sm mb-1 text-accent flex items-center gap-2">
                    <span>{concept.term}</span>
                  </h4>
                  <p className="font-mono text-xs sm:text-sm text-charcoal leading-relaxed">
                    {concept.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* High-Yield KTU Exam Takeaways */}
          <div className="p-4 bg-amber-50/80 border-l-4 border-l-amber-600 border border-amber-200">
            <h3 className="font-mono text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Essential University Exam Formulas &amp; Valuation Key</span>
            </h3>
            <ul className="space-y-2">
              {chapter.examTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-mono text-charcoal leading-relaxed">
                  <span className="text-amber-700 font-bold mt-0.5">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      ) : (
        /* Full Markdown View */
        <div className="space-y-4">
          {isLoadingMarkdown ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-accent mx-auto" />
              <p className="font-mono text-xs text-charcoal-muted">
                Fetching raw chapter notes and images from GitHub repository...
              </p>
            </div>
          ) : markdownError ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500 text-charcoal text-xs font-mono space-y-3">
              <p>{markdownError}</p>
              <a
                href={chapter.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-charcoal text-paper font-bold text-xs"
              >
                <span>Open {chapter.title} on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-6 bg-paper/90 border border-stone-200 shadow-2xs">
              <ToppersNoteRenderer content={liveMarkdown} className={fontClass} />
            </div>
          )}
        </div>
      )}

      {/* Chapter Page Navigation Bottom Bar */}
      <div className="pt-6 border-t-2 border-charcoal/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div>
          {onPrevChapter ? (
            <button
              onClick={onPrevChapter}
              className="px-3 py-1.5 bg-paper hover:bg-paper-dark border border-line-border rounded flex items-center gap-1 font-bold text-charcoal transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>
          ) : (
            <div />
          )}
        </div>

        <span className="text-charcoal-muted font-bold">
          Chapter {chapter.chapterNumber} of {totalChapters}
        </span>

        <div>
          {onNextChapter ? (
            <button
              onClick={onNextChapter}
              className="px-3 py-1.5 bg-charcoal hover:bg-accent text-paper rounded flex items-center gap-1 font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>

    </div>
  );
};
