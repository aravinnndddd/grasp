import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Check,
  Sparkles,
  SlidersHorizontal,
  FileText,
  Search,
  ExternalLink,
  Layers,
  ArrowLeft,
  Send,
  Cpu,
  Bookmark,
  Printer,
  Eye,
  EyeOff,
  FileCode,
  Tag,
  Maximize2,
  Minimize2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Zap
} from 'lucide-react';
import { NotebookWhiteboard, WhiteboardTool } from './NotebookWhiteboard';
import { WhiteboardToolbar } from './WhiteboardToolbar';
import { UploadedNote, UploadedNotesStorage } from '../../lib/storage/uploaded-notes';
import { PdfRagEngine } from '../../lib/rag/pdf-rag-engine';
import { sectioniseNote, NoteSection } from '../../lib/notes/note-sectioniser';
import { ToppersNoteRenderer } from './ToppersNoteRenderer';
import { PDFViewer } from './PDFViewer';
import { MermaidDiagram } from './MermaidDiagram';
import { DiagramGenerator, VisualDiagramItem } from '../../lib/diagrams/diagram-generator';
import { JevCognitiveRouter, JevExecutionResult } from '../../lib/ai/jev-router';
import { SavedAnswersStorage } from '../../lib/storage/saved-answers';

interface UploadedNoteNotebookViewProps {
  note: UploadedNote;
  onBack: () => void;
  onOpenGroqSettings?: () => void;
  initialViewMode?: 'notebook' | 'diagrams' | 'transcript' | 'pdf';
}

