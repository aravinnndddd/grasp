import React, { useState } from 'react';
import { CurriculumHierarchy, ConceptDetail } from '../../types/curriculum';
import { StudentProfile } from '../../types/learning';
import { ChevronRight, ChevronDown, BookOpen, Clock, Award, ShieldAlert, Layers, ArrowUpRight } from 'lucide-react';

interface ExplorerProps {
  curriculum: CurriculumHierarchy;
  profile: StudentProfile;
  onSelectConcept: (conceptId: string) => void;
  currentSubjectId?: string;
  onSelectSubject?: (subjectId: string) => void;
}

export const CurriculumExplorer: React.FC<ExplorerProps> = ({
  curriculum,
  profile,
  onSelectConcept,
  currentSubjectId,
  onSelectSubject
}) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
    'cst-301-flat': true,
    'cst-303-cn': true,
    'cst-305-ml': true,
    'pccst501': true,
    'pccst503': true,
    'pccst502': true,
    ...(currentSubjectId ? { [currentSubjectId]: true } : {})
  });
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1-automata': true,
    'mod-4-transport': true,
    'mod-2-linear': true
  });

  // Extensibility Demonstration State
  const [selectedUniv, setSelectedUniv] = useState<string>('KTU');
  const [selectedScheme, setSelectedScheme] = useState<string>('2024 Scheme');
  const [selectedBranch, setSelectedBranch] = useState<string>('CSE');
  const [selectedSem, setSelectedSem] = useState<string>('S5');

  const toggleSubject = (id: string) => {
    setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 font-sans">
      {/* Header */}
      <div className="space-y-3 border-b border-line-border pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
            KNOWLEDGE ATLAS // CURRICULUM EXPLORER
          </span>
          <span className="text-xs font-mono-code text-terracotta font-semibold">
            UNIVERSALLY EXTENSIBLE ARCHITECTURE
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif-heading font-bold text-ink-900 tracking-tight">
          Curriculum Hierarchy Tree
        </h1>
        <p className="text-xs text-ink-700 max-w-2xl font-sans leading-relaxed">
          Structured non-destructive syllabus engine. Explore subjects, modules, topics, and interactive concept chapters for APJ Abdul Kalam Technological University (KTU).
        </p>

        {/* Universal Extensibility Switcher Bar */}
        <div className="bg-paper-200 border border-line-border p-3 rounded flex flex-wrap items-center gap-3 text-xs font-mono-code text-ink-800">
          <div className="flex items-center gap-1.5">
            <span className="text-ink-500 text-[11px] uppercase">University:</span>
            <select
              value={selectedUniv}
              onChange={(e) => setSelectedUniv(e.target.value)}
              className="px-2 py-1 bg-white border border-line-border rounded text-xs font-mono-code"
            >
              <option value="KTU">APJ Abdul Kalam Tech Univ (KTU)</option>
              <option value="ANNA">Anna University (Autonomous)</option>
              <option value="VTU">Visvesvaraya Tech Univ (VTU)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-500 text-[11px] uppercase">Scheme:</span>
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="px-2 py-1 bg-white border border-line-border rounded text-xs font-mono-code"
            >
              <option value="2024 Scheme">2024 Scheme (Active)</option>
              <option value="2019 Scheme">2019 Scheme</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-500 text-[11px] uppercase">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-2 py-1 bg-white border border-line-border rounded text-xs font-mono-code"
            >
              <option value="CSE">Computer Science & Engineering</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="IT">Information Technology</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-500 text-[11px] uppercase">Semester:</span>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="px-2 py-1 bg-white border border-line-border rounded text-xs font-mono-code font-bold text-terracotta"
            >
              <option value="S5">S5 (Semester 5)</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
              <option value="S4">S4</option>
              <option value="S6">S6</option>
              <option value="S7">S7</option>
              <option value="S8">S8</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Subject Selection Strip */}
      <div className="bg-white border border-line-border p-3 rounded shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-code">
          <span className="font-bold text-ink-700 uppercase flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-terracotta" />
            <span>FOCUS ON SUBJECT:</span>
          </span>
          <span className="text-[11px] text-ink-500 hidden sm:inline">
            Click to focus and expand full syllabus tree
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {curriculum.subjects.map(s => {
            const isFocus = s.id === currentSubjectId;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setExpandedSubjects(prev => ({ ...prev, [s.id]: true }));
                  if (onSelectSubject) onSelectSubject(s.id);
                }}
                className={`px-2.5 py-1 text-xs font-mono-code rounded border transition-all cursor-pointer ${
                  isFocus
                    ? 'bg-ink-900 text-white font-bold border-ink-900 shadow-xs'
                    : 'bg-paper-100 text-ink-800 border-line-border hover:border-terracotta hover:bg-paper-200'
                }`}
              >
                {s.code}: {s.title.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* The Hierarchical Subject / Module / Topic / Concept Tree */}
      <div className="space-y-4">
        {curriculum.subjects.map((sub) => {
          const isSubExpanded = !!expandedSubjects[sub.id];

          return (
            <div key={sub.id} className="bg-white border border-line-border rounded overflow-hidden shadow-notebook">
              {/* Subject Accordion Header */}
              <button
                onClick={() => toggleSubject(sub.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-paper-50 transition-colors border-b border-line-border"
              >
                <div className="flex items-center gap-3">
                  {isSubExpanded ? (
                    <ChevronDown className="w-4 h-4 text-ink-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-ink-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono-code text-ink-500">
                      <span className="text-terracotta font-bold">{sub.code}</span>
                      <span>·</span>
                      <span>{sub.credits} Credits</span>
                      <span>·</span>
                      <span>{sub.modules.length} Modules</span>
                    </div>
                    <h3 className="text-lg font-serif-heading font-bold text-ink-900 mt-0.5">
                      {sub.title}
                    </h3>
                  </div>
                </div>

                <div className="text-xs font-mono-code text-ink-500 hidden sm:block">
                  {sub.scheme}
                </div>
              </button>

              {/* Modules tree */}
              {isSubExpanded && (
                <div className="p-4 bg-paper-50/50 space-y-3">
                  {sub.modules.map((mod) => {
                    const isModExpanded = !!expandedModules[mod.id];
                    const conceptCount = mod.topics.reduce((acc, t) => acc + t.concepts.length, 0);

                    return (
                      <div key={mod.id} className="border border-line-border rounded bg-white overflow-hidden">
                        <button
                          onClick={() => toggleModule(mod.id)}
                          className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-paper-100 transition-colors text-xs font-mono-code"
                        >
                          <div className="flex items-center gap-2">
                            {isModExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-ink-500" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-ink-500" />
                            )}
                            <span className="font-bold text-ink-900">{mod.title}</span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-ink-500">
                            <span>{mod.hours}h</span>
                            <span>·</span>
                            <span className="text-terracotta font-semibold">{conceptCount} interactive concepts</span>
                          </div>
                        </button>

                        {/* Topics & Concepts */}
                        {isModExpanded && (
                          <div className="px-4 py-3 border-t border-line-border bg-paper-50 space-y-2">
                            <p className="text-xs text-ink-600 font-sans italic mb-2">
                              {mod.description}
                            </p>

                            {mod.topics.length === 0 ? (
                              <div className="text-xs text-ink-500 font-mono-code py-1">
                                [Module topics syllabus loaded. Additional interactive labs scheduled for upcoming modules.]
                              </div>
                            ) : (
                              mod.topics.map((t) => (
                                <div key={t.id} className="space-y-1.5 pt-1">
                                  <div className="text-xs font-mono-code text-ink-700 font-semibold flex items-center gap-1.5">
                                    <span className="text-ink-400">├─</span> Topic: {t.title}
                                  </div>

                                  {t.concepts.map((concept) => {
                                    const progress = profile.progressMap[concept.id];
                                    const state = progress?.state || 'UNKNOWN';

                                    return (
                                      <div
                                        key={concept.id}
                                        onClick={() => onSelectConcept(concept.id)}
                                        className="ml-5 p-3 rounded border border-line-border bg-white hover:border-terracotta hover:shadow-notebook transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-3 group"
                                      >
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2 text-[10px] font-mono-code">
                                            <span className="px-2 py-0.5 rounded bg-paper-200 text-ink-800 uppercase font-semibold">
                                              {concept.category}
                                            </span>
                                            <span className="text-ink-500">
                                              {concept.difficulty}
                                            </span>
                                            <span className="text-ink-500 flex items-center gap-0.5">
                                              <Clock className="w-3 h-3" /> ~{concept.estimatedMinutes}m
                                            </span>
                                            <span className="text-red-700 font-semibold">
                                              KTU: {concept.examImportance}
                                            </span>
                                          </div>
                                          <h4 className="text-sm font-bold text-ink-900 group-hover:text-terracotta transition-colors font-serif-heading">
                                            {concept.title}
                                          </h4>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                          <span className={`px-2 py-0.5 rounded text-[11px] font-mono-code font-bold ${
                                            state === 'MASTERED'
                                              ? 'bg-green-100 text-green-900 border border-green-300'
                                              : state === 'APPLIED'
                                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                              : 'bg-paper-200 text-ink-700'
                                          }`}>
                                            {state}
                                          </span>

                                          <button className="p-1 text-ink-400 group-hover:text-terracotta">
                                            <ArrowUpRight className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
