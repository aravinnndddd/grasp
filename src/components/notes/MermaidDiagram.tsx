import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const renderMermaid = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Dynamic import so it does not bloat the initial page load bundle
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
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

        // Clean chart code: remove any accidental backticks or language tags
        const cleanChart = chart
          .replace(/^```[a-z]*/i, '')
          .replace(/```$/, '')
          .trim();

        const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, cleanChart);

        if (isMounted) {
          setSvgContent(svg);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.warn('Mermaid render issue:', err);
        if (isMounted) {
          setError(err?.message || 'Syntax parsing error in diagram definition');
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

  // Fallback to stylized technical schematic if syntax error occurs
  if (error) {
    return (
      <div className="my-3 p-3 bg-paper-dark border border-line-border rounded font-mono text-xs text-charcoal">
        <div className="text-[10px] text-amber-800 font-bold uppercase mb-1 flex items-center justify-between border-b border-line-border/60 pb-1">
          <span>[ARCHITECTURE SCHEMATIC]</span>
          <span className="text-[9px] text-amber-700">TEXT FALLBACK</span>
        </div>
        <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[11px]">{chart}</pre>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="my-3 p-6 bg-white/80 border border-line-border rounded flex items-center justify-center gap-2 text-xs font-mono text-charcoal-muted animate-pulse">
        <div className="w-3.5 h-3.5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span>Rendering Visual Diagram...</span>
      </div>
    );
  }

  return (
    <div className={`my-3 p-4 bg-white border border-line-border rounded shadow-2xs overflow-x-auto flex flex-col items-center ${className}`}>
      <div className="w-full flex items-center justify-between pb-1.5 mb-2 border-b border-line-border/50 text-[10px] font-mono text-charcoal-muted uppercase">
        <span className="font-bold text-accent">Interactive Architecture Schematic</span>
        <span>Vector SVG</span>
      </div>
      <div 
        ref={containerRef}
        className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};
