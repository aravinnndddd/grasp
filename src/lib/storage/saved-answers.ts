export interface SavedAiAnswer {
  id: string;
  timestamp: string;
  subjectCode: string;
  subjectTitle: string;
  moduleTitle: string;
  query: string;
  response: string;
  modelUsed: string;
  routingTask: string;
  gfgLinks?: Array<{ title: string; url: string }>;
  tags?: string[];
}

const STORAGE_KEY = 'intuition_saved_ai_answers';

export class SavedAnswersStorage {
  static getAll(): SavedAiAnswer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading saved AI answers:', e);
    }
    return [];
  }

  static getBySubject(subjectCode: string): SavedAiAnswer[] {
    const all = this.getAll();
    return all.filter(a => a.subjectCode.toUpperCase() === subjectCode.toUpperCase());
  }

  static save(item: Omit<SavedAiAnswer, 'id' | 'timestamp'>): SavedAiAnswer {
    const all = this.getAll();
    const newEntry: SavedAiAnswer = {
      ...item,
      id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };

    // Prepend to show latest first
    const updated = [newEntry, ...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving AI answer:', e);
    }
    return newEntry;
  }

  static delete(id: string): void {
    const all = this.getAll();
    const filtered = all.filter(a => a.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Error deleting answer:', e);
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing answers:', e);
    }
  }

  static exportAsMarkdown(): string {
    const all = this.getAll();
    if (all.length === 0) return '# No saved AI answers found.\n';

    let md = `# GRASP // Saved AI Learning Answers & Notes\n`;
    md += `*Exported on: ${new Date().toLocaleString()}*\n\n---\n\n`;

    all.forEach((ans, idx) => {
      md += `## ${idx + 1}. [${ans.subjectCode}] ${ans.query}\n`;
      md += `**Subject:** ${ans.subjectTitle} | **Module:** ${ans.moduleTitle}\n`;
      md += `**Date:** ${new Date(ans.timestamp).toLocaleString()} | **Model:** \`${ans.modelUsed}\`\n\n`;
      
      if (ans.gfgLinks && ans.gfgLinks.length > 0) {
        md += `**GeeksforGeeks Reference Links:**\n`;
        ans.gfgLinks.forEach(g => {
          md += `- [${g.title}](${g.url})\n`;
        });
        md += `\n`;
      }

      md += `### Answer:\n${ans.response}\n\n---\n\n`;
    });

    return md;
  }
}
