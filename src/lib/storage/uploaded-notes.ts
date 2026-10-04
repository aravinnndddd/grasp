export interface UploadedNote {
  id: string;
  timestamp: string;
  title: string;
  subjectCode: string;
  subjectId: string;
  subjectTitle: string;
  moduleNum: number; // 0 = All Modules / General, 1..4 = Specific Module
  category: 'lecture_notes' | 'handwritten_scans' | 'summary' | 'formula_sheet' | 'exam_solutions' | 'custom';
  fileType: 'pdf' | 'text' | 'markdown' | 'image' | 'doc';
  fileName: string;
  fileSize: number; // in bytes
  content?: string; // Text content if text/markdown or transcribed
  dataUrl?: string; // Base64 data URL for previewing PDF, image, etc.
  tags: string[];
  author?: string;
  aiSummary?: string;
}

const LOCAL_STORAGE_KEY = 'intuition_uploaded_notes_meta';
const DB_NAME = 'intuition_notes_db';
const DB_STORE = 'uploaded_notes';
const DB_VERSION = 1;

/**
 * Open or create IndexedDB for large binary storage (PDFs, high-res scans)
 */
function openNotesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' });
      }
    };
  });
}

export class UploadedNotesStorage {
  // In-memory cache for fast synchronous access
  private static cachedNotes: UploadedNote[] | null = null;

  /**
   * Get all uploaded notes across all subjects
   */
  static async getAll(): Promise<UploadedNote[]> {
    if (this.cachedNotes) {
      return this.cachedNotes;
    }

    // Try IndexedDB first
    try {
      const db = await openNotesDB();
      const notes = await new Promise<UploadedNote[]>((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readonly');
        const store = tx.objectStore(DB_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      // Sort by newest first
      notes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      this.cachedNotes = notes;
      return notes;
    } catch (e) {
      console.warn('IndexedDB failed, falling back to localStorage for notes:', e);
    }

    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const notes = JSON.parse(raw);
        this.cachedNotes = notes;
        return notes;
      }
    } catch (e) {
      console.error('Failed reading localStorage notes:', e);
    }

    this.cachedNotes = [];
    return [];
  }

  /**
   * Synchronous getter from cache or localStorage (for initial render)
   */
  static getSync(): UploadedNote[] {
    if (this.cachedNotes) return this.cachedNotes;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const notes = JSON.parse(raw);
        this.cachedNotes = notes;
        return notes;
      }
    } catch {
      // Ignore
    }
    return [];
  }

  /**
   * Get notes filtered by subject and optionally module
   */
  static async getBySubject(subjectIdOrCode: string, moduleNum?: number): Promise<UploadedNote[]> {
    const all = await this.getAll();
    const query = subjectIdOrCode.toLowerCase();
    return all.filter(n => {
      const matchesSubject = n.subjectId.toLowerCase() === query || n.subjectCode.toLowerCase() === query;
      if (!matchesSubject) return false;
      if (moduleNum !== undefined && moduleNum !== 0) {
        return n.moduleNum === moduleNum || n.moduleNum === 0;
      }
      return true;
    });
  }

  /**
   * Save a newly uploaded note
   */
  static async save(item: Omit<UploadedNote, 'id' | 'timestamp'>): Promise<UploadedNote> {
    const newNote: UploadedNote = {
      ...item,
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };

    // Save to IndexedDB
    try {
      const db = await openNotesDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        const req = store.put(newNote);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('Could not save note to IndexedDB:', e);
    }

    // Save metadata (without huge base64 dataUrl if too big) to localStorage as backup
    try {
      const all = await this.getAll();
      const updated = [newNote, ...all.filter(n => n.id !== newNote.id)];
      this.cachedNotes = updated;

      // Create lightweight backup without huge dataUrl strings
      const lightweight = updated.map(n => {
        if (n.dataUrl && n.dataUrl.length > 50000) {
          const { dataUrl, ...rest } = n;
          return rest;
        }
        return n;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lightweight.slice(0, 50)));
    } catch (e) {
      console.warn('Could not backup note to localStorage:', e);
    }

    return newNote;
  }

  /**
   * Update an existing note (e.g., adding an AI summary)
   */
  static async update(id: string, updates: Partial<UploadedNote>): Promise<void> {
    const all = await this.getAll();
    const target = all.find(n => n.id === id);
    if (!target) return;

    const updatedNote: UploadedNote = { ...target, ...updates };

    try {
      const db = await openNotesDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        const req = store.put(updatedNote);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('Error updating in IndexedDB:', e);
    }

    this.cachedNotes = all.map(n => (n.id === id ? updatedNote : n));
  }

  /**
   * Delete an uploaded note
   */
  static async delete(id: string): Promise<void> {
    try {
      const db = await openNotesDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('Error deleting from IndexedDB:', e);
    }

    const all = await this.getAll();
    const filtered = all.filter(n => n.id !== id);
    this.cachedNotes = filtered;

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered.slice(0, 50)));
    } catch {
      // Ignore
    }
  }

  /**
   * Clear all uploaded notes
   */
  static async clearAll(): Promise<void> {
    try {
      const db = await openNotesDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Ignore
    }

    this.cachedNotes = [];
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
