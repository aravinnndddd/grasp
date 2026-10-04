import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Maximize2, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  Info
} from 'lucide-react';
import { ModuleNoteItem } from '../../data/notes/module-notes-db';
import { MermaidDiagram } from './MermaidDiagram';
import { resolveDiagram, ResolvedDiagram } from '../../lib/diagrams/diagram-resolver';

interface ModuleDiagramsGalleryProps {
  currentModule: ModuleNoteItem;
  subjectCode: string;
  subjectTitle: string;
}

interface DiagramCardItem {
  id: string;
  sourceQuestion: string;
  markType: '5-Mark' | '8-Mark' | 'Core Concept';
  resolved: ResolvedDiagram;
}

export const ModuleDiagramsGallery: React.FC<ModuleDiagramsGalleryProps> = ({
  currentModule,
  subjectCode,
  subjectTitle
}) => {
  const [selectedDiagramId, setSelectedDiagramId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collect all diagrams from 5-mark and 8-mark questions
  const diagramCards: DiagramCardItem[] = [];

  currentModule.questions5Mark.forEach((q, idx) => {
    if (q.diagramDescription) {
      diagramCards.push({
        id: `5m-${idx}`,
        sourceQuestion: q.question,
        markType: '5-Mark',
        resolved: resolveDiagram(q.diagramDescription, q.question)
      });
    }
  });

  currentModule.questions8Mark.forEach((q, idx) => {
    if (q.diagramDescription) {
      diagramCards.push({
        id: `8m-${idx}`,
        sourceQuestion: q.question,
        markType: '8-Mark',
        resolved: resolveDiagram(q.diagramDescription, q.question)
      });
    }
  });

  // If no diagrams exist in questions, generate conceptual diagrams from module title
  if (diagramCards.length === 0) {
    diagramCards.push({
      id: `concept-main`,
      sourceQuestion: currentModule.title,
      markType: 'Core Concept',
      resolved: resolveDiagram(currentModule.title, currentModule.title)
    });
  }

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-none bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-charcoal">
                Visual Diagrams &amp; Architecture Schematics
              </h2>
              <span className="text-xs font-mono font-bold bg-accent/10 text-accent border border-accent/20 px-2 py-0.5">
                {diagramCards.length} Vector Diagrams
              </span>
            </div>
            <p className="text-[11px] font-mono text-charcoal-muted">
              Mandatory KTU valuation schematics, protocol state machines, packet formats, and algorithm flowcharts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-charcoal-muted">
            {subjectCode} • Module {currentModule.moduleNum}
          </span>
        </div>
      </div>

      {/* Diagrams Grid */}
      <div className="grid grid-cols-1 gap-6">
        {diagramCards.map((item, idx) => (
          <div 
            key={item.id}
            className="p-5 bg-white border border-charcoal/20 shadow-xs space-y-4 hover:border-accent/40 transition-all"
          >
            {/* Card Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line-border/60 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                    item.markType === '8-Mark' 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {item.markType} Mandatory Diagram
                  </span>
                  <span className="text-[11px] font-mono text-charcoal-muted">
                    Fig {idx + 1}.0
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-charcoal">
                  {item.resolved.title}
                </h3>
                <p className="text-xs font-mono text-charcoal-muted line-clamp-1">
                  Target Question: "{item.sourceQuestion}"
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopy(item.resolved.code, item.id)}
                  className="px-2.5 py-1 text-xs font-mono bg-paper hover:bg-paper-light border border-hairline hover:border-accent text-charcoal flex items-center gap-1 cursor-pointer transition-colors"
                  title="Copy Mermaid Code"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            {/* Visual Mermaid Render */}
            <div className="p-4 bg-paper-50 rounded border border-line-border/60 flex justify-center overflow-x-auto min-h-[220px]">
              <MermaidDiagram chart={item.resolved.code} className="w-full max-w-4xl" />
            </div>

            {/* Description / Caption */}
            <div className="pt-2 flex items-start gap-2 text-xs font-mono text-charcoal-muted bg-paper-light p-3 border border-hairline">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-charcoal font-medium leading-relaxed">
                  <strong>Technical Mechanics:</strong> {item.resolved.caption}
                </p>
                <p className="text-[10px] text-amber-800 font-semibold">
                  KTU Valuation Camp Standard: Draw neat labeled blocks/timelines with clear state transitions to earn full marks.
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
