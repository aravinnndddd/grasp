import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  Sparkles, 
  Send, 
  FileText, 
  BookOpen, 
  Layers, 
  Clock, 
  User, 
  Tag, 
  ExternalLink,
  ChevronDown,
  Cpu,
  Save,
  Check
} from 'lucide-react';
import { UploadedNote } from '../../lib/storage/uploaded-notes';
import { ToppersNoteRenderer } from './ToppersNoteRenderer';
import { JevCognitiveRouter, JevExecutionResult } from '../../lib/ai/jev-router';
import { SavedAnswersStorage } from '../../lib/storage/saved-answers';
import { PDFViewer } from './PDFViewer';

interface UploadedNoteViewerModalProps {
  note: UploadedNote | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  fontClass?: string;
  notebookTheme?: 'ruled' | 'grid' | 'yellow' | 'clean';
}

export const UploadedNoteViewerModal: React.FC<UploadedNoteViewerModalProps> = ({
  note,
  isOpen,
  onClose,
  onDelete,
  fontClass = 'font-sans text-xs',
  notebookTheme = 'ruled'
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'ai_chat'>('content');
  const [aiQuery, setAiQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<JevExecutionResult | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  if (!isOpen || !note) return null;

  const handleDownload = () => {
    if (note.dataUrl) {
      const a = document.createElement('a');
      a.href = note.dataUrl;
      a.download = note.fileName;
      a.click();
    } else if (note.content) {
      const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.fileName.endsWith('.md') || note.fileName.endsWith('.txt') ? note.fileName : `${note.fileName}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleAskAi = async (promptOverride?: string) => {
    const query = promptOverride || aiQuery;
    if (!query.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setActiveTab('ai_chat');

    try {
      // RAG Passage Retrieval across all pages
      let noteContext = '';
      if (note.content && note.content.length > 3000) {
        // Split content into page-referenced passages
        const passages = note.content.split(/(?=\[Page\s+\d+\])/i);
        const queryWords = query.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2);
        
        // Score passages by keyword relevance
        const scored = passages.map(p => {
          const lower = p.toLowerCase();
          let score = 0;
          for (const w of queryWords) {
            if (lower.includes(w)) score += 1;
          }
          return { passage: p.trim(), score };
        });

        scored.sort((a, b) => b.score - a.score);
        const topPassages = scored.filter(s => s.score > 0).slice(0, 5).map(s => s.passage);

        if (topPassages.length > 0) {
          noteContext = `RAG Retrieved Excerpts from ${note.title} (Pages matched for query):\n"""\n${topPassages.join('\n\n---\n\n')}\n"""\n\n`;
        } else {
          noteContext = `Context from Uploaded Note (${note.title}):\n"""\n${note.content.slice(0, 4000)}\n"""\n\n`;
        }
      } else if (note.content) {
        noteContext = `Context from Uploaded Note (${note.title}):\n"""\n${note.content}\n"""\n\n`;
      } else if (note.aiSummary) {
        noteContext = `Context from Study Guide (${note.title}):\n"""\n${note.aiSummary.slice(0, 4000)}\n"""\n\n`;
      } else {
        noteContext = `Context: Student uploaded note for ${note.subjectCode} titled "${note.title}".\n\n`;
      }

      const fullPrompt = `${noteContext}Student Query (Cite page numbers if available):\n${query}`;

      const res = await JevCognitiveRouter.executeQuery(fullPrompt, {
        subjectCode: note.subjectCode,
        subjectTitle: note.subjectTitle,
        moduleTitle: note.moduleNum === 0 ? 'All Modules' : `Module ${note.moduleNum}`
      });

      setAiResult(res);

      // Auto save to saved answers
      SavedAnswersStorage.save({
        subjectCode: note.subjectCode,
        subjectTitle: note.subjectTitle,
        moduleTitle: `Uploaded Note: ${note.title}`,
        query: query,
        response: res.response,
        modelUsed: res.decision.modelName,
        routingTask: res.decision.task
      });

      setAiQuery('');
    } catch (e) {
      console.error('Error asking AI about uploaded note:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-ink-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-paper-50 border border-line-border w-full max-w-4xl max-h-[94vh] flex flex-col rounded shadow-2xl overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-paper-100 border-b border-line-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 bg-ink-900 text-white font-mono-code text-[10px] font-bold uppercase rounded">
              {note.subjectCode}
            </span>
            <div>
              <h2 className="text-base font-serif-heading font-bold text-ink-900">
                {note.title}
              </h2>
              <div className="text-[11px] font-mono-code text-ink-500 flex items-center gap-2 mt-0.5">
                <span>{note.moduleNum === 0 ? 'Entire Syllabus' : `Module ${note.moduleNum}`}</span>
                <span>•</span>
                <span>By {note.author || 'Student'}</span>
                <span>•</span>
                <span>{new Date(note.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownload}
              className="p-1.5 text-ink-600 hover:text-ink-900 hover:bg-paper-200 rounded transition-colors"
              title="Download original note file"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
                  onDelete(note.id);
                  onClose();
                }
              }}
              className="p-1.5 text-ink-400 hover:text-rose-600 hover:bg-paper-200 rounded transition-colors"
              title="Delete this note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-400 hover:text-ink-900 hover:bg-paper-200 rounded transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Bar */}
        <div className="px-5 py-2 bg-white border-b border-line-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'content'
                  ? 'bg-ink-900 text-white font-bold'
                  : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
              }`}
            >
              Note Content ({note.fileType.toUpperCase()})
            </button>
            <button
              onClick={() => setActiveTab('ai_chat')}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                activeTab === 'ai_chat'
                  ? 'bg-accent text-white font-bold'
                  : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ask AI About This Note</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-ink-500">
            <span>Size: {(note.fileSize / 1024).toFixed(1)} KB</span>
            {note.tags && note.tags.length > 0 && (
              <span className="hidden sm:inline">
                • Tags: {note.tags.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'content' ? (
            <div className="space-y-4">
              
              {/* Optional AI Summary Banner if generated */}
              {note.aiSummary && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-amber-900 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>AI Executive Summary &amp; Exam Takeaways</span>
                  </div>
                  <div className="pt-1">
                    <ToppersNoteRenderer
                      content={note.aiSummary}
                      className={fontClass}
                    />
                  </div>
                </div>
              )}

              {/* Render by File Type */}
              {note.fileType === 'image' && note.dataUrl && (
                <div className="bg-paper-100 p-2 border border-line-border rounded text-center">
                  <img
                    src={note.dataUrl}
                    alt={note.title}
                    className="max-h-[600px] w-auto mx-auto object-contain rounded shadow-xs"
                  />
                </div>
              )}

              {note.fileType === 'pdf' && note.dataUrl && (
                <div className="space-y-2">
                  <div className="bg-paper-100 p-3 rounded border border-line-border flex items-center justify-between text-xs font-mono-code">
                    <span>PDF Document: <strong>{note.fileName}</strong></span>
                  </div>
                  <PDFViewer fileUrl={note.dataUrl} />
                </div>
              )}

              {(note.fileType === 'text' || note.fileType === 'markdown' || (!note.dataUrl && note.content)) && (
                <div className="p-6 bg-white border border-line-border rounded shadow-xs">
                  <ToppersNoteRenderer
                    content={note.content || '# No text content in note'}
                    className={fontClass}
                  />
                </div>
              )}

              {/* Instant Study Probes */}
              <div className="pt-4 border-t border-line-border space-y-2">
                <span className="text-xs font-mono-code text-ink-500 uppercase font-bold">
                  Quick AI Examination Probes:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono-code">
                  {[
                    'Explain this note in simpler terms with an analogy',
                    'Generate 3-mark and 8-mark questions from this note',
                    'Draw an ASCII / Mermaid diagram for this concept',
                    'Check for any technical errors or missing derivations'
                  ].map((probe, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskAi(probe)}
                      className="px-3 py-1.5 bg-paper-100 hover:bg-terracotta/10 border border-line-border hover:border-terracotta text-ink-800 rounded transition-colors text-[11px]"
                    >
                      {probe}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* AI Chat & Q&A tab */
            <div className="space-y-4">
              
              {/* Query Input */}
              <div className="p-4 bg-paper-100 border border-line-border rounded space-y-3 font-mono-code text-xs">
                <label className="font-bold text-ink-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-terracotta" />
                  <span>Ask Free Groq AI About "{note.title}":</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                    placeholder="e.g. Can you explain the derivation on page 1, or generate KTU 3-mark questions?"
                    className="flex-1 px-3 py-2 bg-white border border-line-border rounded focus:outline-none focus:border-terracotta text-ink-900"
                  />
                  <button
                    onClick={() => handleAskAi()}
                    disabled={isAiLoading || !aiQuery.trim()}
                    className="px-4 py-2 bg-terracotta hover:bg-terracotta-dark disabled:opacity-40 text-white font-bold rounded flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    {isAiLoading ? (
                      <>
                        <Cpu className="w-3.5 h-3.5 animate-spin" />
                        <span>Thinking...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Response */}
              {aiResult && (
                <div className="p-5 bg-white border border-terracotta/30 rounded shadow-xs space-y-3 animate-fade-in font-mono-code text-xs">
                  <div className="flex items-center justify-between border-b border-line-border pb-2 text-[11px]">
                    <span className="px-2 py-0.5 bg-ink-900 text-white font-bold rounded">
                      Model: {aiResult.decision.modelName}
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded font-semibold">
                      Auto-Saved to Notes Vault
                    </span>
                  </div>

                  <div className="pt-2">
                    <ToppersNoteRenderer
                      content={aiResult.response}
                      className={fontClass}
                    />
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
