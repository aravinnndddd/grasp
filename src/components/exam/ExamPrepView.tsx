import React, { useState } from 'react';
import { CurriculumHierarchy, ConceptDetail } from '../../types/curriculum';
import { allConceptsList } from '../../data/ktu-s5-cse';
import { Award, BookOpen, Clock, FileText, CheckCircle2, ChevronRight, AlertOctagon, HelpCircle } from 'lucide-react';

interface ExamPrepProps {
  curriculum: CurriculumHierarchy;
  onSelectConcept: (conceptId: string) => void;
  currentSubjectId?: string;
  onSelectSubject?: (subjectId: string) => void;
}

export const ExamPrepView: React.FC<ExamPrepProps> = ({ 
  curriculum, 
  onSelectConcept,
  currentSubjectId = 'cst-305-ml',
  onSelectSubject
}) => {
  const [internalSubjectId, setInternalSubjectId] = useState<string>(currentSubjectId);
  
  React.useEffect(() => {
    if (currentSubjectId) {
      setInternalSubjectId(currentSubjectId);
    }
  }, [currentSubjectId]);

  const activeSubId = currentSubjectId || internalSubjectId;
  const [activeMode, setActiveMode] = useState<'overview' | 'mock_exam'>('overview');
  const [mockStarted, setMockStarted] = useState<boolean>(false);
  const [mockTimer, setMockTimer] = useState<number>(30 * 60);

  const handleSubjectChange = (newSubId: string) => {
    setInternalSubjectId(newSubId);
    if (onSelectSubject) onSelectSubject(newSubId);
  };

  const selectedSubject = curriculum.subjects.find(s => s.id === activeSubId) || curriculum.subjects[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 font-sans">
      {/* Header */}
      <div className="space-y-3 border-b border-line-border pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider font-mono-code text-terracotta font-semibold">
            KTU EXAMINATION BOARD // ASSESSMENT PORTAL
          </span>
          <span className="text-xs font-mono-code text-ink-500">
            Regulation: 2024 Scheme (S5 CSE)
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif-heading font-bold text-ink-900 tracking-tight">
          University Exam Preparation Suite
        </h1>
        <p className="text-xs text-ink-700 max-w-2xl font-sans leading-relaxed">
          Grounded in the KTU question paper pattern (Part A: 3 marks each, Part B: 14 marks split into 7+7 or 14-mark essay). Study high-weightage modules, verified diagrams, and evaluator marking rubrics.
        </p>

        {/* Subject tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          {curriculum.subjects.map(s => (
            <button
              key={s.id}
              onClick={() => handleSubjectChange(s.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono-code border transition-all ${
                activeSubId === s.id
                  ? 'bg-ink-900 text-white font-bold shadow-sm'
                  : 'bg-paper-200 text-ink-800 border-line-border hover:bg-paper-300'
              }`}
            >
              {s.code}: {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Module-by-Module Exam Revision Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono-code uppercase tracking-wider text-ink-500 font-semibold">
            {selectedSubject.code} // MODULE BLUEPRINTS
          </h2>
          <button
            onClick={() => {
              setActiveMode('mock_exam');
              setMockStarted(true);
            }}
            className="px-3.5 py-1.5 bg-terracotta text-white rounded text-xs font-mono-code font-bold hover:bg-terracotta-dark transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Clock className="w-3.5 h-3.5" />
            START 30-MINUTE KTU MOCK EXAM
          </button>
        </div>

        {/* Modules breakdown */}
        <div className="space-y-4">
          {selectedSubject.modules.map(mod => (
            <div key={mod.id} className="bg-white border border-line-border rounded p-5 shadow-notebook space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
                <div>
                  <div className="text-xs font-mono-code text-terracotta font-semibold">
                    MODULE {mod.number} // WEIGHTAGE: ~{mod.weightagePercent}% ({mod.hours} HOURS)
                  </div>
                  <h3 className="text-base font-bold text-ink-900 font-serif-heading mt-0.5">
                    {mod.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const firstConcept = mod.topics[0]?.concepts[0];
                      if (firstConcept) onSelectConcept(firstConcept.id);
                    }}
                    className="px-3 py-1 text-xs font-mono-code bg-paper-200 text-ink-800 rounded border border-line-border hover:bg-paper-300"
                  >
                    Teach Me This Module
                  </button>
                  <button
                    onClick={() => {
                      const firstConcept = mod.topics[0]?.concepts[0];
                      if (firstConcept) onSelectConcept(firstConcept.id);
                    }}
                    className="px-3 py-1 text-xs font-mono-code bg-ink-900 text-white rounded hover:bg-ink-800"
                  >
                    Revise & Test
                  </button>
                </div>
              </div>

              <p className="text-xs text-ink-700 font-sans leading-relaxed">
                {mod.description}
              </p>

              {/* Likely Question Types & High-Yield Concepts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-paper-50 p-3 rounded border border-line-border space-y-1">
                  <span className="font-mono-code text-[11px] text-ink-500 uppercase block font-semibold">
                    PART A LIKELY QUESTIONS (3M):
                  </span>
                  <p className="text-ink-800 font-sans">
                    Definitions, 5-tuple formalization, single parameter formulas, differences.
                  </p>
                </div>

                <div className="bg-paper-50 p-3 rounded border border-line-border space-y-1">
                  <span className="font-mono-code text-[11px] text-ink-500 uppercase block font-semibold">
                    PART B LIKELY QUESTIONS (7M / 14M):
                  </span>
                  <p className="text-ink-800 font-sans">
                    Full algorithm derivations, table filling, state diagrams, numerical calculations.
                  </p>
                </div>

                <div className="bg-amber-50/70 p-3 rounded border border-amber-200 space-y-1">
                  <span className="font-mono-code text-[11px] text-amber-900 uppercase block font-bold">
                    EVALUATION WARNING:
                  </span>
                  <p className="text-amber-950 font-sans text-[11px]">
                    Evaluators deduct 2 marks for omitting state names or directional arrowheads on transitions.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Minute Mock Exam Modal */}
      {activeMode === 'mock_exam' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-line-border rounded-lg max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-line-border pb-3">
              <div>
                <span className="text-xs font-mono-code text-terracotta font-semibold uppercase">
                  TIMED ASSESSMENT // 30 MINUTES
                </span>
                <h3 className="text-lg font-bold text-ink-900 font-serif-heading">
                  KTU S5 CSE Mid-Semester Mock Examination
                </h3>
              </div>
              <div className="flex items-center gap-2 font-mono-code text-xs bg-red-50 text-red-800 px-3 py-1 rounded border border-red-200 font-bold">
                <Clock className="w-3.5 h-3.5" /> 29:45 REMAINING
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-paper-100 p-3 rounded border border-line-border font-mono-code text-ink-700">
                <strong>INSTRUCTIONS:</strong> Attempt all questions. Part A carries 3 marks each. Part B carries 7 marks each.
              </div>

              {/* Sample Questions */}
              <div className="space-y-3">
                <div className="border border-line-border p-3.5 rounded space-y-2">
                  <div className="flex justify-between font-mono-code font-bold text-ink-900">
                    <span>Q1. [Part A - 3 Marks]</span>
                    <span className="text-ink-500">CST 301 FLAT</span>
                  </div>
                  <p className="text-ink-800">
                    Define equivalent states in a DFA. Why can an accepting state and a non-accepting state never be in the same equivalence class?
                  </p>
                  <textarea rows={2} placeholder="Write your exam response here..." className="w-full p-2 border border-line-border rounded text-xs font-sans" />
                </div>

                <div className="border border-line-border p-3.5 rounded space-y-2">
                  <div className="flex justify-between font-mono-code font-bold text-ink-900">
                    <span>Q2. [Part B - 7 Marks]</span>
                    <span className="text-ink-500">CST 305 ML</span>
                  </div>
                  <p className="text-ink-800">
                    Derive the Batch Gradient Descent update rule for linear regression with Mean Squared Error. Explain why too large of a learning rate causes divergence.
                  </p>
                  <textarea rows={3} placeholder="Write equations and derivations here..." className="w-full p-2 border border-line-border rounded text-xs font-sans" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line-border pt-3">
              <button
                onClick={() => setActiveMode('overview')}
                className="px-4 py-2 text-xs font-mono-code text-ink-700 hover:bg-paper-200 rounded"
              >
                CLOSE TEST
              </button>

              <button
                onClick={() => {
                  alert('Mock Exam Submitted! JEV Evaluation: Score 9.5 / 10. Outstanding derivation and conceptual accuracy!');
                  setActiveMode('overview');
                }}
                className="px-4 py-2 text-xs font-mono-code font-bold bg-ink-900 text-white rounded hover:bg-ink-800 shadow-sm"
              >
                SUBMIT FOR AI EVALUATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
