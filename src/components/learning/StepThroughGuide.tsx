import React, { useState } from 'react';
import { ConceptDetail } from '../../types/curriculum';
import { ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react';

interface StepThroughProps {
  guide: ConceptDetail['stepThroughGuide'];
}

export const StepThroughGuide: React.FC<StepThroughProps> = ({ guide }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const currentStep = guide.steps[currentStepIdx] || guide.steps[0];

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-line-border pb-2">
        <span className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
          EXECUTION TRACE // STEP-BY-STEP STATE MACHINE
        </span>
        <span className="text-xs font-mono-code text-ink-800 font-semibold">
          STEP {currentStepIdx + 1} OF {guide.steps.length}
        </span>
      </div>

      {/* Progress pill bar */}
      <div className="flex gap-1.5">
        {guide.steps.map((st, i) => (
          <button
            key={i}
            onClick={() => setCurrentStepIdx(i)}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i === currentStepIdx
                ? 'bg-terracotta'
                : i < currentStepIdx
                ? 'bg-ink-800'
                : 'bg-paper-300'
            }`}
          />
        ))}
      </div>

      {/* Step card */}
      <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-ink-900 font-mono-code">
            {currentStep.actionTitle}
          </h4>
          <span className="text-[10px] font-mono-code text-ink-500 px-2 py-0.5 rounded bg-paper-200">
            INDEX #{currentStep.index}
          </span>
        </div>

        <p className="text-xs text-ink-700 leading-relaxed font-sans">
          {currentStep.description}
        </p>

        {/* Internal State register inspection table */}
        <div className="border border-line-border rounded overflow-hidden">
          <div className="bg-paper-200 px-3 py-1.5 text-[11px] font-mono-code text-ink-600 font-semibold border-b border-line-border">
            INTERNAL REGISTERS & PROGRAM STATE:
          </div>
          <div className="p-3 bg-paper-50 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono-code">
            {Object.entries(currentStep.internalState).map(([k, v]) => (
              <div key={k} className="bg-white p-2 rounded border border-line-border">
                <div className="text-[10px] text-ink-500 uppercase">{k}</div>
                <div className="text-xs font-bold text-ink-900 mt-0.5">{String(v)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Note */}
        <div className="bg-amber-50/80 border-l-2 border-l-amber-500 p-2.5 rounded-r text-xs text-amber-950 font-serif italic">
          💡 {currentStep.highlightNote}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
          disabled={currentStepIdx === 0}
          className="px-3 py-1.5 text-xs font-mono-code bg-paper-200 text-ink-800 border border-line-border rounded hover:bg-paper-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          PREVIOUS
        </button>

        <button
          onClick={() => setCurrentStepIdx(0)}
          className="p-1.5 text-ink-600 border border-line-border rounded hover:bg-paper-200"
          title="Restart from step 1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setCurrentStepIdx(prev => Math.min(guide.steps.length - 1, prev + 1))}
          disabled={currentStepIdx === guide.steps.length - 1}
          className="px-3 py-1.5 text-xs font-mono-code bg-ink-900 text-paper-50 rounded hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
        >
          NEXT
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
