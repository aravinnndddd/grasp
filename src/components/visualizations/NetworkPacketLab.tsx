import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, ArrowRight, Activity, Zap } from 'lucide-react';

interface WindowRecord {
  rtt: number;
  cwnd: number;
  ssthresh: number;
  event: string;
}

export const NetworkPacketLab: React.FC<{ isBreakMode?: boolean }> = ({ isBreakMode = false }) => {
  const [cwnd, setCwnd] = useState<number>(1);
  const [ssthresh, setSsthresh] = useState<number>(16);
  const [phase, setPhase] = useState<'Slow Start' | 'Congestion Avoidance' | 'Fast Recovery'>('Slow Start');
  const [rttCount, setRttCount] = useState<number>(0);
  const [history, setHistory] = useState<WindowRecord[]>([
    { rtt: 0, cwnd: 1, ssthresh: 16, event: 'Handshake complete' }
  ]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasBufferOverflow, setHasBufferOverflow] = useState<boolean>(isBreakMode);

  // Router buffer maximum limit
  const ROUTER_QUEUE_MAX = 24;

  const simulateNextRTT = (customEvent?: 'DUP_ACK' | 'TIMEOUT') => {
    setRttCount(prev => prev + 1);
    const nextRtt = rttCount + 1;

    let nextCwnd = cwnd;
    let nextSsthresh = ssthresh;
    let nextPhase = phase;
    let eventName = 'ACKs received';

    if (customEvent === 'TIMEOUT' || (cwnd >= ROUTER_QUEUE_MAX && !customEvent)) {
      // Coarse Timeout / Router Queue Burst
      nextSsthresh = Math.max(2, Math.floor(cwnd / 2));
      nextCwnd = 1;
      nextPhase = 'Slow Start';
      eventName = 'TIMEOUT: Queue overflow! cwnd reset to 1';
      setHasBufferOverflow(true);
    } else if (customEvent === 'DUP_ACK') {
      // 3 Duplicate ACKs (Fast Retransmit & Recovery)
      nextSsthresh = Math.max(2, Math.floor(cwnd / 2));
      nextCwnd = nextSsthresh;
      nextPhase = 'Congestion Avoidance';
      eventName = '3 Dup ACKs: cwnd halved via AIMD';
      setHasBufferOverflow(false);
    } else {
      // Normal transmission
      setHasBufferOverflow(false);
      if (cwnd < ssthresh) {
        // Slow Start: Exponential growth
        nextCwnd = Math.min(cwnd * 2, ROUTER_QUEUE_MAX + 4);
        nextPhase = 'Slow Start';
        eventName = 'Slow Start: Doubled cwnd';
      } else {
        // Congestion Avoidance: Linear growth
        nextCwnd = cwnd + 1;
        nextPhase = 'Congestion Avoidance';
        eventName = 'Congestion Avoidance: +1 MSS';
      }
    }

    setCwnd(nextCwnd);
    setSsthresh(nextSsthresh);
    setPhase(nextPhase);

    setHistory(prev => [
      ...prev.slice(-25),
      {
        rtt: nextRtt,
        cwnd: nextCwnd,
        ssthresh: nextSsthresh,
        event: eventName
      }
    ]);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setTimeout(() => {
        simulateNextRTT();
      }, 700);
    }
    return () => clearTimeout(timer);
  }, [isRunning, cwnd, ssthresh, rttCount, phase]);

  const resetSimulation = () => {
    setIsRunning(false);
    setCwnd(1);
    setSsthresh(16);
    setPhase('Slow Start');
    setRttCount(0);
    setHasBufferOverflow(false);
    setHistory([{ rtt: 0, cwnd: 1, ssthresh: 16, event: 'Reset' }]);
  };

  // SVG Chart mapper
  const svgW = 540;
  const svgH = 160;
  const maxRtt = Math.max(15, rttCount);
  const mapX = (r: number) => (r / maxRtt) * (svgW - 50) + 30;
  const mapY = (w: number) => svgH - 20 - (Math.min(w, 28) / 28) * (svgH - 40);

  const polyPoints = history.map(h => `${mapX(h.rtt).toFixed(1)},${mapY(h.cwnd).toFixed(1)}`).join(' ');

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 font-sans space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
            SYSTEM TELEMETRY // AIMD SAWTOOTH SIMULATION
          </div>
          <h4 className="text-base font-semibold text-ink-900 font-serif-heading">
            TCP Reno Congestion Window (cwnd) vs Intermediate Router Queue
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {hasBufferOverflow ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-red-100 text-red-800 border border-red-300 rounded font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              ROUTER QUEUE DROPPED PACKETS
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-paper-200 text-ink-700 border border-line-border rounded">
              <Activity className="w-3.5 h-3.5 text-lab-accent" />
              PHASE: {phase.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Network Pipeline schematic */}
      <div className="bg-white border border-line-border p-3 rounded grid grid-cols-3 gap-2 text-center text-xs font-mono-code paper-grid">
        <div className="border border-line-border p-2 rounded bg-paper-50">
          <div className="text-ink-500 text-[10px]">SENDER (HOST A)</div>
          <div className="text-sm font-bold text-ink-900 mt-1">{cwnd} MSS</div>
          <div className="text-[10px] text-ink-600">Flight Window</div>
        </div>

        <div className={`border p-2 rounded ${hasBufferOverflow ? 'border-red-400 bg-red-50' : 'border-line-border bg-paper-50'}`}>
          <div className="text-ink-500 text-[10px]">ROUTER BUFFER QUEUE</div>
          <div className={`text-sm font-bold mt-1 ${cwnd > 20 ? 'text-red-600' : 'text-ink-900'}`}>
            {Math.min(cwnd, ROUTER_QUEUE_MAX)} / {ROUTER_QUEUE_MAX} pkts
          </div>
          <div className="text-[10px] text-ink-600">
            {cwnd >= ROUTER_QUEUE_MAX ? 'CRITICAL CONGESTION' : 'Queue Flowing'}
          </div>
        </div>

        <div className="border border-line-border p-2 rounded bg-paper-50">
          <div className="text-ink-500 text-[10px]">RECEIVER (HOST B)</div>
          <div className="text-sm font-bold text-ink-900 mt-1">64 KB</div>
          <div className="text-[10px] text-ink-600">Advertised rwnd</div>
        </div>
      </div>

      {/* Live AIMD Sawtooth Graph */}
      <div className="bg-white border border-line-border rounded p-3 relative paper-grid">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-40 select-none">
          {/* Threshold line */}
          <line
            x1="30"
            y1={mapY(ssthresh)}
            x2={svgW - 20}
            y2={mapY(ssthresh)}
            stroke="#94A3B8"
            strokeDasharray="4 2"
          />
          <text x={svgW - 120} y={mapY(ssthresh) - 5} fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">
            ssthresh = {ssthresh} MSS
          </text>

          {/* Router capacity red ceiling line */}
          <line
            x1="30"
            y1={mapY(ROUTER_QUEUE_MAX)}
            x2={svgW - 20}
            y2={mapY(ROUTER_QUEUE_MAX)}
            stroke="#F87171"
            strokeDasharray="2 2"
          />
          <text x="35" y={mapY(ROUTER_QUEUE_MAX) - 4} fill="#DC2626" fontSize="8" fontFamily="JetBrains Mono">
            Router Buffer Drop Ceiling (24 MSS)
          </text>

          {/* Trajectory */}
          {history.length > 1 && (
            <polyline
              points={polyPoints}
              fill="none"
              stroke="#C2410C"
              strokeWidth="2.5"
            />
          )}

          {/* Step markers */}
          {history.map((h, idx) => (
            <circle
              key={idx}
              cx={mapX(h.rtt)}
              cy={mapY(h.cwnd)}
              r={idx === history.length - 1 ? 5 : 2.5}
              fill={idx === history.length - 1 ? '#C2410C' : '#3F3F46'}
            />
          ))}
        </svg>

        {/* Telemetry banner */}
        <div className="flex items-center justify-between text-xs font-mono-code text-ink-600 border-t border-line-border pt-2 mt-2">
          <span>Current cwnd: <strong className="text-ink-900">{cwnd} MSS</strong></span>
          <span>ssthresh: <strong className="text-ink-900">{ssthresh} MSS</strong></span>
          <span>RTT Count: <strong>{rttCount}</strong></span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1.5 text-xs font-mono-code bg-ink-900 text-white rounded hover:bg-ink-800 flex items-center gap-1.5"
          >
            <Play className="w-3 h-3" />
            {isRunning ? 'PAUSE PROBING' : 'AUTO PROBE'}
          </button>
          <button
            onClick={() => simulateNextRTT()}
            className="px-3 py-1.5 text-xs font-mono-code bg-paper-200 border border-line-border rounded hover:bg-paper-300 flex items-center gap-1"
          >
            <ArrowRight className="w-3 h-3" />
            NEXT RTT
          </button>
          <button
            onClick={resetSimulation}
            className="p-1.5 text-ink-600 border border-line-border rounded hover:bg-paper-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive failure injector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateNextRTT('DUP_ACK')}
            className="text-xs font-mono-code text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded hover:bg-amber-100"
          >
            ⚡ Inject 3 Dup ACKs (Fast Retransmit)
          </button>
          <button
            onClick={() => simulateNextRTT('TIMEOUT')}
            className="text-xs font-mono-code text-red-800 bg-red-50 border border-red-300 px-2.5 py-1 rounded hover:bg-red-100"
          >
            💥 Inject Timeout (Reset cwnd to 1)
          </button>
        </div>
      </div>
    </div>
  );
};
