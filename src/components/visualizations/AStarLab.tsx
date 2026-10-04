import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export const AStarLab: React.FC<{ isBreakMode?: boolean }> = ({ isBreakMode = false }) => {
  // 5x5 Grid
  // S at (0, 0), G at (4, 4)
  // Wall at (2, 1), (2, 2), (2, 3)
  const [visitedCells, setVisitedCells] = useState<string[]>(['0,0']);
  const [currentCell, setCurrentCell] = useState<string>('0,0');
  const [heuristicMultiplier, setHeuristicMultiplier] = useState<number>(isBreakMode ? 3.5 : 1.0);
  const [step, setStep] = useState<number>(0);

  const goal = { r: 4, c: 4 };

  const manhattan = (r: number, c: number) => {
    return Math.abs(goal.r - r) + Math.abs(goal.c - c);
  };

  const resetLab = (mult = heuristicMultiplier) => {
    setVisitedCells(['0,0']);
    setCurrentCell('0,0');
    setStep(0);
    setHeuristicMultiplier(mult);
  };

  const stepAStar = () => {
    if (step === 0) {
      setVisitedCells(prev => [...prev, '0,1', '1,0']);
      setCurrentCell('1,0');
      setStep(1);
    } else if (step === 1) {
      setVisitedCells(prev => [...prev, '2,0', '1,1']);
      setCurrentCell('2,0');
      setStep(2);
    } else if (step === 2) {
      setVisitedCells(prev => [...prev, '3,0', '3,1']);
      setCurrentCell('3,0');
      setStep(3);
    } else if (step === 3) {
      setVisitedCells(prev => [...prev, '4,0', '3,2', '4,1', '4,2', '4,3', '4,4']);
      setCurrentCell('4,4');
      setStep(4);
    }
  };

  const isGoalReached = currentCell === '4,4';

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 font-sans space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
            INFORMED SEARCH // HEURISTIC EVALUATION LAB
          </div>
          <h4 className="text-base font-semibold text-ink-900 font-serif-heading">
            A* Grid Navigation: f(n) = g(n) + h(n)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {heuristicMultiplier > 1.0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-red-100 text-red-800 border border-red-300 rounded font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              INADMISSIBLE HEURISTIC (h &gt; h*, Overestimates cost!)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-green-100 text-green-800 border border-green-300 rounded font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              ADMISSIBLE HEURISTIC (Optimal path guaranteed)
            </span>
          )}
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="bg-white border border-line-border p-4 rounded flex flex-col md:flex-row items-center justify-center gap-6 paper-grid">
        <div className="grid grid-cols-5 gap-1.5 p-2 bg-paper-100 border border-line-border rounded">
          {Array.from({ length: 5 }).map((_, r) => (
            <React.Fragment key={r}>
              {Array.from({ length: 5 }).map((_, c) => {
                const key = `${r},${c}`;
                const isStart = r === 0 && c === 0;
                const isGoal = r === 4 && c === 4;
                const isWall = r === 2 && (c === 1 || c === 2 || c === 3);
                const isVisited = visitedCells.includes(key);
                const isCurrent = currentCell === key;

                const h = Math.round(manhattan(r, c) * heuristicMultiplier);
                const g = r + c;
                const f = g + h;

                return (
                  <div
                    key={key}
                    className={`w-14 h-14 rounded border flex flex-col items-center justify-center font-mono-code text-[10px] transition-all relative ${
                      isWall
                        ? 'bg-ink-800 border-ink-900 text-white font-bold'
                        : isCurrent
                        ? 'bg-terracotta text-white font-bold ring-2 ring-terracotta shadow-md'
                        : isGoal
                        ? 'bg-green-100 border-green-500 text-green-950 font-bold'
                        : isStart
                        ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold'
                        : isVisited
                        ? 'bg-paper-200 border-line-border text-ink-800'
                        : 'bg-white border-line-border text-ink-400'
                    }`}
                  >
                    {isWall ? (
                      <span className="text-[9px]">WALL</span>
                    ) : isStart ? (
                      <span>START</span>
                    ) : isGoal ? (
                      <span>GOAL</span>
                    ) : (
                      <>
                        <div className="text-[9px] font-bold">f={f}</div>
                        <div className="text-[8px] opacity-75">g={g} h={h}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Telemetry card */}
        <div className="bg-paper-50 p-4 rounded border border-line-border text-xs font-mono-code space-y-2 w-full md:w-64">
          <div className="font-bold text-ink-900 uppercase border-b border-line-border pb-1">
            NODE EVALUATION:
          </div>
          <div>Current Node: <strong>({currentCell})</strong></div>
          <div>Heuristic Multiplier: <strong>{heuristicMultiplier.toFixed(1)}x</strong></div>
          <div>Goal Status: <strong className={isGoalReached ? 'text-green-700' : 'text-ink-600'}>
            {isGoalReached ? 'REACHED (Optimal)' : 'Expanding...'}
          </strong></div>
          <div className="text-[11px] text-ink-500 pt-1 font-sans">
            A* selects the unvisited node with the lowest f = g + h at each step.
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={stepAStar}
            disabled={isGoalReached}
            className="px-3.5 py-1.5 text-xs font-mono-code bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            EXPAND NEXT BEST NODE
          </button>
          <button
            onClick={() => resetLab()}
            className="p-1.5 text-ink-600 border border-line-border rounded hover:bg-paper-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Break mode toggle */}
        <button
          onClick={() => resetLab(heuristicMultiplier > 1.0 ? 1.0 : 3.5)}
          className={`text-xs font-mono-code px-3 py-1 rounded border transition-colors ${
            heuristicMultiplier > 1.0
              ? 'bg-paper-200 border-line-border text-ink-700'
              : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100 font-semibold'
          }`}
        >
          {heuristicMultiplier > 1.0 ? 'Restore Admissible Heuristic (1.0x)' : '💥 Inject Inadmissible Heuristic (3.5x)'}
        </button>
      </div>
    </div>
  );
};
