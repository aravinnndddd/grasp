import React from 'react';
import { Award, CheckSquare, Square, ShieldCheck } from 'lucide-react';
import { MasteryScoreProfile } from '../../types/learning';

interface MasteryProps {
  criteria: string[];
  completedList: string[];
  score: MasteryScoreProfile;
  isMastered: boolean;
  onToggleCriterion: (criterion: string) => void;
  onConfirmMastery: () => void;
}

export const MasteryChecklist: React.FC<MasteryProps> = ({
  criteria,
  completedList,
  score,
  isMastered,
  onToggleCriterion,
  onConfirmMastery
}) => {
  const allChecked = criteria.every(c => completedList.includes(c));

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 space-y-4 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
            COMPETENCY CERTIFICATION // 17-STAGE AUDIT
          </div>
          <h4 className="text-base font-semibold text-ink-900 font-serif-heading">
            Concept Mastery Qualification Checklist
          </h4>
        </div>

        {isMastered ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono-code bg-green-100 text-green-900 border border-green-300 rounded font-bold">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            STATUS: VERIFIED MASTERED
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono-code bg-paper-200 text-ink-700 border border-line-border rounded">
            IN AUDIT ({completedList.length}/{criteria.length} VERIFIED)
          </span>
        )}
      </div>

      {/* 4-Pillar Score Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs font-mono-code">
        <div className="bg-white p-2.5 rounded border border-line-border">
          <div className="text-ink-500 text-[10px]">UNDERSTANDING</div>
          <div className="text-sm font-bold text-ink-900 mt-1">{score.understanding}%</div>
        </div>
        <div className="bg-white p-2.5 rounded border border-line-border">
          <div className="text-ink-500 text-[10px]">APPLICATION</div>
          <div className="text-sm font-bold text-ink-900 mt-1">{score.application}%</div>
        </div>
        <div className="bg-white p-2.5 rounded border border-line-border">
          <div className="text-ink-500 text-[10px]">RECALL</div>
          <div className="text-sm font-bold text-ink-900 mt-1">{score.recall}%</div>
        </div>
        <div className="bg-white p-2.5 rounded border border-line-border">
          <div className="text-ink-500 text-[10px]">EXAM READINESS</div>
          <div className="text-sm font-bold text-ink-900 mt-1">{score.exam}%</div>
        </div>
        <div className="bg-ink-900 text-white p-2.5 rounded border border-ink-900 col-span-2 md:col-span-1">
          <div className="text-paper-400 text-[10px]">OVERALL</div>
          <div className="text-sm font-bold mt-1 text-paper-50">{score.overall}%</div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1">
        {criteria.map((crit, idx) => {
          const checked = completedList.includes(crit);
          return (
            <button
              key={idx}
              onClick={() => onToggleCriterion(crit)}
              className={`w-full text-left p-2.5 rounded text-xs font-mono-code border transition-all flex items-center gap-3 ${
                checked
                  ? 'bg-white border-green-300 text-green-950 font-medium'
                  : 'bg-paper-100 border-line-border text-ink-700 hover:bg-white'
              }`}
            >
              {checked ? (
                <CheckSquare className="w-4 h-4 text-green-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-ink-400 shrink-0" />
              )}
              <span>{crit}</span>
            </button>
          );
        })}
      </div>

      {/* Final unlock button */}
      <div className="border-t border-line-border pt-3 flex items-center justify-between">
        <span className="text-xs text-ink-600 font-mono-code">
          {allChecked ? 'All competencies verified by student.' : 'Complete and verify all checkboxes above.'}
        </span>

        <button
          onClick={onConfirmMastery}
          disabled={!allChecked}
          className="px-4 py-2 text-xs font-mono-code font-bold bg-terracotta text-white rounded hover:bg-terracotta-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Award className="w-4 h-4" />
          {isMastered ? 'UPDATE MASTERY RECORD' : 'CERTIFY CONCEPT AS MASTERED'}
        </button>
      </div>
    </div>
  );
};
