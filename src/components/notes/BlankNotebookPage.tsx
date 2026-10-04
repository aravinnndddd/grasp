import React, { useState, useEffect, useRef } from 'react';
import { 
  Trash2, 
  FileText, 
  Calendar, 
  RotateCcw, 
  Sparkles, 
  Send, 
  Loader2, 
  Cpu, 
  Check, 
  Edit3, 
  Eye, 
  Zap, 
  ArrowRight,
  HelpCircle,
  X
} from 'lucide-react';
import { UserBlankPage } from '../../lib/storage/user-blank-pages';
import { JevCognitiveRouter, JevExecutionResult, JevRoutingDecision } from '../../lib/ai/jev-router';
import { GroqClient } from '../../lib/ai/groq-client';
import { ToppersNoteRenderer } from './ToppersNoteRenderer';

interface BlankNotebookPageProps {
  page: UserBlankPage;
  onUpdatePage: (updates: Partial<UserBlankPage>) => void;
  onDeletePage: (id: string) => void;
  fontClass?: string;
  notebookTheme?: 'ruled' | 'grid' | 'yellow' | 'clean';
  showSpiral?: boolean;
  subjectCode?: string;
  subjectTitle?: string;
  moduleTitle?: string;
  onOpenGroqSettings?: () => void;
}

