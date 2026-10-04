import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface StepRecord {
  step: number;
  theta: number;
  cost: number;
  grad: number;
}

export const GradientDescentLab: React.FC<{ isBreakMode?: boolean }> = ({ isBreakMode = false }) => {
  // Loss function: J(theta) = (theta - 2)^2 + 1. Min is at theta = 2.0, J = 1.0.
  // Derivative: dJ/dtheta = 2*(theta - 2)
  const [alpha, setAlpha] = useState<number>(isBreakMode ? 1.28 : 0.15);
  const [startTheta, setStartTheta] = useState<number>(8.0);
  const [currentTheta, setCurrentTheta] = useState<number>(8.0);
  const [history, setHistory] = useState<StepRecord[]>([
    { step: 0, theta: 8.0, cost: 37.0, grad: 12.0 }
  ]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasDiverged, setHasDiverged] = useState<boolean>(isBreakMode);

  // Sync with isBreakMode prop if switched
  useEffect(() => {
    if (isBreakMode) {
      setAlpha(1.32);
      resetSimulation(8.0, 1.32);
    }
  }, [isBreakMode]);

  const calcCost = (th: number) => (th - 2) ** 2 + 1;
  const calcGrad = (th: number) => 2 * (th - 2);

  const resetSimulation = (initTh = startTheta, lr = alpha) => {
    setIsRunning(false);
    setCurrentTheta(initTh);
    setHasDiverged(false);
    setHistory([{
      step: 0,
      theta: initTh,
      cost: calcCost(initTh),
      grad: calcGrad(initTh)
    }]);
  };

  const takeSingleStep = () => {
    if (hasDiverged || Math.abs(currentTheta) > 60) {
      setHasDiverged(true);
      return;
    }

    const grad = calcGrad(currentTheta);
    const nextTh = currentTheta - alpha * grad;
    const nextCost = calcCost(nextTh);

    if (Math.abs(nextTh) > 50 || nextCost > 2000) {
      setHasDiverged(true);
      setIsRunning(false);
    }

    setCurrentTheta(nextTh);
    setHistory(prev => [
      ...prev.slice(-30),
      {
        step: prev[prev.length - 1].step + 1,
        theta: nextTh,
        cost: nextCost,
        grad: calcGrad(nextTh)
      }
    ]);
  };

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && !hasDiverged) {
      timer = setTimeout(() => {
        takeSingleStep();
        if (Math.abs(currentTheta - 2.0) < 0.01) {
          setIsRunning(false);
        }
      }, 350);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentTheta, hasDiverged, alpha]);

  // Canvas coordinates mapper
  // Domain: theta in [-6, 10], J in [0, 50]
  const svgWidth = 560;
  const svgHeight = 240;
  const mapX = (th: number) => ((th - (-6)) / (10 - (-6))) * svgWidth;
  const mapY = (cost: number) => svgHeight - 20 - (Math.min(cost, 50) / 50) * (svgHeight - 40);

  // Generate parabola path points
  const points: string[] = [];
  for (let th = -6; th <= 10; th += 0.25) {
    const c = calcCost(th);
    points.push(`${mapX(th).toFixed(1)},${mapY(c).toFixed(1)}`);
  }
  const parabolaD = `M ${points.join(' L ')}`;

  const currentCost = calcCost(currentTheta);
  const currentGrad = calcGrad(currentTheta);
  const isConverged = Math.abs(currentTheta - 2.0) < 0.05;

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 font-sans space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
            EXPERIMENT // CONVEX QUADRATIC SURFACE
          </div>
          <h4 className="text-base font-semibold text-ink-900 font-serif-heading">
            Objective: Minimize J(θ) = (θ - 2)² + 1
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {hasDiverged ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-red-100 text-red-800 border border-red-300 rounded font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              STATUS: DIVERGED (Exploding Gradient)
            </span>
          ) : isConverged ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-green-100 text-green-800 border border-green-300 rounded font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              STATUS: CONVERGED AT MINIMUM (θ* = 2.00)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-paper-200 text-ink-700 border border-line-border rounded">
              <Zap className="w-3.5 h-3.5 text-terracotta" />
              DESCENDING // STEP {history[history.length - 1].step}
            </span>
          )}
        </div>
      </div>

      {/* SVG Interactive Visualization */}
      <div className="relative bg-white border border-line-border rounded overflow-hidden p-2 paper-grid">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 select-none">
          {/* Valley Axis */}
          <line x1={mapX(2)} y1={20} x2={mapX(2)} y2={svgHeight - 15} stroke="#CBD5E1" strokeDasharray="3 3" />
          <text x={mapX(2) + 6} y={35} fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">
            Global Minimum θ* = 2.0
          </text>

          {/* Parabola Curve */}
          <path d={parabolaD} fill="none" stroke="#3A3835" strokeWidth="2.5" />

          {/* Trajectory Trail */}
          {history.length > 1 && (
            <polyline
              points={history
                .map(h => `${mapX(Math.max(-6, Math.min(10, h.theta))).toFixed(1)},${mapY(h.cost).toFixed(1)}`)
                .join(' ')}
              fill="none"
              stroke={hasDiverged ? '#DC2626' : '#C2410C'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          )}

          {/* Prior steps markers */}
          {history.map((h, i) => (
            <circle
              key={i}
              cx={mapX(Math.max(-6, Math.min(10, h.theta)))}
              cy={mapY(h.cost)}
              r={i === history.length - 1 ? 6 : 3}
              fill={i === history.length - 1 ? (hasDiverged ? '#DC2626' : '#C2410C') : '#A49F96'}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          ))}

          {/* Current Hiker Point */}
          {!hasDiverged && (
            <g transform={`translate(${mapX(Math.max(-6, Math.min(10, currentTheta)))}, ${mapY(currentCost)})`}>
              <circle r="7" fill="#C2410C" stroke="#FFFFFF" strokeWidth="2" />
              {/* Tangent slope vector indicator */}
              <line
                x1="-18"
                y1={currentGrad * 1.5}
                x2="18"
                y2={-currentGrad * 1.5}
                stroke="#1E3A8A"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Live HUD telemetry */}
        <div className="absolute top-2 right-2 bg-paper-50/95 border border-line-border rounded px-3 py-2 text-xs font-mono-code space-y-1 shadow-notebook">
          <div className="flex justify-between gap-4">
            <span className="text-ink-500">Current Parameter (θ):</span>
            <span className="font-semibold text-ink-900">{currentTheta.toFixed(3)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink-500">Current Cost J(θ):</span>
            <span className="font-semibold text-ink-900">{currentCost > 999 ? '∞ (Exploded)' : currentCost.toFixed(3)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink-500">Gradient (∂J/∂θ):</span>
            <span className={currentGrad > 0 ? 'text-amber-700' : 'text-blue-700'}>
              {currentGrad > 0 ? `+${currentGrad.toFixed(3)}` : currentGrad.toFixed(3)}
            </span>
          </div>
          <div className="flex justify-between gap-4 border-t border-line-border pt-1">
            <span className="text-ink-500">Next Step Δθ:</span>
            <span className="font-semibold text-terracotta">
              {(-alpha * currentGrad).toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono-code">
            <label className="text-ink-700">Learning Rate (α):</label>
            <span className={`font-semibold ${alpha >= 1.0 ? 'text-red-700 font-bold' : 'text-ink-900'}`}>
              {alpha.toFixed(2)} {alpha >= 1.0 ? '(UNSTABLE)' : ''}
            </span>
          </div>
          <input
            type="range"
            min="0.02"
            max="1.40"
            step="0.02"
            value={alpha}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setAlpha(val);
              resetSimulation(startTheta, val);
            }}
            className="w-full h-1.5 bg-paper-300 rounded-lg appearance-none cursor-pointer accent-terracotta"
          />
          <div className="flex justify-between text-[10px] text-ink-500 font-mono-code">
            <span>0.02 (Slow)</span>
            <span>0.15 (Optimal)</span>
            <span className="text-red-600 font-semibold">1.25+ (Diverges)</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono-code">
            <label className="text-ink-700">Initial Position (θ₀):</label>
            <span className="font-semibold text-ink-900">{startTheta.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-5.0"
            max="9.0"
            step="0.5"
            value={startTheta}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setStartTheta(val);
              resetSimulation(val, alpha);
            }}
            className="w-full h-1.5 bg-paper-300 rounded-lg appearance-none cursor-pointer accent-ink-700"
          />
          <div className="flex justify-between text-[10px] text-ink-500 font-mono-code">
            <span>-5.0 (Left slope)</span>
            <span>θ* = 2.0</span>
            <span>+9.0 (Right slope)</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={hasDiverged || isConverged}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-mono-code font-medium rounded border transition-colors ${
              isRunning
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-ink-900 text-paper-50 border-ink-900 hover:bg-ink-800'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'PAUSE' : 'AUTO RUN'}
          </button>

          <button
            onClick={takeSingleStep}
            disabled={hasDiverged || isConverged}
            className="flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-mono-code bg-paper-200 text-ink-800 border border-line-border rounded hover:bg-paper-300"
            title="Step by Step"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            STEP
          </button>

          <button
            onClick={() => resetSimulation()}
            className="p-1.5 text-ink-600 border border-line-border rounded hover:bg-paper-200"
            title="Reset to θ₀"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Failure mode fast-trigger button */}
      <div className="border-t border-line-border pt-3 flex items-center justify-between text-xs">
        <span className="text-ink-600 font-mono-code">
          💡 Want to see the math fail?
        </span>
        <button
          onClick={() => {
            setAlpha(1.30);
            resetSimulation(startTheta, 1.30);
            setIsRunning(true);
          }}
          className="text-xs font-mono-code text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded hover:bg-red-100 transition-colors"
        >
          💥 Force Exploding Gradient Divergence (α = 1.30)
        </button>
      </div>
    </div>
  );
};
