import React from 'react';
import { Search, Bot, Cpu, ChevronDown } from 'lucide-react';
import { ConceptDetail } from '../../types/curriculum';
import { ktuS5CseCurriculum } from '../../data/ktu-s5-cse';
import { GroqClient } from '../../lib/ai/groq-client';

interface HeaderNavProps {
  currentTab: 'HOME' | 'NOTES' | 'PRACTICE' | 'EXAM';
  onSelectTab: (tab: 'HOME' | 'NOTES' | 'PRACTICE' | 'EXAM') => void;
  currentConcept: ConceptDetail;
  currentSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  onOpenSearch: () => void;
  onToggleTutor: () => void;
  onOpenGroqSettings: () => void;
  isTutorOpen: boolean;
  masteryPercentage: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onSelectTab,
  currentConcept,
  currentSubjectId,
  onSelectSubject,
  onOpenSearch,
  onToggleTutor,
  onOpenGroqSettings,
  isTutorOpen,
  masteryPercentage
}) => {
  const tabs: Array<{ id: 'HOME' | 'NOTES' | 'PRACTICE' | 'EXAM'; label: string }> = [
    { id: 'HOME', label: 'HOME' },
    { id: 'NOTES', label: 'NOTES' },
    { id: 'PRACTICE', label: 'PRACTICE' },
    { id: 'EXAM', label: 'EXAM QS' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-paper-100/95 backdrop-blur border-b border-line-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4 font-sans">
        {/* Left: Brand & Subject Selector */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectTab('HOME')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-6 h-6 bg-terracotta text-white rounded flex items-center justify-center font-mono-code text-xs font-extrabold shadow-sm">
              G
            </div>
            <div>
              <div className="font-serif-heading font-extrabold text-sm text-ink-900 tracking-tight leading-none group-hover:text-terracotta transition-colors">
                GRASP
              </div>
              <div className="font-mono-code text-[9px] text-ink-500 uppercase tracking-widest leading-none mt-0.5">
                BTech Lab
              </div>
            </div>
          </button>

          {/* Quick Subject Switcher Dropdown */}
          <div className="relative flex items-center">
            <select
              value={currentSubjectId}
              onChange={(e) => onSelectSubject(e.target.value)}
              className="bg-paper-200 border border-line-border rounded px-2.5 py-1 text-xs font-mono-code font-bold text-ink-900 focus:outline-none focus:border-terracotta cursor-pointer hover:bg-paper-300 transition-colors"
            >
              {ktuS5CseCurriculum.subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code}: {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Minimal Navigation */}
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono-code rounded transition-all ${
                currentTab === tab.id
                  ? 'bg-ink-900 text-paper-50 font-bold shadow-sm'
                  : 'text-ink-700 hover:text-ink-900 hover:bg-paper-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right: Search, Mastery HUD, AI Socratic Tutor */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-ink-600 hover:text-ink-900 hover:bg-paper-200 rounded border border-line-border flex items-center gap-1.5 text-xs font-mono-code px-2.5"
            title="Search knowledge graph (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-ink-500">Search</span>
          </button>

          {/* Subtle Mastery Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono-code bg-paper-200 px-2.5 py-1 rounded border border-line-border">
            <span className="text-ink-500 text-[10px]">MASTERY</span>
            <span className="font-bold text-ink-900">{masteryPercentage}%</span>
          </div>

          {/* Groq AI Settings */}
          <button
            onClick={onOpenGroqSettings}
            className="px-2.5 py-1 text-xs font-mono-code rounded border border-line-border bg-paper-100 hover:bg-paper-200 text-ink-800 flex items-center gap-1.5 transition-colors"
            title="Configure Groq AI Key and Model"
          >
            <Cpu className="w-3.5 h-3.5 text-terracotta" />
            <span className="hidden lg:inline text-[11px]">GROQ AI</span>
            <span className={`w-1.5 h-1.5 rounded-full ${GroqClient.isConfigured() ? 'bg-emerald-600' : 'bg-amber-500'}`} />
          </button>

          {/* Contextual AI Tutor Trigger */}
          <button
            onClick={onToggleTutor}
            className={`px-2.5 py-1 text-xs font-mono-code rounded border flex items-center gap-1.5 transition-all ${
              isTutorOpen
                ? 'bg-terracotta text-white border-terracotta shadow-sm font-semibold'
                : 'bg-white border-line-border text-ink-800 hover:bg-paper-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden md:inline">SOCRATIC TUTOR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
