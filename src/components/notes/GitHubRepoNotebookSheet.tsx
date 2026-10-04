import React, { useState } from 'react';
import { 
  Github, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Layers,
  Sparkles
} from 'lucide-react';
import { GitHubNoteChapter, ImportedGitHubRepo } from '../../lib/storage/github-notes-storage';
import { ToppersNoteRenderer } from './ToppersNoteRenderer';

interface GitHubRepoNotebookSheetProps {
  repo: ImportedGitHubRepo;
  chapter: GitHubNoteChapter;
  chapterIndex: number;
  totalChapters: number;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  fontClass?: string;
  showMarginalia?: boolean;
}

export const GitHubRepoNotebookSheet: React.FC<GitHubRepoNotebookSheetProps> = ({
  repo,
  chapter,
  chapterIndex,
  totalChapters,
  onNextChapter,
  onPrevChapter,
  fontClass = 'font-sans text-xs',
  showMarginalia = true
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(chapter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([chapter.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chapter.name || 'note'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${fontClass}`}>
      {/* Chapter Notebook Header */}
      <div className="border-b-2 border-line-border pb-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-ink-900 text-white font-mono-code font-bold text-[10px] uppercase rounded flex items-center gap-1.5">
              <Github className="w-3 h-3" />
              <span>{repo.owner}/{repo.repo}</span>
            </span>
            <span className="text-xs font-mono-code text-ink-500 font-semibold">
              Chapter {chapterIndex + 1} of {totalChapters}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono-code">
            <a
              href={chapter.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 bg-paper-100 hover:bg-paper-200 border border-line-border rounded text-ink-700 flex items-center gap-1 transition-colors"
              title="Open source file on GitHub"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={handleCopy}
              className="px-2 py-1 bg-paper-100 hover:bg-paper-200 border border-line-border rounded text-ink-700 flex items-center gap-1 transition-colors"
              title="Copy markdown text"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-2 py-1 bg-paper-100 hover:bg-paper-200 border border-line-border rounded text-ink-700 flex items-center gap-1 transition-colors"
              title="Download markdown file"
            >
              <Download className="w-3 h-3" />
              <span>Save</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-ink-900 tracking-tight leading-snug">
            {chapter.title}
          </h1>
          <p className="text-xs text-ink-600 font-sans mt-1">
            Source repository: <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer" className="text-terracotta hover:underline font-mono-code">{repo.repoUrl}</a>
          </p>
        </div>

        {/* Marginalia callout if enabled */}
        {showMarginalia && (
          <div className="bg-paper-50 border border-line-border/80 rounded-md p-3 text-xs text-ink-700 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <div className="font-sans leading-relaxed">
              <strong>Imported Notes Companion:</strong> Rendered directly inside your notebook sheet with full whiteboard sketching, custom font scaling, and theme paper backgrounds enabled.
            </div>
          </div>
        )}
      </div>

      {/* Main Chapter Content Rendered via ToppersNoteRenderer */}
      <div className="bg-white/80 border border-line-border/60 rounded-lg p-5 shadow-xs">
        <ToppersNoteRenderer content={chapter.content} />
      </div>

      {/* Bottom Paging Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-line-border text-xs font-mono-code">
        <button
          onClick={onPrevChapter}
          disabled={!onPrevChapter || chapterIndex === 0}
          className="px-3.5 py-1.5 rounded border border-line-border bg-paper-100 hover:bg-paper-200 text-ink-800 flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous Chapter</span>
        </button>

        <span className="text-ink-500 hidden sm:inline">
          {chapter.name}
        </span>

        <button
          onClick={onNextChapter}
          disabled={!onNextChapter || chapterIndex >= totalChapters - 1}
          className="px-3.5 py-1.5 rounded border border-line-border bg-ink-900 hover:bg-black text-white font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <span>Next Chapter</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
