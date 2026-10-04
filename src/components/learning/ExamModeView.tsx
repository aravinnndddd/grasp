import React, { useState } from 'react';
import { ConceptDetail, ExamAnswerItem } from '../../types/curriculum';
import { Award, BookOpen, AlertOctagon, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const ExamModeView: React.FC<{ concept: ConceptDetail }> = ({ concept }) => {
  const [selectedMark, setSelectedMark] = useState<2 | 5 | 10>(5);
  const currentAnswer = concept.examMode.answers.find(a => a.marks === selectedMark) || concept.examMode.answers[0];

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono-code text-terracotta font-semibold">
            KTU EXAM WORKSTATION // {concept.examMode.ktuSubjectCode}
          </div>
          <h4 className="text-base font-semibold text-ink-900 font-serif-heading">
            Official University Marking Rubric & Model Answers
          </h4>
        </div>

        <div className="flex items-center gap-1.5 bg-paper-200 p-1 rounded border border-line-border">
          {([2, 5, 10] as const).map(m => (
            <button
              key={m}
              onClick={() => setSelectedMark(m)}
              className={`px-3 py-1 rounded text-xs font-mono-code transition-all ${
                selectedMark === m
                  ? 'bg-ink-900 text-white font-bold shadow-sm'
                  : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              {m} MARKS
            </button>
          ))}
        </div>
      </div>

      {/* Official KTU Definition Box */}
      <div className="bg-white border-l-4 border-l-ink-900 border-y border-r border-line-border p-3.5 rounded-r shadow-notebook">
        <div className="text-[11px] font-mono-code text-ink-500 uppercase font-semibold">
          CANONICAL EXAM DEFINITION (Word-for-word KTU Syllabus)
        </div>
        <p className="text-xs text-ink-900 font-serif italic mt-1 leading-relaxed">
          "{concept.examMode.examDefinition}"
        </p>
      </div>

      {/* Selected Model Answer Card */}
      {currentAnswer && (
        <div className="bg-white border border-line-border rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-line-border pb-2">
            <span className="text-xs font-mono-code font-bold text-ink-900">
              Q: {currentAnswer.question}
            </span>
            <span className="text-xs font-mono-code bg-terracotta/10 text-terracotta px-2 py-0.5 rounded font-semibold">
              Weightage: {currentAnswer.marks} Marks
            </span>
          </div>

          <div className="bg-paper-100 p-3 rounded border border-line-border whitespace-pre-wrap font-sans text-xs text-ink-800 leading-relaxed">
            {currentAnswer.modelAnswer}
          </div>

          {currentAnswer.diagramDescription && (
            <div className="bg-paper-50 p-2.5 rounded border border-line-border text-xs flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-lab-accent shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono-code text-ink-900">Mandatory Diagram Checklist: </strong>
                <span className="text-ink-700">{currentAnswer.diagramDescription}</span>
              </div>
            </div>
          )}

          {/* Key points expected by evaluators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-green-50/70 border border-green-200 p-3 rounded text-xs space-y-1.5">
              <div className="font-mono-code text-green-900 font-bold text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                POINTS EXPECTED BY KTU EVALUATORS:
              </div>
              <ul className="space-y-1 text-green-950 font-sans pl-1">
                {currentAnswer.keyPointsExpected.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-green-600 font-mono-code">✓</span> {pt}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/70 border border-red-200 p-3 rounded text-xs space-y-1.5">
              <div className="font-mono-code text-red-900 font-bold text-[11px] flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-700" />
                COMMON STUDENT MARK DEDUCTIONS:
              </div>
              <ul className="space-y-1 text-red-950 font-sans pl-1">
                {currentAnswer.commonDeductions.map((ded, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-500 font-mono-code">✕</span> {ded}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Historical KTU Question Paper Archive */}
      {concept.examMode.frequentYearQuestions.length > 0 && (
        <div className="border-t border-line-border pt-3">
          <div className="text-[11px] font-mono-code text-ink-500 uppercase mb-2">
            FREQUENTLY REPEATED KTU QUESTIONS FROM PREVIOUS SCHEMES:
          </div>
          <div className="space-y-1.5">
            {concept.examMode.frequentYearQuestions.map((q, i) => (
              <div key={i} className="text-xs font-mono-code text-ink-800 bg-paper-200 p-2 rounded border border-line-border">
                {q}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
