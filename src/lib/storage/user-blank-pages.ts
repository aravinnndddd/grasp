export interface UserBlankPage {
  id: string;
  subjectId: string;
  moduleNum: number;
  title: string;
  content: string;
  paperType: 'ruled' | 'grid' | 'clean' | 'yellow';
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'intuition_user_blank_pages';

export class UserBlankPagesStorage {
  static getAll(): UserBlankPage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading user blank pages:', e);
    }
    return [];
  }

  static getForModule(subjectId: string, moduleNum: number): UserBlankPage[] {
    const all = this.getAll();
    const query = subjectId.toLowerCase();
    return all.filter(p => p.subjectId.toLowerCase() === query && (p.moduleNum === moduleNum || p.moduleNum === 0));
  }

  static save(page: Omit<UserBlankPage, 'id' | 'createdAt' | 'updatedAt'>): UserBlankPage {
    const all = this.getAll();
    const newPage: UserBlankPage = {
      ...page,
      id: `blank-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [...all, newPage];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage limit for blank pages:', e);
    }
    return newPage;
  }

  static update(id: string, updates: Partial<UserBlankPage>): void {
    const all = this.getAll();
    const updated = all.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error updating blank page:', e);
    }
  }

  static delete(id: string): void {
    const all = this.getAll();
    const filtered = all.filter(p => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      // Also clean up associated whiteboard drawings
      localStorage.removeItem(`intuition_whiteboard_userpage_${id}`);
    } catch (e) {
      console.warn('Error deleting blank page:', e);
    }
  }
}
