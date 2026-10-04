import React, { useState } from 'react';
import { Search, X, ArrowRight, BookOpen, Layers, Zap } from 'lucide-react';
import { allConceptsList } from '../../data/ktu-s5-cse';
import { ConceptDetail } from '../../types/curriculum';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept: (conceptId: string) => void;
}

export const KnowledgeSearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectConcept
}) => {
  const [query, setQuery] = useState<string>('');

  if (!isOpen) return null;

  const filtered = allConceptsList.filter(c => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.subjectTitle.toLowerCase().includes(q) ||
      c.idea.simpleExplanation.toLowerCase().includes(q) ||
      c.prerequisites.some(p => p.title.toLowerCase().includes(q)) ||
      c.unlocks.some(u => u.title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-fadeIn font-sans">
      <div className="bg-white border border-line-border rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden space-y-0">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-line-border flex items-center gap-3 bg-paper-50">
          <Search className="w-4 h-4 text-ink-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts, prerequisites, or topics... (e.g. 'gradient', 'dfa', 'tcp')"
            className="w-full text-xs font-mono-code bg-transparent focus:outline-none text-ink-900"
          />
          <button
            onClick={onClose}
            className="p-1 text-ink-500 hover:text-ink-900 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono-code text-ink-500">
              No concepts matching "{query}". Try "gradient", "automata", or "tcp".
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectConcept(c.id);
                  onClose();
                }}
                className="p-3 rounded border border-line-border hover:border-terracotta hover:bg-paper-50 transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono-code">
                  <span className="text-terracotta font-semibold uppercase">{c.subjectTitle}</span>
                  <span className="text-ink-500">{c.moduleTitle}</span>
                </div>

                <h4 className="text-sm font-bold text-ink-900 group-hover:text-terracotta transition-colors font-serif-heading">
                  {c.title}
                </h4>

                <p className="text-xs text-ink-700 line-clamp-2 font-sans">
                  {c.idea.simpleExplanation}
                </p>

                {/* Relationship info */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono-code text-ink-500">
                  <span>Prereqs: {c.prerequisites.map(p => p.title).join(', ')}</span>
                  <span>·</span>
                  <span className="text-green-700">Unlocks: {c.unlocks.map(u => u.title).join(', ')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-paper-100 border-t border-line-border flex items-center justify-between text-[11px] font-mono-code text-ink-500">
          <span>Search returns knowledge nodes and relationship maps</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
