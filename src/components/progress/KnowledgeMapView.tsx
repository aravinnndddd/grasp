import React from 'react';
import { StudentProfile } from '../../types/learning';
import { allConceptsList } from '../../data/ktu-s5-cse';
import { Award, Compass, ShieldCheck, Flame, GitFork, ArrowRight, Zap } from 'lucide-react';

import { ktuS5CseCurriculum } from '../../data/ktu-s5-cse';

interface KnowledgeMapProps {
  profile: StudentProfile;
  onSelectConcept: (conceptId: string) => void;
  currentSubjectId?: string;
  onSelectSubject?: (subjectId: string) => void;
}

export const KnowledgeMapView: React.FC<KnowledgeMapProps> = ({ 
  profile, 
  onSelectConcept,
  currentSubjectId,
  onSelectSubject
}) => {
  const [selectedSubFilter, setSelectedSubFilter] = React.useState<string>(currentSubjectId || 'ALL');

  const handleSubFilter = (subId: string) => {
    setSelectedSubFilter(subId);
    if (subId !== 'ALL' && onSelectSubject) {
      onSelectSubject(subId);
    }
  };

  const stateColor: Record<string, string> = {
    MASTERED: 'bg-green-100 border-green-500 text-green-950 font-bold',
    APPLIED: 'bg-blue-100 border-blue-500 text-blue-950 font-semibold',
    UNDERSTOOD: 'bg-amber-100 border-amber-500 text-amber-950',
    INTRODUCED: 'bg-paper-200 border-line-border text-ink-700',
    UNKNOWN: 'bg-paper-100 border-dashed border-line-border text-ink-400',
    NEEDS_REVISION: 'bg-red-100 border-red-400 text-red-900 font-semibold'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 font-sans">
      {/* Header */}
      <div className="space-y-3 border-b border-line-border pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
            KNOWLEDGE GRAPH // MASTERY STATE MAP
          </span>
          <span className="text-xs font-mono-code text-terracotta font-semibold">
            7-STAGE CONCEPTUAL PROGRESSION
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif-heading font-bold text-ink-900 tracking-tight">
          Student Knowledge Network
        </h1>
        <p className="text-xs text-ink-700 max-w-2xl font-sans leading-relaxed">
          Knowledge is not a flat percentage bar. Concepts connect into an evolving dependency graph. As you experiment, break, and predict, states evolve from INTRODUCED to MASTERED.
        </p>
      </div>

      {/* State Legend */}
      <div className="bg-white border border-line-border p-3.5 rounded shadow-notebook flex flex-wrap items-center gap-3 text-xs font-mono-code">
        <span className="text-ink-500 text-[11px] uppercase font-semibold">STATE LEGEND:</span>
        <span className="px-2 py-0.5 rounded border bg-paper-100 border-dashed border-line-border text-ink-400">UNKNOWN</span>
        <span className="px-2 py-0.5 rounded border bg-paper-200 border-line-border text-ink-700">INTRODUCED</span>
        <span className="px-2 py-0.5 rounded border bg-amber-100 border-amber-400 text-amber-900">UNDERSTOOD</span>
        <span className="px-2 py-0.5 rounded border bg-blue-100 border-blue-400 text-blue-900">APPLIED</span>
        <span className="px-2 py-0.5 rounded border bg-green-100 border-green-500 text-green-950 font-bold">MASTERED</span>
        <span className="px-2 py-0.5 rounded border bg-red-100 border-red-400 text-red-900">NEEDS_REVISION</span>
      </div>

      {/* Visual Network Grid */}
      <div className="bg-white border border-line-border rounded p-6 shadow-notebook space-y-6 paper-grid">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-border/60 pb-3">
          <div className="text-xs font-mono-code text-ink-500 uppercase font-semibold">
            TOPOLOGICAL KNOWLEDGE DEPENDENCY GRAPH
          </div>

          {/* Subject Filter Bar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono-code text-ink-500 uppercase font-bold mr-1">
              SUBJECT:
            </span>
            <button
              onClick={() => handleSubFilter('ALL')}
              className={`px-2 py-0.5 text-xs font-mono-code rounded border transition-all ${
                selectedSubFilter === 'ALL'
                  ? 'bg-ink-900 text-white font-bold'
                  : 'bg-paper-100 text-ink-700 border-line-border hover:bg-paper-200'
              }`}
            >
              All ({allConceptsList.length})
            </button>
            {ktuS5CseCurriculum.subjects.slice(0, 5).map(s => {
              const isSelected = selectedSubFilter === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSubFilter(s.id)}
                  className={`px-2 py-0.5 text-xs font-mono-code rounded border transition-all ${
                    isSelected
                      ? 'bg-ink-900 text-white font-bold'
                      : 'bg-paper-100 text-ink-700 border-line-border hover:border-terracotta hover:bg-paper-200'
                  }`}
                >
                  {s.code}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allConceptsList
            .filter(c => selectedSubFilter === 'ALL' || c.subjectId === selectedSubFilter)
            .map((concept) => {
            const prog = profile.progressMap[concept.id];
            const state = prog?.state || 'INTRODUCED';
            const score = prog?.score || { understanding: 70, application: 60, recall: 75, exam: 60, overall: 66 };

            return (
              <div
                key={concept.id}
                onClick={() => onSelectConcept(concept.id)}
                className="border border-line-border rounded p-4 bg-paper-50 hover:bg-white hover:border-terracotta hover:shadow-notebook transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code text-ink-500 uppercase">
                    {concept.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code ${stateColor[state]}`}>
                    {state}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-ink-900 group-hover:text-terracotta transition-colors font-serif-heading">
                    {concept.title}
                  </h4>
                  <div className="text-[11px] text-ink-500 font-mono-code mt-0.5">
                    {concept.subjectTitle}
                  </div>
                </div>

                {/* Score Pills */}
                <div className="grid grid-cols-4 gap-1 text-center font-mono-code text-[10px] border-t border-line-border pt-2">
                  <div className="bg-paper-200 p-1 rounded">
                    <div className="text-ink-500 text-[8px]">UND</div>
                    <div className="font-bold text-ink-900">{score.understanding}%</div>
                  </div>
                  <div className="bg-paper-200 p-1 rounded">
                    <div className="text-ink-500 text-[8px]">APP</div>
                    <div className="font-bold text-ink-900">{score.application}%</div>
                  </div>
                  <div className="bg-paper-200 p-1 rounded">
                    <div className="text-ink-500 text-[8px]">REC</div>
                    <div className="font-bold text-ink-900">{score.recall}%</div>
                  </div>
                  <div className="bg-paper-200 p-1 rounded">
                    <div className="text-ink-500 text-[8px]">EXAM</div>
                    <div className="font-bold text-ink-900">{score.exam}%</div>
                  </div>
                </div>

                {/* Prerequisites connection */}
                <div className="text-[11px] font-mono-code text-ink-600 flex items-center justify-between border-t border-line-border pt-2">
                  <span>Prereqs: {concept.prerequisites.length}</span>
                  <span className="text-terracotta flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter Lab <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adaptive JEV Diagnostics Banner */}
      <div className="bg-paper-200 border-l-4 border-l-terracotta border-y border-r border-line-border p-4 rounded-r space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-terracotta" />
          <span className="text-xs font-mono-code font-bold uppercase text-ink-900">
            JEV ADAPTIVE PREREQUISITE DIAGNOSTIC
          </span>
        </div>
        <p className="text-xs text-ink-800 leading-relaxed font-sans">
          The classification engine analyzes your predictions, error rates, and failure interactions. When you struggle with <em>Gradient Descent</em>, the system identifies multivariate partial derivatives as the root-cause gap and recommends an 8-minute targeted conceptual review instead of spamming repetitive questions.
        </p>
      </div>
    </div>
  );
};
