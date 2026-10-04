import React from 'react';
import { ConceptDetail } from '../../types/curriculum';
import { StudentProfile } from '../../types/learning';
import { allConceptsList } from '../../data/ktu-s5-cse';
import { Play, ArrowRight, Compass, ShieldAlert, Sparkles, Flame, Calendar, BookOpen } from 'lucide-react';

interface LearningDeskProps {
  profile: StudentProfile;
  currentConcept: ConceptDetail;
  onContinueLearning: () => void;
  onSelectConcept: (conceptId: string) => void;
  onOpenExplorer: () => void;
  onOpenExam: () => void;
}

export const LearningDesk: React.FC<LearningDeskProps> = ({
  profile,
  currentConcept,
  onContinueLearning,
  onSelectConcept,
  onOpenExplorer,
  onOpenExam
}) => {
  // Compute subtle mastery metrics
  const masteredCount = Object.values(profile.progressMap).filter(p => p.state === 'MASTERED').length;
  const inProgressCount = Object.values(profile.progressMap).filter(p => p.state === 'INTRODUCED' || p.state === 'UNDERSTOOD' || p.state === 'APPLIED').length;
  const needsRevisionCount = Object.values(profile.progressMap).filter(p => p.state === 'NEEDS_REVISION').length;

  // The knowledge path for current concept
  const knowledgePath = [
    { title: currentConcept.subjectTitle, type: 'subject' },
    { title: currentConcept.moduleTitle.split(':')[0], type: 'module' },
    { title: currentConcept.title, type: 'concept', isCurrent: true },
    { title: currentConcept.unlocks[0]?.title || 'Next Concept', type: 'unlocked' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 font-sans">
      {/* Student Welcome Note */}
      <div className="space-y-2 border-b border-line-border pb-6">
        <div className="flex items-center justify-between text-xs font-mono-code text-ink-500">
          <span>RESEARCH STATION // DESK OF {profile.name.toUpperCase()}</span>
          <span>{profile.university} · {profile.branch} {profile.semester} ({profile.scheme})</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif-heading font-bold text-ink-900 tracking-tight">
          Good evening, {profile.name}.
        </h1>
        <p className="text-sm text-ink-700 font-serif italic">
          Ready to resume your active experiment in computer science?
        </p>
      </div>

      {/* Focus Station: Continue where you stopped */}
      <div className="bg-white border border-line-border rounded p-6 shadow-notebook space-y-5 paper-grid">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
          <span className="text-xs uppercase tracking-wider font-mono-code text-terracotta font-semibold">
            CONTINUE WHERE YOU STOPPED
          </span>
          <span className="text-xs font-mono-code text-ink-500">
            Estimated ~{currentConcept.estimatedMinutes} min remaining
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono-code text-ink-500 uppercase">
            {currentConcept.subjectTitle} // {currentConcept.moduleTitle}
          </div>
          <h2 className="text-2xl md:text-3xl font-serif-heading font-bold text-ink-900">
            {currentConcept.title}
          </h2>
          <p className="text-xs text-ink-700 leading-relaxed max-w-2xl font-sans">
            {currentConcept.idea.simpleExplanation}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onContinueLearning}
            className="px-5 py-2.5 bg-ink-900 text-white rounded text-xs font-mono-code font-bold hover:bg-ink-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            RESUME INTERACTIVE CHAPTER
          </button>

          <button
            onClick={onOpenExplorer}
            className="px-4 py-2.5 bg-paper-200 text-ink-800 rounded text-xs font-mono-code border border-line-border hover:bg-paper-300 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            BROWSE FULL SYLLABUS
          </button>
        </div>
      </div>

      {/* Visual Knowledge Path */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono-code uppercase tracking-wider text-ink-500 font-semibold">
            CURRENT KNOWLEDGE TRAJECTORY
          </h3>
          <span className="text-[11px] font-mono-code text-ink-500">
            Nonlinear Conceptual Flow
          </span>
        </div>

        <div className="bg-white border border-line-border p-4 rounded shadow-notebook">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono-code">
            {knowledgePath.map((step, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`p-3 rounded border w-full md:w-auto text-center md:text-left transition-all ${
                    step.isCurrent
                      ? 'border-terracotta bg-terracotta/5 text-ink-900 font-bold shadow-sm'
                      : 'border-line-border bg-paper-50 text-ink-700'
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-widest text-ink-400 mb-0.5">
                    {step.type}
                  </div>
                  <div className="text-xs truncate max-w-[180px]">
                    {step.title}
                  </div>
                </div>

                {idx < knowledgePath.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-ink-400 shrink-0 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Representative Concepts Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono-code uppercase tracking-wider text-ink-500 font-semibold">
            REPRESENTATIVE INTERACTIVE LABORATORIES
          </h3>
          <span className="text-[11px] font-mono-code text-ink-500">
            Select any concept to enter lab
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {allConceptsList.map((c) => {
            const isSelected = c.id === currentConcept.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectConcept(c.id)}
                className={`text-left p-4 rounded border transition-all space-y-2 ${
                  isSelected
                    ? 'bg-white border-terracotta shadow-notebook ring-1 ring-terracotta/20'
                    : 'bg-white border-line-border hover:bg-paper-50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono-code">
                  <span className="text-terracotta font-semibold uppercase">{c.category}</span>
                  <span className="text-ink-500">{c.estimatedMinutes}m</span>
                </div>
                <h4 className="text-sm font-bold text-ink-900 font-serif-heading leading-snug">
                  {c.title}
                </h4>
                <div className="text-[11px] text-ink-600 line-clamp-2 font-sans">
                  {c.idea.intuitionSummary}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtle Knowledge & Desk Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-mono-code">
        <div className="bg-paper-50 p-3 rounded border border-line-border">
          <div className="text-ink-500 text-[10px] uppercase">CONCEPTS MASTERED</div>
          <div className="text-xl font-bold text-ink-900 mt-1">{masteredCount} verified</div>
        </div>

        <div className="bg-paper-50 p-3 rounded border border-line-border">
          <div className="text-ink-500 text-[10px] uppercase">IN PROGRESS</div>
          <div className="text-xl font-bold text-ink-900 mt-1">{inProgressCount} active</div>
        </div>

        <div className="bg-paper-50 p-3 rounded border border-line-border">
          <div className="text-ink-500 text-[10px] uppercase">LEARNING STREAK</div>
          <div className="text-xl font-bold text-terracotta mt-1 flex items-center gap-1">
            <Flame className="w-4 h-4" /> {profile.streakDays} days
          </div>
        </div>

        <div className="bg-paper-50 p-3 rounded border border-line-border">
          <div className="text-ink-500 text-[10px] uppercase">KTU S5 EXAM TARGET</div>
          <div className="text-xl font-bold text-ink-900 mt-1 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-ink-500" /> Dec 2026
          </div>
        </div>
      </div>
    </div>
  );
};