export const UploadedNoteNotebookView: React.FC<UploadedNoteNotebookViewProps> = ({
  note,
  onBack,
  onOpenGroqSettings,
  initialViewMode = 'notebook'
}) => {
  // Dynamic markdown source supporting live progressive batch updates
  const [currentMarkdown, setCurrentMarkdown] = useState<string>(
    note.aiSummary || note.content || `# ${note.title}\n\nDocument uploaded.`
  );

  React.useEffect(() => {
    if (note.aiSummary) {
      setCurrentMarkdown(note.aiSummary);
    }
  }, [note.id, note.aiSummary]);

  const markdownSource = currentMarkdown;
  const sectionised = useMemo(() => sectioniseNote(currentMarkdown, note.title), [currentMarkdown, note.title]);

  // Progressive Batch Synthesis State (Preventing 429 Rate Limits)
  const [isBatchSynthesizing, setIsBatchSynthesizing] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ message: string; percent: number }>({ message: '', percent: 0 });
  const [batchError, setBatchError] = useState<string>('');

  const pendingModulesCount = useMemo(() => {
    return sectionised.sections.filter(s => s.content.includes('<!-- PENDING_SYNTHESIS_START')).length;
  }, [sectionised.sections]);

  const synthesizedModulesCount = sectionised.totalSections - pendingModulesCount;
  const synthesisPercent = sectionised.totalSections > 0 ? Math.round((synthesizedModulesCount / sectionised.totalSections) * 100) : 100;

  const handleSynthesizeBatch = async (startIdx?: number, count = 3) => {
    setIsBatchSynthesizing(true);
    setBatchError('');
    setBatchProgress({ message: 'Initializing RAG index for deep textbook synthesis…', percent: 10 });

    try {
      // Reconstruct or read RAG index directly in memory from note.content
      const ragIndex = PdfRagEngine.buildIndexFromContent(note.title, note.content || currentMarkdown);
      const result = await PdfRagEngine.synthesizeModuleBatch(
        ragIndex,
        currentMarkdown,
        startIdx,
        count,
        (msg, pct) => setBatchProgress({ message: msg, percent: pct })
      );

      if (result.synthesizedCount > 0) {
        setCurrentMarkdown(result.updatedMarkdown);
        note.aiSummary = result.updatedMarkdown;
        await UploadedNotesStorage.update(note.id, { aiSummary: result.updatedMarkdown });
      }
    } catch (err: any) {
      console.error('Batch synthesis error:', err);
      setBatchError(err.message || 'Failed to synthesize module batch.');
    } finally {
      setIsBatchSynthesizing(false);
    }
  };

  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [sectionSearchQuery, setSectionSearchQuery] = useState<string>('');
  const [showTocSidebar, setShowTocSidebar] = useState<boolean>(true);
  const [showCompanionSidebar, setShowCompanionSidebar] = useState<boolean>(true);
  const [isToolbarHidden, setIsToolbarHidden] = useState<boolean>(false);

  // Notebook styling controls
  const [notebookTheme, setNotebookTheme] = useState<'ruled' | 'grid' | 'yellow' | 'clean'>('ruled');
  const [showSpiral, setShowSpiral] = useState<boolean>(true);
  const [noteFont, setNoteFont] = useState<'sans' | 'handwriting' | 'serif' | 'mono'>('sans');
  const [noteFontSize, setNoteFontSize] = useState<'xs' | 'sm' | 'base'>('xs');
  const [isStylePanelOpen, setIsStylePanelOpen] = useState<boolean>(false);

  // Parse all pages from note.content (guaranteeing all 100+ pages are readable)
  const documentPages = useMemo(() => {
    if (!note.content) return [];
    const parts = note.content.split(/(?=\[Page\s+\d+\])/i);
    return parts.map((chunk, idx) => {
      const match = chunk.match(/\[Page\s+(\d+)\]/i);
      const pageNum = match ? parseInt(match[1], 10) : idx + 1;
      const text = chunk.replace(/\[Page\s+\d+\]:?\s*/i, '').trim();
      return { pageNum, text };
    }).filter(p => p.text.length > 0);
  }, [note.content]);

  // Extract all vector Mermaid diagrams present in the note
  const extractedDiagrams = useMemo(() => {
    return DiagramGenerator.extractDiagramsFromMarkdown(markdownSource);
  }, [markdownSource]);

  const [generatedDiagrams, setGeneratedDiagrams] = useState<VisualDiagramItem[]>([]);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState<boolean>(false);
  const [customDiagramPrompt, setCustomDiagramPrompt] = useState<string>('');
  const [selectedDiagramForZoom, setSelectedDiagramForZoom] = useState<VisualDiagramItem | null>(null);

  // View mode: Formatted Notebook vs Visual Diagrams vs All Pages Transcript vs Original PDF
  const [viewMode, setViewMode] = useState<'notebook' | 'diagrams' | 'transcript' | 'pdf'>(initialViewMode);
  const [selectedTranscriptPage, setSelectedTranscriptPage] = useState<number>(1);
  const [transcriptSearch, setTranscriptSearch] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Fullscreen and Whiteboard Annotation Toolkit State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState<boolean>(false);
  const [activeWhiteboardTool, setActiveWhiteboardTool] = useState<WhiteboardTool>('pen');
  const [activeWhiteboardColor, setActiveWhiteboardColor] = useState<string>('#18181B');
  const [whiteboardStrokeWidth, setWhiteboardStrokeWidth] = useState<number>(2);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFsChange = () => {
      const fsActive = !!document.fullscreenElement;
      setIsFullscreen(fsActive);
      if (!fsActive) {
        setIsToolbarHidden(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsToolbarHidden(prev => !prev);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Auto-seed essential diagrams if none were found in markdown
  React.useEffect(() => {
    if (extractedDiagrams.length === 0 && generatedDiagrams.length === 0) {
      const essentials = DiagramGenerator.ensureEssentialDiagrams(
        note.title,
        sectionised.sections.map(s => ({ title: s.title, content: s.content }))
      );
      setGeneratedDiagrams(essentials);
    }
  }, [extractedDiagrams.length, note.title, sectionised.sections]);

  // Section AI Socratic Q&A
  const [sectionAiQuery, setSectionAiQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<JevExecutionResult | null>(null);

  const allDiagrams = [...generatedDiagrams, ...extractedDiagrams];

  const activeSection: NoteSection = sectionised.sections[activeSectionIndex] || sectionised.sections[0];

  // Font styling resolver
  const getNoteFontClass = () => {
    let fontCls = 'font-sans';
    if (noteFont === 'handwriting') fontCls = 'font-handwriting font-medium';
    else if (noteFont === 'serif') fontCls = 'font-serif';
    else if (noteFont === 'mono') fontCls = 'font-mono-code';

    let sizeCls = 'text-xs';
    if (noteFontSize === 'sm') sizeCls = 'text-[13px]';
    else if (noteFontSize === 'base') sizeCls = 'text-sm';

    return `${fontCls} ${sizeCls}`;
  };

  const getThemeClass = () => {
    switch (notebookTheme) {
      case 'ruled': return 'notebook-ruled-page border-amber-900/10 text-ink-900';
      case 'grid': return 'notebook-grid-page border-blue-900/10 text-ink-900';
      case 'yellow': return 'notebook-legal-pad border-amber-800/10 text-amber-950';
      case 'clean':
      default:
        return 'bg-paper-50 border-line-border text-ink-900';
    }
  };

  // Filter sections for TOC
  const filteredSections = sectionised.sections.filter(s =>
    s.title.toLowerCase().includes(sectionSearchQuery.toLowerCase()) ||
    s.moduleLabel?.toLowerCase().includes(sectionSearchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(sectionSearchQuery.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSection.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownSource], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}_Study_Notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAskSectionAi = async (overridePrompt?: string) => {
    const query = overridePrompt || sectionAiQuery;
    if (!query.trim() || isAiLoading) return;

    setIsAiLoading(true);

    try {
      const context = `
Context from Student's Uploaded Document (${note.title}):
Current Section: "${activeSection.title}" (${activeSection.moduleLabel || 'Module'})
${activeSection.pageRange ? `Page Reference: ${activeSection.pageRange}` : ''}

Section Text:
"""
${activeSection.content.slice(0, 4000)}
"""
`;

      const res = await JevCognitiveRouter.executeQuery(`${context}\n\nStudent Query:\n${query}`, {
        subjectCode: note.subjectCode,
        subjectTitle: note.subjectTitle,
        moduleTitle: activeSection.title
      });

      setAiResult(res);

      SavedAnswersStorage.save({
        subjectCode: note.subjectCode,
        subjectTitle: note.subjectTitle,
        moduleTitle: `${note.title}: ${activeSection.title}`,
        query,
        response: res.response,
        modelUsed: res.decision.modelName,
        routingTask: res.decision.task
      });

      setSectionAiQuery('');
    } catch (err) {
      console.error('Section AI query failed:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className={`font-sans animate-fade-in ${
      isFullscreen
        ? 'fixed inset-0 z-50 bg-paper-50 overflow-y-auto p-3 sm:p-6 pb-24'
        : 'space-y-4 pb-12'
    }`}>
      {/* ── Floating Restore Toolbar Button (When Hidden) ── */}
      {isToolbarHidden && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 animate-fade-in flex items-center gap-2">
          <button
            onClick={() => setIsToolbarHidden(false)}
            className="px-4 py-1.5 bg-ink-900/95 hover:bg-black text-white text-xs font-mono-code font-bold rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer border border-white/20 hover:scale-105"
            title="Restore Top Bar (Press H or click)"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Show Toolbar</span>
            <span className="text-[10px] text-ink-300 font-normal px-1.5 py-0.2 bg-white/10 rounded">H</span>
          </button>
        </div>
      )}

      {/* ── Top Navigation Bar ── */}
      {!isToolbarHidden && (
        <div className={`bg-paper-100 border border-line-border rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs ${
          isFullscreen ? 'sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-md mb-4' : ''
        }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-paper-200 text-ink-700 hover:text-ink-900 rounded-lg border border-line-border transition-colors flex items-center gap-1.5 text-xs font-mono-code cursor-pointer"
            title="Return to Note Vault"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Vault</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-ink-900 text-white font-mono-code font-bold text-[10px] rounded uppercase">
                {note.subjectCode}
              </span>
              <h1 className="text-base sm:text-lg font-serif-heading font-bold text-ink-900 truncate max-w-[280px] sm:max-w-md">
                {note.title}
              </h1>
            </div>
            <div className="text-[11px] font-mono-code text-ink-500 flex items-center gap-2 mt-0.5">
              <span>{sectionised.totalSections} Sections</span>
              <span>•</span>
              <span>{sectionised.totalWords.toLocaleString()} Words</span>
              <span>•</span>
              <span>Updated {new Date(note.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* View Mode & Adjuster Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Multi-view Switcher: Topper's Notebook vs Visual Diagrams vs All Pages Text vs Original PDF */}
          <div className="flex items-center border border-line-border rounded-lg bg-paper-200 p-0.5 text-xs font-mono-code flex-wrap">
            <button
              onClick={() => setViewMode('notebook')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'notebook'
                  ? 'bg-ink-900 text-white font-bold shadow-xs'
                  : 'text-ink-700 hover:text-ink-900'
              }`}
              title="View structured Topper's Study Guide with KaTeX formulas and diagrams"
            >
              📘 Topper's Guide
            </button>
            <button
              onClick={() => setViewMode('diagrams')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'diagrams'
                  ? 'bg-ink-900 text-white font-bold shadow-xs'
                  : 'text-ink-700 hover:text-ink-900'
              }`}
              title="Visualize interactive architecture, flowchart & sequence diagrams"
            >
              <Layers className="w-3.5 h-3.5 text-terracotta" />
              <span>Diagrams ({allDiagrams.length})</span>
            </button>
            {documentPages.length > 0 && (
              <button
                onClick={() => setViewMode('transcript')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  viewMode === 'transcript'
                    ? 'bg-ink-900 text-white font-bold shadow-xs'
                    : 'text-ink-700 hover:text-ink-900'
                }`}
                title="Read all 100+ pages of the original document text"
              >
                📑 All {documentPages.length} Pages Text
              </button>
            )}
            {note.dataUrl && (
              <button
                onClick={() => setViewMode('pdf')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  viewMode === 'pdf'
                    ? 'bg-ink-900 text-white font-bold shadow-xs'
                    : 'text-ink-700 hover:text-ink-900'
                }`}
                title="View original uploaded PDF"
              >
                📄 Original PDF
              </button>
            )}
          </div>

          {/* Sidebar Toggles */}
          <button
            onClick={() => setShowTocSidebar(!showTocSidebar)}
            className={`p-1.5 rounded-lg border border-line-border text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer ${
              showTocSidebar ? 'bg-ink-900 text-white border-ink-900 font-bold' : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
            }`}
            title="Toggle Chapters Table of Contents Sidebar"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{showTocSidebar ? 'TOC' : 'Show TOC'}</span>
          </button>

          {isFullscreen && (
            <button
              onClick={() => setShowCompanionSidebar(!showCompanionSidebar)}
              className={`p-1.5 rounded-lg border border-line-border text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer ${
                showCompanionSidebar ? 'bg-terracotta text-white border-terracotta font-bold' : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
              }`}
              title="Toggle AI Study Companion & Outline Sidebar"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Companion</span>
            </button>
          )}

          {/* Style Adjuster Toggle */}
          <button
            onClick={() => setIsStylePanelOpen(!isStylePanelOpen)}
            className={`p-1.5 rounded-lg border border-line-border text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer ${
              isStylePanelOpen ? 'bg-terracotta text-white border-terracotta' : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
            }`}
            title="Customize Notebook Paper & Handwriting Font"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Paper &amp; Font</span>
          </button>

          {/* Copy and Download */}
          <button
            onClick={handleCopy}
            className="p-1.5 bg-paper-100 hover:bg-paper-200 border border-line-border rounded-lg text-ink-700 hover:text-ink-900 transition-colors cursor-pointer"
            title="Copy current section markdown"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 bg-paper-100 hover:bg-paper-200 border border-line-border rounded-lg text-ink-700 hover:text-ink-900 transition-colors cursor-pointer"
            title="Download full markdown study guide"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Whiteboard Drawing & Annotation Toolbar */}
          <WhiteboardToolbar
            isDrawingEnabled={isDrawingEnabled}
            onToggleDrawing={() => setIsDrawingEnabled(!isDrawingEnabled)}
            activeTool={activeWhiteboardTool}
            onSelectTool={setActiveWhiteboardTool}
            activeColor={activeWhiteboardColor}
            onSelectColor={setActiveWhiteboardColor}
            strokeWidth={whiteboardStrokeWidth}
            onSelectStrokeWidth={setWhiteboardStrokeWidth}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />

          {/* Hide Toolbar Button */}
          <button
            onClick={() => setIsToolbarHidden(true)}
            className="p-1.5 bg-paper-100 hover:bg-paper-200 border border-line-border rounded-lg text-ink-700 hover:text-ink-900 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono-code"
            title="Hide Toolbar for Immersive Reading (Press H to toggle)"
          >
            <EyeOff className="w-3.5 h-3.5 text-ink-600" />
            <span className="hidden sm:inline">Hide Bar</span>
          </button>
        </div>
      </div>
      )}

      {/* ── Optional Paper & Font Customizer Dropdown Panel ── */}
      {!isToolbarHidden && isStylePanelOpen && (
        <div className="bg-paper-50 border border-line-border rounded-xl p-4 shadow-sm space-y-3 font-mono-code text-xs animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Paper Background */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-ink-600 uppercase">Stationery Paper Texture:</label>
              <div className="flex gap-1.5">
                {[
                  { id: 'ruled', label: '📘 Ruled Notebook' },
                  { id: 'grid', label: '📐 Graph Grid' },
                  { id: 'yellow', label: '📒 Legal Pad' },
                  { id: 'clean', label: '📄 Clean Parchment' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setNotebookTheme(t.id as any)}
                    className={`px-2.5 py-1 rounded-md border text-[11px] transition-all cursor-pointer ${
                      notebookTheme === t.id
                        ? 'bg-ink-900 text-white border-ink-900 font-bold'
                        : 'bg-white text-ink-700 border-line-border hover:bg-paper-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Handwriting / Typography Font */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-ink-600 uppercase">Topper's Penmanship Font:</label>
              <div className="flex gap-1.5">
                {[
                  { id: 'sans', label: 'Clean Sans' },
                  { id: 'handwriting', label: '✍️ Handwriting' },
                  { id: 'serif', label: 'Academic Serif' },
                  { id: 'mono', label: 'Monospace' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setNoteFont(f.id as any)}
                    className={`px-2.5 py-1 rounded-md border text-[11px] transition-all cursor-pointer ${
                      noteFont === f.id
                        ? 'bg-ink-900 text-white border-ink-900 font-bold'
                        : 'bg-white text-ink-700 border-line-border hover:bg-paper-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spiral Toggle */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-ink-600 uppercase">Spiral Wire Rings:</label>
              <button
                onClick={() => setShowSpiral(!showSpiral)}
                className={`px-3 py-1 rounded-md border text-[11px] transition-all cursor-pointer ${
                  showSpiral
                    ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                    : 'bg-white text-ink-600 border-line-border hover:bg-paper-200'
                }`}
              >
                {showSpiral ? '✓ Spiral Visible' : 'Hidden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Workspace Body ── */}
      {viewMode === 'pdf' && note.dataUrl ? (
        <div className="bg-white border border-line-border rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-code text-ink-600 border-b border-line-border pb-2">
            <span>Viewing Original File: <strong>{note.fileName}</strong> ({(note.fileSize / 1024).toFixed(1)} KB)</span>
            <a href={note.dataUrl} download={note.fileName} className="text-terracotta underline hover:opacity-80">
              Download PDF Directly
            </a>
          </div>
          <PDFViewer fileUrl={note.dataUrl} />
        </div>
      ) : viewMode === 'diagrams' ? (
        /* ── Visual Diagrams & Flowcharts Gallery ── */
        <div className="bg-white border border-line-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-line-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-terracotta" />
                <h3 className="text-lg font-serif-heading font-bold text-ink-900">
                  Visual Diagrams &amp; Architecture Schematics
                </h3>
                <span className="px-2 py-0.5 bg-paper-200 border border-line-border rounded text-xs font-mono-code font-bold text-ink-700">
                  {allDiagrams.length} Diagrams
                </span>
              </div>
              <p className="text-xs text-ink-500 font-sans mt-0.5">
                Interactive vector flowcharts, system architectures, and protocol sequences generated from "{note.title}".
              </p>
            </div>

            {/* Quick Generator for Active Section */}
            <button
              onClick={async () => {
                setIsGeneratingDiagram(true);
                try {
                  const diag = await DiagramGenerator.generateForTopic(activeSection.title, activeSection.content, 'architecture');
                  setGeneratedDiagrams(prev => [diag, ...prev]);
                } finally {
                  setIsGeneratingDiagram(false);
                }
              }}
              disabled={isGeneratingDiagram}
              className="px-3.5 py-2 bg-terracotta hover:bg-terracotta/90 disabled:opacity-40 text-white font-bold text-xs font-mono-code rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingDiagram ? 'Synthesizing Vector Schematic…' : `+ Draw Diagram for "${activeSection.moduleLabel || 'Section'}"`}</span>
            </button>
          </div>

          {/* Quick Diagram Type Presets for the Active Section */}
          <div className="flex items-center gap-2 flex-wrap bg-paper-50 p-3 rounded-xl border border-line-border">
            <span className="text-[11px] font-mono-code text-ink-600 font-bold shrink-0">
              ⚡ 1-Click Synthesizer for "{activeSection.title.slice(0, 30)}…":
            </span>
            {[
              { type: 'mindmap', label: '🗺️ Concept Mind Map' },
              { type: 'flowchart', label: '🔄 Process Flowchart' },
              { type: 'architecture', label: '🏗️ System Architecture' },
              { type: 'sequence', label: '⚡ Protocol Sequence' },
              { type: 'state', label: '🔀 State Transitions' },
            ].map(preset => (
              <button
                key={preset.type}
                disabled={isGeneratingDiagram}
                onClick={async () => {
                  setIsGeneratingDiagram(true);
                  try {
                    const d = await DiagramGenerator.generateForTopic(activeSection.title, activeSection.content, preset.type as any);
                    setGeneratedDiagrams(prev => [d, ...prev]);
                  } finally {
                    setIsGeneratingDiagram(false);
                  }
                }}
                className="px-2.5 py-1 bg-white hover:bg-paper-100 border border-line-border rounded text-[11px] font-mono-code text-ink-800 hover:text-terracotta hover:border-terracotta transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Topic Diagram Generator */}
          <div className="p-4 bg-paper-50 border border-line-border rounded-xl space-y-2 font-mono-code text-xs">
            <label className="font-bold text-ink-800 flex items-center gap-1.5">
              <span>Visualize Any Topic from this Document:</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Protocol Packet Header Layout, Handshake Timeline, State Machine, Pipeline Flow..."
                value={customDiagramPrompt}
                onChange={(e) => setCustomDiagramPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customDiagramPrompt.trim() && !isGeneratingDiagram) {
                    setIsGeneratingDiagram(true);
                    DiagramGenerator.generateForTopic(customDiagramPrompt, markdownSource, 'architecture')
                      .then(d => {
                        setGeneratedDiagrams(prev => [d, ...prev]);
                        setCustomDiagramPrompt('');
                      })
                      .finally(() => setIsGeneratingDiagram(false));
                  }
                }}
                className="flex-1 px-3 py-2 bg-white border border-line-border rounded-lg text-xs font-mono-code text-ink-900 focus:outline-none focus:border-terracotta"
              />
              <button
                onClick={async () => {
                  if (!customDiagramPrompt.trim() || isGeneratingDiagram) return;
                  setIsGeneratingDiagram(true);
                  try {
                    const d = await DiagramGenerator.generateForTopic(customDiagramPrompt, markdownSource, 'architecture');
                    setGeneratedDiagrams(prev => [d, ...prev]);
                    setCustomDiagramPrompt('');
                  } finally {
                    setIsGeneratingDiagram(false);
                  }
                }}
                disabled={isGeneratingDiagram || !customDiagramPrompt.trim()}
                className="px-4 py-2 bg-ink-900 text-white font-bold text-xs font-mono-code rounded-lg hover:bg-black disabled:opacity-40 transition-colors cursor-pointer"
              >
                {isGeneratingDiagram ? 'Drawing…' : 'Generate'}
              </button>
            </div>
          </div>

          {/* Diagram Cards List */}
          {allDiagrams.length > 0 ? (
            <div className="space-y-6">
              {allDiagrams.map((diag, dIdx) => (
                <div key={dIdx} className="bg-paper-50/50 border border-line-border rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-line-border/80 pb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-terracotta inline-block" />
                      <h4 className="font-serif-heading font-bold text-base text-ink-900">
                        {diag.title}
                      </h4>
                      {diag.diagramType && (
                        <span className="px-2 py-0.5 bg-paper-200 border border-line-border rounded text-[10px] font-mono-code text-ink-700 uppercase">
                          {diag.diagramType}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedDiagramForZoom(diag)}
                        className="px-2.5 py-1 text-[11px] font-mono-code bg-white hover:bg-paper-100 border border-line-border rounded text-ink-700 flex items-center gap-1 cursor-pointer"
                        title="Zoom / Fullscreen View"
                      >
                        <Eye className="w-3 h-3 text-terracotta" />
                        <span>Zoom / Expand</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(diag.code);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-2.5 py-1 text-[11px] font-mono-code bg-white hover:bg-paper-100 border border-line-border rounded text-ink-700 flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Mermaid Code</span>
                      </button>
                    </div>
                  </div>

                  {/* Rendered Mermaid Vector Schematic */}
                  <div className="bg-white rounded-lg p-4 border border-line-border/60 overflow-x-auto shadow-2xs">
                    <MermaidDiagram chart={diag.code} />
                  </div>

                  <p className="text-xs text-ink-600 font-sans italic">
                    {diag.caption}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 border-2 border-dashed border-line-border rounded-xl space-y-3">
              <Layers className="w-10 h-10 text-ink-400 mx-auto" />
              <div className="text-sm font-serif-heading font-bold text-ink-900">
                No Diagrams Extracted Yet
              </div>
              <p className="text-xs text-ink-500 font-sans max-w-sm mx-auto">
                Click below to synthesize the first interactive architecture diagram or flowchart for "{activeSection.title}".
              </p>
              <button
                onClick={async () => {
                  setIsGeneratingDiagram(true);
                  try {
                    const diag = await DiagramGenerator.generateForTopic(activeSection.title, activeSection.content);
                    setGeneratedDiagrams(prev => [diag, ...prev]);
                  } finally {
                    setIsGeneratingDiagram(false);
                  }
                }}
                disabled={isGeneratingDiagram}
                className="px-4 py-2 bg-terracotta text-white font-bold text-xs font-mono-code rounded-lg hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Diagram for Active Section</span>
              </button>
            </div>
          )}
        </div>
      ) : viewMode === 'transcript' ? (
        /* ── Full Document Transcript (All 100+ Pages) ── */
        <div className="bg-white border border-line-border rounded-2xl p-5 sm:p-7 shadow-sm space-y-4 font-mono-code">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-border pb-3">
            <div>
              <h3 className="text-base font-serif-heading font-bold text-ink-900">
                Full Document Text ({documentPages.length} Extracted Pages)
              </h3>
              <p className="text-[11px] text-ink-500 font-mono-code">
                100% of the text extracted from your uploaded file — completely searchable &amp; indexed.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Page Jumper */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-ink-600">Jump to:</span>
                <select
                  value={selectedTranscriptPage}
                  onChange={(e) => setSelectedTranscriptPage(parseInt(e.target.value, 10))}
                  className="px-2 py-1 bg-paper-100 border border-line-border rounded font-bold text-ink-900 focus:outline-none focus:border-terracotta cursor-pointer text-xs"
                >
                  {documentPages.map(p => (
                    <option key={p.pageNum} value={p.pageNum}>
                      Page {p.pageNum}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-ink-400 absolute left-2 top-2" />
                <input
                  type="text"
                  placeholder="Find on pages..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="pl-7 pr-2 py-1 bg-paper-100 border border-line-border rounded text-xs text-ink-900 focus:outline-none focus:border-terracotta w-36 sm:w-44"
                />
              </div>
            </div>
          </div>

          {/* Transcript Content Reader */}
          {(() => {
            const curPage = documentPages.find(p => p.pageNum === selectedTranscriptPage) || documentPages[0];
            const pageText = curPage ? curPage.text : 'No text on this page.';
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-ink-500 bg-paper-50 p-2.5 rounded-lg border border-line-border">
                  <span className="font-bold text-ink-800">
                    📄 Page {curPage?.pageNum} of {documentPages.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pageText);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-2 py-0.5 rounded bg-white hover:bg-paper-200 border border-line-border text-ink-700 flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Page Text</span>
                    </button>
                    <span>{pageText.split(/\s+/).length} words</span>
                  </div>
                </div>

                <div className="p-6 bg-paper-50/70 border border-line-border/80 rounded-xl leading-relaxed whitespace-pre-wrap text-ink-900 text-xs font-mono-code max-h-[60vh] overflow-y-auto">
                  {pageText}
                </div>

                {/* Page Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setSelectedTranscriptPage(prev => Math.max(1, prev - 1))}
                    disabled={selectedTranscriptPage <= 1}
                    className="px-3 py-1.5 rounded-lg border border-line-border bg-paper-100 hover:bg-paper-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs cursor-pointer font-bold text-ink-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Page</span>
                  </button>

                  <span className="text-xs text-ink-500 font-bold">
                    Page {selectedTranscriptPage} / {documentPages.length}
                  </span>

                  <button
                    onClick={() => setSelectedTranscriptPage(prev => Math.min(documentPages.length, prev + 1))}
                    disabled={selectedTranscriptPage >= documentPages.length}
                    className="px-3 py-1.5 rounded-lg border border-line-border bg-paper-100 hover:bg-paper-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs cursor-pointer font-bold text-ink-800"
                  >
                    <span>Next Page</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className={`flex gap-5 items-start ${
          isFullscreen
            ? 'flex-col lg:flex-row justify-center max-w-[1850px] mx-auto w-full'
            : 'flex-col lg:flex-row w-full'
        }`}>
          
          {/* ── Left Sidebar: Section TOC & Module Picker ── */}
          {showTocSidebar && (
            <aside className={`w-full lg:w-72 xl:w-80 shrink-0 space-y-3 ${
              isFullscreen ? 'sticky top-20 max-h-[calc(100vh-6.5rem)] overflow-y-auto' : ''
            }`}>
            <div className="bg-paper-50 border border-line-border rounded-xl p-3 shadow-xs space-y-3">
              <div className="space-y-2 border-b border-line-border/60 pb-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono-code font-bold text-ink-900 uppercase">
                    <BookOpen className="w-4 h-4 text-terracotta" />
                    <span>Table of Contents</span>
                  </div>
                  <span className="px-2 py-0.5 bg-paper-200 text-ink-600 text-[10px] font-mono-code rounded font-bold">
                    {sectionised.totalSections} Chapters
                  </span>
                </div>

                {/* Course Synthesis Progress & Rate-Limit Shield */}
                <div className="space-y-1 font-mono-code text-[11px]">
                  <div className="flex items-center justify-between text-ink-600 text-[10px]">
                    <span className="font-semibold">Course Progress: {synthesizedModulesCount}/{sectionised.totalSections} Ready</span>
                    <span className="font-bold text-ink-900">{synthesisPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-paper-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-terracotta to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${synthesisPercent}%` }}
                    />
                  </div>
                </div>

                {pendingModulesCount > 0 && (
                  <button
                    onClick={() => handleSynthesizeBatch(undefined, 3)}
                    disabled={isBatchSynthesizing}
                    className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-[10px] font-mono-code font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>{isBatchSynthesizing ? 'Synthesizing…' : `✨ Synthesize Next 3 (${pendingModulesCount} Queued)`}</span>
                  </button>
                )}
              </div>

              {/* Filter search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-ink-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter sections..."
                  value={sectionSearchQuery}
                  onChange={(e) => setSectionSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-line-border rounded-lg text-xs font-mono-code text-ink-900 focus:outline-none focus:border-terracotta"
                />
              </div>

              {/* Section list */}
              <div className="space-y-1.5 max-h-[68vh] overflow-y-auto pr-1">
                {filteredSections.map((sec) => {
                  const isActive = sec.index === activeSectionIndex;
                  const isPending = sec.content.includes('<!-- PENDING_SYNTHESIS_START');
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSectionIndex(sec.index);
                        setAiResult(null);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-terracotta text-white border-terracotta shadow-xs'
                          : isPending
                          ? 'bg-amber-50/50 hover:bg-amber-50 text-ink-800 border-amber-200/80'
                          : 'bg-white hover:bg-paper-100 text-ink-800 border-line-border/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono-code opacity-90 mb-0.5">
                        <span className="font-bold">{sec.moduleLabel || `Chapter ${sec.index + 1}`}</span>
                        <div className="flex items-center gap-1">
                          {isPending ? (
                            <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${isActive ? 'bg-amber-400 text-ink-900' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                              ⚡ Queued
                            </span>
                          ) : (
                            <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                              ✓ Ready
                            </span>
                          )}
                          {sec.pageRange && (
                            <span className={`px-1.5 py-0.2 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-paper-200 text-ink-600'}`}>
                              {sec.pageRange}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-semibold leading-tight line-clamp-2">
                        {sec.title}
                      </div>
                      <div className={`text-[10px] font-mono-code mt-1.5 flex items-center gap-2 ${isActive ? 'text-white/80' : 'text-ink-400'}`}>
                        <span>~{sec.wordCount} words</span>
                        <span>•</span>
                        <span>{sec.estimatedMinutes} min read</span>
                      </div>
                    </button>
                  );
                })}

                {filteredSections.length === 0 && (
                  <div className="p-4 text-center text-xs font-mono-code text-ink-400">
                    No sections matching "{sectionSearchQuery}"
                  </div>
                )}
              </div>
            </div>
          </aside>
          )}

          {/* ── Main Canvas: Authentic Topper's Notebook Sheet (Centered) ── */}
          <main className={`flex-1 min-w-0 ${
            isFullscreen
              ? 'max-w-3xl lg:max-w-4xl xl:max-w-[880px] 2xl:max-w-4xl mx-auto w-full'
              : 'w-full'
          }`}>
            <div className={`relative rounded-2xl border ${getThemeClass()} ${showSpiral && (notebookTheme === 'ruled' || notebookTheme === 'yellow') ? 'pl-10 sm:pl-16 pr-4 sm:pr-8 py-7' : 'p-5 sm:p-8 md:p-10'} shadow-lg min-h-[75vh] transition-all`}>
              
              {/* Whiteboard Canvas Overlay for Smooth Handwriting & Annotations */}
              <NotebookWhiteboard
                pageKey={`uploaded_${note.id}_sec_${activeSectionIndex}`}
                isDrawingEnabled={isDrawingEnabled}
                activeTool={activeWhiteboardTool}
                activeColor={activeWhiteboardColor}
                strokeWidth={whiteboardStrokeWidth}
              />

              {/* Spiral wire rings on the left margin */}
              {showSpiral && (notebookTheme === 'ruled' || notebookTheme === 'yellow') && (
                <div
                  className="spiral-binder absolute left-1 sm:left-3 top-0 bottom-0 w-6 pointer-events-none z-10 opacity-70"
                  title="Spiral Binding"
                />
              )}

              {/* Stationery Header */}
              <div className="border-b border-line-border/80 pb-5 mb-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap text-xs font-mono-code">
                    <span className="px-2.5 py-0.5 bg-terracotta text-white font-bold rounded text-[11px] uppercase tracking-wide">
                      {activeSection.moduleLabel || `Section ${activeSection.index + 1}`}
                    </span>
                    {activeSection.pageRange && (
                      <span className="px-2 py-0.5 bg-paper-200 border border-line-border text-ink-700 font-bold rounded text-[11px]">
                        📌 Source: {activeSection.pageRange}
                      </span>
                    )}
                    <span className="text-ink-500 hidden sm:inline">
                      • Chapter {activeSection.index + 1} of {sectionised.totalSections}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono-code text-ink-500">
                    ⏱️ {activeSection.estimatedMinutes} min read · {activeSection.wordCount} words
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-ink-900 tracking-tight leading-snug">
                    {activeSection.title}
                  </h2>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={async () => {
                        setIsGeneratingDiagram(true);
                        try {
                          const d = await DiagramGenerator.generateForTopic(activeSection.title, activeSection.content, 'architecture');
                          setGeneratedDiagrams(prev => [d, ...prev]);
                          setViewMode('diagrams');
                        } finally {
                          setIsGeneratingDiagram(false);
                        }
                      }}
                      disabled={isGeneratingDiagram}
                      className="px-3 py-1.5 bg-paper-100 hover:bg-terracotta hover:text-white border border-line-border text-ink-800 rounded-lg text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
                    >
                      <Layers className="w-3.5 h-3.5 text-terracotta" />
                      <span>{isGeneratingDiagram ? 'Synthesizing…' : '📊 Draw Diagram for this Chapter'}</span>
                    </button>
                    {allDiagrams.some(d => d.title.toLowerCase().includes(activeSection.title.toLowerCase()) || activeSection.title.toLowerCase().includes(d.title.toLowerCase())) && (
                      <button
                        onClick={() => setViewMode('diagrams')}
                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-mono-code font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <span>✓ Diagram Ready</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Inline Visual Diagram for this Chapter if available */}
              {allDiagrams.filter(d => d.title.toLowerCase().includes(activeSection.title.toLowerCase()) || activeSection.title.toLowerCase().includes(d.title.toLowerCase())).length > 0 && (
                <div className="mb-6 p-4 bg-white/95 border border-line-border rounded-xl shadow-xs space-y-2">
                  {(() => {
                    const secDiag = allDiagrams.find(d => d.title.toLowerCase().includes(activeSection.title.toLowerCase()) || activeSection.title.toLowerCase().includes(d.title.toLowerCase()))!;
                    return (
                      <>
                        <div className="flex items-center justify-between border-b border-line-border/60 pb-1.5 text-xs font-mono-code">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-terracotta" />
                            <span className="font-bold text-ink-900">{secDiag.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedDiagramForZoom(secDiag)}
                              className="text-ink-600 hover:text-terracotta flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-terracotta" />
                              <span>Zoom / Expand</span>
                            </button>
                            <button
                              onClick={() => setViewMode('diagrams')}
                              className="text-terracotta underline text-[11px] cursor-pointer"
                            >
                              Diagram Gallery →
                            </button>
                          </div>
                        </div>
                        <div className="overflow-x-auto bg-white p-2 rounded">
                          <MermaidDiagram chart={secDiag.code} />
                        </div>
                        <p className="text-[11px] font-mono-code text-ink-500 italic">
                          {secDiag.caption}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Progressive Synthesis Command Card for Queued Sections */}
              {(() => {
                const isCurrentSectionPending = activeSection.content.includes('<!-- PENDING_SYNTHESIS_START');
                const hasPendingUpcoming = sectionised.sections.slice(activeSectionIndex + 1).some(s => s.content.includes('<!-- PENDING_SYNTHESIS_START'));

                return (
                  <>
                    {isCurrentSectionPending && (
                      <div className="mb-6 p-5 bg-gradient-to-br from-amber-50/95 via-orange-50/70 to-paper-50 border-2 border-amber-300 rounded-2xl shadow-sm space-y-4 font-mono-code">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-amber-500 text-white shadow-2xs">
                              <Sparkles className="w-4 h-4" />
                            </span>
                            <div>
                              <h3 className="text-sm font-bold text-ink-900 font-serif-heading">
                                Progressive Session Synthesis (Rate-Limit Shield)
                              </h3>
                              <p className="text-[11px] text-ink-600 font-sans">
                                To prevent API rate limits (429), sessions are generated on-demand as you progress through the courseware.
                              </p>
                            </div>
                          </div>
                          {activeSection.pageRange && (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md font-bold text-xs border border-amber-200">
                              📖 Source: {activeSection.pageRange}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-ink-700 font-sans leading-relaxed">
                          Synthesizing this session retrieves exact passages from Pages {activeSection.pageRange || 'the textbook'} using client-side BM25 RAG, generating complete exam-ready notes, mathematical derivations (KaTeX), and interactive vector Mermaid diagrams.
                        </p>

                        {isBatchSynthesizing ? (
                          <div className="p-4 bg-white/90 border border-amber-300 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs text-ink-800">
                              <span className="font-bold flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-amber-600 animate-spin" />
                                <span>{batchProgress.message || 'Synthesizing session…'}</span>
                              </span>
                              <span className="font-bold text-amber-700">{batchProgress.percent}%</span>
                            </div>
                            <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-terracotta rounded-full transition-all duration-300"
                                style={{ width: `${batchProgress.percent}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <button
                              onClick={() => handleSynthesizeBatch(activeSectionIndex, 1)}
                              className="px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>✨ Synthesize This Session ({activeSection.moduleLabel || 'Chapter'})</span>
                            </button>

                            {pendingModulesCount > 1 && (
                              <button
                                onClick={() => handleSynthesizeBatch(activeSectionIndex, 3)}
                                className="px-4 py-2 bg-ink-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                              >
                                <Layers className="w-4 h-4 text-amber-400" />
                                <span>✨ Synthesize Next 3 Sessions</span>
                              </button>
                            )}
                          </div>
                        )}

                        {batchError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>{batchError}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Main Content Rendered via ToppersNoteRenderer */}
                    <div className={`leading-relaxed ${getNoteFontClass()}`}>
                      <ToppersNoteRenderer content={activeSection.content} />
                    </div>

                    {/* Milestone Next Batch Study Callout */}
                    {!isCurrentSectionPending && hasPendingUpcoming && (
                      <div className="my-8 p-4.5 bg-gradient-to-r from-amber-50 via-paper-50 to-orange-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs font-mono-code text-xs">
                        <div className="space-y-1">
                          <div className="font-bold text-ink-900 flex items-center gap-2">
                            <span className="text-base">🎯</span>
                            <span>Completed Studying {activeSection.moduleLabel || `Chapter ${activeSection.index + 1}`}!</span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Studied</span>
                          </div>
                          <p className="text-[11px] text-ink-600 font-sans">
                            Great work! Ready to synthesize the next 3 sessions with RAG citations, KaTeX, and Mermaid flowcharts?
                          </p>
                        </div>

                        <button
                          onClick={() => handleSynthesizeBatch(activeSectionIndex + 1, 3)}
                          disabled={isBatchSynthesizing}
                          className="px-4 py-2 bg-ink-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>{isBatchSynthesizing ? 'Synthesizing…' : '✨ Synthesize Next 3 Sessions'}</span>
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Bottom Section Paging Controls */}
              <div className="mt-10 pt-5 border-t border-line-border/80 flex items-center justify-between gap-3 text-xs font-mono-code pl-4 sm:pl-7">
                <button
                  onClick={() => {
                    setActiveSectionIndex(prev => Math.max(0, prev - 1));
                    setAiResult(null);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  disabled={activeSectionIndex === 0}
                  className="px-4 py-2 rounded-lg border border-line-border bg-white hover:bg-paper-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer font-bold text-ink-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Section</span>
                </button>

                <span className="text-ink-500 font-bold">
                  {activeSectionIndex + 1} / {sectionised.totalSections}
                </span>

                <button
                  onClick={() => {
                    setActiveSectionIndex(prev => Math.min(sectionised.sections.length - 1, prev + 1));
                    setAiResult(null);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  disabled={activeSectionIndex === sectionised.sections.length - 1}
                  className="px-4 py-2 rounded-lg border border-line-border bg-white hover:bg-paper-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer font-bold text-ink-800"
                >
                  <span>Next Section</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* ── Interactive Section Socratic Q&A Drawer ── */}
              <div className="mt-8 pt-6 border-t-2 border-line-border/80 pl-4 sm:pl-7 space-y-3 font-mono-code text-xs">
                <div className="flex items-center gap-2 text-ink-900 font-bold">
                  <Sparkles className="w-4 h-4 text-terracotta" />
                  <span>Ask AI Tutor Grounded in "{activeSection.title}":</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sectionAiQuery}
                    onChange={(e) => setSectionAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskSectionAi()}
                    placeholder="e.g. Can you explain the derivation in this section, or generate KTU 3-mark questions?"
                    className="flex-1 px-3 py-2 bg-white border border-line-border rounded-lg text-ink-900 focus:outline-none focus:border-terracotta text-xs"
                  />
                  <button
                    onClick={() => handleAskSectionAi()}
                    disabled={isAiLoading || !sectionAiQuery.trim()}
                    className="px-4 py-2 bg-terracotta hover:bg-terracotta/90 disabled:opacity-40 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isAiLoading ? (
                      <>
                        <Cpu className="w-3.5 h-3.5 animate-spin" />
                        <span>Solving…</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Ask AI</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Explanation Result */}
                {aiResult && (
                  <div className="p-5 bg-white border border-terracotta/30 rounded-xl space-y-3 shadow-xs mt-3 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-line-border pb-2 text-[11px]">
                      <span className="font-bold text-ink-900">
                        ⚡ Socratic AI Response ({aiResult.decision.modelName})
                      </span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Saved to Note Vault
                      </span>
                    </div>
                    <div className="pt-1">
                      <ToppersNoteRenderer content={aiResult.response} className={getNoteFontClass()} />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </main>

          {/* ── Right Sidebar: Study Companion & Chapter Outline (Fullscreen Mode) ── */}
          {isFullscreen && showCompanionSidebar && (
            <aside className="hidden xl:block w-72 2xl:w-80 shrink-0 space-y-3 sticky top-20 max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-1">
              {/* Quick Chapter Outline / Subsections */}
              <div className="bg-paper-50 border border-line-border rounded-xl p-3.5 shadow-xs space-y-2.5 font-mono-code text-xs">
                <div className="flex items-center justify-between border-b border-line-border/60 pb-2">
                  <span className="font-bold text-ink-900 flex items-center gap-1.5 uppercase text-[11px]">
                    <Layers className="w-3.5 h-3.5 text-terracotta" />
                    <span>Chapter Outline</span>
                  </span>
                  <span className="text-[10px] text-ink-500 font-bold">
                    {activeSection.subsections.length || 4} Topics
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  {activeSection.subsections.length > 0 ? (
                    activeSection.subsections.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-1.5 rounded hover:bg-white border border-transparent hover:border-line-border transition-colors text-ink-700 flex items-center gap-1.5 cursor-pointer leading-tight"
                        onClick={() => {
                          const headings = Array.from(document.querySelectorAll('h3, h4, h5'));
                          const target = headings.find(h => h.textContent?.toLowerCase().includes(sub.title.toLowerCase().slice(0, 15)));
                          if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                        <span className="truncate text-[11px] font-sans font-medium">{sub.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-1 text-[11px] font-sans text-ink-600">
                      <div className="p-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                        <span>Core Principles &amp; Concepts</span>
                      </div>
                      <div className="p-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Mathematical Formulas &amp; KaTeX</span>
                      </div>
                      <div className="p-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Vector Flowcharts &amp; Architecture</span>
                      </div>
                      <div className="p-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>KTU 3-Mark &amp; 8-Mark Answers</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Socratic AI Tutor in Right Sidebar */}
              <div className="bg-paper-50 border border-line-border rounded-xl p-3.5 shadow-xs space-y-2.5 font-mono-code text-xs">
                <div className="flex items-center justify-between border-b border-line-border/60 pb-2">
                  <span className="font-bold text-ink-900 flex items-center gap-1.5 uppercase text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                    <span>Socratic AI Companion</span>
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[9px] rounded border border-emerald-200">
                    Live
                  </span>
                </div>

                <p className="text-[11px] text-ink-500 font-sans leading-snug">
                  Ask questions about <strong className="text-ink-800 font-semibold">{activeSection.moduleLabel || 'this chapter'}</strong> while reading:
                </p>

                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={sectionAiQuery}
                    onChange={(e) => setSectionAiQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAskSectionAi();
                      }
                    }}
                    placeholder="Ask doubt, derivation, or KTU question…"
                    className="w-full px-2.5 py-1.5 bg-white border border-line-border rounded-lg text-ink-900 focus:outline-none focus:border-terracotta text-xs font-mono-code resize-none"
                  />
                  <button
                    onClick={() => handleAskSectionAi()}
                    disabled={isAiLoading || !sectionAiQuery.trim()}
                    className="w-full py-1.5 px-3 bg-terracotta hover:bg-terracotta/90 disabled:opacity-40 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    {isAiLoading ? (
                      <>
                        <Cpu className="w-3.5 h-3.5 animate-spin" />
                        <span>Solving…</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Ask AI Companion</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Socratic Answer Card in Companion Sidebar */}
                {aiResult && (
                  <div className="p-3 bg-white border border-terracotta/30 rounded-xl space-y-2 shadow-2xs mt-2 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-line-border pb-1 text-[10px]">
                      <span className="font-bold text-ink-900 truncate">
                        ⚡ {aiResult.decision.modelName}
                      </span>
                      <span className="text-emerald-700 font-bold shrink-0">Saved</span>
                    </div>
                    <div className="text-[11px] leading-relaxed">
                      <ToppersNoteRenderer content={aiResult.response} className="text-xs" />
                    </div>
                  </div>
                )}
              </div>

              {/* Active Chapter Visual Diagrams Preview in Companion Sidebar */}
              {allDiagrams.filter(d => d.title.toLowerCase().includes(activeSection.title.toLowerCase()) || activeSection.title.toLowerCase().includes(d.title.toLowerCase())).length > 0 && (
                <div className="bg-paper-50 border border-line-border rounded-xl p-3.5 shadow-xs space-y-2 font-mono-code text-xs">
                  <div className="flex items-center justify-between border-b border-line-border/60 pb-1.5 text-[11px]">
                    <span className="font-bold text-ink-900 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-terracotta" />
                      <span>Chapter Diagram</span>
                    </span>
                    <button
                      onClick={() => setViewMode('diagrams')}
                      className="text-terracotta hover:underline text-[10px]"
                    >
                      All Diagrams →
                    </button>
                  </div>
                  {(() => {
                    const secDiag = allDiagrams.find(d => d.title.toLowerCase().includes(activeSection.title.toLowerCase()) || activeSection.title.toLowerCase().includes(d.title.toLowerCase()))!;
                    return (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-ink-800 truncate">{secDiag.title}</div>
                        <div
                          className="bg-white rounded p-2 border border-line-border overflow-hidden cursor-pointer hover:border-terracotta transition-colors max-h-48"
                          onClick={() => setSelectedDiagramForZoom(secDiag)}
                          title="Click to Zoom Diagram"
                        >
                          <MermaidDiagram chart={secDiag.code} />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </aside>
          )}
        </div>
      )}

      {/* ── Fullscreen / Zoom Modal for Diagrams ── */}
      {selectedDiagramForZoom && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-line-border overflow-hidden">
            <div className="p-4 border-b border-line-border flex items-center justify-between bg-paper-50 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-terracotta" />
                <h3 className="font-serif-heading font-bold text-base text-ink-900">
                  {selectedDiagramForZoom.title}
                </h3>
                {selectedDiagramForZoom.diagramType && (
                  <span className="px-2 py-0.5 bg-paper-200 border border-line-border rounded text-[10px] font-mono-code text-ink-700 uppercase">
                    {selectedDiagramForZoom.diagramType}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDiagramForZoom.code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-1.5 text-xs font-mono-code border border-line-border rounded-lg bg-white hover:bg-paper-100 flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Code' : 'Copy Mermaid Code'}</span>
                </button>
                <button
                  onClick={() => setSelectedDiagramForZoom(null)}
                  className="px-3 py-1.5 rounded-lg bg-paper-200 hover:bg-paper-300 text-ink-800 text-xs font-mono-code font-bold cursor-pointer transition-colors"
                >
                  ✕ Close Fullscreen
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 sm:p-8 overflow-auto bg-white flex items-center justify-center min-h-[400px]">
              <div className="w-full">
                <MermaidDiagram chart={selectedDiagramForZoom.code} />
              </div>
            </div>
            <div className="p-3 border-t border-line-border bg-paper-50 text-xs font-mono-code text-ink-600 italic">
              {selectedDiagramForZoom.caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
