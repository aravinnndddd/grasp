import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/layout/HeaderNav';
import { UploadedNotesVaultView } from './components/notes/UploadedNotesVaultView';
import { KnowledgeSearchModal } from './components/search/KnowledgeSearchModal';
import { GroqSettingsModal } from './components/ai/GroqSettingsModal';

export const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isGroqSettingsOpen, setIsGroqSettingsOpen] = useState<boolean>(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Global keyboard shortcuts (Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-paper-100 text-ink-900 flex flex-col font-sans selection:bg-terracotta/20 selection:text-terracotta">
      {/* Universal Technical Navigation */}
      <HeaderNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGroqSettings={() => setIsGroqSettingsOpen(true)}
      />

      {/* Main Workspace Body: Exclusively Uploaded Notes & 100+ Page PDF Studio */}
      <main id="study-workspace" className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <UploadedNotesVaultView
          onOpenGroqSettings={() => setIsGroqSettingsOpen(true)}
          externalSelectedNoteId={selectedNoteId}
          onClearExternalSelectedNoteId={() => setSelectedNoteId(null)}
        />
      </main>

      {/* Groq AI Configuration Modal */}
      <GroqSettingsModal
        isOpen={isGroqSettingsOpen}
        onClose={() => setIsGroqSettingsOpen(false)}
      />

      {/* Global Knowledge Search Modal */}
      <KnowledgeSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectNote={(noteId) => {
          setSelectedNoteId(noteId);
          setIsSearchOpen(false);
        }}
      />

      {/* Clean Modern Engineering Footer */}
      <footer className="border-t border-line-border bg-paper-100 py-6 text-center text-xs font-mono-code text-ink-500 space-y-1">
        <div>
          GRASP // AI Notes Studio · 100+ Page PDF &amp; RAG Engine
        </div>
        <div className="text-[11px] text-ink-400">
          "Master concepts from first principles." · Client-Side Document Grounding · Mermaid Diagrams · Interactive Notebook
        </div>
      </footer>
    </div>
  );
};

export default App;
