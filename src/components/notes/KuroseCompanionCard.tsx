import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  Github, 
  Layers,
  Award,
  ArrowRight
} from 'lucide-react';
import { getKuroseChaptersForModule, kuroseRossRepoData, KuroseChapter } from '../../data/notes/kurose-ross-notes';

interface KuroseCompanionCardProps {
  currentModuleNum: number;
  subjectCode: string;
  onNavigateToChapter: (chapterNum: number) => void;
}

export const KuroseCompanionCard: React.FC<KuroseCompanionCardProps> = ({
  currentModuleNum,
  subjectCode,
  onNavigateToChapter
}) => {
  // Only render for Computer Networks (PCCST501 / CST303)
  const isComputerNetworks = 
    subjectCode.toLowerCase().includes('cst501') || 
    subjectCode.toLowerCase().includes('cst303') ||
    subjectCode.toLowerCase().includes('cn');

  if (!isComputerNetworks) return null;

  const relevantChapters = getKuroseChaptersForModule(currentModuleNum);

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border-l-4 border-amber-600 border-y border-r border-amber-600/20 p-4 mb-6 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              <BookOpen className="w-3 h-3" />
              Textbook Companion Repo
            </span>
            <span className="font-mono text-xs text-charcoal font-semibold">
              Kurose &amp; Ross: A Top-Down Approach (8th Ed)
            </span>
            <span className="text-[11px] font-mono text-charcoal-muted">
              • UMD ENPM694 Notes by Vasanth Vanan
            </span>
          </div>

          <p className="text-xs text-charcoal leading-relaxed font-mono">
            Official university companion notes mapped directly to Module {currentModuleNum}. Clean first-principles architecture, state machine diagrams, and protocol walkthroughs.
          </p>

          {/* Relevant Chapters for Current Module */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] font-mono font-bold text-charcoal-muted uppercase">
              Jump to Chapter Pages:
            </span>
            {relevantChapters.length > 0 ? (
              relevantChapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => onNavigateToChapter(ch.chapterNumber)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-paper border border-amber-600/40 hover:border-amber-600 text-charcoal font-mono text-xs font-semibold hover:bg-amber-500/10 transition-colors cursor-pointer shadow-2xs"
                  title={`Go to page for Chapter ${ch.chapterNumber}: ${ch.title}`}
                >
                  <span>Ch {ch.chapterNumber}: {ch.shortTitle}</span>
                  <ArrowRight className="w-3 h-3 text-amber-600" />
                </button>
              ))
            ) : (
              <button
                onClick={() => onNavigateToChapter(1)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-paper border border-line-border text-charcoal font-mono text-xs hover:border-accent"
              >
                <span>Explore All 6 Chapters</span>
                <ArrowRight className="w-3 h-3 text-accent" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          <button
            onClick={() => onNavigateToChapter(relevantChapters[0]?.chapterNumber || 1)}
            className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Read Chapter Notes on the notebook"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Read More</span>
          </button>

          <a
            href={kuroseRossRepoData.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-paper hover:bg-paper-light border border-line-border hover:border-charcoal text-charcoal transition-colors cursor-pointer"
            title="Open GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
