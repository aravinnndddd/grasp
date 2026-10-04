import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Award, 
  HelpCircle, 
  CheckCircle, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Cpu, 
  Zap, 
  Send, 
  Bookmark, 
  Share2, 
  Info, 
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  Layers,
  GraduationCap,
  Save,
  Download,
  Trash2,
  Search,
  ExternalLink as LinkIcon,
  SlidersHorizontal,
  Palette,
  Type,
  Upload,
  FolderUp,
  FileCheck,
  Maximize2,
  Minimize2,
  Plus,
  ChevronLeft,
  BookOpen as BookIcon,
  LayoutList,
  PanelLeft,
  PanelLeftClose,
  Github,
  Eye,
  EyeOff
} from 'lucide-react';
import { NotebookSidebar } from './NotebookSidebar';
import { moduleNotesDatabase, SubjectNotes, ModuleNoteItem } from '../../data/notes/module-notes-db';
import { ktuS5CseCurriculum } from '../../data/ktu-s5-cse';
import { JevCognitiveRouter, JevExecutionResult } from '../../lib/ai/jev-router';
import { GroqClient } from '../../lib/ai/groq-client';
import { SavedAnswersStorage, SavedAiAnswer } from '../../lib/storage/saved-answers';
import { findGfgLinks } from '../../lib/curriculum/gfg-links';
import { ToppersNoteRenderer } from './ToppersNoteRenderer';
import { UploadNotesModal } from './UploadNotesModal';
import { UploadedNoteViewerModal } from './UploadedNoteViewerModal';
import { UploadedNotesStorage, UploadedNote } from '../../lib/storage/uploaded-notes';
import { NotebookWhiteboard, WhiteboardTool } from './NotebookWhiteboard';
import { WhiteboardToolbar } from './WhiteboardToolbar';
import { BlankNotebookPage } from './BlankNotebookPage';
import { UserBlankPage, UserBlankPagesStorage } from '../../lib/storage/user-blank-pages';
import { KuroseCompanionCard } from './KuroseCompanionCard';
import { QuestionDiagramRenderer } from './QuestionDiagramRenderer';
import { ModuleDiagramsGallery } from './ModuleDiagramsGallery';
import { kuroseRossRepoData } from '../../data/notes/kurose-ross-notes';
import { KuroseChapterNotebookSheet } from './KuroseChapterNotebookSheet';
import { GitHubRepoImporterModal } from './GitHubRepoImporterModal';
import { GitHubRepoNotebookSheet } from './GitHubRepoNotebookSheet';
import { GitHubNotesStorage, ImportedGitHubRepo } from '../../lib/storage/github-notes-storage';

interface ModuleNotesViewProps {
  initialSubjectId?: string;
  onOpenGroqSettings: () => void;
  onSelectSubject?: (subjectId: string) => void;
  onOpenGhImporter?: () => void;
}

