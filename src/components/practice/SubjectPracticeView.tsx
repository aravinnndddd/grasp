import React, { useState, useEffect } from 'react';
import { ktuS5CseCurriculum, allConceptsList, conceptMap } from '../../data/ktu-s5-cse';
import { moduleNotesDatabase, SubjectNotes } from '../../data/notes/module-notes-db';
import { PracticeProblem } from '../../types/curriculum';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Target, 
  Zap, 
  BookOpen, 
  Award, 
  Layers, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface SubjectPracticeViewProps {
  currentSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  onOpenNotes?: () => void;
  onOpenExam?: () => void;
}

// Subject ID normalization map
const SUBJECT_ID_MAP: Record<string, string> = {
  'cst-305-ml': 'pccst503',
  'cst-303-cn': 'pccst501',
  'cst-306-daa': 'pccst502',
  'cst-308-ai': 'pecst522',
  'cst-307-mpmc': 'pbcst504',
  'cst-301-flat': 'pccst501-flat'
};

export const SubjectPracticeView: React.FC<SubjectPracticeViewProps> = ({
  currentSubjectId,
  onSelectSubject,
  onOpenNotes,
  onOpenExam
}) => {
  const normalizedId = SUBJECT_ID_MAP[currentSubjectId] || currentSubjectId;
  const activeSubject = ktuS5CseCurriculum.subjects.find(
    s => s.id === currentSubjectId || s.id === normalizedId || s.code.toLowerCase() === normalizedId.toLowerCase()
  ) || ktuS5CseCurriculum.subjects[0];

  const currentSubjectNotes: SubjectNotes = 
    moduleNotesDatabase[normalizedId] || 
    moduleNotesDatabase[currentSubjectId] || 
    moduleNotesDatabase['pccst501'];

  // Practice Mode: Ladder Drills vs Step-by-Step Problems
  const [practiceTab, setPracticeTab] = useState<'ladder' | 'problems'>('ladder');
  const [selectedModuleNum, setSelectedModuleNum] = useState<number>(0); // 0 = all

  // Concept resolution for interactive ladder
  const subjectConcepts = allConceptsList.filter(
    c => c.subjectId === currentSubjectId || c.subjectId === normalizedId || c.subjectTitle.toLowerCase().includes(activeSubject.title.toLowerCase().split(' ')[0])
  );
  const activeConcept = subjectConcepts[0] || allConceptsList[0];

  // State for Ladder Problems
  const ladderProblems: PracticeProblem[] = activeConcept?.practiceProblems || [];
  const [activeProblemIdx, setActiveProblemIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [solvedScore, setSolvedScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // State for Step-by-step problems reveal
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // Reset active problem index when subject changes
  useEffect(() => {
    setActiveProblemIdx(0);
    setSelectedAnswers({});
    setRevealedAnswers({});
    setSolvedScore({ correct: 0, total: 0 });
    setRevealedSolutions({});
  }, [currentSubjectId]);

  const currentProblem = ladderProblems[activeProblemIdx] || ladderProblems[0];

  const handleSelectOption = (problemId: string, optionId: string) => {
    if (revealedAnswers[problemId]) return; // already answered

    setSelectedAnswers(prev => ({ ...prev, [problemId]: optionId }));
    setRevealedAnswers(prev => ({ ...prev, [problemId]: true }));

    const opt = currentProblem?.options?.find(o => o.id === optionId);
    setSolvedScore(prev => ({
      correct: prev.correct + (opt?.isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleResetLadder = () => {
    setSelectedAnswers({});
    setRevealedAnswers({});
    setSolvedScore({ correct: 0, total: 0 });
    setActiveProblemIdx(0);
  };

  const toggleSolution = (key: string) => {
    setRevealedSolutions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Compile subject-specific worked problems from all modules
  const allModulesList = Object.values(currentSubjectNotes.modules || {});
  const filteredModules = selectedModuleNum === 0 
    ? allModulesList 
    : allModulesList.filter(m => m.moduleNum === selectedModuleNum);

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 font-sans">
      {/* Top Header Card */}
      <div className="bg-white border border-line-border rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-border pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-terracotta text-white font-mono-code font-bold text-[10px] uppercase rounded">
              PRACTICE ARENA
            </span>
            <span className="text-xs font-mono-code text-ink-500 font-semibold">
              KTU 2024 Scheme // {activeSubject.code}
            </span>
          </div>

          {/* Quick Subject Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code text-ink-500 hidden sm:inline">Subject:</span>
            <select
              value={currentSubjectId}
              onChange={(e) => onSelectSubject(e.target.value)}
              className="bg-paper-100 border border-line-border rounded px-2.5 py-1 text-xs font-mono-code font-bold text-ink-900 cursor-pointer hover:border-terracotta transition-colors"
            >
              {ktuS5CseCurriculum.subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code}: {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-ink-900">
              {activeSubject.title}
            </h1>
            <p className="text-xs text-ink-600 font-sans mt-1 max-w-2xl leading-relaxed">
              Targeted problem-solving drills, 7-level progressive concept ladder, and analytical exercises tailored to university exam patterns.
            </p>
          </div>

          {/* Score Badge */}
          {ladderProblems.length > 0 && (
            <div className="bg-paper-100 border border-line-border px-3.5 py-2 rounded-md flex items-center gap-3 text-xs font-mono-code">
              <div>
                <span className="text-[10px] text-ink-500 block uppercase font-medium">Drill Score</span>
                <span className="font-bold text-sm text-ink-900">
                  {solvedScore.correct} / {ladderProblems.length} Correct
                </span>
              </div>
              <button
                onClick={handleResetLadder}
                className="p-1.5 text-ink-500 hover:text-terracotta hover:bg-paper-200 rounded transition-colors"
                title="Reset drill progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Practice Mode Switcher & Module Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPracticeTab('ladder')}
              className={`px-3 py-1.5 text-xs font-mono-code rounded font-bold transition-all flex items-center gap-1.5 ${
                practiceTab === 'ladder'
                  ? 'bg-ink-900 text-white shadow-xs'
                  : 'bg-paper-200 text-ink-700 hover:bg-paper-300'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-terracotta" />
              <span>7-Level Concept Ladder</span>
            </button>
            <button
              onClick={() => setPracticeTab('problems')}
              className={`px-3 py-1.5 text-xs font-mono-code rounded font-bold transition-all flex items-center gap-1.5 ${
                practiceTab === 'problems'
                  ? 'bg-ink-900 text-white shadow-xs'
                  : 'bg-paper-200 text-ink-700 hover:bg-paper-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-accent-blue" />
              <span>Module Problem Solving</span>
            </button>
          </div>

          {/* Module Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono-code">
            <span className="text-ink-400 text-[11px] hidden sm:inline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Module:
            </span>
            <button
              onClick={() => setSelectedModuleNum(0)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono-code transition-colors ${
                selectedModuleNum === 0
                  ? 'bg-terracotta text-white font-bold'
                  : 'bg-paper-200 text-ink-700 hover:bg-paper-300'
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => setSelectedModuleNum(num)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-code transition-colors ${
                  selectedModuleNum === num
                    ? 'bg-terracotta text-white font-bold'
                    : 'bg-paper-200 text-ink-700 hover:bg-paper-300'
                }`}
              >
                M{num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: 7-Level Progressive Concept Ladder */}
      {practiceTab === 'ladder' && (
        <div className="space-y-4">
          {ladderProblems.length > 0 ? (
            <div className="bg-white border border-line-border rounded-lg p-5 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-terracotta">
                    PROGRESSIVE DIFFICULTY LADDER // {activeConcept.title}
                  </span>
                  <div className="text-xs text-ink-500 font-mono-code">
                    Level {activeProblemIdx + 1} of {ladderProblems.length} — {currentProblem?.levelLabel}
                  </div>
                </div>

                {/* Level jump buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ladderProblems.map((prob, idx) => {
                    const isAnswered = revealedAnswers[prob.id];
                    const selectedOptId = selectedAnswers[prob.id];
                    const chosenOpt = prob.options?.find(o => o.id === selectedOptId);
                    const isCurrent = activeProblemIdx === idx;

                    return (
                      <button
                        key={prob.id}
                        onClick={() => setActiveProblemIdx(idx)}
                        className={`px-2.5 py-1 text-xs font-mono-code rounded border transition-all flex items-center gap-1 ${
                          isCurrent
                            ? 'bg-ink-900 text-white font-bold ring-2 ring-terracotta/40'
                            : isAnswered
                            ? chosenOpt?.isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-red-50 border-red-300 text-red-800'
                            : 'bg-paper-100 border-line-border text-ink-700 hover:bg-paper-200'
                        }`}
                      >
                        <span>L{idx + 1}</span>
                        {isAnswered && (
                          <span className={chosenOpt?.isCorrect ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                            {chosenOpt?.isCorrect ? '✓' : '✕'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problem Prompt */}
              {currentProblem && (
                <div className="space-y-4">
                  <div className="bg-paper-50 border border-line-border p-4 rounded-md">
                    <div className="text-xs font-mono-code font-bold text-terracotta uppercase mb-1">
                      {currentProblem.levelLabel}
                    </div>
                    <p className="text-sm sm:text-base font-medium text-ink-900 font-sans leading-relaxed">
                      {currentProblem.question}
                    </p>
                  </div>

                  {/* Options */}
                  {currentProblem.options && currentProblem.options.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-mono-code text-ink-500 uppercase font-semibold">
                        SELECT BEST ENGINEERING ANSWER:
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {currentProblem.options.map((opt) => {
                          const isSelected = selectedAnswers[currentProblem.id] === opt.id;
                          const isRevealed = revealedAnswers[currentProblem.id];

                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectOption(currentProblem.id, opt.id)}
                              disabled={isRevealed}
                              className={`w-full text-left p-3.5 rounded-md border text-xs font-mono-code transition-all flex items-start gap-3 ${
                                isSelected
                                  ? opt.isCorrect
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs'
                                    : 'bg-red-50 border-red-500 text-red-950 font-semibold shadow-xs'
                                  : isRevealed && opt.isCorrect
                                  ? 'bg-emerald-50/70 border-emerald-400 text-emerald-900 font-semibold'
                                  : 'bg-white border-line-border text-ink-800 hover:bg-paper-100 hover:border-ink-400'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {isSelected ? (
                                  opt.isCorrect ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  )
                                ) : isRevealed && opt.isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-ink-400 flex items-center justify-center text-[10px] text-ink-500">
                                    {opt.id.toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <span className="flex-1 leading-relaxed">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Explanation Card when answered */}
                  {revealedAnswers[currentProblem.id] && (
                    <div className="p-4 rounded-md border bg-paper-100 border-line-border animate-fade-in space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-ink-900">
                        <HelpCircle className="w-4 h-4 text-terracotta" />
                        <span>ENGINEERING RATIONALE &amp; EXPLANATION</span>
                      </div>
                      <p className="text-xs text-ink-800 font-sans leading-relaxed">
                        {currentProblem.correctExplanation}
                      </p>
                    </div>
                  )}

                  {/* Navigation Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-line-border">
                    <button
                      onClick={() => setActiveProblemIdx(prev => Math.max(0, prev - 1))}
                      disabled={activeProblemIdx === 0}
                      className="px-3 py-1.5 text-xs font-mono-code text-ink-700 hover:bg-paper-200 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Previous Level
                    </button>

                    <button
                      onClick={() => setActiveProblemIdx(prev => Math.min(ladderProblems.length - 1, prev + 1))}
                      disabled={activeProblemIdx === ladderProblems.length - 1}
                      className="px-4 py-1.5 text-xs font-mono-code font-bold bg-ink-900 text-white hover:bg-black rounded flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                    >
                      <span>Next Level</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-line-border rounded-lg p-8 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-terracotta mx-auto opacity-70" />
              <h3 className="text-base font-bold font-serif-heading text-ink-900">
                Interactive Ladder In Preparation for {activeSubject.code}
              </h3>
              <p className="text-xs text-ink-600 max-w-md mx-auto font-sans leading-relaxed">
                Use the "Module Problem Solving" tab below to practice 3-mark, 5-mark, and 8-mark numericals and derivations directly from the official syllabus!
              </p>
              <button
                onClick={() => setPracticeTab('problems')}
                className="px-4 py-2 bg-ink-900 text-white text-xs font-mono-code font-bold rounded hover:bg-black transition-colors"
              >
                Switch to Module Problem Solving
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Module Problem Solving & Derivations */}
      {practiceTab === 'problems' && (
        <div className="space-y-4">
          {filteredModules.map(mod => (
            <div key={mod.moduleNum} className="bg-white border border-line-border rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-2.5">
                <div>
                  <span className="text-[10px] font-mono-code font-bold uppercase text-terracotta">
                    MODULE {mod.moduleNum} PRACTICE SET
                  </span>
                  <h3 className="text-base font-serif-heading font-bold text-ink-900">
                    {mod.title}
                  </h3>
                </div>
                <span className="text-xs font-mono-code text-ink-500">
                  {mod.questions5Mark.length + mod.questions8Mark.length} Practice Exercises
                </span>
              </div>

              {/* 5-Mark & 8-Mark Analytical Practice Problems */}
              <div className="space-y-3">
                {mod.questions5Mark.map((q, idx) => {
                  const key = `m${mod.moduleNum}-5m-${idx}`;
                  const isRevealed = revealedSolutions[key];

                  return (
                    <div key={key} className="border border-line-border rounded-md p-3.5 bg-paper-50 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-accent-blue/10 text-accent-blue font-mono-code font-bold text-[10px] rounded uppercase">
                            5-Mark Practice Problem #{idx + 1}
                          </span>
                          <h4 className="text-xs sm:text-sm font-semibold text-ink-900 leading-snug">
                            {q.question}
                          </h4>
                        </div>
                        <button
                          onClick={() => toggleSolution(key)}
                          className={`shrink-0 px-2.5 py-1 text-xs font-mono-code font-semibold rounded border transition-colors ${
                            isRevealed
                              ? 'bg-paper-200 text-ink-800 border-line-border'
                              : 'bg-white text-terracotta border-terracotta/40 hover:bg-terracotta hover:text-white'
                          }`}
                        >
                          {isRevealed ? 'Hide Solution' : 'Reveal Solution'}
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="pt-2 border-t border-line-border/60 text-xs text-ink-800 font-sans leading-relaxed bg-white p-3 rounded border border-line-border/40 whitespace-pre-wrap">
                          {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })}

                {mod.questions8Mark.map((q, idx) => {
                  const key = `m${mod.moduleNum}-8m-${idx}`;
                  const isRevealed = revealedSolutions[key];

                  return (
                    <div key={key} className="border border-line-border rounded-md p-3.5 bg-paper-50 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-800 font-mono-code font-bold text-[10px] rounded uppercase">
                            8-Mark / 14-Mark Deep Exercise #{idx + 1}
                          </span>
                          <h4 className="text-xs sm:text-sm font-semibold text-ink-900 leading-snug">
                            {q.question}
                          </h4>
                        </div>
                        <button
                          onClick={() => toggleSolution(key)}
                          className={`shrink-0 px-2.5 py-1 text-xs font-mono-code font-semibold rounded border transition-colors ${
                            isRevealed
                              ? 'bg-paper-200 text-ink-800 border-line-border'
                              : 'bg-white text-terracotta border-terracotta/40 hover:bg-terracotta hover:text-white'
                          }`}
                        >
                          {isRevealed ? 'Hide Solution' : 'Reveal Solution'}
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="pt-2 border-t border-line-border/60 text-xs text-ink-800 font-sans leading-relaxed bg-white p-3 rounded border border-line-border/40 whitespace-pre-wrap">
                          {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Quick Links to Notes & Exam */}
      <div className="bg-paper-100 border border-line-border rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
        <div className="text-ink-600">
          Want to study full conceptual explanations or test university blueprints?
        </div>
        <div className="flex items-center gap-2">
          {onOpenNotes && (
            <button
              onClick={onOpenNotes}
              className="px-3 py-1.5 bg-white border border-line-border hover:border-terracotta text-ink-900 font-semibold rounded transition-colors"
            >
              Open Module Notes
            </button>
          )}
          {onOpenExam && (
            <button
              onClick={onOpenExam}
              className="px-3 py-1.5 bg-ink-900 hover:bg-black text-white font-bold rounded transition-colors"
            >
              KTU Exam Blueprints
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
