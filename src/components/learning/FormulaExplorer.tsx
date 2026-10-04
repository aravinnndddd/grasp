import React, { useState } from 'react';
import { FormulaData, ConceptVariable } from '../../types/curriculum';
import { HelpCircle, Info } from 'lucide-react';

export const FormulaExplorer: React.FC<{ formula: FormulaData }> = ({ formula }) => {
  const [selectedVar, setSelectedVar] = useState<ConceptVariable>(formula.variables[0]);

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-line-border pb-2">
        <span className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
          INTERACTIVE EQUATION // CLICK ANY VARIABLE
        </span>
        <span className="text-xs font-mono-code text-ink-600 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-terracotta" /> Click symbols to unpack
        </span>
      </div>

      {/* Main mathematical display banner */}
      <div className="bg-white border border-line-border p-4 rounded text-center shadow-notebook paper-grid">
        <div className="font-mono-code text-xl md:text-2xl font-bold text-ink-900 tracking-wide select-all py-1">
          {formula.plain}
        </div>
        <p className="text-xs text-ink-600 mt-2 font-serif italic max-w-xl mx-auto">
          "{formula.explanation}"
        </p>
      </div>

      {/* Variable pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {formula.variables.map((v, i) => (
          <button
            key={i}
            onClick={() => setSelectedVar(v)}
            className={`px-3 py-1.5 rounded text-xs font-mono-code border transition-all ${
              selectedVar.symbol === v.symbol
                ? 'bg-ink-900 text-paper-50 border-ink-900 shadow-sm'
                : 'bg-paper-200 text-ink-800 border-line-border hover:bg-paper-300'
            }`}
          >
            {v.symbol} <span className="opacity-75">({v.name})</span>
          </button>
        ))}
      </div>

      {/* Variable deep explanation card */}
      {selectedVar && (
        <div className="bg-white border-l-4 border-l-terracotta border-y border-r border-line-border p-4 rounded-r text-xs space-y-2 font-mono-code">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-ink-900">
              Variable: {selectedVar.name} ({selectedVar.symbol})
            </span>
            {selectedVar.unit && (
              <span className="text-[11px] text-ink-500 bg-paper-200 px-2 py-0.5 rounded">
                Unit / Type: {selectedVar.unit}
              </span>
            )}
          </div>

          <p className="text-ink-700 leading-relaxed font-sans text-sm">
            {selectedVar.meaning}
          </p>

          <div className="bg-paper-100 p-2.5 rounded border border-line-border flex items-start gap-2">
            <Info className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink-900">What happens when increased? </strong>
              <span className="text-ink-700 font-sans">{selectedVar.effectWhenIncreased}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
