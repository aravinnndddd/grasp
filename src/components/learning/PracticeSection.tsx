import React, { useState } from 'react';
import { PracticeProblem } from '../../types/curriculum';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

export const PracticeSection: React.FC<{
  problems: PracticeProblem[];
  onProblemSolved?: (problemId: string, isCorrect: boolean) => void;
}> = ({ problems, onProblemSolved }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const currentProblem = problems[activeTab] || problems[0];

  const handleSelectOption = (probId: string, optId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [probId]: optId }));
    setRevealed(prev => ({ ...prev, [probId]: true }));

    const opt = currentProblem.options?.find(o => o.id === optId);
    if (onProblemSolved) {
      onProblemSolved(probId, !!opt?.isCorrect);
    }
  };

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 space-y-4 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-2">
        <span className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
          PROGRESSIVE DIFFICULTY LADDER // 7 LEVELS
        </span>
        <span className="text-xs font-mono-code text-ink-600">
          Problem {activeTab + 1} of {problems.length}
        </span>
      </div>

      {/* Level selector tabs */}
      <div className="flex flex-wrap gap-1.5">
        {problems.map((p, idx) => {
          const isDone = revealed[p.id];
          const chosenOpt = p.options?.find(o => o.id === selectedAnswers[p.id]);
          return (
            <button
              key={p.id}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1 text-xs font-mono-code rounded border transition-all ${
                activeTab === idx
                  ? 'bg-ink-900 text-white font-semibold'
                  : 'bg-paper-200 text-ink-700 hover:bg-paper-300'
              }`}
            >
              {p.levelLabel}
              {isDone && (
                <span className={`ml-1.5 ${chosenOpt?.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {chosenOpt?.isCorrect ? '✓' : '✕'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Problem View */}
      {currentProblem && (
        <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-3">
          <div className="text-xs font-mono-code text-terracotta font-semibold uppercase">
            {currentProblem.levelLabel}
          </div>

          <h4 className="text-sm font-medium text-ink-900 leading-snug">
            {currentProblem.question}
          </h4>

          {/* Options list */}
          {currentProblem.options && (
            <div className="space-y-2 pt-1">
              {currentProblem.options.map(opt => {
                const isSelected = selectedAnswers[currentProblem.id] === opt.id;
                const isAnswerRevealed = revealed[currentProblem.id];

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentProblem.id, opt.id)}
                    className={`w-full text-left p-3 rounded text-xs font-mono-code border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-green-50 border-green-500 text-green-950 font-semibold'
                          : 'bg-red-50 border-red-500 text-red-950 font-semibold'
                        : isAnswerRevealed && opt.isCorrect
                        ? 'bg-green-50/50 border-green-300 text-green-900'
                        : 'bg-white border-line-border text-ink-800 hover:bg-paper-100'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-line-border bg-paper-100" />
                      )}
                    </div>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Explanation reveal */}
          {revealed[currentProblem.id] && (
            <div className="bg-paper-100 border border-line-border p-3 rounded text-xs text-ink-800 font-sans leading-relaxed">
              <strong className="font-mono-code text-ink-900 block mb-1">
                Detailed Solution & Reasoning:
              </strong>
              {currentProblem.correctExplanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
