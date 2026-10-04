import React, { useState } from 'react';
import { 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Info, 
  Layers, 
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { MermaidDiagram } from './MermaidDiagram';
import { resolveDiagram, ResolvedDiagram } from '../../lib/diagrams/diagram-resolver';

interface QuestionDiagramRendererProps {
  diagramDescription?: string;
  diagramCode?: string;
  questionTitle?: string;
  className?: string;
}

export const QuestionDiagramRenderer: React.FC<QuestionDiagramRendererProps> = ({
  diagramDescription,
  diagramCode,
  questionTitle = '',
  className = ''
}) => {
  if (!diagramDescription && !diagramCode) return null;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const resolved: ResolvedDiagram = diagramCode 
    ? {
        type: 'mermaid',
        title: questionTitle || 'Architecture Diagram',
        code: diagramCode,
        caption: diagramDescription || 'Official technical schematic'
      }
    : resolveDiagram(diagramDescription || '', questionTitle);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(resolved.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`my-4 border border-amber-500/40 bg-white shadow-xs overflow-hidden transition-all ${className} ${isExpanded ? 'p-4' : 'p-3'}`}>
      
      {/* Top Banner / Technical Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-line-border/70 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">
            <ImageIcon className="w-3 h-3" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
              KTU Mandatory Architecture Diagram
            </span>
            <span className="font-serif font-bold text-charcoal text-xs sm:text-sm">
              {resolved.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setShowCode(!showCode)}
            className="px-2 py-0.5 bg-paper hover:bg-paper-light border border-hairline hover:border-accent text-charcoal text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
            title="Toggle Mermaid diagram source code"
          >
            <FileCode className="w-3 h-3 text-accent" />
            <span>{showCode ? 'View Diagram' : 'View Code'}</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="p-1 hover:bg-paper-light border border-hairline rounded text-charcoal cursor-pointer"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-paper-light border border-hairline rounded text-charcoal cursor-pointer"
            title={isExpanded ? 'Normal View' : 'Maximize Diagram'}
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Diagram Render or Code View */}
      {showCode ? (
        <div className="p-3 bg-slate-900 text-slate-100 rounded text-xs font-mono overflow-x-auto my-2">
          <pre className="whitespace-pre leading-relaxed">{resolved.code}</pre>
        </div>
      ) : (
        <div className={`overflow-x-auto py-2 flex justify-center bg-paper-50/50 rounded border border-line-border/40 ${isExpanded ? 'min-h-[380px]' : ''}`}>
          <MermaidDiagram chart={resolved.code} className="w-full max-w-3xl" />
        </div>
      )}

      {/* Evaluator Pro-Tip & Caption */}
      <div className="mt-2.5 pt-2 border-t border-line-border/60 flex items-start gap-2 text-xs font-mono">
        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <p className="text-charcoal font-medium text-[11px]">
            <strong>Evaluator Key:</strong> {resolved.caption || diagramDescription}
          </p>
          <p className="text-[10px] text-amber-700 font-semibold">
            ⭐ KTU valuation camps allocate 2.5 to 3 marks strictly for reproducing this labeled diagram.
          </p>
        </div>
      </div>

    </div>
  );
};
