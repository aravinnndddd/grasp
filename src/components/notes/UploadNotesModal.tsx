import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  File,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Cpu,
  Brain,
  Wand2,
  BookOpen,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { UploadedNotesStorage, UploadedNote } from '../../lib/storage/uploaded-notes';
import { GroqClient } from '../../lib/ai/groq-client';
import { PdfRagEngine, PdfRagIndex } from '../../lib/rag/pdf-rag-engine';

interface UploadNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectId?: string;
  defaultModuleNum?: number;
  onNoteUploaded: (newNote: UploadedNote) => void;
}

/* ─── AI helpers ────────────────────────────────────────────────── */

/** Extract raw text from a File using FileReader */
function readFileAsText(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res((e.target?.result as string) || '');
    reader.onerror = () => rej(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/** Read any file as a base64 dataUrl */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res((e.target?.result as string) || '');
    reader.onerror = () => rej(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

interface DetectedMeta {
  title: string;
  subject: string;
  subjectCode: string;
  moduleNum: number;
  category: UploadedNote['category'];
  tags: string[];
  summary: string;
}

const AI_ANALYSIS_PROMPT = (rawText: string) => `
You are an intelligent academic document analyser.
Analyse the following document text and extract structured metadata AND generate a comprehensive, beautifully formatted study note.

DOCUMENT TEXT (first 3000 chars):
"""
${rawText.slice(0, 3000)}
"""

Respond ONLY with a valid JSON object exactly matching this schema — no extra text, no markdown fences:

{
  "title": "<descriptive note title, max 80 chars>",
  "subject": "<full subject name detected from content, e.g. Design and Analysis of Algorithms>",
  "subjectCode": "<subject code if found, else infer from subject, e.g. CST 306>",
  "moduleNum": <1|2|3|4|0 — module number if detectable, else 0>,
  "category": "<one of: lecture_notes | summary | formula_sheet | exam_solutions | handwritten_scans | custom>",
  "tags": ["<topic1>", "<topic2>", "<topic3>"],
  "summary": "<A comprehensive, richly formatted markdown study note generated from this document. Include:\\n- ## Core Concepts section with bullet explanations\\n- ## Key Formulas / Algorithms if relevant (use code blocks)\\n- ## Exam Takeaways with 3-mark and 8-mark ready answers\\n- ## Memory Anchors with 1-line analogies for each major concept\\nMake it creative, detailed and KTU-exam-ready. Minimum 400 words.>"
}
`;

async function analyseWithAI(text: string): Promise<DetectedMeta> {
  const raw = await GroqClient.chatCompletion(
    [
      {
        role: 'system',
        content: 'You are a precise academic document parser. Always respond with valid JSON only.'
      },
      { role: 'user', content: AI_ANALYSIS_PROMPT(text) }
    ],
    { temperature: 0.4, maxTokens: 2500 }
  );

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  return JSON.parse(cleaned) as DetectedMeta;
}

/* ─── Component ────────────────────────────────────────────────── */

type Step = 'drop' | 'analysing' | 'preview' | 'saving' | 'done';

export const UploadNotesModal: React.FC<UploadNotesModalProps> = ({
  isOpen,
  onClose,
  onNoteUploaded
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('drop');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [meta, setMeta] = useState<DetectedMeta | null>(null);
  const [error, setError] = useState('');
  const [editableTitle, setEditableTitle] = useState('');
  const [textMode, setTextMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [ragProgress, setRagProgress] = useState<{ message: string; percent: number }>({ message: '', percent: 0 });
  const [ragStats, setRagStats] = useState<{ totalPages: number; totalChunks: number } | null>(null);

  if (!isOpen) return null;

  const reset = () => {
    setStep('drop');
    setSelectedFile(null);
    setFileDataUrl('');
    setRawText('');
    setMeta(null);
    setError('');
    setEditableTitle('');
    setPastedText('');
    setTextMode(false);
    setIsDragging(false);
    setRagProgress({ message: '', percent: 0 });
    setRagStats(null);
  };

  const getExt = (name: string) => name.split('.').pop()?.toLowerCase() || '';

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setError('');
    setStep('analysing');

    try {
      const ext = getExt(file.name);
      let text = '';
      let dataUrl = '';

      if (['txt', 'md', 'markdown'].includes(ext)) {
        text = await readFileAsText(file);
        setFileDataUrl('');
        setRawText(text);

        if (!GroqClient.isConfigured()) {
          const fallback: DetectedMeta = {
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            subject: 'General Study Material',
            subjectCode: 'GEN',
            moduleNum: 0,
            category: 'lecture_notes',
            tags: [ext.toUpperCase(), 'uploaded'],
            summary: text.slice(0, 2000) || `# ${file.name}\n\nDocument uploaded.`
          };
          setMeta(fallback);
          setEditableTitle(fallback.title);
          setStep('preview');
          return;
        }

        const analysed = await analyseWithAI(text);
        setMeta(analysed);
        setEditableTitle(analysed.title);
        setStep('preview');
      } else if (ext === 'pdf') {
        // --- 100+ Page PDF RAG Pipeline ---
        dataUrl = await readFileAsDataUrl(file);
        setFileDataUrl(dataUrl);

        setRagProgress({ message: 'Initializing client-side RAG pipeline…', percent: 5 });

        // Step 1: Extract all pages and construct semantic BM25 RAG index
        const ragIndex = await PdfRagEngine.buildIndexFromPdf(file, (msg, pct) => {
          setRagProgress({ message: msg, percent: pct });
        });

        setRagStats({ totalPages: ragIndex.totalPages, totalChunks: ragIndex.totalChunks });

        // Extract raw text for fallback/search storage
        const combinedText = ragIndex.chunks.map(c => `[Page ${c.pageNumber}]: ${c.content}`).join('\n\n');
        setRawText(combinedText);

        if (!GroqClient.isConfigured()) {
          const fallback: DetectedMeta = {
            title: ragIndex.documentTitle,
            subject: 'Engineering Study Material',
            subjectCode: 'KTU',
            moduleNum: 0,
            category: 'lecture_notes',
            tags: ['PDF', `${ragIndex.totalPages} Pages`, `${ragIndex.totalChunks} Chunks`, 'RAG-Ready'],
            summary: `# 📚 ${ragIndex.documentTitle}\n\n> **RAG Index Ready:** ${ragIndex.totalPages} Pages indexed into ${ragIndex.totalChunks} semantic passages.\n> *Configure your Groq / OpenRouter API Key in AI Settings to generate deep multi-module syllabus notes across all ${ragIndex.totalPages} pages.*`
          };
          setMeta(fallback);
          setEditableTitle(fallback.title);
          setStep('preview');
          return;
        }

        // Step 2: Use RAG to generate comprehensive notes for all pages & modules
        setRagProgress({ message: `Generating comprehensive notes for ${ragIndex.totalPages} pages with RAG…`, percent: 75 });

        const { notes, topicBreakdown } = await PdfRagEngine.generateComprehensiveNotes(ragIndex, (status, pct) => {
          setRagProgress({ message: status, percent: pct });
        });

        const detectedMeta: DetectedMeta = {
          title: ragIndex.documentTitle,
          subject: 'Comprehensive Engineering Courseware',
          subjectCode: 'KTU',
          moduleNum: 0,
          category: 'lecture_notes',
          tags: ['RAG-Grounding', `${ragIndex.totalPages} Pages`, `${topicBreakdown.length} Modules`, 'KTU-Exam-Ready'],
          summary: notes
        };

        setMeta(detectedMeta);
        setEditableTitle(detectedMeta.title);
        setStep('preview');
      } else {
        // Image or other files
        dataUrl = await readFileAsDataUrl(file);
        text = `File: ${file.name}\nType: ${ext.toUpperCase()}\nSize: ${(file.size / 1024).toFixed(1)} KB`;
        setFileDataUrl(dataUrl);
        setRawText(text);

        const fallback: DetectedMeta = {
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          subject: 'Uploaded Media',
          subjectCode: 'GEN',
          moduleNum: 0,
          category: 'handwritten_scans',
          tags: [ext.toUpperCase(), 'media'],
          summary: `# ${file.name}\n\nMedia uploaded successfully.`
        };
        setMeta(fallback);
        setEditableTitle(fallback.title);
        setStep('preview');
      }
    } catch (err: any) {
      setError(err.message || 'Analysis failed. You can still save the file manually.');
      setStep('drop');
    }
  };

  const handleTextSubmit = async () => {
    if (!pastedText.trim()) {
      setError('Please paste some text first.');
      return;
    }
    setError('');
    setStep('analysing');
    setRawText(pastedText);

    try {
      if (!GroqClient.isConfigured()) {
        const fallback: DetectedMeta = {
          title: 'Pasted Notes',
          subject: 'General Study Material',
          subjectCode: 'GEN',
          moduleNum: 0,
          category: 'lecture_notes',
          tags: ['pasted', 'notes'],
          summary: pastedText
        };
        setMeta(fallback);
        setEditableTitle(fallback.title);
        setStep('preview');
        return;
      }
      const analysed = await analyseWithAI(pastedText);
      setMeta(analysed);
      setEditableTitle(analysed.title);
      setStep('preview');
    } catch (err: any) {
      setError(err.message || 'AI analysis failed.');
      setStep('drop');
    }
  };

  const handleSave = async () => {
    if (!meta) return;
    setStep('saving');
    try {
      const ext = selectedFile ? getExt(selectedFile.name) : 'md';
      let fileType: UploadedNote['fileType'] = 'text';
      if (ext === 'pdf') fileType = 'pdf';
      else if (ext === 'md' || ext === 'markdown') fileType = 'markdown';
      else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) fileType = 'image';

      const saved = await UploadedNotesStorage.save({
        title: editableTitle.trim() || meta.title,
        subjectCode: meta.subjectCode || 'GEN',
        subjectId: (meta.subjectCode || 'gen').toLowerCase().replace(/\s+/g, '-'),
        subjectTitle: meta.subject || 'General',
        moduleNum: meta.moduleNum ?? 0,
        category: meta.category,
        fileType: textMode ? 'markdown' : fileType,
        fileName: selectedFile?.name || `${editableTitle}.md`,
        fileSize: selectedFile?.size || rawText.length,
        content: textMode ? pastedText : rawText || undefined,
        dataUrl: fileDataUrl || undefined,
        tags: meta.tags,
        author: 'AI-Enhanced Upload',
        aiSummary: meta.summary
      });

      onNoteUploaded(saved);
      setStep('done');
      setTimeout(() => {
        onClose();
        reset();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save note.');
      setStep('preview');
    }
  };

  /* ── render helpers ────────────────────────────── */
  const categoryEmoji: Record<UploadedNote['category'], string> = {
    lecture_notes: '📚',
    handwritten_scans: '✍️',
    summary: '⚡',
    formula_sheet: '📐',
    exam_solutions: '🏆',
    custom: '📄'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-paper-50 border border-line-border w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden font-sans">

        {/* ── Header ── */}
        <div className="px-5 py-4 bg-gradient-to-r from-terracotta/10 to-amber-50 border-b border-line-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-terracotta/15 border border-terracotta/25 flex items-center justify-center text-terracotta">
              <Wand2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-serif-heading font-bold text-ink-900">Smart Note Import</h2>
              <p className="text-[11px] font-mono-code text-ink-500">
                Drop any PDF or text — AI reads it and generates structured notes automatically
              </p>
            </div>
          </div>
          <button onClick={() => { onClose(); reset(); }} className="p-1.5 text-ink-400 hover:text-ink-900 hover:bg-paper-200 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Progress bar ── */}
        <div className="h-1 bg-paper-200">
          <div
            className="h-full bg-terracotta transition-all duration-500"
            style={{ width: step === 'drop' ? '10%' : step === 'analysing' ? '50%' : step === 'preview' ? '75%' : step === 'saving' ? '90%' : '100%' }}
          />
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ── STEP: drop ── */}
          {(step === 'drop') && (
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2 text-xs font-mono-code">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Toggle */}
              <div className="flex gap-2 text-xs font-mono-code">
                <button
                  onClick={() => setTextMode(false)}
                  className={`flex-1 py-2 rounded-lg border transition-all ${!textMode ? 'bg-terracotta text-white border-terracotta font-bold' : 'bg-paper-100 text-ink-600 border-line-border hover:border-terracotta'}`}
                >
                  📂 Upload File (PDF / MD / TXT / Image)
                </button>
                <button
                  onClick={() => setTextMode(true)}
                  className={`flex-1 py-2 rounded-lg border transition-all ${textMode ? 'bg-terracotta text-white border-terracotta font-bold' : 'bg-paper-100 text-ink-600 border-line-border hover:border-terracotta'}`}
                >
                  ✏️ Paste / Type Notes
                </button>
              </div>

              {!textMode ? (
                /* Drop zone */
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all select-none ${isDragging ? 'border-terracotta bg-terracotta/5 scale-[1.01]' : 'border-line-border hover:border-terracotta hover:bg-paper-100'}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.md,.markdown,.png,.jpg,.jpeg,.doc,.docx"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                  <div className="flex flex-col items-center gap-3 text-ink-500">
                    <div className="w-14 h-14 rounded-2xl bg-paper-200 flex items-center justify-center text-2xl">
                      📄
                    </div>
                    <div className="text-sm font-semibold text-ink-700">Drop your file here or click to browse</div>
                    <div className="text-[11px] text-ink-400 font-mono-code">
                      PDF · Markdown · Text · PNG / JPG scans<br />
                      <span className="text-terracotta font-bold mt-1 block">AI will auto-detect subject, module & generate notes</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Paste mode */
                <div className="space-y-2">
                  <label className="text-xs font-mono-code font-bold text-ink-700">Paste or type your notes here:</label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    rows={8}
                    placeholder={`# Module 3 – Greedy Algorithms\n\n## Activity Selection Problem\nGiven n activities with start/finish times...\n\nPaste any raw notes — AI will structure, title and tag them automatically.`}
                    className="w-full p-3 bg-white border border-line-border rounded-lg font-mono-code text-xs text-ink-900 focus:outline-none focus:border-terracotta leading-relaxed resize-none"
                  />
                  <button
                    onClick={handleTextSubmit}
                    disabled={!pastedText.trim()}
                    className="w-full py-2.5 bg-terracotta text-white font-bold text-xs font-mono-code rounded-lg hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
                  >
                    <Brain className="w-4 h-4" />
                    Analyse with AI & Generate Note
                  </button>
                </div>
              )}

              {/* Info callout */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] font-mono-code text-ink-700 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>AI-Powered:</strong> No need to select subject or module. The AI reads your document and auto-detects everything — then creates a structured, KTU-exam-ready note with concepts, formulas, and memory anchors.
                </span>
              </div>
            </div>
          )}

          {/* ── STEP: analysing ── */}
          {step === 'analysing' && (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-5 text-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-terracotta/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-terracotta/10 border-2 border-terracotta flex items-center justify-center">
                  <Brain className="w-7 h-7 text-terracotta animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-1 max-w-md">
                <div className="text-sm font-bold text-ink-900 font-serif-heading">
                  RAG Pipeline Active: Processing Document…
                </div>
                <div className="text-xs text-ink-600 font-mono-code min-h-[36px] flex items-center justify-center">
                  {ragProgress.message || 'Extracting pages · Indexing BM25 tokens · Synthesizing grounded study notes'}
                </div>
              </div>

              {/* Live progress percentage bar */}
              <div className="w-full max-w-sm space-y-1">
                <div className="flex justify-between text-[11px] font-mono-code text-ink-500">
                  <span>Progress</span>
                  <span className="font-bold text-terracotta">{ragProgress.percent}%</span>
                </div>
                <div className="h-2 w-full bg-paper-200 rounded-full overflow-hidden border border-line-border">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-terracotta transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(5, ragProgress.percent)}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {[
                  '100+ Pages Supported',
                  'Client-side PDF Extraction',
                  'BM25 Semantic Retrieval',
                  'Grounded Citations'
                ].map((label, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 bg-paper-100 border border-line-border rounded-full text-[10px] font-mono-code text-ink-600"
                  >
                    ✓ {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP: preview ── */}
          {step === 'preview' && meta && (
            <div className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2 text-xs font-mono-code">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Detected badges */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center justify-between text-xs font-mono-code font-bold text-emerald-800 mb-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> RAG Notes Generation Complete
                  </span>
                  {ragStats && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                      ⚡ {ragStats.totalPages} Pages Grounded · {ragStats.totalChunks} Passages
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono-code">
                  <span className="px-2 py-0.5 bg-white border border-emerald-200 rounded-full text-ink-700">
                    📖 {meta.subject}
                  </span>
                  <span className="px-2 py-0.5 bg-white border border-emerald-200 rounded-full text-ink-700">
                    🏷️ {meta.subjectCode}
                  </span>
                  <span className="px-2 py-0.5 bg-white border border-emerald-200 rounded-full text-ink-700">
                    {meta.moduleNum > 0 ? `📦 Module ${meta.moduleNum}` : '📦 All Modules'}
                  </span>
                  <span className="px-2 py-0.5 bg-white border border-emerald-200 rounded-full text-ink-700">
                    {categoryEmoji[meta.category]} {meta.category.replace(/_/g, ' ')}
                  </span>
                  {meta.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-amber-800">#{t}</span>
                  ))}
                </div>
              </div>

              {/* Editable title */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono-code font-bold text-ink-600 uppercase tracking-wide">Note Title (editable)</label>
                <input
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold text-ink-900 bg-white border border-line-border rounded-lg focus:outline-none focus:border-terracotta"
                />
              </div>

              {/* AI-generated note preview */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono-code font-bold text-ink-600 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> AI-Generated Study Note Preview
                </label>
                <div className="bg-white border border-line-border rounded-lg p-4 max-h-56 overflow-y-auto text-xs font-mono-code text-ink-700 leading-relaxed whitespace-pre-wrap">
                  {meta.summary}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono-code text-ink-600 hover:text-ink-900 border border-line-border rounded-lg hover:border-ink-400 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start Over
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-terracotta text-white text-xs font-bold font-mono-code rounded-lg hover:opacity-90 transition-all shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Save to Note Vault
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: saving ── */}
          {step === 'saving' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
              <Cpu className="w-10 h-10 text-terracotta animate-spin" />
              <div className="text-sm font-bold text-ink-900">Saving to Note Vault…</div>
            </div>
          )}

          {/* ── STEP: done ── */}
          {step === 'done' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-ink-900">Note saved successfully!</div>
              <div className="text-xs font-mono-code text-ink-500">Find it in your module notes view</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
