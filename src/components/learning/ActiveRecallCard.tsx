import React, { useState } from 'react';
import { ActiveRecallPrompt } from '../../types/curriculum';
import { Eye, EyeOff, Check, Sparkles } from 'lucide-react';

export const ActiveRecallCard: React.FC<{
  prompts: ActiveRecallPrompt[];
  onComplete?: () => void;
}> = ({ prompts, onComplete }) => {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [userDrafts, setUserDrafts] = useState<Record<string, string>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-line-border pb-2">
        <span className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
          SPACED RETRIEVAL // NO HINTS ACTIVE RECALL
        </span>
        <span className="text-xs font-mono-code text-terracotta font-semibold">
          TEST RETENTION
        </span>
      </div>

      <p className="text-xs text-ink-600">
        All textbook explanations are hidden. Recall the answer directly from your internal mental model before revealing the solution.
      </p>

      <div className="space-y-3">
        {prompts.map((p, idx) => {
          const isRevealed = !!revealedIds[p.id];
          return (
            <div key={p.id} className="bg-white border border-line-border rounded p-3.5 space-y-2.5 shadow-notebook">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-ink-900 font-sans">
                  {idx + 1}. {p.question}
                </span>

                <button
                  onClick={() => toggleReveal(p.id)}
                  className="px-2.5 py-1 text-xs font-mono-code text-ink-700 bg-paper-200 hover:bg-paper-300 rounded border border-line-border flex items-center gap-1 shrink-0"
                >
                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {isRevealed ? 'HIDE' : 'REVEAL ANSWER'}
                </button>
              </div>

              {!isRevealed && (
                <textarea
                  rows={2}
                  placeholder="Mental scratchpad (optional)... jot your thought before checking."
                  value={userDrafts[p.id] || ''}
                  onChange={(e) => setUserDrafts({ ...userDrafts, [p.id]: e.target.value })}
                  className="w-full text-xs font-mono-code p-2 border border-line-border rounded bg-paper-50 focus:outline-none"
                />
              )}

              {isRevealed && (
                <div className="bg-paper-100 border-l-2 border-l-ink-900 p-2.5 rounded-r text-xs space-y-1.5 font-sans animate-fadeIn">
                  <div className="text-ink-900 font-medium leading-relaxed">
                    {p.idealAnswer}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono-code text-ink-600">
                    <span className="font-semibold text-ink-800">Crucial Keywords: </span>
                    {p.expectedKeywords.join(', ')}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
