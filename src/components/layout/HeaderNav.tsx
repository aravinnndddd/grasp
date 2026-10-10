import React from 'react';
import { Search, Bot, Cpu, Sparkles } from 'lucide-react';
import { GroqClient } from '../../lib/ai/groq-client';

interface HeaderNavProps {
  onOpenSearch: () => void;
  onOpenGroqSettings: () => void;
  onToggleTutor?: () => void;
  isTutorOpen?: boolean;
  notesCount?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenSearch,
  onToggleTutor,
  onOpenGroqSettings,
  isTutorOpen,
  notesCount = 0
}) => {
  return (
    <header className="sticky top-0 z-30 bg-paper-100/95 backdrop-blur border-b border-line-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-4 font-sans">
        {/* Left: Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 text-left shrink-0">
            <div className="w-7 h-7 bg-terracotta text-white rounded-lg flex items-center justify-center font-mono-code text-xs font-extrabold shadow-sm">
              G
            </div>
            <div>
              <div className="font-serif-heading font-extrabold text-base sm:text-lg text-ink-900 tracking-tight leading-none">
                GRASP
              </div>
              <div className="font-mono-code text-[9px] text-ink-500 uppercase tracking-widest leading-none mt-0.5">
                AI Notes Studio
              </div>
            </div>
          </div>

          <span className="hidden sm:inline-block h-4 w-px bg-line-border" />

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono-code text-ink-600">
            <span className="px-2 py-0.5 bg-paper-200 border border-line-border rounded-md font-bold text-[11px] text-ink-700">
              ⚡ 100+ Page PDF &amp; RAG Engine
            </span>
          </div>
        </div>

        {/* Right: Search, AI Settings, Socratic Tutor */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-ink-600 hover:text-ink-900 hover:bg-paper-200 rounded-lg border border-line-border flex items-center gap-1.5 text-xs font-mono-code px-2 sm:px-2.5 cursor-pointer"
            title="Search notes (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-ink-500">Search</span>
            <kbd className="hidden md:inline text-[9px] bg-paper-200 px-1 py-0.2 rounded text-ink-400">Ctrl K</kbd>
          </button>

          {/* Groq AI Settings */}
          <button
            onClick={onOpenGroqSettings}
            className="p-1.5 sm:px-2.5 sm:py-1 text-xs font-mono-code rounded-lg border border-line-border bg-paper-100 hover:bg-paper-200 text-ink-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Configure Groq AI Key and Model"
          >
            <Cpu className="w-3.5 h-3.5 text-terracotta" />
            <span className="hidden xl:inline text-[11px]">GROQ AI</span>
            <span className={`w-1.5 h-1.5 rounded-full ${GroqClient.isConfigured() ? 'bg-emerald-600' : 'bg-amber-500'}`} />
          </button>

          {/* Contextual AI Tutor Trigger (if enabled) */}
          {onToggleTutor && (
            <button
              onClick={onToggleTutor}
              className={`p-1.5 sm:px-2.5 sm:py-1 text-xs font-mono-code rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                isTutorOpen
                  ? 'bg-terracotta text-white border-terracotta shadow-sm font-semibold'
                  : 'bg-white border-line-border text-ink-800 hover:bg-paper-200'
              }`}
              title="Open Socratic AI Tutor"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden md:inline">SOCRATIC TUTOR</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

