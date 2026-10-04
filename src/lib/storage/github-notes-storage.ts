export interface GitHubNoteChapter {
  id: string;
  name: string;
  title: string;
  path: string;
  rawUrl: string;
  githubUrl: string;
  size: number;
  content: string; // The markdown content
}

export interface ImportedGitHubRepo {
  id: string;
  owner: string;
  repo: string;
  repoUrl: string;
  description: string;
  subjectId: string;
  importedAt: string;
  defaultBranch: string;
  chapters: GitHubNoteChapter[];
}

const STORAGE_KEY = 'intuition_imported_gh_repos';

export class GitHubNotesStorage {
  static getAll(): ImportedGitHubRepo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load imported GitHub repos', e);
      return [];
    }
  }

  static getForSubject(subjectId: string): ImportedGitHubRepo[] {
    const all = this.getAll();
    return all.filter(r => r.subjectId === subjectId || r.subjectId === 'all');
  }

  static getById(id: string): ImportedGitHubRepo | null {
    const all = this.getAll();
    return all.find(r => r.id === id) || null;
  }

  static save(repo: ImportedGitHubRepo): void {
    const all = this.getAll().filter(r => r.id !== repo.id);
    all.unshift(repo);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('LocalStorage limit exceeded, pruning older imported repos', e);
      // If quota exceeded, keep only top 3
      const pruned = all.slice(0, 3);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
      } catch (err) {
        console.error('Unable to save repo to localStorage', err);
      }
    }
  }

  static delete(id: string): void {
    const all = this.getAll().filter(r => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Parse a GitHub URL (e.g. https://github.com/VasanthVanan/computer-networking-top-down-approach-notes)
   */
  static parseGitHubUrl(inputUrl: string): { owner: string; repo: string; subpath?: string } | null {
    try {
      const cleanUrl = inputUrl.trim().replace(/\/$/, '');
      const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:tree|blob)\/[^\/]+\/(.+))?/i);
      if (match) {
        const owner = match[1];
        let repo = match[2];
        if (repo.endsWith('.git')) repo = repo.slice(0, -4);
        const subpath = match[3] || '';
        return { owner, repo, subpath };
      }
    } catch (e) {
      // ignore
    }
    return null;
  }

  /**
   * Fetch repo metadata and markdown files from GitHub API and raw content
   */
  static async fetchRepo(url: string, subjectId: string): Promise<ImportedGitHubRepo> {
    const parsed = this.parseGitHubUrl(url);
    if (!parsed) {
      throw new Error('Invalid GitHub repository URL. Expected format: https://github.com/owner/repository');
    }

    const { owner, repo, subpath } = parsed;

    // 1. Fetch repo metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        throw new Error(`Repository "${owner}/${repo}" not found or is private.`);
      }
      if (repoRes.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please wait a moment or try again.');
      }
      throw new Error(`GitHub error: ${repoRes.statusText}`);
    }

    const repoJson = await repoRes.json();
    const defaultBranch = repoJson.default_branch || 'main';
    const description = repoJson.description || `Notes imported from GitHub repository ${owner}/${repo}`;

    // 2. Fetch directory contents
    const contentsUrl = subpath
      ? `https://api.github.com/repos/${owner}/${repo}/contents/${subpath}`
      : `https://api.github.com/repos/${owner}/${repo}/contents`;

    const contentsRes = await fetch(contentsUrl);
    if (!contentsRes.ok) {
      throw new Error(`Failed to list contents for repository: ${contentsRes.statusText}`);
    }

    const contentsJson = await contentsRes.json();
    if (!Array.isArray(contentsJson)) {
      throw new Error('URL does not point to a directory with markdown note files.');
    }

    // Filter markdown files
    const mdFiles = contentsJson.filter((item: any) => 
      item.type === 'file' && 
      (item.name.endsWith('.md') || item.name.endsWith('.markdown')) &&
      !item.name.toLowerCase().startsWith('license')
    );

    if (mdFiles.length === 0) {
      throw new Error('No markdown (.md) note files found in the root of this repository.');
    }

    // Sort chapters naturally (e.g. Chapter 1, Chapter 2, etc.)
    mdFiles.sort((a: any, b: any) => 
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );

    // 3. Fetch content for each markdown file (limit to top 15 to stay within browser storage limits)
    const chapters: GitHubNoteChapter[] = [];
    const filesToFetch = mdFiles.slice(0, 15);

    for (let i = 0; i < filesToFetch.length; i++) {
      const file = filesToFetch[i];
      let rawText = '';
      try {
        const rawRes = await fetch(file.download_url);
        if (rawRes.ok) {
          rawText = await rawRes.text();
        }
      } catch (err) {
        console.warn(`Failed to fetch raw content for ${file.name}`, err);
        rawText = `# ${file.name}\n\n*Unable to fetch raw content from GitHub directly. [Open on GitHub](${file.html_url})*`;
      }

      // Clean title from filename
      let title = file.name.replace(/\.md$/i, '').replace(/\.markdown$/i, '');
      title = decodeURIComponent(title);

      chapters.push({
        id: `gh-ch-${i + 1}-${file.name.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
        name: file.name,
        title,
        path: file.path,
        rawUrl: file.download_url,
        githubUrl: file.html_url,
        size: file.size,
        content: rawText
      });
    }

    const importedRepo: ImportedGitHubRepo = {
      id: `gh-${owner.toLowerCase()}-${repo.toLowerCase()}`,
      owner,
      repo,
      repoUrl: `https://github.com/${owner}/${repo}`,
      description,
      subjectId,
      importedAt: new Date().toISOString(),
      defaultBranch,
      chapters
    };

    // Save to storage
    this.save(importedRepo);

    return importedRepo;
  }
}
