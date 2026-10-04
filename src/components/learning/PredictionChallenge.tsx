import React, { useState } from 'react';
import { PredictionOption } from '../../types/curriculum';
import { HelpCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface PredictionProps {
  prompt: string;
  contextState: string;
  options: PredictionOption[];
  onSolved?: () => void;
}

export const PredictionChallenge: React.FC<PredictionProps> = ({
  prompt,
  contextState,
  options,
  onSolved
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const selectedOption = options.find(o => o.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setIsRevealed(true);
    const opt = options.find(o => o.id === id);
    if (opt?.isCorrect && onSolved) {
      onSolved();
    }
  };

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-line-border pb-2">
        <span className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
          CHALLENGE // ACTIVE COGNITIVE PREDICTION
        </span>
        <span className="text-xs font-mono-code text-terracotta font-semibold">
          PREDICT BEFORE REVEAL
        </span>
      </div>

      <div className="bg-paper-200 border border-line-border px-3 py-2 rounded text-xs font-mono-code text-ink-800">
        <span className="text-ink-500 font-semibold">Given System State: </span>
        {contextState}
      </div>

      <h4 className="text-base font-medium text-ink-900 leading-snug">
        {prompt}
      </h4>

      {/* Options grid */}
      <div className="space-y-2 pt-1">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left p-3 rounded text-xs font-mono-code border transition-all flex items-start gap-3 ${
                isSelected
                  ? opt.isCorrect
                    ? 'bg-green-50 border-green-400 text-green-950 font-semibold shadow-sm'
                    : 'bg-red-50 border-red-400 text-red-950 font-semibold shadow-sm'
                  : 'bg-white border-line-border text-ink-800 hover:bg-paper-100 hover:border-ink-400'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSelected ? (
                  opt.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )
                ) : (
                  <div className="w-4 h-4 rounded-full border border-line-border bg-paper-100" />
                )}
              </div>
              <div className="flex-1">{opt.text}</div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Feedback Reveal */}
      {isRevealed && selectedOption && (
        <div
          className={`p-3.5 rounded border text-xs leading-relaxed space-y-1 ${
            selectedOption.isCorrect
              ? 'bg-green-50/80 border-green-200 text-green-900'
              : 'bg-red-50/80 border-red-200 text-red-900'
          }`}
        >
          <div className="font-mono-code font-bold uppercase tracking-wider text-[11px]">
            {selectedOption.isCorrect ? '✓ PREDICTION ACCURATE' : '✕ MISPREDICTION ANALYZED'}
          </div>
          <p className="font-sans text-xs">
            {selectedOption.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
