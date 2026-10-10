import React, { useEffect, useRef, useState } from 'react';
import { Layers, RefreshCw, Code, Eye, AlertCircle } from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

/**
 * Normalizes and sanitizes any Mermaid chart string:
 * 1. Replaces unicode dashes, box-drawing characters (─, ━, —, –) with ASCII hyphens
 * 2. Replaces unicode arrows (→, ⟶) with standard Mermaid arrows (--> or ->)
 * 3. Automatically wraps unquoted node labels containing parentheses, brackets, or punctuation in double quotes
 * 4. Ensures a valid diagram header is present
 */
export function sanitizeMermaidChart(rawChart: string): string {
  if (!rawChart) return '';

  let code = rawChart
    .replace(/^```[a-z0-9_-]*/gi, '')
    .replace(/```$/g, '')
    .trim();

  // 1. Replace unicode quotation marks
  code = code
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  // 2. Replace unicode horizontal box-drawing characters and dashes (e.g. ──>, ─>, —>, –>)
  // \u2500 = ─ (Box Drawings Light Horizontal)
  // \u2501 = ━ (Box Drawings Heavy Horizontal)
  // \u2014 = — (Em Dash)
  // \u2013 = – (En Dash)
  // \u2212 = − (Minus Sign)
  code = code
    .replace(/[\u2500\u2501\u2014\u2013\u2212]{2,}>/g, '-->')
    .replace(/[\u2500\u2501\u2014\u2013\u2212]>/g, '-->')
    .replace(/[\u2500\u2501\u2014\u2013\u2212]{2,}/g, '--')
    .replace(/[\u2192\u27F6]/g, '-->')
    .replace(/--\s+>/g, '-->')
    .replace(/==\s+>/g, '==>')
    .replace(/-\.\s*->/g, '-.->');

  // 3. Ensure a valid diagram header
  const lines = code.split('\n');
  const firstNonEmpty = lines.find(l => l.trim().length > 0)?.trim().toLowerCase() || '';
  const validHeaders = [
    'graph',
    'flowchart',
    'sequencediagram',
    'statediagram',
    'classdiagram',
    'mindmap',
    'erdiagram',
    'gantt',
    'pie',
    'gitgraph',
    'c4context'
  ];
  const hasValidHeader = validHeaders.some(h => firstNonEmpty.startsWith(h));

  if (!hasValidHeader) {
    code = 'flowchart TD\n' + code;
  }

  // 4. Line-by-line sanitization of unquoted node labels
  const processedLines = code.split('\n').map(line => {
    let l = line;
    const trimmed = l.trim().toLowerCase();

    // Skip diagram keywords, directives, subgraphs, comments, and styles
    if (
      trimmed.startsWith('graph ') ||
      trimmed.startsWith('flowchart ') ||
      trimmed.startsWith('sequencediagram') ||
      trimmed.startsWith('statediagram') ||
      trimmed.startsWith('classdiagram') ||
      trimmed.startsWith('mindmap') ||
      trimmed.startsWith('style ') ||
      trimmed.startsWith('classdef ') ||
      trimmed.startsWith('%%') ||
      trimmed.startsWith('subgraph ') ||
      trimmed === 'end' ||
      trimmed.startsWith('note ') ||
      trimmed.startsWith('autonumber')
    ) {
      return l;
    }

    // A. Fix unquoted square brackets: Node[Text with (parens) or symbols] -> Node["Text with (parens) or symbols"]
    // Matches: ID[text] where text doesn't start with " or '
    l = l.replace(/([a-zA-Z0-9_\u00C0-\u017F-]+)\[([^"'\n\]]+)\]/g, (match, id, text) => {
      // Don't modify if already quoted or empty
      if (text.startsWith('"') && text.endsWith('"')) return match;
      const clean = text.replace(/"/g, "'").trim();
      return `${id}["${clean}"]`;
    });

    // B. Fix unquoted decision rhombuses: Node{Decision question ?} -> Node{"Decision question ?"}
    l = l.replace(/([a-zA-Z0-9_\u00C0-\u017F-]+)\{([^"'\n\}]+)\}/g, (match, id, text) => {
      if (text.startsWith('"') && text.endsWith('"')) return match;
      const clean = text.replace(/"/g, "'").trim();
      return `${id}{"${clean}"}`;
    });

    // C. Fix unquoted rounded nodes: Node(Some text) -> Node("Some text")
    // Avoid double parens (( )) which are circle nodes
    l = l.replace(/([a-zA-Z0-9_\u00C0-\u017F-]+)\((?!\()([^"'\n\)]+)\)(?!\))/g, (match, id, text) => {
      if (id.toLowerCase() === 'subgraph' || id.toLowerCase() === 'style') return match;
      if (text.startsWith('"') && text.endsWith('"')) return match;
      const clean = text.replace(/"/g, "'").trim();
      return `${id}("${clean}")`;
    });

    // D. Fix unquoted circle nodes: Node((Some text)) -> Node(("Some text"))
    l = l.replace(/([a-zA-Z0-9_\u00C0-\u017F-]+)\(\(([^"'\n\)]+)\)\)/g, (match, id, text) => {
      if (text.startsWith('"') && text.endsWith('"')) return match;
      const clean = text.replace(/"/g, "'").trim();
      return `${id}(("${clean}"))`;
    });

    return l;
  });

  return processedLines.join('\n');
}

/**
 * Built-in native SVG diagram generator:
 * If Mermaid encounters an unrecoverable syntax issue, this parses nodes and edges
 * and generates a clean, responsive vector SVG diagram so the student ALWAYS sees
 * an authentic visual flowchart instead of raw text.
 */
function renderNativeSvgFlowchart(chartSource: string): string {
  interface NodeItem {
    id: string;
    label: string;
    type: 'process' | 'decision' | 'start';
  }

  interface EdgeItem {
    from: string;
    to: string;
    label?: string;
  }

  const nodes = new Map<string, NodeItem>();
  const edges: EdgeItem[] = [];

  const lines = chartSource.split('\n');

  lines.forEach(rawLine => {
    const line = rawLine.trim();
    if (!line || line.startsWith('graph') || line.startsWith('flowchart') || line.startsWith('style') || line.startsWith('%%')) return;

    // Detect edges: e.g. A["..."] -->|label| B["..."] or A --> B
    const edgeMatch = line.match(/([a-zA-Z0-9_-]+)(?:\["?(.*?)"?\]|\{"?(.*?)"?\}|\("?(.*?)"?\))?\s*(?:-->|==>|-.->)\s*(?:\|(.*?)\|)?\s*([a-zA-Z0-9_-]+)(?:\["?(.*?)"?\]|\{"?(.*?)"?\}|\("?(.*?)"?\))?/);

    if (edgeMatch) {
      const fromId = edgeMatch[1];
      const fromLabel = edgeMatch[2] || edgeMatch[3] || edgeMatch[4] || fromId;
      const edgeLabel = edgeMatch[5]?.trim();
      const toId = edgeMatch[6];
      const toLabel = edgeMatch[7] || edgeMatch[8] || edgeMatch[9] || toId;

      if (!nodes.has(fromId)) {
        nodes.set(fromId, {
          id: fromId,
          label: fromLabel,
          type: edgeMatch[3] ? 'decision' : 'process'
        });
      }

      if (!nodes.has(toId)) {
        nodes.set(toId, {
          id: toId,
          label: toLabel,
          type: edgeMatch[8] ? 'decision' : 'process'
        });
      }

      edges.push({
        from: fromId,
        to: toId,
        label: edgeLabel
      });
    } else {
      // Standalone node definitions
      const nodeMatch = line.match(/([a-zA-Z0-9_-]+)(?:\["?(.*?)"?\]|\{"?(.*?)"?\}|\("?(.*?)"?\))/);
      if (nodeMatch) {
        const id = nodeMatch[1];
        const label = nodeMatch[2] || nodeMatch[3] || nodeMatch[4] || id;
        if (!nodes.has(id)) {
          nodes.set(id, {
            id,
            label,
            type: nodeMatch[3] ? 'decision' : 'process'
          });
        }
      }
    }
  });

  const nodeList = Array.from(nodes.values());
  if (nodeList.length === 0) {
    return '';
  }

  // Layout parameters for responsive SVG flowchart
  const nodeWidth = 320;
  const nodeHeight = 56;
  const gapY = 50;
  const paddingX = 40;
  const paddingY = 40;

  const totalHeight = paddingY * 2 + nodeList.length * nodeHeight + (nodeList.length - 1) * gapY;
  const totalWidth = nodeWidth + paddingX * 2;

  const nodePositions = new Map<string, { x: number; y: number }>();

  nodeList.forEach((n, idx) => {
    nodePositions.set(n.id, {
      x: paddingX,
      y: paddingY + idx * (nodeHeight + gapY)
    });
  });

  // Generate SVG elements
  const nodesSvg = nodeList.map((node, idx) => {
    const pos = nodePositions.get(node.id)!;
    const isDecision = node.type === 'decision';
    const isFirst = idx === 0;
    const isLast = idx === nodeList.length - 1;

    let fillBg = '#FFF7ED';
    let strokeCol = '#EA580C';
    let textCol = '#9A3412';

    if (isFirst) {
      fillBg = '#EFF6FF';
      strokeCol = '#3B82F6';
      textCol = '#1E40AF';
    } else if (isLast) {
      fillBg = '#F0FDF4';
      strokeCol = '#22C55E';
      textCol = '#166534';
    } else if (isDecision) {
      fillBg = '#FEFCE8';
      strokeCol = '#EAB308';
      textCol = '#854D0E';
    }

    return `
      <g class="flow-node" transform="translate(${pos.x}, ${pos.y})">
        <rect width="${nodeWidth}" height="${nodeHeight}" rx="8" fill="${fillBg}" stroke="${strokeCol}" stroke-width="2" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"/>
        <text x="${nodeWidth / 2}" y="${nodeHeight / 2 + 4}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="600" fill="${textCol}">
          ${escapeXml(node.label.length > 42 ? node.label.slice(0, 40) + '…' : node.label)}
        </text>
      </g>
    `;
  }).join('');

  // Generate connector lines & arrows
  const edgesSvg = edges.map(edge => {
    const fromPos = nodePositions.get(edge.from);
    const toPos = nodePositions.get(edge.to);
    if (!fromPos || !toPos) return '';

    const startX = fromPos.x + nodeWidth / 2;
    const startY = fromPos.y + nodeHeight;
    const endX = toPos.x + nodeWidth / 2;
    const endY = toPos.y;

    const labelSvg = edge.label ? `
      <g transform="translate(${(startX + endX) / 2}, ${(startY + endY) / 2})">
        <rect x="-45" y="-10" width="90" height="20" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
        <text x="0" y="3.5" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="600" fill="#475569">
          ${escapeXml(edge.label.slice(0, 16))}
        </text>
      </g>
    ` : '';

    return `
      <g class="flow-edge">
        <path d="M ${startX} ${startY} L ${endX} ${endY}" stroke="#94A3B8" stroke-width="2" marker-end="url(#arrowhead)"/>
        ${labelSvg}
      </g>
    `;
  }).join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="100%" style="max-width: 580px; height: auto;">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94A3B8"/>
        </marker>
      </defs>
      ${edgesSvg}
      ${nodesSvg}
    </svg>
  `;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [nativeFallbackSvg, setNativeFallbackSvg] = useState<string>('');
  const [showRawCode, setShowRawCode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const renderMermaid = async () => {
      setIsLoading(true);
      setError(null);
      setSvgContent('');
      setNativeFallbackSvg('');

      // Clean and sanitize the diagram code
      const sanitized = sanitizeMermaidChart(chart);

      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
          themeVariables: {
            primaryColor: '#F5F4EE',
            primaryTextColor: '#18181B',
            primaryBorderColor: '#C2410C',
            lineColor: '#52525B',
            secondaryColor: '#FEF08A',
            tertiaryColor: '#FFFFFF'
          }
        });

        const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;

        try {
          const { svg } = await mermaid.render(uniqueId, sanitized);
          if (isMounted) {
            setSvgContent(svg);
            setIsLoading(false);
            return;
          }
        } catch (firstPassError) {
          console.warn('Initial Mermaid pass failed, attempting auto-repair:', firstPassError);

          // Clean up any error DOM elements injected by mermaid
          const errEl = document.getElementById(`d${uniqueId}`);
          if (errEl) errEl.remove();

          // Second Pass: aggressively strip nested characters and retry
          const aggressiveClean = sanitized
            .replace(/style\s+.*$/gm, '') // Strip inline styles that might have invalid syntax
            .replace(/\["([^"]*?)"\]/g, (m, text) => `["${text.replace(/[^a-zA-Z0-9\s,\-\.\:\/]/g, ' ')}"]`);

          const retryId = `mermaid-retry-${Math.random().toString(36).substring(2, 9)}`;
          const { svg: retrySvg } = await mermaid.render(retryId, aggressiveClean);

          if (isMounted) {
            setSvgContent(retrySvg);
            setIsLoading(false);
            return;
          }
        }
      } catch (finalError: any) {
        console.warn('Mermaid render encountered error, engaging native SVG engine:', finalError);

        // Clean up any DOM artifacts
        document.querySelectorAll('[id^="dmermaid-"]').forEach(el => el.remove());

        if (isMounted) {
          // Fallback to high-quality native SVG flowchart
          const nativeSvg = renderNativeSvgFlowchart(sanitized);
          if (nativeSvg) {
            setNativeFallbackSvg(nativeSvg);
          } else {
            setError(finalError?.message || 'Syntax error in diagram definition');
          }
          setIsLoading(false);
        }
      }
    };

    if (chart && chart.trim()) {
      renderMermaid();
    }

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (isLoading) {
    return (
      <div className="my-3 p-6 bg-white/90 border border-line-border rounded-xl flex items-center justify-center gap-2 text-xs font-mono text-ink-500 animate-pulse">
        <div className="w-3.5 h-3.5 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
        <span>Synthesizing Vector Architecture Diagram…</span>
      </div>
    );
  }

  // If Mermaid succeeded or Native SVG fallback is ready
  const activeSvg = svgContent || nativeFallbackSvg;

  if (activeSvg) {
    return (
      <div className={`my-3 p-4 bg-white border border-line-border rounded-xl shadow-2xs overflow-x-auto flex flex-col items-center ${className}`}>
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-line-border/60 text-[10px] font-mono-code text-ink-500 uppercase">
          <div className="flex items-center gap-1.5 font-bold text-terracotta">
            <Layers className="w-3.5 h-3.5" />
            <span>{svgContent ? 'Interactive Vector Schematic' : 'Native SVG Flowchart'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawCode(!showRawCode)}
              className="text-ink-600 hover:text-ink-900 flex items-center gap-1 cursor-pointer transition-colors"
              title="Toggle raw diagram syntax"
            >
              <Code className="w-3 h-3" />
              <span>{showRawCode ? 'Hide Code' : 'View Code'}</span>
            </button>
            <span className="px-1.5 py-0.5 bg-paper-100 border border-line-border rounded text-[9px] text-ink-600">
              VECTOR SVG
            </span>
          </div>
        </div>

        {/* Visual SVG Schematic Container */}
        <div 
          ref={containerRef}
          className="w-full flex justify-center py-2 [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:transition-transform"
          dangerouslySetInnerHTML={{ __html: activeSvg }}
        />

        {/* Optional Code Inspector Drawer */}
        {showRawCode && (
          <div className="w-full mt-3 p-3 bg-paper-100 border border-line-border rounded-lg text-[11px] font-mono-code text-ink-800 overflow-x-auto">
            <div className="text-[10px] text-ink-500 font-bold mb-1 uppercase">Mermaid Source:</div>
            <pre className="whitespace-pre leading-relaxed">{chart}</pre>
          </div>
        )}
      </div>
    );
  }

  // Extreme fallback if both engines encountered empty data
  return (
    <div className="my-3 p-4 bg-paper-50 border border-line-border rounded-xl font-mono-code text-xs text-ink-800 space-y-2">
      <div className="text-[11px] text-amber-800 font-bold uppercase flex items-center justify-between border-b border-line-border/80 pb-1.5">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Architecture Schematic Code</span>
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(chart);
          }}
          className="px-2 py-0.5 bg-white border border-line-border rounded text-[10px] text-ink-700 hover:bg-paper-100 cursor-pointer"
        >
          Copy Code
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[11px] bg-white p-3 rounded-lg border border-line-border/70">{chart}</pre>
    </div>
  );
};