export const ModuleNotesView: React.FC<ModuleNotesViewProps> = ({
  initialSubjectId = 'pccst503',
  onOpenGroqSettings,
  onSelectSubject,
  onOpenGhImporter
}) => {
  // Current subject and module selection
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [selectedModuleNum, setSelectedModuleNum] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'all' | 'concept' | 'diagrams' | 'definitions' | '3mark' | '5mark' | '8mark' | 'kurose' | 'references' | 'saved' | 'uploaded'>('all');

  // Notebook Styling & Adjuster state
  const [notebookTheme, setNotebookTheme] = useState<'ruled' | 'grid' | 'yellow' | 'clean'>('ruled');
  const [showSpiral, setShowSpiral] = useState<boolean>(true);
  const [showStickyNotes, setShowStickyNotes] = useState<boolean>(true);
  const [showMarginalia, setShowMarginalia] = useState<boolean>(true);
  const [isStylePanelOpen, setIsStylePanelOpen] = useState<boolean>(false);

  // Font Customization state (Handwriting, Academic Serif, Clean Sans, Monospace)
  const [noteFont, setNoteFont] = useState<'sans' | 'handwriting' | 'serif' | 'mono'>('sans');
  const [noteFontSize, setNoteFontSize] = useState<'xs' | 'sm' | 'base' | 'lg'>('xs');

  const getNoteFontClass = () => {
    let fontCls = 'font-sans';
    if (noteFont === 'handwriting') fontCls = 'font-handwriting font-medium';
    else if (noteFont === 'serif') fontCls = 'font-serif';
    else if (noteFont === 'mono') fontCls = 'font-mono';

    let sizeCls = 'text-xs';
    if (noteFontSize === 'sm') sizeCls = 'text-[13px]';
    else if (noteFontSize === 'base') sizeCls = 'text-sm';
    else if (noteFontSize === 'lg') sizeCls = 'text-base';

    return `${fontCls} ${sizeCls}`;
  };

  // AI Assistant state
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<JevExecutionResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<SavedAiAnswer[]>([]);
  const [savedSearchQuery, setSavedSearchQuery] = useState('');

  // Uploaded Notes State
  const [uploadedNotes, setUploadedNotes] = useState<UploadedNote[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [viewingNote, setViewingNote] = useState<UploadedNote | null>(null);
  const [uploadedSearchQuery, setUploadedSearchQuery] = useState<string>('');
  const [uploadedCategoryFilter, setUploadedCategoryFilter] = useState<string>('all');

  // Page-Wise Notes vs Scroll Mode State
  const [viewMode, setViewMode] = useState<'page' | 'scroll'>('page');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Fullscreen Study Mode & Collapsible Sidebar
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isFsToolbarHidden, setIsFsToolbarHidden] = useState<boolean>(false);

  // Excalidraw-style Whiteboard & Annotation Toolkit State
  const [isDrawingEnabled, setIsDrawingEnabled] = useState<boolean>(false);
  const [activeWhiteboardTool, setActiveWhiteboardTool] = useState<WhiteboardTool>('pen');
  const [activeWhiteboardColor, setActiveWhiteboardColor] = useState<string>('#18181B');
  const [whiteboardStrokeWidth, setWhiteboardStrokeWidth] = useState<number>(2);

  // User-Created Custom Blank / Scratchpad Pages
  const [userBlankPages, setUserBlankPages] = useState<UserBlankPage[]>([]);

  // Load saved answers, uploaded notes, and user blank pages on mount/change
  useEffect(() => {
    setSavedAnswers(SavedAnswersStorage.getAll());
    UploadedNotesStorage.getAll().then(notes => setUploadedNotes(notes));
    setUserBlankPages(UserBlankPagesStorage.getForModule(selectedSubjectId, selectedModuleNum));
    setCurrentPageIndex(0);
  }, [selectedSubjectId, selectedModuleNum]);

  // User-Imported GitHub Notes Repos State
  const [isGhImportModalOpen, setIsGhImportModalOpen] = useState<boolean>(false);
  const [importedGhRepos, setImportedGhRepos] = useState<ImportedGitHubRepo[]>(() => 
    GitHubNotesStorage.getForSubject(initialSubjectId)
  );

  const refreshImportedGhRepos = () => {
    setImportedGhRepos(GitHubNotesStorage.getForSubject(selectedSubjectId));
  };

  // Sync when initialSubjectId prop changes
  useEffect(() => {
    if (initialSubjectId && initialSubjectId !== selectedSubjectId) {
      setSelectedSubjectId(initialSubjectId);
    }
    refreshImportedGhRepos();
  }, [initialSubjectId, selectedSubjectId]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      if (isFs) {
        setIsSidebarOpen(false);
      } else {
        setIsFsToolbarHidden(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
      setIsSidebarOpen(false);
      setIsFsToolbarHidden(false);
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
      setIsFsToolbarHidden(false);
    }
  };

  const refreshSavedAnswers = () => {
    setSavedAnswers(SavedAnswersStorage.getAll());
  };

  const refreshUploadedNotes = async () => {
    const notes = await UploadedNotesStorage.getAll();
    setUploadedNotes(notes);
  };

  const refreshUserBlankPages = () => {
    setUserBlankPages(UserBlankPagesStorage.getForModule(selectedSubjectId, selectedModuleNum));
  };

  const handleAddBlankPage = () => {
    const defaultPagesCount = defaultPageConfigs.length;
    const newPage = UserBlankPagesStorage.save({
      subjectId: selectedSubjectId,
      moduleNum: selectedModuleNum,
      title: `Scratchpad Page ${userBlankPages.length + 1}`,
      content: '',
      paperType: notebookTheme
    });
    refreshUserBlankPages();
    setViewMode('page');
    setCurrentPageIndex(defaultPagesCount + userBlankPages.length);
  };

  const handleUpdateBlankPage = (id: string, updates: Partial<UserBlankPage>) => {
    UserBlankPagesStorage.update(id, updates);
    refreshUserBlankPages();
  };

  const handleDeleteBlankPage = (id: string) => {
    UserBlankPagesStorage.delete(id);
    refreshUserBlankPages();
    setCurrentPageIndex(prev => Math.max(0, prev - 1));
  };

  const handleDeleteUploadedNote = async (id: string) => {
    await UploadedNotesStorage.delete(id);
    await refreshUploadedNotes();
  };

  const handleExportSaved = () => {
    const md = SavedAnswersStorage.exportAsMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KTU_S5_Saved_AI_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteSaved = (id: string) => {
    SavedAnswersStorage.delete(id);
    refreshSavedAnswers();
  };

  // Expanded cards state
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Resolve subject data with alias normalization
  const normalizedSubId = ({
    'cst-305-ml': 'pccst503',
    'cst-303-cn': 'pccst501',
    'cst-306-daa': 'pccst502',
    'cst-308-ai': 'pecst522',
    'cst-307-mpmc': 'pbcst504',
    'cst-301-flat': 'pccst501-flat'
  } as Record<string, string>)[selectedSubjectId] || selectedSubjectId;

  const currentSubjectNotes: SubjectNotes = 
    moduleNotesDatabase[normalizedSubId] || 
    moduleNotesDatabase[selectedSubjectId] || 
    moduleNotesDatabase[selectedSubjectId.toLowerCase()] || 
    moduleNotesDatabase['pccst501'] ||
    moduleNotesDatabase['pccst503'];

  // Resolve current module
  const currentModule: ModuleNoteItem = 
    currentSubjectNotes.modules[selectedModuleNum] || 
    currentSubjectNotes.modules[1] || {
      moduleNum: 1,
      title: 'Module 1: Foundational Syllabus Topics',
      syllabusTopics: ['Core principles and syllabus foundations'],
      conceptualWalkthrough: ['Comprehensive conceptual breakdown.'],
      examDefinitions: ['Foundational syllabus term definition.'],
      questions3Mark: [{ question: 'Explain core concept.', answer: 'Standard definition and significance.' }],
      questions5Mark: [{ question: 'Detail the operational mechanics.', answer: 'Step by step analysis.' }],
      questions8Mark: [{ question: 'Comprehensive architectural evaluation.', answer: 'Derivation and proof.' }]
    };

  const handleSubjectChange = (newSubId: string) => {
    setSelectedSubjectId(newSubId);
    setSelectedModuleNum(1);
    setAiResult(null);
    if (onSelectSubject) {
      onSelectSubject(newSubId);
    }
  };

  const handleAskAi = async (customQuery?: string) => {
    const queryToUse = customQuery || aiQuery;
    if (!queryToUse.trim()) return;

    setIsAiLoading(true);
    try {
      const result = await JevCognitiveRouter.executeQuery(queryToUse, {
        subjectTitle: currentSubjectNotes.subjectTitle,
        subjectCode: currentSubjectNotes.subjectCode,
        moduleTitle: currentModule.title
      });
      setAiResult(result);
      refreshSavedAnswers();
    } catch (err: any) {
      console.error('AI execution error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const allSubjects = ktuS5CseCurriculum.subjects;

  const isComputerNetworks = 
    selectedSubjectId.toLowerCase().includes('cst501') || 
    selectedSubjectId.toLowerCase().includes('cst303') ||
    currentSubjectNotes.subjectCode.toLowerCase().includes('cst501') ||
    currentSubjectNotes.subjectCode.toLowerCase().includes('cst303');

  // Base Syllabus Pages for Page-Wise Book Mode
  const basePageConfigs = [
    { id: 'concepts', title: 'Concepts & Intuition', subtitle: 'First-principles breakdown, motives & mechanics' },
    { id: 'diagrams', title: 'Visual Diagrams & Models', subtitle: 'Mermaid diagrams, topologies & mathematical models' },
    { id: 'definitions_3mark', title: 'Definitions & 3-Mark', subtitle: 'Official KTU exam definitions & Part A questions' },
    { id: 'exam_5_8mark', title: '5-Mark & 8-Mark Solved', subtitle: 'Comprehensive model answers & university valuation rubrics' },
    { id: 'references', title: 'Textbooks & References', subtitle: 'Authoritative syllabus reference volumes' }
  ];

  // Kurose & Ross Chapter Pages appended directly for Computer Networks
  const kurosePageConfigs = isComputerNetworks
    ? kuroseRossRepoData.chapters.map(ch => ({
        id: `kurose_${ch.id}`,
        title: `Kurose Ch ${ch.chapterNumber}: ${ch.shortTitle}`,
        subtitle: `Top-Down Approach (8th Ed) - ${ch.title}`,
        chapter: ch
      }))
    : [];

  // User-Imported GitHub Repositories chapter pages
  const ghRepoPageConfigs = importedGhRepos.flatMap(repo => 
    repo.chapters.map((ch, idx) => ({
      id: `gh_${repo.id}_${ch.id}`,
      title: `${repo.repo}: ${ch.title}`,
      subtitle: `Imported GitHub Notes (${repo.owner}/${repo.repo})`,
      ghRepo: repo,
      ghChapter: ch,
      ghChapterIndex: idx,
      totalGhChapters: repo.chapters.length
    }))
  );

  const defaultPageConfigs = [...basePageConfigs, ...kurosePageConfigs, ...ghRepoPageConfigs];

  const handleNavigateToKuroseChapter = (chapterNum: number) => {
    const targetIdx = basePageConfigs.length + (chapterNum - 1);
    setViewMode('page');
    setCurrentPageIndex(targetIdx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = defaultPageConfigs.length + userBlankPages.length;
  const isCustomBlankPage = currentPageIndex >= defaultPageConfigs.length;
  const currentBlankPage = isCustomBlankPage ? userBlankPages[currentPageIndex - defaultPageConfigs.length] : null;
  const activePageKey = isCustomBlankPage 
    ? `userpage_${currentBlankPage?.id}` 
    : `${selectedSubjectId}_m${selectedModuleNum}_p${currentPageIndex}`;

  const shouldRenderSection = (sectionPageIdx: number, tabName: string) => {
    if (viewMode === 'page') {
      return currentPageIndex === sectionPageIdx;
    }
    return activeTab === 'all' || activeTab === tabName;
  };

  return (
    <div className={`min-h-screen bg-paper pb-24 text-charcoal font-sans transition-all ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-paper-100 p-2 sm:p-6 shadow-2xl' : ''}`}>
      
      {/* Redesigned Collapsible Left Sidebar */}
      <NotebookSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedSubjectId={selectedSubjectId}
        onSelectSubject={handleSubjectChange}
        allSubjects={allSubjects}
        currentSubjectNotes={currentSubjectNotes}
        selectedModuleNum={selectedModuleNum}
        onSelectModule={(mNum) => {
          setSelectedModuleNum(mNum);
          setAiResult(null);
        }}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab as any)}
        savedCount={savedAnswers.length}
        uploadCount={uploadedNotes.filter(n => n.subjectId.toLowerCase() === selectedSubjectId.toLowerCase() || n.subjectCode.toLowerCase() === currentSubjectNotes.subjectCode.toLowerCase()).length}
        onExportSaved={handleExportSaved}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenGroqSettings={onOpenGroqSettings}
        notebookTheme={notebookTheme}
        onSelectTheme={setNotebookTheme}
        noteFont={noteFont}
        onSelectFont={setNoteFont}
        noteFontSize={noteFontSize}
        onSelectFontSize={setNoteFontSize}
        showSpiral={showSpiral}
        onToggleSpiral={setShowSpiral}
        showStickyNotes={showStickyNotes}
        onToggleStickyNotes={setShowStickyNotes}
        showMarginalia={showMarginalia}
        onToggleMarginalia={setShowMarginalia}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        isFullscreen={isFullscreen}
      />

      {/* Sleek Minimal Top Navigation Bar (Non-Fullscreen View) */}
      {!isFullscreen && (
        <div className="bg-white border-b border-line-border sticky top-14 z-20 shadow-xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
            
            {/* Sidebar Toggle & Course Context Pill */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="px-2.5 sm:px-3 py-1.5 bg-paper hover:bg-paper-light border border-hairline hover:border-accent text-charcoal font-mono text-xs font-bold rounded flex items-center gap-1.5 sm:gap-2 transition-all shadow-2xs cursor-pointer"
                title="Toggle Sidebar: Modules, Subjects, Paper Themes & Options"
              >
                <PanelLeft className="w-4 h-4 text-accent" />
                <span className="hidden xs:inline">Modules &amp; Settings</span>
                <span className="xs:hidden">Menu</span>
              </button>

              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="font-bold text-accent px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[11px]">
                  {currentSubjectNotes.subjectCode} • M{currentModule.moduleNum}
                </span>
                <span className="text-charcoal font-semibold hidden md:inline truncate max-w-[260px]">
                  {currentModule.title.split(':')[1] || currentModule.title}
                </span>
              </div>
            </div>

            {/* Main Action Bar: Drawing Tools + Page Navigation + Fullscreen */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
              {/* Whiteboard Toolbar */}
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

              {/* View Mode Toggle */}
              <div className="flex items-center bg-paper border border-hairline p-0.5 rounded font-mono text-xs">
                <button
                  onClick={() => setViewMode('page')}
                  className={`px-2 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                    viewMode === 'page' ? 'bg-charcoal text-paper font-bold' : 'text-charcoal-muted hover:text-charcoal'
                  }`}
                  title="Page-Wise Notebook Mode"
                >
                  <BookIcon className="w-3 h-3 text-accent inline mr-1" />
                  <span className="hidden sm:inline">Page</span>
                </button>
                <button
                  onClick={() => setViewMode('scroll')}
                  className={`px-2 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                    viewMode === 'scroll' ? 'bg-charcoal text-paper font-bold' : 'text-charcoal-muted hover:text-charcoal'
                  }`}
                  title="Continuous Scroll Mode"
                >
                  <LayoutList className="w-3 h-3 inline mr-1" />
                  <span className="hidden sm:inline">Scroll</span>
                </button>
              </div>

              {/* In Page-Wise Mode: Prev & Next Page Controls */}
              {viewMode === 'page' && (
                <div className="flex items-center gap-1 bg-paper border border-hairline p-0.5 rounded font-mono text-xs">
                  <button
                    onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentPageIndex === 0}
                    className="p-1 hover:bg-paper-light disabled:opacity-30 rounded text-charcoal cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-1.5 text-[11px] font-bold text-charcoal whitespace-nowrap">
                    P.{currentPageIndex + 1}/{totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPageIndex >= totalPages - 1}
                    className="p-1 hover:bg-paper-light disabled:opacity-30 rounded text-charcoal cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick + Add Blank Page in Page-Wise Mode */}
              {viewMode === 'page' && (
                <button
                  onClick={handleAddBlankPage}
                  className="px-2.5 py-1 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-mono text-[11px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                  title="Add New A4 Blank Notebook Page"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Blank Page</span>
                </button>
              )}

              {/* Paste GitHub Notes Repo Button */}
              <button
                onClick={() => setIsGhImportModalOpen(true)}
                className="px-2.5 py-1 bg-ink-900 hover:bg-black text-white font-mono text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Paste and import any public GitHub notes repository (e.g. Kurose & Ross notes)"
              >
                <Github className="w-3.5 h-3.5 text-paper-200" />
                <span className="hidden sm:inline">Paste GH Repo</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Fullscreen Floating Controls Bar: ONLY tools and next button! */}
      {isFullscreen && isFsToolbarHidden && (
        <button
          onClick={() => setIsFsToolbarHidden(false)}
          className="fixed top-2.5 left-1/2 -translate-x-1/2 z-50 bg-ink-900/90 hover:bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer opacity-75 hover:opacity-100 animate-fade-in border border-white/20"
          title="Show Fullscreen Toolbar (Click to reveal)"
        >
          <Eye className="w-3.5 h-3.5 text-accent" />
          <span className="text-[11px] font-bold">Show Toolbar</span>
          <ChevronDown className="w-3 h-3 text-ink-300" />
        </button>
      )}

      {isFullscreen && !isFsToolbarHidden && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border border-charcoal/20 rounded-lg shadow-xl px-3 py-1.5 flex items-center gap-2 max-w-[95vw] overflow-x-auto animate-fade-in">
          {/* Small discreet sidebar trigger */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-paper-200 rounded text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
            title="Open Modules & Settings Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-line-border" />

          {/* Whiteboard Tools (Draw/Annotate, Pen, Highlighter, Eraser, Shapes, Colors, Stroke Width) */}
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

          <div className="w-[1px] h-4 bg-line-border" />

          {/* Page Navigation: Prev, Page X/Y, Next */}
          {viewMode === 'page' && (
            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
                className="px-2 py-1 bg-paper hover:bg-paper-200 disabled:opacity-30 border border-line-border rounded text-charcoal font-semibold flex items-center gap-0.5 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <span className="px-2 py-0.5 bg-paper-dark border border-hairline rounded font-bold text-charcoal text-[11px] whitespace-nowrap">
                {currentPageIndex + 1} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPageIndex >= totalPages - 1}
                className="px-2.5 py-1 bg-charcoal hover:bg-black disabled:opacity-30 text-white rounded font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Next Page"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5 text-accent" />
              </button>
            </div>
          )}

          {/* Quick + Add Blank Page button in fullscreen */}
          {viewMode === 'page' && (
            <button
              onClick={handleAddBlankPage}
              className="p-1.5 text-accent hover:bg-accent/10 rounded transition-colors cursor-pointer"
              title="Add New A4 Blank Notebook Page"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          <div className="w-[1px] h-4 bg-line-border" />

          {/* Hide Toolbar Button (Focus Mode) */}
          <button
            onClick={() => setIsFsToolbarHidden(true)}
            className="p-1.5 text-charcoal-muted hover:text-charcoal hover:bg-paper-200 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono"
            title="Hide Toolbar (Focus Mode)"
          >
            <EyeOff className="w-4 h-4" />
            <span className="hidden md:inline text-[10px]">Hide</span>
          </button>

          {/* Exit Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-charcoal-muted hover:text-rose-600 hover:bg-paper-200 rounded transition-colors ml-0.5 cursor-pointer"
            title="Exit Fullscreen (Esc)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container with Customizable Notebook Page Wrapper */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-3 sm:py-6">
        
        {/* Page-Wise Navigation Station Bar */}
        {viewMode === 'page' && !isFullscreen && (
          <div className="mb-4 bg-paper-50 border border-line-border p-2 sm:p-2.5 rounded flex flex-wrap items-center justify-between gap-2 sm:gap-3 shadow-2xs text-xs font-mono">
            {/* Page Flipper Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
                className="px-2 sm:px-2.5 py-1 bg-white hover:bg-paper-200 disabled:opacity-30 border border-line-border rounded flex items-center gap-1 font-semibold text-charcoal transition-colors cursor-pointer text-xs"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev Page</span>
              </button>

              <span className="font-bold text-charcoal px-2 py-0.5 bg-paper-dark border border-hairline rounded text-[11px] sm:text-xs">
                P.{currentPageIndex + 1}/{totalPages}
              </span>

              <button
                onClick={() => setCurrentPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPageIndex >= totalPages - 1}
                className="px-2 sm:px-2.5 py-1 bg-white hover:bg-paper-200 disabled:opacity-30 border border-line-border rounded flex items-center gap-1 font-semibold text-charcoal transition-colors cursor-pointer text-xs"
                title="Next Page"
              >
                <span className="hidden sm:inline">Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Page Jump Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
              {defaultPageConfigs.map((cfg, idx) => (
                <button
                  key={cfg.id}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`px-2.5 py-1 text-[11px] rounded border transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                    currentPageIndex === idx
                      ? 'bg-ink-900 text-white font-bold border-ink-900 shadow-2xs'
                      : 'bg-white text-charcoal-muted border-line-border hover:text-charcoal hover:border-charcoal'
                  }`}
                  title={cfg.subtitle}
                >
                  {cfg.id.startsWith('kurose_') 
                    ? `P.${idx + 1}: Ch ${(cfg as any).chapter?.chapterNumber || ''}` 
                    : cfg.id.startsWith('gh_')
                    ? `P.${idx + 1}: ${(cfg as any).ghChapter?.title.slice(0, 10)}...`
                    : `P.${idx + 1}: ${cfg.title.split(' ')[0]}`
                  }
                </button>
              ))}

              {userBlankPages.map((up, uIdx) => {
                const pageNum = defaultPageConfigs.length + uIdx;
                return (
                  <button
                    key={up.id}
                    onClick={() => setCurrentPageIndex(pageNum)}
                    className={`px-2.5 py-1 text-[11px] rounded border transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                      currentPageIndex === pageNum
                        ? 'bg-accent text-white font-bold border-accent shadow-2xs'
                        : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    }`}
                    title={up.title}
                  >
                    P.{pageNum + 1}: {up.title.slice(0, 10)}...
                  </button>
                );
              })}

              {/* Add New Blank Page Button */}
              <button
                onClick={handleAddBlankPage}
                className="px-2.5 sm:px-3 py-1 bg-accent hover:bg-accent/90 text-white font-bold text-[11px] rounded flex items-center gap-1 transition-colors shadow-2xs shrink-0 ml-1 cursor-pointer"
                title="Add a new blank scratchpad page to type and sketch with Excalidraw-like whiteboard tools"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">+ Add Blank Page</span>
              </button>
            </div>
          </div>
        )}

        <div className={`transition-all duration-300 relative ${
          isCustomBlankPage
            ? 'p-0 bg-transparent border-none shadow-none space-y-0'
            : notebookTheme === 'ruled'
            ? `notebook-ruled-page p-3.5 sm:p-10 border border-stone-300 shadow-xl pl-7 sm:pl-20 rounded-xs space-y-6 sm:space-y-8 ${getNoteFontClass()}`
            : notebookTheme === 'grid'
            ? `notebook-grid-page p-3.5 sm:p-10 border border-blue-200 shadow-xl pl-4 sm:pl-10 rounded-xs space-y-6 sm:space-y-8 ${getNoteFontClass()}`
            : notebookTheme === 'yellow'
            ? `notebook-legal-pad p-3.5 sm:p-10 border border-amber-300 shadow-xl pl-7 sm:pl-20 rounded-xs space-y-6 sm:space-y-8 ${getNoteFontClass()}`
            : `space-y-6 sm:space-y-8 ${getNoteFontClass()}`
        }`}>

          {/* Excalidraw-style Whiteboard Canvas Overlay */}
          <NotebookWhiteboard
            pageKey={activePageKey}
            isDrawingEnabled={isDrawingEnabled}
            activeTool={activeWhiteboardTool}
            activeColor={activeWhiteboardColor}
            strokeWidth={whiteboardStrokeWidth}
          />

          {/* Spiral binding wire rings simulation */}
          {!isCustomBlankPage && showSpiral && (notebookTheme === 'ruled' || notebookTheme === 'yellow') && (
            <div 
              className="spiral-binder absolute left-1 sm:left-2.5 top-0 bottom-0 w-6 pointer-events-none z-10 opacity-70"
              title="Spiral Binder" 
            />
          )}

          {/* Compact Page Stamp for Pages > 0 */}
          {!isCustomBlankPage && viewMode === 'page' && currentPageIndex > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-hairline/80 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent font-bold uppercase rounded-xs text-[10px]">
                  {currentSubjectNotes.subjectCode} • MOD {currentModule.moduleNum}
                </span>
                <span className="text-charcoal font-semibold">
                  {defaultPageConfigs[currentPageIndex]?.title}
                </span>
              </div>
              <span className="text-charcoal-muted text-[11px]">
                Page {currentPageIndex + 1} of {totalPages}
              </span>
            </div>
          )}

        {/* Module Header Card (Page 0 or Scroll Mode) */}
        {(viewMode === 'scroll' || currentPageIndex === 0) && (
          <>
            <div className="p-6 bg-paper-light border border-hairline shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-2 flex-1 min-w-[280px]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase">
                  {currentSubjectNotes.subjectCode} • MODULE {currentModule.moduleNum}
                </span>
                <span className="font-mono text-xs text-charcoal-muted">
                  Official KTU S5 CSE Syllabus Alignment
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-charcoal tracking-tight">
                {currentModule.title}
              </h1>
              <p className="text-xs text-charcoal-muted font-mono leading-relaxed">
                Subject: <strong className="text-charcoal">{currentSubjectNotes.subjectTitle}</strong>
              </p>
            </div>

            {/* Syllabus Topics Pills */}
            <div className="max-w-md w-full bg-paper p-3.5 border border-hairline shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-muted font-bold block mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-accent" /> Syllabus Topics Covered in this Module:
              </span>
              <ul className="text-xs space-y-1 font-mono text-charcoal">
                {currentModule.syllabusTopics.map((top, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                    <span className="text-accent font-bold">›</span>
                    <span>{top}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pinned Topper's Exam Sticky Note (Naturally placed in card layout, zero overlapping) */}
            {showStickyNotes && notebookTheme !== 'clean' && (
              <div className="sticky-note-yellow p-4 shadow-md font-handwriting text-amber-950 text-sm max-w-xs rotate-1 border-t-2 border-amber-400 shrink-0">
                <div className="text-[11px] font-mono uppercase tracking-widest text-amber-900 font-bold mb-1 flex items-center gap-1">
                  📌 TOPPER'S EXAM MEMO
                </div>
                <p className="leading-snug text-base">
                  For <strong>{currentSubjectNotes.subjectCode} M{currentModule.moduleNum}</strong>: 
                  Memorize verbatim definitions & always sketch the architecture schematic for full 8 marks!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* JEV + Groq AI Assistant Box for Module */}
        <div className="p-5 bg-paper-dark/60 border border-hairline space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-none bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold uppercase text-charcoal flex items-center gap-1.5">
                  JEV Cognitive Router & Free AI Engine
                  <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 border border-emerald-300">
                    Active Grounding: {currentSubjectNotes.subjectCode} M{currentModule.moduleNum}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-charcoal-muted">
              <span>Model: <strong className="text-charcoal">{GroqClient.getSelectedModel()}</strong></span>
              <button
                onClick={onOpenGroqSettings}
                className="text-accent hover:underline flex items-center gap-0.5"
              >
                Change <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Quick Query Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="text-charcoal-muted text-[10px] uppercase">Instant Probes:</span>
            {[
              `Give me 3-mark questions for ${currentModule.title}`,
              `Explain the hardest concept in ${currentSubjectNotes.subjectCode} Module ${currentModule.moduleNum}`,
              `What diagram must I draw to get 8 marks in KTU exam?`,
              `Diagnose common mistakes students make in this module`
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleAskAi(chip)}
                className="px-2 py-0.5 bg-paper hover:bg-paper-light border border-hairline hover:border-accent text-charcoal text-[10px] transition-colors"
              >
                {chip.slice(0, 38)}...
              </button>
            ))}
          </div>

          {/* Query Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask Groq AI / JEV Router about ${currentSubjectNotes.subjectCode} Module ${currentModule.moduleNum}...`}
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
              className="flex-1 px-3 py-2 bg-paper border border-hairline focus:border-accent focus:outline-none text-charcoal placeholder:text-charcoal-muted/50 font-mono text-xs"
            />
            <button
              onClick={() => handleAskAi()}
              disabled={isAiLoading || !aiQuery.trim()}
              className="px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-40 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {isAiLoading ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin" />
                  Routing...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Ask AI
                </>
              )}
            </button>
          </div>

          {/* AI Response Display with Routing Telemetry */}
          {aiResult && (
            <div className="p-4 bg-paper border border-accent/30 space-y-3 animate-fade-in font-mono text-xs">
              
              {/* Telemetry Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-hairline/60 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-charcoal text-paper font-bold uppercase tracking-wider">
                    JEV ROUTE: {aiResult.decision.targetAI}
                  </span>
                  <span className="text-charcoal-muted">
                    Engine: <strong className="text-charcoal">{aiResult.decision.modelName}</strong>
                  </span>
                  <span className="text-charcoal-muted">
                    Task: <strong className="text-accent">{aiResult.decision.task}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 flex items-center gap-1 font-semibold">
                    <Save className="w-3 h-3 text-emerald-600" /> Auto-Saved to Vault
                  </span>
                  <div className="text-charcoal-muted flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Grounding: {aiResult.decision.groundingSource}</span>
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div className="text-[11px] text-charcoal-muted bg-paper-dark/40 p-2 border border-hairline/40">
                <strong>Routing Rationale:</strong> {aiResult.decision.reasoning}
              </div>

              {/* Body Text (Topper's Formatted Markdown) */}
              <div className="p-3 bg-paper border border-hairline rounded-none">
                <ToppersNoteRenderer content={aiResult.response} className={getNoteFontClass()} />
              </div>

              {/* GeeksforGeeks Reference Links if present */}
              {aiResult.gfgLinks && aiResult.gfgLinks.length > 0 && (
                <div className="pt-2 border-t border-hairline/60">
                  <div className="text-[10px] text-charcoal-muted uppercase font-bold mb-1.5 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                    <span>GeeksforGeeks Recommended Articles:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiResult.gfgLinks.map((g, i) => (
                      <a
                        key={i}
                        href={g.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 flex items-center gap-1.5 transition-colors font-mono"
                      >
                        <span>{g.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Copy & View in Vault Button */}
              <div className="flex items-center justify-between pt-2 border-t border-hairline/60 text-[10px]">
                <button
                  onClick={() => setActiveTab('saved')}
                  className="text-accent hover:underline flex items-center gap-1 font-mono"
                >
                  <Save className="w-3 h-3" /> View in Saved Vault ({savedAnswers.length})
                </button>
                <button
                  onClick={() => handleCopy(aiResult.response, 'ai-response')}
                  className="px-2.5 py-1 text-[10px] border border-hairline hover:bg-paper-dark flex items-center gap-1 text-charcoal-muted hover:text-charcoal transition-colors font-mono"
                >
                  {copiedIndex === 'ai-response' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedIndex === 'ai-response' ? 'Copied to Clipboard' : 'Copy Response'}
                </button>
              </div>
            </div>
          )}
          </div>
          </>
        )}

        {/* Computer Networks: Top-Down Approach (Kurose & Ross) Companion Card */}
        <KuroseCompanionCard
          currentModuleNum={selectedModuleNum}
          subjectCode={currentSubjectNotes.subjectCode}
          onNavigateToChapter={handleNavigateToKuroseChapter}
        />

        {/* SECTION 1: UNDERSTAND THE CONCEPT */}
        {(shouldRenderSection(0, 'concept') || (viewMode === 'page' && currentPageIndex === 0)) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-blue-100/60 border border-blue-300 flex items-center justify-center text-blue-800">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-charcoal">
                    Understand the Concept: Conceptual Deep-Dive
                  </h2>
                  <p className="text-[11px] font-mono text-charcoal-muted">
                    First-principles breakdown, historical engineering motives, and mathematical intuition
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-charcoal-muted">
                {currentModule.conceptualWalkthrough.length} Core Principles
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentModule.conceptualWalkthrough.map((conceptPoint, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 transition-colors shadow-2xs relative border-l-4 border-l-rose-400/80 ${
                    notebookTheme !== 'clean' ? 'bg-white/90 backdrop-blur-xs border border-stone-200 hover:border-accent/40' : 'bg-paper-light border border-hairline hover:border-accent/40'
                  }`}
                >
                  {/* Handwritten Marginalia Stamp */}
                  {showMarginalia && notebookTheme !== 'clean' && (
                    <div className="absolute -left-12 top-4 hidden md:block font-handwriting text-rose-600 font-bold text-xs -rotate-6 select-none tracking-tight">
                      ⭐ V.V.IMP
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                      <span className="w-6 h-6 rounded-none bg-paper-dark border border-hairline text-charcoal font-mono text-xs font-bold flex items-center justify-center">
                        0{idx + 1}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-amber-800 bg-amber-100 px-1 border border-amber-300 uppercase tracking-tighter">
                        KEY
                      </span>
                    </div>
                    <div className="flex-1">
                      <ToppersNoteRenderer content={conceptPoint} className={getNoteFontClass()} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 1.5: VISUAL ARCHITECTURE DIAGRAMS & MODELS GALLERY */}
        {(shouldRenderSection(1, 'diagrams') || (viewMode === 'page' && currentPageIndex === 1)) && (
          <ModuleDiagramsGallery
            currentModule={currentModule}
            subjectCode={currentSubjectNotes.subjectCode}
            subjectTitle={currentSubjectNotes.subjectTitle}
          />
        )}

        {/* SECTION 2: CANONICAL EXAM DEFINITIONS */}
        {(shouldRenderSection(2, 'definitions') || (viewMode === 'page' && currentPageIndex === 2)) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-amber-100/60 border border-amber-300 flex items-center justify-center text-amber-800">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-charcoal">
                    Official Exam Definitions (Verbatim Standard)
                  </h2>
                  <p className="text-[11px] font-mono text-charcoal-muted">
                    Canonical textbook definitions required by KTU valuation camps for full marks
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-charcoal-muted">
                {currentModule.examDefinitions.length} Definitions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentModule.examDefinitions.map((def, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 transition-colors relative border-l-3 border-l-emerald-500 ${
                    notebookTheme !== 'clean' ? 'bg-white/90 backdrop-blur-xs border border-stone-200 hover:border-emerald-400/50' : 'bg-paper-light border border-hairline hover:border-emerald-400/50'
                  }`}
                >
                  {/* Handwritten Marginalia Stamp */}
                  {showMarginalia && notebookTheme !== 'clean' && (
                    <div className="absolute -left-10 top-3 hidden md:block font-handwriting text-emerald-700 font-bold text-xs -rotate-3 select-none tracking-tight">
                      🎯 DEF
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 px-1.5 py-0.5 bg-emerald-50 border border-emerald-300">
                      VALUATION DEF 0{idx + 1}
                    </span>
                    <button
                      onClick={() => handleCopy(def, `def-${idx}`)}
                      className="text-charcoal-muted hover:text-charcoal p-1"
                      title="Copy definition"
                    >
                      {copiedIndex === `def-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <ToppersNoteRenderer content={def} isDefinition={true} className={getNoteFontClass()} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: PART A - 3-MARK QUESTIONS & ANSWERS */}
        {(shouldRenderSection(2, '3mark') || (viewMode === 'page' && currentPageIndex === 2)) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-emerald-100/60 border border-emerald-300 flex items-center justify-center text-emerald-800">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-charcoal">
                    Part A: 3-Mark Questions & Model Answers
                  </h2>
                  <p className="text-[11px] font-mono text-charcoal-muted">
                    Concise, high-impact answers targeting definitions, principles, formulas, and differences
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold">
                KTU PART A STANDARD (3 MARKS EACH)
              </span>
            </div>

            <div className="space-y-3">
              {currentModule.questions3Mark.map((qItem, idx) => {
                const itemId = `3m-${idx}`;
                const isExpanded = expandedItems[itemId] !== false; // default open
                return (
                  <div key={idx} className={`overflow-hidden shadow-2xs transition-colors ${
                    notebookTheme !== 'clean' ? 'bg-white/95 border border-stone-200' : 'bg-paper-light border border-hairline'
                  }`}>
                    <button
                      onClick={() => toggleExpand(itemId)}
                      className="w-full px-5 py-3 text-left flex items-start justify-between gap-3 bg-paper/60 hover:bg-paper-dark/40 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        {showMarginalia && notebookTheme !== 'clean' && (
                          <span className="hidden sm:inline-block font-handwriting text-emerald-700 font-bold text-xs -rotate-2 select-none shrink-0 pt-0.5">
                            [3M KEY]
                          </span>
                        )}
                        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 shrink-0">
                          Q{idx + 1} [3M]
                        </span>
                        <span className="font-sans font-semibold text-xs text-charcoal">
                          {qItem.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-charcoal-muted" /> : <ChevronRight className="w-4 h-4 text-charcoal-muted" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 py-4 border-t border-hairline space-y-2 bg-paper-light">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-charcoal-muted">
                          <div className="flex items-center gap-2">
                            <span>MODEL ANSWER (KTU VALUATION KEY):</span>
                            {findGfgLinks(qItem.question + ' ' + currentSubjectNotes.subjectTitle)[0] && (
                              <a
                                href={findGfgLinks(qItem.question + ' ' + currentSubjectNotes.subjectTitle)[0].url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 flex items-center gap-1 font-mono transition-colors"
                              >
                                <span>GFG Article</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => handleCopy(qItem.answer, itemId)}
                            className="flex items-center gap-1 hover:text-charcoal"
                          >
                            {copiedIndex === itemId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedIndex === itemId ? 'Copied' : 'Copy Answer'}
                          </button>
                        </div>
                        <div className="bg-paper p-3 border border-hairline/60 rounded-none border-l-2 border-l-emerald-500">
                          <ToppersNoteRenderer content={qItem.answer} className={getNoteFontClass()} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 4: PART B - 5-MARK QUESTIONS & ANSWERS */}
        {(shouldRenderSection(3, '5mark') || (viewMode === 'page' && currentPageIndex === 3)) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-purple-100/60 border border-purple-300 flex items-center justify-center text-purple-800">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-charcoal">
                    Part B: 5-Mark Questions & Model Answers
                  </h2>
                  <p className="text-[11px] font-mono text-charcoal-muted">
                    Sub-questions requiring technical depth, step-by-step algorithms, and mandatory diagrams
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-purple-50 border border-purple-300 text-purple-800 font-bold">
                KTU PART B SUB-PART (5 MARKS)
              </span>
            </div>

            <div className="space-y-4">
              {currentModule.questions5Mark.map((qItem, idx) => {
                const itemId = `5m-${idx}`;
                const isExpanded = expandedItems[itemId] !== false;
                const gfg = findGfgLinks(qItem.question + ' ' + currentSubjectNotes.subjectTitle)[0];
                return (
                  <div key={idx} className={`overflow-hidden shadow-2xs transition-colors ${
                    notebookTheme !== 'clean' ? 'bg-white/95 border border-stone-200' : 'bg-paper-light border border-hairline'
                  }`}>
                    <button
                      onClick={() => toggleExpand(itemId)}
                      className="w-full px-5 py-3.5 text-left flex items-start justify-between gap-3 bg-paper/60 hover:bg-paper-dark/40 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        {showMarginalia && notebookTheme !== 'clean' && (
                          <span className="hidden sm:inline-block font-handwriting text-purple-700 font-bold text-xs -rotate-2 select-none shrink-0 pt-0.5">
                            [5M DIAG]
                          </span>
                        )}
                        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 border border-purple-200 shrink-0">
                          Q{idx + 1} [5M]
                        </span>
                        <span className="font-sans font-semibold text-xs text-charcoal">
                          {qItem.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-charcoal-muted" /> : <ChevronRight className="w-4 h-4 text-charcoal-muted" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 py-4 border-t border-hairline space-y-3 bg-paper-light">
                        {qItem.diagramDescription && (
                          <QuestionDiagramRenderer
                            diagramDescription={qItem.diagramDescription}
                            questionTitle={qItem.question}
                          />
                        )}

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-charcoal-muted">
                            <div className="flex items-center gap-2">
                              <span>STEP-BY-STEP MODEL ANSWER:</span>
                              {gfg && (
                                <a
                                  href={gfg.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 flex items-center gap-1 font-mono transition-colors"
                                >
                                  <span>GFG Guide</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => handleCopy(qItem.answer, itemId)}
                              className="flex items-center gap-1 hover:text-charcoal"
                            >
                              {copiedIndex === itemId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              {copiedIndex === itemId ? 'Copied' : 'Copy Answer'}
                            </button>
                          </div>
                          <div className="bg-paper p-3 border border-hairline/60 rounded-none border-l-2 border-l-purple-500">
                            <ToppersNoteRenderer content={qItem.answer} className={getNoteFontClass()} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 5: PART B - 8-MARK ESSAY QUESTIONS & ANSWERS */}
        {(shouldRenderSection(3, '8mark') || (viewMode === 'page' && currentPageIndex === 3)) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-rose-100/60 border border-rose-300 flex items-center justify-center text-rose-800">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-charcoal">
                    Part B: 8-Mark Essay Questions & Complete Answers
                  </h2>
                  <p className="text-[11px] font-mono text-charcoal-muted">
                    Full-length university exam essays with evaluation rubrics, proofs, and mark distributions
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-rose-50 border border-rose-300 text-rose-800 font-bold">
                KTU ESSAY STANDARD (8 MARKS)
              </span>
            </div>

            <div className="space-y-4">
              {currentModule.questions8Mark.map((qItem, idx) => {
                const itemId = `8m-${idx}`;
                const isExpanded = expandedItems[itemId] !== false;
                const gfg = findGfgLinks(qItem.question + ' ' + currentSubjectNotes.subjectTitle)[0];
                return (
                  <div key={idx} className={`overflow-hidden shadow-2xs transition-colors ${
                    notebookTheme !== 'clean' ? 'bg-white/95 border border-stone-200' : 'bg-paper-light border border-hairline'
                  }`}>
                    <button
                      onClick={() => toggleExpand(itemId)}
                      className="w-full px-5 py-4 text-left flex items-start justify-between gap-3 bg-paper/60 hover:bg-paper-dark/40 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        {showMarginalia && notebookTheme !== 'clean' && (
                          <span className="hidden sm:inline-block font-handwriting text-rose-600 font-bold text-xs -rotate-3 select-none shrink-0 pt-0.5">
                            ★ 8M ESSAY
                          </span>
                        )}
                        <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 border border-rose-200 shrink-0">
                          ESSAY Q{idx + 1} [8M]
                        </span>
                        <span className="font-sans font-semibold text-xs text-charcoal">
                          {qItem.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-charcoal-muted" /> : <ChevronRight className="w-4 h-4 text-charcoal-muted" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 py-4 border-t border-hairline space-y-4 bg-paper-light">
                        {qItem.diagramDescription && (
                          <QuestionDiagramRenderer
                            diagramDescription={qItem.diagramDescription}
                            questionTitle={qItem.question}
                          />
                        )}

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-charcoal-muted">
                            <div className="flex items-center gap-2">
                              <span>COMPREHENSIVE MODEL ANSWER & EVALUATION KEY:</span>
                              {gfg && (
                                <a
                                  href={gfg.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 flex items-center gap-1 font-mono transition-colors"
                                >
                                  <span>GFG Guide</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => handleCopy(qItem.answer, itemId)}
                              className="flex items-center gap-1 hover:text-charcoal"
                            >
                              {copiedIndex === itemId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              {copiedIndex === itemId ? 'Copied' : 'Copy Full Essay'}
                            </button>
                          </div>
                          <div className="bg-paper p-4 border border-hairline/60 rounded-none border-l-3 border-l-rose-500">
                            <ToppersNoteRenderer content={qItem.answer} className={getNoteFontClass()} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 6: PRESCRIBED TEXTBOOK REFERENCES */}
        {(shouldRenderSection(4, 'references') || (viewMode === 'page' && currentPageIndex === 4)) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-800">
                  <Bookmark className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-charcoal">
                    Authoritative Textbook References
                  </h2>
                  <p className="text-[11px] font-mono text-charcoal-muted">
                    Official recommended texts by APJ Abdul Kalam Technological University
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-charcoal-muted">
                {currentSubjectNotes.references.length} Prescribed Volumes
              </span>
            </div>

            <div className="p-4 bg-paper-light border border-hairline">
              <ul className="space-y-2 font-mono text-xs text-charcoal">
                {currentSubjectNotes.references.map((ref, idx) => {
                  const isUrl = ref.includes('http');
                  const urlMatch = isUrl ? ref.match(/https?:\/\/[^\s)]+/) : null;
                  const url = urlMatch ? urlMatch[0] : null;
                  const text = url ? ref.replace(url, '').replace(/GitHub:\s*$/, '').trim() : ref;

                  return (
                    <li key={idx} className="flex items-start gap-2.5 p-2 bg-paper border border-hairline/40">
                      <span className="text-accent font-bold">[{idx + 1}]</span>
                      <div className="flex-1 leading-relaxed">
                        <span>{text}</span>
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent font-bold hover:underline ml-2 break-all"
                          >
                            <span>Open Companion Repo</span>
                            <ExternalLink className="w-3 h-3 inline" />
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* SECTION 7: SAVED AI ANSWERS VAULT */}
        {(shouldRenderSection(4, 'saved') || (viewMode === 'page' && currentPageIndex === 4)) && (
          <section className="space-y-4 pt-4 border-t border-hairline">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-emerald-100/70 border border-emerald-300 flex items-center justify-center text-emerald-800">
                  <Save className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                    Saved AI Answers Vault
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 border border-emerald-300">
                      {savedAnswers.length} ANSWERS SAVED
                    </span>
                  </h2>
                  <p className="text-[11px] font-mono text-charcoal-muted">
                    Persistent history of all AI explanations, diagrams, and model answers generated for your study sessions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {savedAnswers.length > 0 && (
                  <button
                    onClick={handleExportSaved}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs flex items-center gap-1.5 transition-colors shadow-2xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export All (.md)
                  </button>
                )}
              </div>
            </div>

            {/* Search Filter Bar */}
            {savedAnswers.length > 0 && (
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-charcoal-muted" />
                <input
                  type="text"
                  placeholder="Filter saved AI answers by query, topic, or subject code..."
                  value={savedSearchQuery}
                  onChange={(e) => setSavedSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-paper-light border border-hairline text-charcoal font-mono text-xs focus:border-accent focus:outline-none"
                />
              </div>
            )}

            {/* List of Saved Answers */}
            {savedAnswers.length === 0 ? (
              <div className="p-8 bg-paper-light border border-hairline text-center space-y-3">
                <Save className="w-8 h-8 text-charcoal-muted/50 mx-auto" />
                <div className="font-mono text-xs text-charcoal font-semibold">
                  No AI answers saved yet in this session
                </div>
                <p className="text-[11px] text-charcoal-muted max-w-md mx-auto leading-relaxed">
                  Every time you ask the AI assistant above, the detailed conceptual explanation, ASCII diagram, and GeeksforGeeks reference links will be automatically preserved here permanently.
                </p>
                <button
                  onClick={() => handleAskAi(`Explain the core mechanism of ${currentSubjectNotes.subjectTitle} Module ${currentModule.moduleNum} with diagram`)}
                  className="px-4 py-1.5 border border-accent bg-accent/10 hover:bg-accent/20 text-accent font-mono text-xs transition-colors"
                >
                  Generate First Answer for Module {currentModule.moduleNum}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedAnswers
                  .filter(ans => {
                    if (!savedSearchQuery.trim()) return true;
                    const q = savedSearchQuery.toLowerCase();
                    return ans.query.toLowerCase().includes(q) ||
                      ans.subjectCode.toLowerCase().includes(q) ||
                      ans.response.toLowerCase().includes(q);
                  })
                  .map((ans) => (
                    <div key={ans.id} className="p-5 bg-paper-light border border-hairline shadow-2xs space-y-3 font-mono text-xs">
                      
                      {/* Meta header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-hairline/60 text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold bg-accent/10 text-accent px-1.5 py-0.5 border border-accent/20">
                            {ans.subjectCode}
                          </span>
                          <span className="text-charcoal font-semibold">
                            {ans.moduleTitle}
                          </span>
                          <span className="text-charcoal-muted">
                            • {new Date(ans.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-charcoal-muted bg-paper-dark px-1.5 py-0.5 border border-hairline">
                            Model: {ans.modelUsed}
                          </span>
                          <button
                            onClick={() => handleDeleteSaved(ans.id)}
                            className="p-1 text-charcoal-muted hover:text-rose-600 transition-colors"
                            title="Delete this saved answer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Question */}
                      <div className="font-sans font-bold text-sm text-charcoal flex items-start gap-2">
                        <span className="font-mono text-accent font-bold">Q:</span>
                        <span>{ans.query}</span>
                      </div>

                      {/* Answer Body (Topper's Formatted Markdown) */}
                      <div className="p-4 bg-paper border border-hairline rounded-none border-l-3 border-l-accent">
                        <ToppersNoteRenderer content={ans.response} className={getNoteFontClass()} />
                      </div>

                      {/* GFG Links in Vault Item */}
                      {ans.gfgLinks && ans.gfgLinks.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] text-charcoal-muted uppercase font-bold flex items-center gap-1">
                            <ExternalLink className="w-3 h-3 text-emerald-600" /> GeeksforGeeks Links:
                          </span>
                          {ans.gfgLinks.map((g, gi) => (
                            <a
                              key={gi}
                              href={g.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 flex items-center gap-1 transition-colors"
                            >
                              <span>{g.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleCopy(ans.response, ans.id)}
                          className="px-2.5 py-1 text-[10px] border border-hairline hover:bg-paper-dark flex items-center gap-1 text-charcoal-muted hover:text-charcoal transition-colors"
                        >
                          {copiedIndex === ans.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedIndex === ans.id ? 'Copied' : 'Copy Full Answer'}
                        </button>
                      </div>

                    </div>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 8: STUDENT UPLOADED NOTES VAULT */}
        {(shouldRenderSection(4, 'uploaded') || (viewMode === 'page' && currentPageIndex === 4)) && (
          <section className="space-y-4 pt-4 border-t border-hairline">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-amber-100/70 border border-amber-300 flex items-center justify-center text-amber-800">
                  <FolderUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                    Student Uploaded Notes &amp; Materials
                    <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.2 border border-amber-300">
                      {uploadedNotes.filter(n => n.subjectId.toLowerCase() === selectedSubjectId.toLowerCase() || n.subjectCode.toLowerCase() === currentSubjectNotes.subjectCode.toLowerCase()).length} NOTES IN VAULT
                    </span>
                  </h2>
                  <p className="text-[11px] font-mono text-charcoal-muted">
                    Your personal uploaded handwritten scans, college lecture notes, and PDFs integrated into the study desk
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-white font-mono text-xs flex items-center gap-1.5 transition-colors shadow-2xs font-semibold"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Notes / PDF
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 font-mono text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-charcoal-muted" />
                <input
                  type="text"
                  placeholder="Filter uploaded notes by title, keyword, or author..."
                  value={uploadedSearchQuery}
                  onChange={(e) => setUploadedSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-paper-light border border-hairline text-charcoal font-mono text-xs focus:border-accent focus:outline-none"
                />
              </div>

              <select
                value={uploadedCategoryFilter}
                onChange={(e) => setUploadedCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-paper-light border border-hairline text-charcoal font-mono text-xs focus:border-accent focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="lecture_notes">📚 College Lecture Notes</option>
                <option value="handwritten_scans">✍️ Handwritten Scans</option>
                <option value="summary">⚡ Quick Summaries</option>
                <option value="formula_sheet">📐 Formula Sheets</option>
                <option value="exam_solutions">🏆 Exam Solved Papers</option>
              </select>
            </div>

            {/* Notes List / Grid */}
            {(() => {
              const currentSubjectNotesList = uploadedNotes.filter(n => {
                const matchesSub = n.subjectId.toLowerCase() === selectedSubjectId.toLowerCase() ||
                  n.subjectCode.toLowerCase() === currentSubjectNotes.subjectCode.toLowerCase();
                if (!matchesSub) return false;

                // When in specific module tab view (unless in 'uploaded' dedicated tab where user can see all modules for this subject)
                if (activeTab === 'all' && n.moduleNum !== 0 && n.moduleNum !== selectedModuleNum) {
                  return false;
                }

                if (uploadedCategoryFilter !== 'all' && n.category !== uploadedCategoryFilter) {
                  return false;
                }

                if (uploadedSearchQuery.trim()) {
                  const q = uploadedSearchQuery.toLowerCase();
                  return n.title.toLowerCase().includes(q) ||
                    n.fileName.toLowerCase().includes(q) ||
                    (n.author && n.author.toLowerCase().includes(q)) ||
                    n.tags.some(t => t.toLowerCase().includes(q));
                }

                return true;
              });

              if (currentSubjectNotesList.length === 0) {
                return (
                  <div className="p-8 bg-paper-light border border-hairline text-center space-y-3">
                    <FolderUp className="w-8 h-8 text-charcoal-muted/50 mx-auto" />
                    <div className="font-mono text-xs text-charcoal font-semibold">
                      No uploaded notes found for {currentSubjectNotes.subjectCode} {activeTab === 'all' ? `Module ${selectedModuleNum}` : ''}
                    </div>
                    <p className="text-[11px] text-charcoal-muted max-w-md mx-auto leading-relaxed">
                      Upload your handwritten notebook scans, college slides, PDF question papers, or typed markdown summaries. The AI engine can summarize and quiz you directly from your uploads.
                    </p>
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="px-4 py-2 border border-accent bg-accent text-white hover:bg-accent/90 font-mono text-xs font-semibold transition-colors shadow-2xs inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Your First Note
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSubjectNotesList.map((note) => {
                    let catLabel = 'Note';
                    if (note.category === 'lecture_notes') catLabel = 'Lecture Notes';
                    else if (note.category === 'handwritten_scans') catLabel = 'Handwritten Scan';
                    else if (note.category === 'summary') catLabel = 'Summary';
                    else if (note.category === 'formula_sheet') catLabel = 'Formula Sheet';
                    else if (note.category === 'exam_solutions') catLabel = 'KTU Solved';

                    return (
                      <div
                        key={note.id}
                        className="p-4 bg-paper-light border border-hairline shadow-2xs hover:border-accent transition-all flex flex-col justify-between space-y-3 font-mono text-xs group"
                      >
                        {/* Top row */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold bg-accent/10 text-accent px-1.5 py-0.5 border border-accent/20">
                                {note.subjectCode}
                              </span>
                              <span className="bg-paper-dark text-charcoal px-1.5 py-0.5 border border-hairline">
                                {note.moduleNum === 0 ? 'All Modules' : `Mod ${note.moduleNum}`}
                              </span>
                              <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 border border-amber-200">
                                {catLabel}
                              </span>
                            </div>

                            <span className="text-charcoal-muted uppercase text-[9px] font-bold">
                              {note.fileType.toUpperCase()} · {(note.fileSize / 1024).toFixed(0)} KB
                            </span>
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => setViewingNote(note)}
                            className="font-sans font-bold text-sm text-charcoal hover:text-accent cursor-pointer transition-colors line-clamp-2 leading-snug"
                          >
                            {note.title}
                          </h3>

                          {/* AI Summary snippet if present */}
                          {note.aiSummary && (
                            <p className="text-[11px] font-sans text-charcoal-muted line-clamp-2 leading-relaxed bg-amber-50/50 p-2 border-l-2 border-amber-500">
                              {note.aiSummary}
                            </p>
                          )}

                          {/* Tags */}
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 text-[10px]">
                              {note.tags.slice(0, 3).map((t, ti) => (
                                <span key={ti} className="bg-paper text-charcoal-muted px-1.5 py-0.2 border border-hairline/60">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Footer & Actions */}
                        <div className="pt-2 border-t border-hairline/60 flex items-center justify-between text-[11px]">
                          <div className="text-charcoal-muted text-[10px]">
                            By {note.author || 'Student'} • {new Date(note.timestamp).toLocaleDateString()}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setViewingNote(note)}
                              className="px-2.5 py-1 bg-charcoal text-paper hover:bg-black font-bold text-[10px] transition-colors"
                            >
                              Open &amp; Study
                            </button>
                            <button
                              onClick={() => handleDeleteUploadedNote(note.id)}
                              className="p-1 text-charcoal-muted hover:text-rose-600 transition-colors"
                              title="Delete this note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </section>
        )}

        {/* SECTION 9: KUROSE & ROSS TOP-DOWN APPROACH NOTEBOOK CHAPTER PAGES */}
        {isComputerNetworks && (
          <>
            {kuroseRossRepoData.chapters.map((ch, chIdx) => {
              const chPageIdx = basePageConfigs.length + chIdx;
              const isCurrentPage = viewMode === 'page' && currentPageIndex === chPageIdx;
              const shouldRenderInScroll = viewMode === 'scroll' && (activeTab === 'all' || activeTab === 'kurose' || activeTab === 'references');

              if (!isCurrentPage && !shouldRenderInScroll) return null;

              return (
                <section 
                  key={ch.id} 
                  id={`kurose-ch-${ch.chapterNumber}`}
                  className={`space-y-6 ${viewMode === 'scroll' ? 'pt-8 border-t-4 border-charcoal/20' : ''}`}
                >
                  <KuroseChapterNotebookSheet
                    chapter={ch}
                    chapterNumber={ch.chapterNumber}
                    totalChapters={kuroseRossRepoData.chapters.length}
                    onNextChapter={chIdx < kuroseRossRepoData.chapters.length - 1 ? () => {
                      setCurrentPageIndex(chPageIdx + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } : undefined}
                    onPrevChapter={() => {
                      setCurrentPageIndex(chIdx > 0 ? chPageIdx - 1 : basePageConfigs.length - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    fontClass={getNoteFontClass()}
                    showMarginalia={showMarginalia && notebookTheme !== 'clean'}
                  />
                </section>
              );
            })}
          </>
        )}

        {/* SECTION 9.5: USER-IMPORTED GITHUB REPOSITORY CHAPTER PAGES */}
        {importedGhRepos.map((repo) => {
          return repo.chapters.map((ch, chIdx) => {
            const targetPageIdx = defaultPageConfigs.findIndex(cfg => cfg.id === `gh_${repo.id}_${ch.id}`);
            const isCurrentPage = viewMode === 'page' && currentPageIndex === targetPageIdx;
            const shouldRenderInScroll = viewMode === 'scroll' && (activeTab === 'all' || activeTab === 'references');

            if (!isCurrentPage && !shouldRenderInScroll) return null;

            return (
              <section 
                key={`gh-chapter-${repo.id}-${ch.id}`}
                id={`gh-repo-${repo.id}-ch-${chIdx + 1}`}
                className={`space-y-6 ${viewMode === 'scroll' ? 'pt-8 border-t-4 border-charcoal/20' : ''}`}
              >
                <GitHubRepoNotebookSheet
                  repo={repo}
                  chapter={ch}
                  chapterIndex={chIdx}
                  totalChapters={repo.chapters.length}
                  onNextChapter={targetPageIdx < totalPages - 1 ? () => {
                    setCurrentPageIndex(targetPageIdx + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } : undefined}
                  onPrevChapter={() => {
                    setCurrentPageIndex(Math.max(0, targetPageIdx - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  fontClass={getNoteFontClass()}
                  showMarginalia={showMarginalia && notebookTheme !== 'clean'}
                />
              </section>
            );
          });
        })}

        {/* Custom Blank / Scratchpad Page View */}
        {viewMode === 'page' && isCustomBlankPage && currentBlankPage && (
          <BlankNotebookPage
            page={currentBlankPage}
            onUpdatePage={(updates) => handleUpdateBlankPage(currentBlankPage.id, updates)}
            onDeletePage={handleDeleteBlankPage}
            fontClass={getNoteFontClass()}
            notebookTheme={notebookTheme}
            showSpiral={showSpiral}
            subjectCode={currentSubjectNotes.subjectCode}
            subjectTitle={currentSubjectNotes.subjectTitle}
            moduleTitle={currentModule.title}
            onOpenGroqSettings={onOpenGroqSettings}
          />
        )}

        {/* User Custom Blank Pages in Scroll Mode */}
        {viewMode === 'scroll' && userBlankPages.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-hairline">
            <h2 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
              <BookIcon className="w-4 h-4 text-accent" />
              <span>User Custom Scratchpad Pages ({userBlankPages.length})</span>
            </h2>
            {userBlankPages.map(page => (
              <BlankNotebookPage
                key={page.id}
                page={page}
                onUpdatePage={(updates) => handleUpdateBlankPage(page.id, updates)}
                onDeletePage={handleDeleteBlankPage}
                fontClass={getNoteFontClass()}
                notebookTheme={notebookTheme}
                showSpiral={showSpiral}
                subjectCode={currentSubjectNotes.subjectCode}
                subjectTitle={currentSubjectNotes.subjectTitle}
                moduleTitle={currentModule.title}
                onOpenGroqSettings={onOpenGroqSettings}
              />
            ))}
          </section>
        )}

        {/* Bottom Page Flipper Bar (Page-Wise Mode) */}
        {viewMode === 'page' && (
          <div className="pt-6 border-t border-hairline/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <button
              onClick={() => {
                setCurrentPageIndex(prev => Math.max(0, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPageIndex === 0}
              className="px-3 py-1.5 bg-paper hover:bg-paper-dark disabled:opacity-30 border border-line-border rounded flex items-center gap-1.5 font-semibold text-charcoal transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-charcoal-muted">
                Page <strong className="text-charcoal">{currentPageIndex + 1}</strong> of {totalPages}
              </span>
              <button
                onClick={handleAddBlankPage}
                className="px-2.5 py-1 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-bold rounded flex items-center gap-1 transition-colors"
                title="Add a new blank page to draw and type"
              >
                <Plus className="w-3 h-3" />
                <span>Blank Page</span>
              </button>
            </div>

            <button
              onClick={() => {
                setCurrentPageIndex(prev => Math.min(totalPages - 1, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPageIndex >= totalPages - 1}
              className="px-3 py-1.5 bg-paper hover:bg-paper-dark disabled:opacity-30 border border-line-border rounded flex items-center gap-1.5 font-semibold text-charcoal transition-colors cursor-pointer"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        </div>
      </div>

      {/* Upload Notes Modal */}
      <UploadNotesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onNoteUploaded={(newNote) => {
          refreshUploadedNotes();
          setActiveTab('uploaded');
        }}
      />

      {/* Uploaded Note Full Viewer Modal */}
      <UploadedNoteViewerModal
        note={viewingNote}
        isOpen={!!viewingNote}
        onClose={() => setViewingNote(null)}
        onDelete={handleDeleteUploadedNote}
        fontClass={getNoteFontClass()}
        notebookTheme={notebookTheme}
      />

      {/* GitHub Repo Importer Modal */}
      <GitHubRepoImporterModal
        isOpen={isGhImportModalOpen}
        onClose={() => setIsGhImportModalOpen(false)}
        currentSubjectId={selectedSubjectId}
        onRepoImported={(repo) => {
          refreshImportedGhRepos();
          setIsGhImportModalOpen(false);
          // Jump to first chapter of newly imported repo
          const targetIdx = defaultPageConfigs.length;
          setViewMode('page');
          setCurrentPageIndex(targetIdx);
        }}
      />

    </div>
  );
};
