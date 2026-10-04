import React from 'react';
import { 
  BookOpen, 
  X, 
  Check, 
  ChevronRight, 
  Cpu, 
  Upload, 
  Download, 
  SlidersHorizontal, 
  Palette, 
  Type, 
  BookOpen as BookIcon, 
  LayoutList,
  Sparkles,
  Layers,
  FileText,
  Bookmark,
  Award,
  HelpCircle,
  ShieldCheck,
  PanelLeftClose
} from 'lucide-react';
import { SubjectNotes } from '../../data/notes/module-notes-db';
import { GroqClient } from '../../lib/ai/groq-client';

interface NotebookSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubjectId: string;
  onSelectSubject: (subId: string) => void;
  allSubjects: Array<{ id: string; code: string; title: string }>;
  currentSubjectNotes: SubjectNotes;
  selectedModuleNum: number;
  onSelectModule: (mNum: number) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
  uploadCount: number;
  onExportSaved: () => void;
  onOpenUploadModal: () => void;
  onOpenGroqSettings: () => void;
  notebookTheme: 'ruled' | 'grid' | 'yellow' | 'clean';
  onSelectTheme: (theme: 'ruled' | 'grid' | 'yellow' | 'clean') => void;
  noteFont: 'sans' | 'handwriting' | 'serif' | 'mono';
  onSelectFont: (font: 'sans' | 'handwriting' | 'serif' | 'mono') => void;
  noteFontSize: 'xs' | 'sm' | 'base' | 'lg';
  onSelectFontSize: (size: 'xs' | 'sm' | 'base' | 'lg') => void;
  showSpiral: boolean;
  onToggleSpiral: (show: boolean) => void;
  showStickyNotes: boolean;
  onToggleStickyNotes: (show: boolean) => void;
  showMarginalia: boolean;
  onToggleMarginalia: (show: boolean) => void;
  viewMode: 'page' | 'scroll';
  onSelectViewMode: (mode: 'page' | 'scroll') => void;
  isFullscreen?: boolean;
}

