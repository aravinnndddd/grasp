import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  BookOpen, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Search, 
  Layers, 
  Award, 
  Lightbulb, 
  FileCode,
  Github,
  RefreshCw,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Bookmark,
  FileText
} from 'lucide-react';
import { KuroseChapter, kuroseRossRepoData } from '../../data/notes/kurose-ross-notes';
import { ToppersNoteRenderer } from './ToppersNoteRenderer';
import { MermaidDiagram } from './MermaidDiagram';
import { resolveDiagram } from '../../lib/diagrams/diagram-resolver';

interface KuroseChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChapterId?: string;
}

export const KuroseChapterModal: React.FC<KuroseChapterModalProps> = ({
  isOpen,
  onClose,
  initialChapterId = 'ch1'
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(initialChapterId);
  const [activeTab, setActiveTab] = useState<'synthesis' | 'full_markdown'>('synthesis');
  const [copied, setCopied] = useState<boolean>(false);
  const [liveMarkdown, setLiveMarkdown] = useState<string>('');
  const [isLoadingMarkdown, setIsLoadingMarkdown] = useState<boolean>(false);
  const [markdownError, setMarkdownError] = useState<string | null>(null);

  // Notebook paper customization
  const [notebookTheme, setNotebookTheme] = useState<'ruled' | 'grid' | 'yellow' | 'clean'>('ruled');
  const [showSpiral, setShowSpiral] = useState<boolean>(true);
  const [noteFont, setNoteFont] = useState<'sans' | 'handwriting' | 'serif' | 'mono'>('sans');
  const [isOsFullscreen, setIsOsFullscreen] = useState<boolean>(false);

  const chapters = kuroseRossRepoData.chapters;
  const currentChapterIndex = chapters.findIndex(c => c.id === selectedChapterId);
  const currentChapter = chapters[currentChapterIndex >= 0 ? currentChapterIndex : 0];

  useEffect(() => {
    if (initialChapterId) {
      setSelectedChapterId(initialChapterId);
    }
  }, [initialChapterId]);

  useEffect(() => {
    if (activeTab === 'full_markdown' && !liveMarkdown) {
      fetchLiveMarkdown(currentChapter.rawUrl);
    }
  }, [selectedChapterId, activeTab]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsOsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleOsFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

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
      setMarkdownError('Could not fetch the live markdown from GitHub directly. You can read the structured notebook breakdown below or view the raw file on GitHub.');
    } finally {
      setIsLoadingMarkdown(false);
    }
  };

  if (!isOpen) return null;

  const handleSelectChapter = (chId: string) => {
    setSelectedChapterId(chId);
    setLiveMarkdown('');
  };

  const handleNextChapter = () => {
    const nextIdx = (currentChapterIndex + 1) % chapters.length;
    handleSelectChapter(chapters[nextIdx].id);
  };

  const handlePrevChapter = () => {
    const prevIdx = (currentChapterIndex - 1 + chapters.length) % chapters.length;
    handleSelectChapter(chapters[prevIdx].id);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = activeTab === 'full_markdown' && liveMarkdown 
      ? liveMarkdown 
      : `# ${currentChapter.title}\n\n${currentChapter.summary}\n\n## Core Topics\n${currentChapter.coreTopics.map(t => `- ${t}`).join('\n')}\n\n## Key Concepts\n${currentChapter.keyConcepts.map(c => `### ${c.term}\n${c.explanation}`).join('\n\n')}\n\n## Exam Takeaways\n${currentChapter.examTakeaways.map(e => `- ${e}`).join('\n')}`;
    
    const blob = new Blob([textToDownload], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentChapter.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFontClass = () => {
    if (noteFont === 'handwriting') return 'font-handwriting text-sm';
    if (noteFont === 'serif') return 'font-serif text-sm';
    if (noteFont === 'mono') return 'font-mono text-xs';
    return 'font-sans text-xs';
  };

  // Resolve representative diagram for this chapter
  const chapterDiagram = resolveDiagram(currentChapter.summary + ' ' + currentChapter.title, currentChapter.title);

  return (
    <div className="fixed inset-0 z-50 bg-[#ECE9E1] flex flex-col overflow-hidden animate-in fade-in duration-150 select-text">
      
      {/* 100% Full-Screen Study Desk Top Bar */}
      <div className="bg-[#212224] text-paper px-4 py-2 flex items-center justify-between gap-3 border-b-2 border-accent shrink-0 flex-wrap shadow-md">
        
        {/* Left: Back to KTU Notes Button + Chapter Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-paper/10 hover:bg-accent text-white font-mono text-xs font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer border border-white/20 hover:border-accent"
            title="Exit and return to KTU Module Notes"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Notes</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-600/30 border border-amber-500 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Kurose &amp; Ross: Top-Down Approach (8th Ed)
                </span>
                <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded font-mono text-stone-300 hidden md:inline">
                  UMD ENPM694 Notes
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white font-serif truncate max-w-[280px] sm:max-w-[420px]">
                {currentChapter.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Right: Controls & Adjusters */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Paper Theme Picker */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setNotebookTheme('ruled')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${notebookTheme === 'ruled' ? 'bg-amber-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}
              title="Ruled Paper"
            >
              Ruled
            </button>
            <button
              onClick={() => setNotebookTheme('grid')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${notebookTheme === 'grid' ? 'bg-amber-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}
              title="Grid Paper"
            >
              Grid
            </button>
            <button
              onClick={() => setNotebookTheme('yellow')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${notebookTheme === 'yellow' ? 'bg-amber-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}
              title="Yellow Legal Pad"
            >
              Legal
            </button>
            <button
              onClick={() => setNotebookTheme('clean')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${notebookTheme === 'clean' ? 'bg-amber-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}
              title="Clean Paper"
            >
              Clean
            </button>
          </div>

          {/* Font Picker */}
          <div className="hidden sm:flex items-center bg-black/40 border border-white/10 rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setNoteFont('sans')}
              className={`px-2 py-0.5 rounded cursor-pointer ${noteFont === 'sans' ? 'bg-white/20 text-white font-bold' : 'text-stone-300'}`}
            >
              Sans
            </button>
            <button
              onClick={() => setNoteFont('handwriting')}
              className={`px-2 py-0.5 rounded cursor-pointer ${noteFont === 'handwriting' ? 'bg-white/20 text-white font-bold font-handwriting' : 'text-stone-300'}`}
            >
              Handwriting
            </button>
            <button
              onClick={() => setNoteFont('serif')}
              className={`px-2 py-0.5 rounded cursor-pointer ${noteFont === 'serif' ? 'bg-white/20 text-white font-bold font-serif' : 'text-stone-300'}`}
            >
              Serif
            </button>
          </div>

          {/* Chapter Prev/Next Flipper */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded p-0.5 font-mono text-xs">
            <button
              onClick={handlePrevChapter}
              className="p-1 hover:bg-white/10 rounded text-stone-200 cursor-pointer"
              title="Previous Chapter"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-1.5 text-[11px] font-bold text-amber-400">
              Ch {currentChapterIndex + 1} of {chapters.length}
            </span>
            <button
              onClick={handleNextChapter}
              className="p-1 hover:bg-white/10 rounded text-stone-200 cursor-pointer"
              title="Next Chapter"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode: Topper Notes vs Markdown */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab('synthesis')}
              className={`px-2.5 py-0.5 rounded cursor-pointer ${activeTab === 'synthesis' ? 'bg-amber-600 text-white font-bold' : 'text-stone-300'}`}
            >
              Notebook
            </button>
            <button
              onClick={() => setActiveTab('full_markdown')}
              className={`px-2.5 py-0.5 rounded cursor-pointer ${activeTab === 'full_markdown' ? 'bg-amber-600 text-white font-bold' : 'text-stone-300'}`}
            >
              Full Markdown
            </button>
          </div>

          {/* OS Fullscreen Toggle */}
          <button
            onClick={toggleOsFullscreen}
            className="p-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title={isOsFullscreen ? 'Exit Browser Fullscreen' : 'Enter Fullscreen'}
          >
            {isOsFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download & GitHub */}
          <button
            onClick={handleDownload}
            className="p-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Download Notes (.md)"
          >
            <Download className="w-4 h-4" />
          </button>

          <a
            href={currentChapter.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-rose-400 transition-colors cursor-pointer ml-1"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Binder Tabs along Top Edge */}
      <div className="bg-[#D8D5CB] border-b border-stone-300 px-4 py-1.5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-thin">
        <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-widest pl-1">
          Chapters:
        </span>
        {chapters.map((ch, idx) => {
          const isSelected = ch.id === selectedChapterId;
          const tabColors = [
            'bg-blue-600 hover:bg-blue-700',
            'bg-purple-600 hover:bg-purple-700',
            'bg-emerald-600 hover:bg-emerald-700',
            'bg-amber-600 hover:bg-amber-700',
            'bg-rose-600 hover:bg-rose-700',
            'bg-teal-600 hover:bg-teal-700'
          ];
          return (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(ch.id)}
              className={`px-3 py-1 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer rounded-t shadow-xs border-t-2 border-x ${
                isSelected
                  ? 'bg-paper text-charcoal border-stone-400 -mb-2 pb-2 z-10 shadow-sm'
                  : `${tabColors[idx % tabColors.length]} text-white border-transparent opacity-85 hover:opacity-100`
              }`}
            >
              Ch {ch.chapterNumber}: {ch.shortTitle}
            </button>
          );
        })}
      </div>

      {/* Full-Screen Scrollable Notebook Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#ECE9E1] relative">
        
        {/* Genuine Notebook Page Sheet */}
        <div className={`max-w-4xl mx-auto transition-all relative ${
          notebookTheme === 'ruled'
            ? `notebook-ruled-page p-6 sm:p-12 border border-stone-300 shadow-2xl pl-10 sm:pl-20 rounded-xs space-y-6 ${getFontClass()}`
            : notebookTheme === 'grid'
            ? `notebook-grid-page p-6 sm:p-12 border border-blue-200 shadow-2xl pl-6 sm:pl-12 rounded-xs space-y-6 ${getFontClass()}`
            : notebookTheme === 'yellow'
            ? `notebook-legal-pad p-6 sm:p-12 border border-amber-300 shadow-2xl pl-10 sm:pl-20 rounded-xs space-y-6 ${getFontClass()}`
            : `bg-white p-6 sm:p-12 border border-stone-200 shadow-2xl rounded-xs space-y-6 ${getFontClass()}`
        }`}>

          {/* Spiral Wire Coil along Left Spine */}
          {showSpiral && (notebookTheme === 'ruled' || notebookTheme === 'yellow') && (
            <div 
              className="spiral-binder absolute left-1 sm:left-2.5 top-0 bottom-0 w-6 pointer-events-none z-10 opacity-70"
              title="Spiral Wire Binder" 
            />
          )}

          {/* Handwritten Marginalia Stamp */}
          {(notebookTheme === 'ruled' || notebookTheme === 'yellow') && (
            <div className="absolute -left-12 top-8 hidden md:block font-handwriting text-rose-600 font-bold text-xs -rotate-6 select-none tracking-tight">
              ⭐ KUROSE 8E
            </div>
          )}

          {/* Post-it Note in the Margin */}
          <div className="sticky-note-yellow p-4 border border-amber-300 shadow-md max-w-xs ml-auto mb-4 -rotate-1 hidden sm:block">
            <div className="font-handwriting font-bold text-charcoal text-sm mb-1 text-amber-950 flex items-center gap-1">
              <span>📌 KTU Valuation Anchor:</span>
            </div>
            <p className="font-handwriting text-xs text-amber-900 leading-snug">
              KTU PCCST501 questions on this topic follow Kurose &amp; Ross definitions verbatim. Pay close attention to packet formats and state transitions!
            </p>
            <div className="mt-2 text-[10px] font-mono text-amber-800 font-bold text-right">
              Direct KTU S5 Module {currentChapter.ktuModules.join(', ')} Mapping
            </div>
          </div>

          {/* Notebook Page Header */}
          <div className="border-b-2 border-charcoal/30 pb-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-charcoal-muted">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-accent text-white font-bold uppercase rounded-xs">
                  CHAPTER 0{currentChapter.chapterNumber}
                </span>
                <span className="font-bold text-charcoal">
                  KTU PCCST501 • MODULE {currentChapter.ktuModules.join(' & ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Author: <strong>Vasanth Vanan</strong></span>
                <span>•</span>
                <span>UMD ENPM694 Course</span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              {currentChapter.title}
            </h1>

            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs font-mono text-charcoal-muted">
              <span className="bg-paper-dark px-2 py-0.5 border border-hairline font-bold text-charcoal">
                Textbook: Computer Networking (A Top-Down Approach)
              </span>
              <a
                href={currentChapter.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open GitHub Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* View Mode: Synthesis View */}
          {activeTab === 'synthesis' ? (
            <div className="space-y-6">
              
              {/* Executive Summary in Highlighter Box */}
              <div className="p-4 bg-paper/90 border-l-4 border-l-amber-500 border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-mono text-xs font-bold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Executive Conceptual Overview</span>
                </div>
                <p className="font-serif text-sm sm:text-base leading-relaxed text-charcoal">
                  <span className="marker-yellow px-1">{currentChapter.summary}</span>
                </p>
              </div>

              {/* Visual Architecture Diagram Rendered on Notebook Paper */}
              <div className="p-4 bg-white/90 border border-stone-300 shadow-xs space-y-3">
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

              {/* Core Topics Breakdown */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base text-charcoal border-b border-charcoal/20 pb-1 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  <span>Core Syllabus Topics Covered</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {currentChapter.coreTopics.map((topic, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-paper/80 border border-stone-200 text-xs font-mono text-charcoal shadow-2xs">
                      <span className="text-accent font-bold font-mono">[{idx + 1}]</span>
                      <span className="leading-relaxed">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Architectural Concepts */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base text-charcoal border-b border-charcoal/20 pb-1 flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" />
                  <span>First-Principles Mechanisms &amp; Protocols</span>
                </h3>
                <div className="space-y-3">
                  {currentChapter.keyConcepts.map((concept, idx) => (
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
                  {currentChapter.examTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-mono text-charcoal leading-relaxed">
                      <span className="text-amber-700 font-bold mt-0.5">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            /* View Mode: Full Verbatim Markdown Source with Images & Tables */
            <div className="space-y-4">
              {isLoadingMarkdown ? (
                <div className="p-12 text-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-accent mx-auto" />
                  <p className="font-mono text-xs text-charcoal-muted">
                    Fetching raw chapter notes and diagrams from GitHub repository...
                  </p>
                </div>
              ) : markdownError ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500 text-charcoal text-xs font-mono space-y-3">
                  <p>{markdownError}</p>
                  <a
                    href={currentChapter.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-charcoal text-paper font-bold text-xs"
                  >
                    <span>Open {currentChapter.title} on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-6 bg-paper/90 border border-stone-200 shadow-2xs">
                  <ToppersNoteRenderer content={liveMarkdown} />
                </div>
              )}
            </div>
          )}

          {/* Notebook Bottom Signature & Stamp */}
          <div className="pt-6 border-t-2 border-charcoal/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-charcoal-muted">
            <div>
              <span>Source: <strong>VasanthVanan/computer-networking-top-down-approach-notes</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(activeTab === 'full_markdown' && liveMarkdown ? liveMarkdown : JSON.stringify(currentChapter, null, 2))}
                className="px-2.5 py-1 text-xs font-mono border border-line-border hover:border-accent text-charcoal flex items-center gap-1 cursor-pointer bg-paper"
                title="Copy Chapter Notes"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Notes'}</span>
              </button>
              <a
                href="https://github.com/VasanthVanan/computer-networking-top-down-approach-notes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline flex items-center gap-1 font-bold"
              >
                <span>Star Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
