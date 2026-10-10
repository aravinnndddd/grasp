import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  BookOpen,
  FileText,
  Trash2,
  Download,
  Sparkles,
  Search,
  Plus,
  Layers,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2,
  FileCheck,
  Cpu,
  Brain,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { UploadedNotesStorage, UploadedNote } from '../../lib/storage/uploaded-notes';
import { UploadNotesModal } from './UploadNotesModal';
import { UploadedNoteNotebookView } from './UploadedNoteNotebookView';

interface UploadedNotesVaultViewProps {
  currentSubjectId?: string;
  onOpenGroqSettings?: () => void;
}

export const UploadedNotesVaultView: React.FC<UploadedNotesVaultViewProps> = ({
  currentSubjectId,
  onOpenGroqSettings
}) => {
  const [notes, setNotes] = useState<UploadedNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<UploadedNote | null>(null);
  const [selectedNoteTab, setSelectedNoteTab] = useState<'notebook' | 'diagrams' | 'transcript' | 'pdf'>('notebook');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all uploaded notes
  const loadNotes = async () => {
    setLoading(true);
    try {
      const allNotes = await UploadedNotesStorage.getAll();
      setNotes(allNotes);
    } catch (e) {
      console.error('Failed to load notes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this study note from your vault?')) {
      await UploadedNotesStorage.delete(id);
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      loadNotes();
    }
  };

  const handleCreateSampleNote = async () => {
    const sampleSummary = `# Distributed Systems & Network Architecture

> **Document Scope:** Full 104 Pages | **Index Resolution:** 218 Semantic Passages
> Generated via **RAG (Retrieval-Augmented Generation)** covering all modules with page citations.

---

## Module 1: Foundations of Distributed Consensus & Clock Synchronization

### Core Principles & Formulations
- **Lamport Logical Clocks**: Defines a strict partial ordering of events in distributed systems without requiring physical time synchronization.
- **Vector Clocks**: Extends logical clocks to capture causal history across $N$ processes.
- **Clock Drift**: Given oscillator drift rate $\\rho$, two physical clocks drift apart by at most:
\\[
|C_i(t) - C_j(t)| \\le 2\\rho \\Delta t
\\]
- **Cristian's Algorithm**: Client synchronizes with time server using round-trip time estimation:
\\[
T_{\\text{client}} = T_{\\text{server}} + \\frac{T_1 - T_0 - I}{2}
\\]

### Technical Architecture & Flowchart Diagram
\`\`\`mermaid
graph TD
    A["<b>Client Node</b><br/>Timestamp T0"] -->|"Request Time"| B["<b>Time Server</b><br/>Timestamp T_Server"]
    B -->|"Response with T_Server"| C["<b>Client Node</b><br/>Timestamp T1"]
    C --> D["<b>Offset Calculation</b><br/>RTT = (T1 - T0) / 2"]
    D --> E["<b>Synchronized Clock</b><br/>T_Client = T_Server + RTT ✅"]

    style A fill:#EFF6FF,stroke:#3B82F6,stroke-width:2px
    style B fill:#FEF3C7,stroke:#D97706,stroke-width:2px
    style C fill:#EFF6FF,stroke:#3B82F6
    style D fill:#F1F5F9,stroke:#475569
    style E fill:#DCFCE7,stroke:#16A34A,stroke-width:2px
\`\`\`

### KTU Exam Focus: 3-Mark & 8-Mark Ready Answers
- **3-Mark**: What is the difference between Lamport logical clocks and vector clocks? Lamport logical clocks provide partial event ordering, whereas vector clocks establish exact causal relationships between concurrent events.
- **8-Mark**: Explain the Byzantine Generals Problem and state why $3m + 1$ generals are required to tolerate $m$ faulty traitors.

---

## Module 2: Consensus Protocols & Raft State Machine Replication

### Core Principles & Formulations
- **Raft Consensus**: Elects a single leader per term to achieve consensus across replicated state machines.
- **Leader Election**: Follower initiates election if election timeout (150ms–300ms) elapses without heartbeat.
- **Log Matching Property**: If two logs contain an entry with the same index and term, they store identical commands.

### Technical Architecture & Flowchart Diagram
\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Leader as Raft Leader
    participant Follower1 as Follower A
    participant Follower2 as Follower B

    Client->>Leader: Command ("set x=10")
    Leader->>Follower1: AppendEntries (Index: 42, Term: 3)
    Leader->>Follower2: AppendEntries (Index: 42, Term: 3)
    Follower1-->>Leader: AppendEntries ACK ✅
    Follower2-->>Leader: AppendEntries ACK ✅
    Note over Leader: Quorum Reached (3/3 Nodes)
    Leader->>Leader: Commit Log Entry to State Machine
    Leader-->>Client: Success ("x=10 committed")
\`\`\`

---

## Module 3: Distributed Storage & Consistent Hashing

### Core Principles & Formulations
- **Consistent Hashing Ring**: Maps both keys and node identifiers onto a circular keyspace $[0, 2^{32} - 1]$.
- **Virtual Nodes (Vnodes)**: Assigns multiple tokens per physical node to prevent hotspot skew:
\\[
\\text{Vnodes per Node} = K \\approx 100 \\text{ to } 256
\\]

### Technical Architecture & Flowchart Diagram
\`\`\`mermaid
graph TD
    subgraph Ring ["Consistent Hashing Ring (0 to 2^32 - 1)"]
        N0["Node A (Token 1000)"] --> N1["Node B (Token 4500)"]
        N1 --> N2["Node C (Token 8900)"]
        N2 --> N0
    end

    Key1["Key: 'user_981' (Hash: 2300)"] -.->|"Stored in"| N1
    Key2["Key: 'order_442' (Hash: 7100)"] -.->|"Stored in"| N2

    style Ring fill:#FFF7ED,stroke:#EA580C,stroke-width:2px
    style N0 fill:#EFF6FF,stroke:#3B82F6
    style N1 fill:#DCFCE7,stroke:#16A34A
    style N2 fill:#FEF3C7,stroke:#D97706
\`\`\`
`;

    const sampleContent = Array.from({ length: 104 }, (_, i) => {
      return `[Page ${i + 1}]:\nLecture Excerpt for Page ${i + 1} covering Distributed Computing, Consensus Proofs, Clock Drift Calculations, and Scalable Cloud Storage Architectures.`;
    }).join('\n\n');

    const created = await UploadedNotesStorage.save({
      title: 'Distributed Systems & Network Architecture (100+ Page Master Syllabus)',
      subjectCode: 'CST 402',
      subjectId: 'cst-402',
      subjectTitle: 'Distributed Systems',
      moduleNum: 0,
      category: 'lecture_notes',
      fileType: 'pdf',
      fileName: 'Distributed_Systems_Complete_Courseware_104_Pages.pdf',
      fileSize: 104 * 4096,
      content: sampleContent,
      tags: ['RAG-Grounding', '104 Pages', '3 Diagrams', 'KTU-Exam-Ready'],
      author: 'In-Browser RAG Engine',
      aiSummary: sampleSummary
    });

    await loadNotes();
    setSelectedNote(created);
    setSelectedNoteTab('notebook');
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.tags && n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // If a note is selected, render the full Topper's Notebook Preview UI
  if (selectedNote) {
    return (
      <UploadedNoteNotebookView
        note={selectedNote}
        onBack={() => setSelectedNote(null)}
        onOpenGroqSettings={onOpenGroqSettings}
        initialViewMode={selectedNoteTab}
      />
    );
  }

  return (
    <div className="space-y-6 font-sans animate-fade-in pb-16">
      {/* ── Page Header & Callout ── */}
      <div className="bg-paper-50 border border-line-border rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-code text-terracotta font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>RESEARCH STATION // PERSONAL NOTEBOOK VAULT &amp; DIAGRAM STUDIO</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif-heading font-bold text-ink-900 tracking-tight">
            Uploaded Notes &amp; 100+ Page PDF Laboratory
          </h1>

          <p className="text-sm text-ink-600 font-sans leading-relaxed">
            Upload any university PDF textbook, syllabus, or lecture slides. This dedicated laboratory extracts <strong>100% of all 100+ pages</strong> in-browser via <strong>RAG (Retrieval-Augmented Generation)</strong>, renders authentic Topper's engineering notebooks with KaTeX math, and <strong>synthesizes interactive visual diagrams and flowcharts for every chapter</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-2.5 bg-terracotta hover:bg-terracotta/90 text-white font-bold text-xs font-mono-code rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Any PDF / 100+ Pages (RAG-Enabled)</span>
            </button>

            {notes.length === 0 && (
              <button
                onClick={handleCreateSampleNote}
                className="px-4 py-2 bg-white hover:bg-paper-100 border border-line-border text-ink-800 font-bold text-xs font-mono-code rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>⚡ Try Sample 104-Page Syllabus Note</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-xs font-mono-code text-ink-500">
              <span className="px-2.5 py-1 bg-white border border-line-border rounded-md font-bold">
                📚 {notes.length} Documents in Vault
              </span>
            </div>
          </div>
        </div>

        {/* Subtle decorative watermark icon */}
        <div className="absolute right-4 -bottom-6 text-paper-200/50 pointer-events-none hidden md:block">
          <BookOpen className="w-48 h-48" />
        </div>
      </div>

      {/* ── Interactive Direct Drag & Drop Zone ── */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOver(false);
          setIsUploadModalOpen(true);
        }}
        onClick={() => setIsUploadModalOpen(true)}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
          isDraggingOver
            ? 'border-terracotta bg-terracotta/5 scale-[1.005]'
            : 'border-line-border bg-white hover:bg-paper-50/70 hover:border-terracotta/60'
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-paper-100 text-terracotta flex items-center justify-center">
          <Upload className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif-heading font-bold text-base text-ink-900">
            Drop any PDF here to Learn, Index with RAG &amp; Visualize Diagrams
          </h3>
          <p className="text-xs text-ink-500 font-mono-code max-w-xl mx-auto">
            Supports 100+ page textbook PDFs, scanned lecture notes, and markdown. Extracts all pages client-side with zero data leakage.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono-code text-ink-600 pt-1">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100+ Pages RAG</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mermaid Architecture Diagrams</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Topper's Ruled Sheet &amp; KaTeX</span>
          </span>
        </div>
      </div>

      {/* ── Why This Page Exists (Educational Capabilities Banner) ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: Upload,
            title: '1. Any PDF (100+ Pgs)',
            desc: 'Client-side PDF text extraction partitions 100% of all pages without truncation.'
          },
          {
            icon: Cpu,
            title: '2. BM25 RAG Index',
            desc: 'Passage chunking & semantic retrieval ground every note with exact [Page X] citations.'
          },
          {
            icon: Layers,
            title: '3. Visual Diagrams',
            desc: 'Interactive Mermaid flowcharts, mind maps, and protocol timelines synthesized for every chapter.'
          },
          {
            icon: BookOpen,
            title: '4. Topper’s Stationery',
            desc: 'Authentic spiral notebook preview, ruled paper textures, and validated KaTeX LaTeX math.'
          }
        ].map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="p-4 bg-paper-50 border border-line-border rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-terracotta" />
                <h4 className="font-serif-heading font-bold text-xs text-ink-900">{feat.title}</h4>
              </div>
              <p className="text-[11px] text-ink-600 font-sans leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-paper-100 border border-line-border rounded-xl p-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search uploaded notes, subject codes, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-line-border rounded-lg text-xs font-mono-code text-ink-900 focus:outline-none focus:border-terracotta"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-ink-500 w-full sm:w-auto justify-end">
          <span>Showing {filteredNotes.length} of {notes.length} notes</span>
        </div>
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="text-center py-16 text-xs font-mono-code text-ink-500">
          <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto mb-2" />
          <span>Opening personal notebook vault…</span>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && notes.length === 0 && (
        <div className="text-center py-16 px-4 bg-paper-50 border-2 border-dashed border-line-border rounded-2xl max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-paper-200 flex items-center justify-center text-3xl mx-auto">
            📖
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-serif-heading font-bold text-ink-900">Your Vault is Empty</h3>
            <p className="text-xs text-ink-500 font-sans">
              Drop any 100+ page textbook, syllabus PDF, or lecture markdown file. AI will read it, extract every module, and generate full Topper's notebook notes automatically with visual diagrams.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-terracotta text-white font-bold text-xs font-mono-code rounded-lg hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Your First PDF</span>
            </button>
            <button
              onClick={handleCreateSampleNote}
              className="px-4 py-2 bg-white border border-line-border text-ink-800 font-bold text-xs font-mono-code rounded-lg hover:bg-paper-100 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-terracotta" />
              <span>Load 104-Page Sample</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Notebook Library Grid ── */}
      {!loading && notes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((item) => {
            const hasRagTag = item.tags && item.tags.some(t => t.toLowerCase().includes('rag') || t.toLowerCase().includes('pages'));
            const dateStr = new Date(item.timestamp).toLocaleDateString();

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedNote(item);
                  setSelectedNoteTab('notebook');
                }}
                className="group bg-paper-50 hover:bg-white border border-line-border hover:border-terracotta/70 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                {/* Left spiral spine preview accent */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-terracotta to-amber-600 group-hover:w-2.5 transition-all" />

                <div className="space-y-3 pl-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-ink-900 text-white font-mono-code font-bold text-[10px] rounded uppercase">
                      {item.subjectCode || 'KTU'}
                    </span>

                    <div className="flex items-center gap-1">
                      {hasRagTag && (
                        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono-code font-bold rounded">
                          ⚡ RAG Grounded
                        </span>
                      )}
                      <button
                        onClick={(e) => handleDeleteNote(item.id, e)}
                        className="p-1 text-ink-300 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete note from vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-serif-heading font-bold text-ink-900 group-hover:text-terracotta transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-ink-500 font-mono-code mt-0.5">
                      {item.subjectTitle || 'General Engineering'}
                    </p>
                  </div>

                  {/* Summary preview snippet */}
                  <p className="text-xs text-ink-600 font-sans line-clamp-3 leading-relaxed">
                    {item.aiSummary ? item.aiSummary.replace(/^[#\s\-\*\>]+/gm, '').slice(0, 150) + '…' : 'Document uploaded and indexed.'}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-paper-200 text-ink-700 text-[10px] font-mono-code rounded">
                          #{t}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-[10px] font-mono-code text-ink-400">
                          +{item.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-4 pt-3 border-t border-line-border/70 flex items-center justify-between text-[11px] font-mono-code text-ink-500 pl-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{dateStr}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(item);
                        setSelectedNoteTab('diagrams');
                      }}
                      className="px-2 py-1 bg-paper-100 hover:bg-terracotta hover:text-white rounded border border-line-border text-[10px] font-bold text-ink-700 flex items-center gap-1 transition-colors"
                      title="Open visual flowcharts and architecture diagrams"
                    >
                      <Layers className="w-3 h-3 text-terracotta" />
                      <span>Diagrams</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(item);
                        setSelectedNoteTab('notebook');
                      }}
                      className="px-2.5 py-1 bg-terracotta text-white rounded text-[10px] font-bold flex items-center gap-1 hover:opacity-90 transition-opacity"
                    >
                      <span>Study</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <UploadNotesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultSubjectId={currentSubjectId}
        onNoteUploaded={(newNote) => {
          loadNotes();
          setSelectedNote(newNote);
          setSelectedNoteTab('notebook');
          setIsUploadModalOpen(false);
        }}
      />
    </div>
  );
};
