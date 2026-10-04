import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

export const DijkstraLab: React.FC<{ isBreakMode?: boolean }> = ({ isBreakMode = false }) => {
  // Graph definition:
  // Nodes: S (0, start), A, B, C, D
  // Edges: (S,A)=3, (S,B)=5, (A,B)=-4 (in break mode) or 1 (normal), (A,C)=6, (B,C)=2, (C,D)=3
  const [visited, setVisited] = useState<string[]>(['S']);
  const [distances, setDistances] = useState<Record<string, number>>({
    S: 0,
    A: 3,
    B: 5,
    C: Infinity,
    D: Infinity
  });
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [breakTriggered, setBreakTriggered] = useState<boolean>(isBreakMode);

  const edgeWeightAB = breakTriggered ? -4 : 1;

  const resetSim = (neg = isBreakMode) => {
    setBreakTriggered(neg);
    setVisited(['S']);
    setDistances({ S: 0, A: 3, B: 5, C: Infinity, D: Infinity });
    setStepIndex(0);
  };

  const stepDijkstra = () => {
    if (stepIndex === 0) {
      // Step 1: Finalize A (dist 3)
      setVisited(prev => [...prev, 'A']);
      const newDistB = breakTriggered ? Math.min(5, 3 + edgeWeightAB) : Math.min(5, 3 + 1);
      setDistances(prev => ({
        ...prev,
        A: 3,
        B: newDistB,
        C: 3 + 6 // 9
      }));
      setStepIndex(1);
    } else if (stepIndex === 1) {
      // Step 2: Finalize B (dist -1 in break mode or 4)
      setVisited(prev => [...prev, 'B']);
      setDistances(prev => ({
        ...prev,
        C: Math.min(prev.C, prev.B + 2) // relax C via B
      }));
      setStepIndex(2);
    } else if (stepIndex === 2) {
      // Step 3: Finalize C
      setVisited(prev => [...prev, 'C']);
      setDistances(prev => ({
        ...prev,
        D: prev.C + 3
      }));
      setStepIndex(3);
    } else if (stepIndex === 3) {
      // Step 4: Finalize D
      setVisited(prev => [...prev, 'D']);
      setStepIndex(4);
    }
  };

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 font-sans space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
            GREEDY GRAPH // SHORTEST PATH RELAXATION LAB
          </div>
          <h4 className="text-base font-semibold text-ink-900 font-serif-heading">
            Dijkstra vs Negative Edge Weight Invariant
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {breakTriggered ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-red-100 text-red-800 border border-red-300 rounded font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              GREEDY INVARIANT BROKEN (Negative Edge A→B = -4)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-paper-200 text-ink-700 border border-line-border rounded">
              <Zap className="w-3.5 h-3.5 text-terracotta" />
              NON-NEGATIVE WEIGHTS (VALID)
            </span>
          )}
        </div>
      </div>

      {/* SVG Weighted Graph Display */}
      <div className="bg-white border border-line-border rounded p-4 relative paper-grid">
        <svg viewBox="0 0 520 180" className="w-full h-44 select-none">
          {/* Edges */}
          {/* S -> A */}
          <line x1="70" y1="90" x2="180" y2="40" stroke="#71717A" strokeWidth="2" />
          <text x="115" y="55" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">3</text>

          {/* S -> B */}
          <line x1="70" y1="90" x2="180" y2="140" stroke="#71717A" strokeWidth="2" />
          <text x="115" y="130" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">5</text>

          {/* A -> B */}
          <line x1="180" y1="40" x2="180" y2="140" stroke={breakTriggered ? '#DC2626' : '#71717A'} strokeWidth={breakTriggered ? 2.5 : 1.5} />
          <text x="185" y="95" fill={breakTriggered ? '#DC2626' : '#3F3F46'} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
            {edgeWeightAB}
          </text>

          {/* A -> C */}
          <line x1="180" y1="40" x2="330" y2="60" stroke="#71717A" strokeWidth="2" />
          <text x="250" y="45" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">6</text>

          {/* B -> C */}
          <line x1="180" y1="140" x2="330" y2="60" stroke="#71717A" strokeWidth="2" />
          <text x="250" y="115" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">2</text>

          {/* C -> D */}
          <line x1="330" y1="60" x2="450" y2="90" stroke="#71717A" strokeWidth="2" />
          <text x="390" y="70" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">3</text>

          {/* Nodes */}
          {/* S */}
          <g transform="translate(70, 90)">
            <circle r="20" fill={visited.includes('S') ? '#FFEDD5' : '#FFFFFF'} stroke={visited.includes('S') ? '#C2410C' : '#27272A'} strokeWidth="2" />
            <text textAnchor="middle" dy="4" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">S: {distances.S}</text>
          </g>

          {/* A */}
          <g transform="translate(180, 40)">
            <circle r="20" fill={visited.includes('A') ? '#FFEDD5' : '#FFFFFF'} stroke={visited.includes('A') ? '#C2410C' : '#27272A'} strokeWidth="2" />
            <text textAnchor="middle" dy="4" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">A: {distances.A}</text>
          </g>

          {/* B */}
          <g transform="translate(180, 140)">
            <circle r="20" fill={visited.includes('B') ? '#FFEDD5' : '#FFFFFF'} stroke={visited.includes('B') ? '#C2410C' : '#27272A'} strokeWidth="2" />
            <text textAnchor="middle" dy="4" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">B: {distances.B}</text>
          </g>

          {/* C */}
          <g transform="translate(330, 60)">
            <circle r="20" fill={visited.includes('C') ? '#FFEDD5' : '#FFFFFF'} stroke={visited.includes('C') ? '#C2410C' : '#27272A'} strokeWidth="2" />
            <text textAnchor="middle" dy="4" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">
              C: {distances.C === Infinity ? '∞' : distances.C}
            </text>
          </g>

          {/* D (Goal) */}
          <g transform="translate(450, 90)">
            <circle r="20" fill={visited.includes('D') ? '#DCFCE7' : '#FFFFFF'} stroke={visited.includes('D') ? '#15803D' : '#27272A'} strokeWidth="2" />
            <text textAnchor="middle" dy="4" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">
              D*: {distances.D === Infinity ? '∞' : distances.D}
            </text>
          </g>
        </svg>

        {/* Telemetry */}
        <div className="flex items-center justify-between text-xs font-mono-code text-ink-600 border-t border-line-border pt-2">
          <span>Visited / Finalized: &#123;{visited.join(', ')}&#125;</span>
          <span>Shortest Path to D: <strong>{distances.D === Infinity ? 'Searching...' : `${distances.D} units`}</strong></span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={stepDijkstra}
            disabled={stepIndex >= 4}
            className="px-3.5 py-1.5 text-xs font-mono-code bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            STEP EXTRACT MIN & RELAX
          </button>
          <button
            onClick={() => resetSim(breakTriggered)}
            className="p-1.5 text-ink-600 border border-line-border rounded hover:bg-paper-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Break mode toggle */}
        <button
          onClick={() => resetSim(!breakTriggered)}
          className={`text-xs font-mono-code px-3 py-1 rounded border transition-colors ${
            breakTriggered
              ? 'bg-paper-200 border-line-border text-ink-700'
              : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100 font-semibold'
          }`}
        >
          {breakTriggered ? 'Restore Positive Edge Weights (Valid)' : '💥 Inject Negative Edge (A→B = -4)'}
        </button>
      </div>
    </div>
  );
};
