import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Clock, FileText, Sparkles } from 'lucide-react';
import { UploadedNotesStorage, UploadedNote } from '../../lib/storage/uploaded-notes';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote?: (noteId: string) => void;
}

export const KnowledgeSearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectNote
}) => {
  const [query, setQuery] = useState<string>('');
  const [notes, setNotes] = useState<UploadedNote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      UploadedNotesStorage.getAll()
        .then(res => setNotes(res))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();
  const filtered = notes.filter(n => {
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      n.subjectTitle.toLowerCase().includes(q) ||
      n.subjectCode.toLowerCase().includes(q) ||
      (n.tags && n.tags.some(t => t.toLowerCase().includes(q))) ||
      (n.aiSummary && n.aiSummary.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-fadeIn font-sans">
      <div className="bg-white border border-line-border rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden space-y-0">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-line-border flex items-center gap-3 bg-paper-50">
          <Search className="w-4 h-4 text-ink-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search uploaded notes, subject titles, tags... (e.g. 'systems', 'consensus', 'tcp')"
            className="w-full text-xs font-mono-code bg-transparent focus:outline-none text-ink-900"
          />
          <button
            onClick={onClose}
            className="p-1 text-ink-500 hover:text-ink-900 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="text-center py-8 text-xs font-mono-code text-ink-500">
              Loading note vault…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono-code text-ink-500">
              {notes.length === 0
                ? 'Your note vault is empty. Upload a PDF or Markdown file to get started.'
                : `No notes matching "${query}".`}
            </div>
          ) : (
            filtered.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  if (onSelectNote) onSelectNote(note.id);
                  onClose();
                }}
                className="p-3.5 rounded-lg border border-line-border hover:border-terracotta hover:bg-paper-50 transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono-code">
                  <span className="text-terracotta font-semibold uppercase">{note.subjectCode || 'DOC'} · {note.subjectTitle || 'Engineering'}</span>
                  <span className="text-ink-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-ink-900 group-hover:text-terracotta transition-colors font-serif-heading">
                  {note.title}
                </h4>

                <p className="text-xs text-ink-600 line-clamp-2 font-sans">
                  {note.aiSummary ? note.aiSummary.replace(/^[#\s\-\*\>]+/gm, '').slice(0, 160) : 'Document indexed and ready for study.'}
                </p>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {note.tags.slice(0, 4).map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-paper-200 text-ink-600 text-[9px] font-mono-code rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-paper-100 border-t border-line-border flex items-center justify-between text-[11px] font-mono-code text-ink-500">
          <span>Search uploaded notes and RAG indices</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