export const NotebookSidebar: React.FC<NotebookSidebarProps> = ({
  isOpen,
  onClose,
  selectedSubjectId,
  onSelectSubject,
  allSubjects,
  currentSubjectNotes,
  selectedModuleNum,
  onSelectModule,
  activeTab,
  onSelectTab,
  savedCount,
  uploadCount,
  onExportSaved,
  onOpenUploadModal,
  onOpenGroqSettings,
  notebookTheme,
  onSelectTheme,
  noteFont,
  onSelectFont,
  noteFontSize,
  onSelectFontSize,
  showSpiral,
  onToggleSpiral,
  showStickyNotes,
  onToggleStickyNotes,
  showMarginalia,
  onToggleMarginalia,
  viewMode,
  onSelectViewMode,
  isFullscreen = false
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile / overlay mode */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-charcoal/40 backdrop-blur-2xs z-40 lg:hidden"
        title="Close Sidebar"
      />

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white border-r border-line-border z-50 flex flex-col shadow-2xl animate-fade-in ${
          isFullscreen ? 'z-50' : 'z-30'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-line-border bg-paper-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none border border-accent/40 bg-accent/10 flex items-center justify-center text-accent">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase font-bold text-accent tracking-widest block">
                KTU 2024 SCHEME // B.TECH CSE S5
              </span>
              <h3 className="font-serif font-bold text-sm text-charcoal">
                Notes & Revision Station
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-charcoal-muted hover:text-charcoal hover:bg-paper-200 rounded transition-colors cursor-pointer"
            title="Close Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs font-mono">
          
          {/* Section 1: Subject Selector */}
          <div>
            <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1.5 flex items-center justify-between">
              <span>Select Subject</span>
              <span className="text-[9px] text-accent font-semibold">{allSubjects.length} Courses</span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => onSelectSubject(e.target.value)}
              className="w-full bg-paper border border-hairline text-charcoal font-bold font-mono text-xs px-2.5 py-2 focus:border-accent focus:outline-none cursor-pointer rounded-xs"
            >
              {allSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.code}] {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Section 2: Module Selector (Modules 1 - 4) */}
          <div>
            <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1.5">
              Select Module
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[1, 2, 3, 4].map((mNum) => {
                const isSelected = selectedModuleNum === mNum;
                const hasMod = !!currentSubjectNotes.modules[mNum];
                return (
                  <button
                    key={mNum}
                    onClick={() => onSelectModule(mNum)}
                    disabled={!hasMod}
                    className={`p-2.5 text-left border rounded-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-accent bg-accent text-white font-bold shadow-xs'
                        : hasMod
                        ? 'border-hairline bg-paper text-charcoal hover:border-charcoal hover:bg-paper-dark'
                        : 'border-hairline/40 text-charcoal-muted/40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold">MODULE {mNum}</span>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="text-[9px] opacity-80 truncate mt-0.5">
                      {currentSubjectNotes.modules[mNum]?.title.split(':')[1] || 'Syllabus Core'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Content Section Filters */}
          <div>
            <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1.5">
              Section Filter
            </label>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'All Content', icon: Layers },
                { id: 'concept', label: 'Core Concepts & Intuition', icon: BookOpen },
                { id: 'diagrams', label: 'Visual Diagrams & Models', icon: Layers },
                { id: 'definitions', label: 'Exam Definitions', icon: Award },
                { id: '3mark', label: '3-Mark Questions (Part A)', icon: HelpCircle },
                { id: '5mark', label: '5-Mark Questions (Part B)', icon: FileText },
                { id: '8mark', label: '8-Mark Long Answers', icon: ShieldCheck },
                ...(selectedSubjectId.toLowerCase().includes('cst501') || selectedSubjectId.toLowerCase().includes('cst303') || currentSubjectNotes.subjectCode.toLowerCase().includes('cst501') ? [
                  { id: 'kurose', label: 'Kurose & Ross 8E Notes', icon: BookOpen }
                ] : []),
                { id: 'references', label: 'Standard Textbooks', icon: Bookmark },
                { id: 'saved', label: `Saved AI Vault (${savedCount})`, icon: Sparkles },
                { id: 'uploaded', label: `My Uploads (${uploadCount})`, icon: Upload }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`w-full px-2.5 py-1.5 flex items-center justify-between text-left rounded-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-charcoal text-paper font-bold shadow-2xs'
                        : 'text-charcoal hover:bg-paper-dark hover:text-accent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-accent' : 'text-charcoal-muted'}`} />
                      <span className="text-[11px]">{tab.label}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3 h-3 opacity-60" />}
                  </button>
                );
              })}
            </div>

            {savedCount > 0 && (
              <button
                onClick={onExportSaved}
                className="w-full mt-2 px-2.5 py-1.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center gap-1.5 font-semibold rounded-xs transition-colors cursor-pointer"
                title="Download all saved AI answers as Markdown"
              >
                <Download className="w-3 h-3" />
                <span>Export Saved Vault ({savedCount})</span>
              </button>
            )}
          </div>

          {/* Section 4: Notebook Theme & Paper Styling */}
          <div className="pt-3 border-t border-line-border">
            <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1.5 flex items-center gap-1">
              <Palette className="w-3 h-3 text-accent" />
              <span>Paper Background</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'ruled', label: '📓 Ruled', desc: 'Spiral Lines' },
                { id: 'grid', label: '📐 Grid', desc: 'Graph Paper' },
                { id: 'yellow', label: '📝 Legal', desc: 'Yellow Pad' },
                { id: 'clean', label: '📄 Digital', desc: 'Clean White' }
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id as any)}
                  className={`p-2 border rounded-xs text-left transition-colors cursor-pointer ${
                    notebookTheme === theme.id
                      ? 'border-accent bg-accent/10 font-bold text-accent shadow-2xs'
                      : 'border-hairline bg-paper text-charcoal hover:border-charcoal'
                  }`}
                >
                  <div className="text-[11px]">{theme.label}</div>
                  <div className="text-[9px] text-charcoal-muted">{theme.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Typography & Font Family */}
          <div className="pt-3 border-t border-line-border">
            <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1.5 flex items-center gap-1">
              <Type className="w-3 h-3 text-accent" />
              <span>Font Style</span>
            </label>
            <div className="space-y-1">
              {[
                { id: 'sans', label: 'Clean Sans (Inter)', demo: 'font-sans' },
                { id: 'handwriting', label: 'Handwritten (Kalam)', demo: 'font-handwriting font-bold text-sm' },
                { id: 'serif', label: 'Academic Serif (Charter)', demo: 'font-serif' },
                { id: 'mono', label: 'Monospace (JetBrains)', demo: 'font-mono' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onSelectFont(f.id as any)}
                  className={`w-full px-2.5 py-1.5 text-left border rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
                    noteFont === f.id
                      ? 'border-charcoal bg-charcoal text-paper font-bold'
                      : 'border-hairline bg-paper text-charcoal hover:border-accent'
                  }`}
                >
                  <span className={`text-[11px] ${f.demo}`}>{f.label}</span>
                  {noteFont === f.id && <Check className="w-3 h-3 text-accent" />}
                </button>
              ))}
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-hairline/60">
              <span className="text-[10px] text-charcoal-muted uppercase font-bold">Text Size:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'xs', label: 'A-', title: 'Compact (12px)' },
                  { id: 'sm', label: 'A', title: 'Standard (13px)' },
                  { id: 'base', label: 'A+', title: 'Comfortable (14px)' },
                  { id: 'lg', label: 'A++', title: 'Large Reader (16px)' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectFontSize(s.id as any)}
                    className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono font-bold border rounded-xs transition-colors cursor-pointer ${
                      noteFontSize === s.id
                        ? 'bg-accent text-white border-accent'
                        : 'bg-paper text-charcoal border-hairline hover:bg-paper-light'
                    }`}
                    title={s.title}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notebook Accents */}
            <div className="space-y-1.5 mt-2.5 pt-2 border-t border-hairline/60">
              <label className="flex items-center gap-2 cursor-pointer text-charcoal hover:text-accent select-none text-[11px]">
                <input 
                  type="checkbox" 
                  checked={showSpiral} 
                  onChange={(e) => onToggleSpiral(e.target.checked)} 
                  className="accent-accent cursor-pointer"
                />
                <span>Spiral Wire Rings</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-charcoal hover:text-accent select-none text-[11px]">
                <input 
                  type="checkbox" 
                  checked={showStickyNotes} 
                  onChange={(e) => onToggleStickyNotes(e.target.checked)} 
                  className="accent-accent cursor-pointer"
                />
                <span>Topper's Sticky Notes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-charcoal hover:text-accent select-none text-[11px]">
                <input 
                  type="checkbox" 
                  checked={showMarginalia} 
                  onChange={(e) => onToggleMarginalia(e.target.checked)} 
                  className="accent-accent cursor-pointer"
                />
                <span>Margin Stamps (⭐ V.V.IMP)</span>
              </label>
            </div>
          </div>

          {/* Section 6: Reading Mode */}
          <div className="pt-3 border-t border-line-border">
            <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1.5">
              Reading Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onSelectViewMode('page')}
                className={`p-2 border rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'page'
                    ? 'border-charcoal bg-charcoal text-paper font-bold'
                    : 'border-hairline bg-paper text-charcoal hover:border-charcoal'
                }`}
              >
                <BookIcon className="w-3 h-3 text-accent" />
                <span className="text-[11px]">Page-Wise</span>
              </button>
              <button
                onClick={() => onSelectViewMode('scroll')}
                className={`p-2 border rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'scroll'
                    ? 'border-charcoal bg-charcoal text-paper font-bold'
                    : 'border-hairline bg-paper text-charcoal hover:border-charcoal'
                }`}
              >
                <LayoutList className="w-3 h-3" />
                <span className="text-[11px]">Full Scroll</span>
              </button>
            </div>
          </div>

          {/* Section 7: Quick Actions (Upload & AI) */}
          <div className="pt-3 border-t border-line-border space-y-2">
            <button
              onClick={onOpenUploadModal}
              className="w-full px-3 py-2 bg-paper hover:bg-paper-light border border-hairline hover:border-accent text-charcoal font-semibold flex items-center justify-center gap-2 rounded-xs transition-colors cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-accent" />
              <span>Upload Personal Notes / Scans</span>
            </button>

            <button
              onClick={onOpenGroqSettings}
              className="w-full px-3 py-2 border border-hairline hover:border-accent bg-paper hover:bg-accent/5 text-charcoal font-mono text-xs flex items-center justify-between rounded-xs transition-colors shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-semibold">AI Engine:</span>
                <span className="text-[11px] text-charcoal-muted truncate max-w-[100px]">
                  {GroqClient.getSelectedModel().split('/').pop() || 'gpt-oss-120b'}
                </span>
              </div>
              <span className={`w-2 h-2 rounded-full ${GroqClient.isConfigured() ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-line-border bg-paper-50 text-[10px] text-charcoal-muted text-center font-mono">
          <span>GRASP Engine • KTU S5 Study Suite</span>
        </div>
      </aside>
    </>
  );
};
