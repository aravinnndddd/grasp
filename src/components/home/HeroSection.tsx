import React from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Zap,
  Compass,
  Target,
  Github,
  Plus,
  ArrowDown,
  CheckCircle2
} from 'lucide-react';
import { ktuS5CseCurriculum } from '../../data/ktu-s5-cse';

interface HeroSectionProps {
  currentSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  currentTab?: 'HOME' | 'NOTES' | 'PRACTICE' | 'EXAM';
  onNavigateTab: (tab: 'HOME' | 'NOTES' | 'PRACTICE' | 'EXAM') => void;
  onOpenGhImporter?: () => void;
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

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentSubjectId,
  onSelectSubject,
  currentTab = 'NOTES',
  onNavigateTab,
  onOpenGhImporter
}) => {
  // Core showcase papers
  const coreCodes = ['PCCST501', 'PCCST503', 'PCCST502', 'PECST522', 'PBCST504'];
  const coreSubjects = ktuS5CseCurriculum.subjects.filter(s =>
    coreCodes.includes(s.code) || ['pccst501', 'pccst503', 'pccst502', 'pecst522', 'pbcst504'].includes(s.id)
  );
  const otherSubjects = ktuS5CseCurriculum.subjects.filter(s =>
    !coreCodes.includes(s.code) && !['pccst501', 'pccst503', 'pccst502', 'pecst522', 'pbcst504'].includes(s.id)
  );

  const normalizedId = SUBJECT_ID_MAP[currentSubjectId] || currentSubjectId;
  const activeSubject = ktuS5CseCurriculum.subjects.find(
    s => s.id === currentSubjectId || s.id === normalizedId || s.code.toLowerCase() === normalizedId.toLowerCase()
  ) || ktuS5CseCurriculum.subjects[0];

  const handleGoToTab = (tab: 'NOTES' | 'PRACTICE' | 'EXAM') => {
    onNavigateTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="min-h-[calc(100vh-3.5rem)] bg-[#FBFBF9] text-[#18181B] border-b border-[#E4E1D8] flex flex-col justify-between relative px-3 sm:px-6 lg:px-8 py-6 sm:py-10">

      {/* Top Banner Tag */}
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 sm:pb-6 border-b border-[#E4E1D8] text-xs font-mono-code">
          <div className="flex items-center gap-2">
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-terracotta text-white font-bold tracking-wider rounded text-[10px] sm:text-[11px] uppercase shadow-xs">
              KTU 2024 SCHEME
            </span>
            <span className="text-ink-700 font-semibold text-xs sm:text-sm">
              B.Tech CSE // Semester 5
            </span>
          </div>
        </div>
      </div>

      {/* Main Center Content: Headline, CTAs, Active Subject Spotlight */}
      <div className="max-w-6xl w-full mx-auto my-auto py-4 sm:py-8 space-y-6 sm:space-y-8">

        {/* Big Hero Header */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-200 border border-[#E4E1D8] rounded-full text-terracotta text-xs font-mono-code font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>GRASP // KTU BTech S5 CSE Engineering Suite</span>
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ink-900 leading-tight">
            GRASP Engineering Concepts from <span className="text-terracotta italic underline decoration-terracotta/30 underline-offset-8">First Principles</span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-ink-700 font-sans leading-relaxed max-w-3xl">
            Complete full-module notes, rendered Mermaid vector diagrams, Kurose &amp; Ross Top-Down notes for Computer Networks, 7-level progressive practice ladder, and KTU 3M/7M/14M exam blueprints.
          </p>
        </div>

        {/* Big Prominent CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-2">
          {/* PRIMARY CTA: OPEN NOTES */}
          <button
            onClick={() => handleGoToTab('NOTES')}
            className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3 sm:py-3.5 bg-terracotta hover:bg-terracotta-dark text-white font-mono-code font-bold text-xs sm:text-sm rounded-lg flex items-center gap-2.5 shadow-md shadow-terracotta/20 hover:shadow-lg hover:shadow-terracotta/30 transition-all cursor-pointer group"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Open Module Notes &amp; Diagrams</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* GITHUB REPO IMPORTER CTA */}
          {onOpenGhImporter && (
            <button
              onClick={onOpenGhImporter}
              className="w-full sm:w-auto justify-center px-4 sm:px-5 py-3 sm:py-3.5 bg-white hover:bg-paper-100 border-2 border-ink-900 text-ink-900 font-mono-code font-bold text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:border-terracotta hover:text-terracotta"
              title="Paste and import any public GitHub notes repository (e.g. Kurose & Ross notes)"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5 text-ink-900 shrink-0" />
              <span>Paste GitHub Notes Repo</span>
              <Plus className="w-4 h-4 text-terracotta shrink-0" />
            </button>
          )}

          {/* PRACTICE ARENA CTA */}
          <button
            onClick={() => handleGoToTab('PRACTICE')}
            className="w-full sm:w-auto justify-center px-4 sm:px-5 py-3 sm:py-3.5 bg-white hover:bg-paper-100 border border-[#E4E1D8] text-ink-800 font-mono-code font-semibold text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-2xs hover:border-accent-blue hover:text-accent-blue"
          >
            <Target className="w-4 h-4 text-accent-blue shrink-0" />
            <span>Practice Drills</span>
          </button>

          {/* EXAM BLUEPRINTS CTA */}
          <button
            onClick={() => handleGoToTab('EXAM')}
            className="w-full sm:w-auto justify-center px-4 sm:px-5 py-3 sm:py-3.5 bg-white hover:bg-paper-100 border border-[#E4E1D8] text-ink-800 font-mono-code font-semibold text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-2xs hover:border-amber-600 hover:text-amber-700"
          >
            <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
            <span>KTU Exam Questions</span>
          </button>
        </div>

        {/* Course Cards Grid: 1-Click Selection on Home Page */}
        <div className="pt-4 sm:pt-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono-code">
            <span className="font-bold text-ink-600 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-terracotta" />
              <span>SELECT SUBJECT TO STUDY:</span>
            </span>
            <span className="text-ink-500 text-[11px] sm:text-xs">
              Active: <strong className="text-ink-900">{activeSubject.code} — {activeSubject.title}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {coreSubjects.map(sub => {
              const isSelected = sub.id === currentSubjectId || sub.id === normalizedId || sub.code === activeSubject.code;
              let subtitle = 'Core Paper';
              if (sub.code === 'PCCST501') subtitle = 'TCP/IP, Top-Down, ALOHA';
              else if (sub.code === 'PCCST503') subtitle = 'Regression, Cost, Descent';
              else if (sub.code === 'PCCST502') subtitle = 'Asymptotics, Dijkstra, DP';
              else if (sub.code === 'PECST522') subtitle = 'A* Search, Heuristics';
              else if (sub.code === 'PBCST504') subtitle = '8051 SFRs, Timers, Interrupts';

              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubject(sub.id)}
                  className={`p-3.5 sm:p-4 rounded-lg text-left border transition-all cursor-pointer flex flex-col justify-between gap-3 ${isSelected
                      ? 'bg-white border-2 border-terracotta shadow-md ring-2 ring-terracotta/20'
                      : 'bg-white hover:bg-paper-100 border-[#E4E1D8] hover:border-ink-400 shadow-2xs'
                    }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-terracotta text-white' : 'bg-paper-200 text-ink-700'
                        }`}>
                        {sub.code}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-terracotta">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>
                    <div className="font-serif-heading font-bold text-base text-ink-900 line-clamp-1 mt-1">
                      {sub.title}
                    </div>
                    <p className="text-[11px] font-mono-code text-ink-500 line-clamp-1">
                      {subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E4E1D8] flex items-center justify-between text-[11px] font-mono-code">
                    <span className="text-ink-500">{sub.credits} Credits</span>
                    <span className={`font-semibold flex items-center gap-0.5 ${isSelected ? 'text-terracotta' : 'text-ink-700'}`}>
                      {isSelected ? 'Study Now' : 'Select'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* More Courses Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 text-xs font-mono-code">
            <span className="text-ink-600 shrink-0">More KTU Electives &amp; Lab Papers:</span>
            <select
              value={otherSubjects.some(s => s.id === currentSubjectId) ? currentSubjectId : ''}
              onChange={(e) => {
                if (e.target.value) onSelectSubject(e.target.value);
              }}
              className="bg-white border border-[#E4E1D8] rounded px-3 py-1.5 text-xs font-mono-code font-semibold text-ink-800 hover:border-terracotta cursor-pointer outline-none w-full sm:w-auto"
            >
              <option value="">Choose from {otherSubjects.length} more KTU courses...</option>
              {otherSubjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  [{sub.code}] {sub.title}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Bottom Action Footer */}
      <div className="max-w-6xl w-full mx-auto pt-4 sm:pt-6 border-t border-[#E4E1D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-xs font-mono-code text-ink-500">
        <button
          onClick={() => handleGoToTab('NOTES')}
          className="flex items-center gap-2 text-ink-700 hover:text-terracotta transition-colors font-semibold cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-terracotta shrink-0" />
          <span>Click to launch {activeSubject.title} module notes →</span>
        </button>

        <span className="text-ink-400 text-[11px] sm:text-xs">
          5 Verified Modules · Kurose &amp; Ross Companion · KTU Blueprints
        </span>
      </div>

    </section>
  );
};
