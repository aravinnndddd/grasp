import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Trash2, 
  BookOpen, 
  Layers, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { GitHubNotesStorage, ImportedGitHubRepo } from '../../lib/storage/github-notes-storage';
import { ktuS5CseCurriculum } from '../../data/ktu-s5-cse';

interface GitHubRepoImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubjectId: string;
  onRepoImported?: (repo: ImportedGitHubRepo) => void;
}

export const GitHubRepoImporterModal: React.FC<GitHubRepoImporterModalProps> = ({
  isOpen,
  onClose,
  currentSubjectId,
  onRepoImported
}) => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(currentSubjectId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [importedRepos, setImportedRepos] = useState<ImportedGitHubRepo[]>(() => GitHubNotesStorage.getAll());

  if (!isOpen) return null;

  const handleImport = async (urlToImport?: string) => {
    const targetUrl = (urlToImport || repoUrl).trim();
    if (!targetUrl) {
      setErrorMsg('Please enter a GitHub repository URL.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const repo = await GitHubNotesStorage.fetchRepo(targetUrl, selectedSubjectId);
      setImportedRepos(GitHubNotesStorage.getAll());
      setSuccessMsg(`Successfully imported "${repo.repo}" with ${repo.chapters.length} chapter note sheets!`);
      setRepoUrl('');
      if (onRepoImported) {
        onRepoImported(repo);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to import GitHub repository.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    GitHubNotesStorage.delete(id);
    setImportedRepos(GitHubNotesStorage.getAll());
  };

  const sampleRepos = [
    {
      title: 'Kurose & Ross Top-Down Notes',
      url: 'https://github.com/VasanthVanan/computer-networking-top-down-approach-notes',
      subject: 'pccst501',
      desc: 'All 7 chapters from UMD ENPM694 (Application, Transport, Network, Link layers)'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-line-border rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto font-sans animate-fade-in">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-ink-900 text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-heading font-bold text-lg text-ink-900">
                Import Notes from GitHub Repository
              </h2>
              <p className="text-xs text-ink-500 font-mono-code">
                Paste any public GitHub repository URL containing markdown notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-900 hover:bg-paper-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase text-ink-700 mb-1.5">
              GitHub Repository URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="https://github.com/owner/repository"
                className="flex-1 bg-paper-50 border border-line-border rounded-lg px-3.5 py-2 text-xs font-mono-code text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-terracotta"
              />
              <button
                onClick={() => handleImport()}
                disabled={isLoading || !repoUrl.trim()}
                className="px-4 py-2 bg-ink-900 hover:bg-black text-white text-xs font-mono-code font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Import Notes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Subject Attachment Dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono-code">
            <span className="text-ink-600 font-semibold">Associate with Subject:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="bg-white border border-line-border rounded px-2.5 py-1 text-xs font-mono-code font-bold text-ink-900"
            >
              {ktuS5CseCurriculum.subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code}: {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sample Repos Quick-Fill */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono-code text-ink-500 uppercase font-semibold">
              Example Repositories:
            </span>
            <div className="space-y-2">
              {sampleRepos.map((sample, idx) => (
                <div 
                  key={idx}
                  className="bg-paper-50 border border-line-border rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-ink-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-terracotta" />
                      <span>{sample.title}</span>
                    </div>
                    <p className="text-[11px] text-ink-600 font-sans">
                      {sample.desc}
                    </p>
                    <span className="text-[10px] font-mono-code text-ink-400 block truncate max-w-sm">
                      {sample.url}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setRepoUrl(sample.url);
                      setSelectedSubjectId(sample.subject);
                      handleImport(sample.url);
                    }}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-white border border-line-border hover:border-terracotta text-terracotta hover:text-terracotta-dark font-mono-code font-bold text-xs rounded transition-colors"
                  >
                    Quick Import
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-900">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Existing Imported Repositories List */}
        {importedRepos.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-line-border">
            <div className="flex items-center justify-between text-xs font-mono-code">
              <span className="font-bold text-ink-800 uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent-blue" />
                <span>Currently Imported GitHub Note Repos ({importedRepos.length})</span>
              </span>
            </div>

            <div className="space-y-2">
              {importedRepos.map(repo => (
                <div 
                  key={repo.id}
                  className="p-3 bg-white border border-line-border rounded-lg flex items-center justify-between gap-3 shadow-2xs hover:border-ink-400 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-xs text-ink-900 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-ink-600" />
                      <span>{repo.owner}/{repo.repo}</span>
                      <span className="text-[10px] font-mono-code px-1.5 py-0.2 bg-paper-200 rounded text-ink-600">
                        {repo.chapters.length} Chapters
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-500 line-clamp-1">
                      {repo.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={repo.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-ink-500 hover:text-ink-900 rounded hover:bg-paper-100 transition-colors"
                      title="View on GitHub"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(repo.id)}
                      className="p-1.5 text-ink-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                      title="Delete imported repo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-line-border">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono-code text-ink-700 hover:bg-paper-200 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