export const BlankNotebookPage: React.FC<BlankNotebookPageProps> = ({
  page,
  onUpdatePage,
  onDeletePage,
  fontClass = 'font-sans',
  notebookTheme = 'ruled',
  showSpiral = true,
  subjectCode = 'PCCST501',
  subjectTitle = 'Computer Networks',
  moduleTitle = 'Module Core Concepts',
  onOpenGroqSettings
}) => {
  const [title, setTitle] = useState<string>(page.title);
  const [content, setContent] = useState<string>(page.content);
  const [isRenderedView, setIsRenderedView] = useState<boolean>(false);

  // AI Prompt State
  const [isAiBarOpen, setIsAiBarOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [liveRouting, setLiveRouting] = useState<JevRoutingDecision | null>(null);
  const [lastAiResult, setLastAiResult] = useState<JevExecutionResult | null>(null);
  const [aiStatusMsg, setAiStatusMsg] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when page changes
  useEffect(() => {
    setTitle(page.title);
    setContent(page.content);
  }, [page.id]);

  // Update live JEV routing preview as user types prompt
  useEffect(() => {
    if (!aiPrompt.trim()) {
      setLiveRouting(null);
      return;
    }
    const decision = JevCognitiveRouter.routeRequest(aiPrompt, {
      subjectTitle,
      subjectCode,
      moduleTitle
    });
    setLiveRouting(decision);
  }, [aiPrompt, subjectTitle, subjectCode, moduleTitle]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    onUpdatePage({ title: val.trim() || 'Untitled A4 Scratchpad' });
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    onUpdatePage({ content: val });

    // Detect if user typed `/ai ` or `/ai`
    const lastLines = val.split('\n');
    const lastLine = lastLines[lastLines.length - 1];
    if (lastLine.trim().startsWith('/ai') && !isAiBarOpen) {
      setIsAiBarOpen(true);
      const query = lastLine.replace(/^\/ai\s*/, '');
      if (query) {
        setAiPrompt(query);
      }
    }
  };

  // Intercept Enter key inside textarea to trigger `/ai <prompt>`
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const cursor = textareaRef.current?.selectionStart || 0;
      const textBeforeCursor = content.substring(0, cursor);
      const currentLine = textBeforeCursor.split('\n').pop() || '';

      if (currentLine.trim().startsWith('/ai')) {
        e.preventDefault();
        const promptQuery = currentLine.replace(/^\/ai\s*/, '').trim();

        if (promptQuery) {
          // Remove the `/ai ...` line before inserting response
          const lines = textBeforeCursor.split('\n');
          lines.pop(); // remove `/ai` line
          const newBefore = lines.join('\n') + (lines.length > 0 ? '\n' : '');
          const textAfterCursor = content.substring(cursor);

          await executeAiPrompt(promptQuery, newBefore, textAfterCursor);
        } else {
          // Just open the AI Copilot bar
          setIsAiBarOpen(true);
        }
      }
    }
  };

  // Execute AI query through JEV Cognitive Router
  const executeAiPrompt = async (
    queryToRun: string, 
    prefix: string = content, 
    suffix: string = ''
  ) => {
    if (!queryToRun.trim() || isAiGenerating) return;

    setIsAiGenerating(true);
    setAiStatusMsg(`JEV Engine: Routing & synthesizing for ${subjectCode}...`);

    try {
      const result = await JevCognitiveRouter.executeQuery(queryToRun, {
        subjectTitle,
        subjectCode,
        moduleTitle
      });

      setLastAiResult(result);

      // Build formatted note block
      const aiNoteHeader = `\n\n### ✦ ${queryToRun}\n> **[JEV Cognitive AI • Model: ${result.decision.modelName}]**\n> *${result.decision.reasoning}*\n\n`;
      const insertedText = `${prefix}${aiNoteHeader}${result.response}\n\n---${suffix}`;

      setContent(insertedText);
      onUpdatePage({ content: insertedText });

      // Automatically set title if currently untitled
      if (title.startsWith('Untitled') || title.startsWith('Scratchpad Page')) {
        const newTitle = queryToRun.slice(0, 45);
        setTitle(newTitle);
        onUpdatePage({ title: newTitle, content: insertedText });
      }

      setAiPrompt('');
      setIsAiBarOpen(false);
      setAiStatusMsg('');
    } catch (err: any) {
      console.error('Failed to execute AI prompt:', err);
      setAiStatusMsg('AI Execution failed. Please check Groq API configuration.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleClearContent = () => {
    if (confirm('Clear all written text on this A4 notebook page?')) {
      setContent('');
      onUpdatePage({ content: '' });
    }
  };

  const formattedDate = new Date(page.updatedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      className={`w-full max-w-[800px] min-h-[1130px] mx-auto relative shadow-2xl transition-all duration-200 select-text ${
        notebookTheme === 'ruled'
          ? 'notebook-ruled-page p-6 sm:p-10 pl-14 sm:pl-20 border border-stone-300'
          : notebookTheme === 'grid'
          ? 'notebook-grid-page p-6 sm:p-10 border border-blue-200'
          : notebookTheme === 'yellow'
          ? 'notebook-legal-pad p-6 sm:p-10 pl-14 sm:pl-20 border border-amber-300'
          : 'bg-paper p-6 sm:p-10 border border-line-border'
      } rounded-xs`}
    >
      {/* Spiral wire rings decoration on left */}
      {showSpiral && (notebookTheme === 'ruled' || notebookTheme === 'yellow') && (
        <div 
          className="spiral-binder absolute left-1 sm:left-2.5 top-0 bottom-0 w-6 pointer-events-none z-10 opacity-70"
          title="Spiral Binder"
        />
      )}

      {/* A4 Notebook Top Margin Stationery Header */}
      <div className="pb-3 border-b border-line-border/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 bg-accent/15 border border-accent/30 text-accent font-bold text-[10px] tracking-widest uppercase rounded-xs">
            A4 NOTEBOOK SHEET
          </span>

          {/* Quick /ai Trigger Pill */}
          <button
            onClick={() => setIsAiBarOpen(!isAiBarOpen)}
            className={`px-2.5 py-0.5 rounded-xs font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs border ${
              isAiBarOpen
                ? 'bg-charcoal text-paper border-charcoal'
                : 'bg-accent/10 hover:bg-accent text-accent hover:text-white border-accent/40'
            }`}
            title="Type /ai anywhere in notes or click here to ask JEV Cognitive AI"
          >
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            <span>/ai Ask AI</span>
          </button>

          <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
            <Calendar className="w-3 h-3 text-accent" />
            <span>{formattedDate}</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 font-mono">
          {/* View Toggle: Handwritten Edit vs Formatted Markdown Render */}
          <button
            onClick={() => setIsRenderedView(!isRenderedView)}
            className="px-2.5 py-0.5 text-[11px] bg-paper hover:bg-paper-light border border-line-border hover:border-charcoal text-charcoal rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
            title={isRenderedView ? 'Switch to Direct Text Editing' : 'Render Formatted Markdown & Diagrams'}
          >
            {isRenderedView ? (
              <>
                <Edit3 className="w-3 h-3 text-accent" />
                <span>Edit Text</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 text-accent" />
                <span>Preview Notes</span>
              </>
            )}
          </button>

          <button
            onClick={handleClearContent}
            disabled={!content.trim()}
            className="px-2 py-0.5 text-[11px] text-charcoal-muted hover:text-charcoal hover:bg-black/5 disabled:opacity-30 rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear all text on page"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`Delete A4 notebook page "${title}"?`)) {
                onDeletePage(page.id);
              }
            }}
            className="px-2 py-0.5 text-[11px] text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Delete this A4 notebook page"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* JEV AI Copilot Dock (/ai prompt bar) */}
      {isAiBarOpen && (
        <div className="mt-3 p-3 bg-white/95 backdrop-blur-xs border border-charcoal/30 rounded-xs shadow-md space-y-2 animate-fade-in font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-accent font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JEV COGNITIVE AI COPILOT (/ai)</span>
            </div>
            <button
              onClick={() => setIsAiBarOpen(false)}
              className="text-charcoal-muted hover:text-charcoal cursor-pointer"
              title="Close AI Dock (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              executeAiPrompt(aiPrompt);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              autoFocus
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Derive Slotted ALOHA throughput and draw state diagram..."
              className="flex-1 px-3 py-1.5 bg-paper border border-hairline focus:border-accent text-charcoal font-sans text-xs focus:outline-none rounded-xs"
              disabled={isAiGenerating}
            />

            <button
              type="submit"
              disabled={!aiPrompt.trim() || isAiGenerating}
              className="px-3 py-1.5 bg-charcoal hover:bg-black disabled:opacity-40 text-paper font-mono text-xs font-bold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  <span>Routing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 text-accent" />
                  <span>Ask JEV</span>
                </>
              )}
            </button>
          </form>

          {/* Real-time JEV Decision Routing Preview */}
          {liveRouting && (
            <div className="pt-1.5 border-t border-hairline/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-charcoal-muted">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>JEV Route:</span>
                <span className="font-bold text-charcoal">{liveRouting.modelName}</span>
                <span className="px-1.5 py-0.2 bg-paper-dark border border-hairline text-accent font-semibold">
                  {liveRouting.task}
                </span>
              </div>
              <span className="truncate max-w-[280px] italic">
                {liveRouting.reasoning}
              </span>
            </div>
          )}

          {aiStatusMsg && (
            <div className="text-[11px] text-accent font-semibold flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>{aiStatusMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Editable Page Title Header - Seamlessly written on the notebook paper */}
      <div className="mt-3 mb-2 flex items-baseline gap-2">
        <span className="font-mono text-xs font-bold text-charcoal-muted uppercase tracking-wider shrink-0 select-none">
          TOPIC:
        </span>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled Note / Derivation Topic (Click to edit)"
          className="w-full bg-transparent border-b border-charcoal/20 hover:border-accent focus:border-accent text-lg sm:text-xl font-serif font-bold text-charcoal focus:outline-none transition-colors py-0.5"
        />
      </div>

      {/* Content Area: Lined Handwritten Input OR Formatted Markdown View */}
      {isRenderedView ? (
        <div className="mt-4 min-h-[900px]">
          {content.trim() ? (
            <ToppersNoteRenderer content={content} className={fontClass} />
          ) : (
            <div className="py-24 text-center text-charcoal-muted font-mono text-xs space-y-2">
              <FileText className="w-8 h-8 mx-auto text-charcoal-muted/40" />
              <p>Notebook is empty. Switch to "Edit Text" or type <strong>/ai &lt;question&gt;</strong> to generate notes.</p>
            </div>
          )}
        </div>
      ) : (
        /* Authentic Notebook Writing Surface - Text lines sit right on the 28px ruled lines */
        <div className="relative mt-2">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Click anywhere and start typing your custom notes, formulas, or derivations...&#10;&#10;💡 Try typing: /ai Explain pure vs slotted ALOHA with throughput formula and press Enter!&#10;💡 Turn on 'Draw / Annotate' in the top bar to sketch diagrams with pencil and highlighter!"
            className={`w-full bg-transparent border-none outline-none resize-none text-charcoal leading-[28px] focus:ring-0 ${fontClass} placeholder:text-charcoal-muted/40 placeholder:font-mono placeholder:text-xs`}
            style={{
              minHeight: '960px',
              lineHeight: '28px',
              fontSize: '15px'
            }}
          />
        </div>
      )}

      {/* Bottom Notebook Margin Stamp */}
      <div className="pt-4 border-t border-line-border/40 mt-4 flex items-center justify-between text-[10px] font-mono text-charcoal-muted">
        <span>A4 DIMENSIONS (210mm × 297mm) • TYPE /AI TO SUMMON JEV AI COPILOT</span>
        <span>{content.length} characters</span>
      </div>
    </div>
  );
};
