import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ArrowRight, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

export const AutomataLab: React.FC<{ isBreakMode?: boolean }> = ({ isBreakMode = false }) => {
  const [inputString, setInputString] = useState<string>('0101');
  const [tapeIndex, setTapeIndex] = useState<number>(-1);
  const [currentState, setCurrentState] = useState<string>('q0');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'original' | 'minimized'>(isBreakMode ? 'original' : 'original');
  const [trapTriggered, setTrapTriggered] = useState<boolean>(isBreakMode);

  // Synchronize break mode
  useEffect(() => {
    if (isBreakMode) {
      setTrapTriggered(true);
      setInputString('0021'); // Invalid alphabet character '2'
      resetAutomaton();
    }
  }, [isBreakMode]);

  // Transition definitions for DFA recognizing strings containing '01'
  // Original 4-state DFA
  // States: q0 (start), q1 (saw 0), q2 (saw 01, final), q_dead (trap)
  const transitionsOriginal: Record<string, Record<string, string>> = {
    q0: { '0': 'q1', '1': 'q0' },
    q1: { '0': 'q1', '1': 'q2' },
    q2: { '0': 'q2', '1': 'q2' },
    q_dead: { '0': 'q_dead', '1': 'q_dead' }
  };

  const acceptingStatesOriginal = new Set(['q2']);

  const resetAutomaton = () => {
    setIsRunning(false);
    setTapeIndex(-1);
    setCurrentState('q0');
  };

  const stepForward = () => {
    if (tapeIndex >= inputString.length - 1) {
      setIsRunning(false);
      return;
    }
    const nextIdx = tapeIndex + 1;
    const char = inputString[nextIdx];

    if (char !== '0' && char !== '1') {
      // Invalid character -> drops into dead sinkhole state!
      setCurrentState('q_dead');
      setTapeIndex(nextIdx);
      setTrapTriggered(true);
      setIsRunning(false);
      return;
    }

    const nextState = transitionsOriginal[currentState]?.[char] || 'q_dead';
    setCurrentState(nextState);
    setTapeIndex(nextIdx);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      if (tapeIndex < inputString.length - 1) {
        timer = setTimeout(() => {
          stepForward();
        }, 500);
      } else {
        setIsRunning(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, tapeIndex, inputString, currentState]);

  const isAtEnd = tapeIndex === inputString.length - 1;
  const isAccepted = isAtEnd && acceptingStatesOriginal.has(currentState);
  const isRejected = isAtEnd && !acceptingStatesOriginal.has(currentState);

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 font-sans space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
            FINITE STATE MACHINE // TRANSITION LAB
          </div>
          <h4 className="text-base font-semibold text-ink-900 font-serif-heading">
            DFA: Strings over &#123;0, 1&#125; containing substring "01"
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {trapTriggered && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-red-100 text-red-800 border border-red-300 rounded font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              SINKHOLE TRAP STATE REACHED
            </span>
          )}
          {isAccepted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-green-100 text-green-800 border border-green-300 rounded font-medium">
              <Check className="w-3.5 h-3.5 text-green-600" />
              STRING ACCEPTED: w ∈ L(M)
            </span>
          )}
          {isRejected && !trapTriggered && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-paper-200 text-ink-700 border border-line-border rounded">
              <X className="w-3.5 h-3.5 text-ink-500" />
              STRING REJECTED: w ∉ L(M)
            </span>
          )}
        </div>
      </div>

      {/* Interactive Tape display */}
      <div className="bg-paper-100 border border-line-border p-3 rounded flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-code text-ink-500 uppercase">Input Tape w:</span>
          <div className="flex border border-line-border rounded overflow-hidden bg-white">
            {inputString.split('').map((ch, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 flex items-center justify-center font-mono-code text-sm font-semibold border-r border-line-border last:border-r-0 transition-colors ${
                  idx === tapeIndex
                    ? 'bg-terracotta text-white'
                    : idx < tapeIndex
                    ? 'bg-paper-200 text-ink-500'
                    : 'text-ink-900'
                }`}
              >
                {ch}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputString}
            onChange={(e) => {
              setInputString(e.target.value);
              resetAutomaton();
              setTrapTriggered(false);
            }}
            placeholder="0101"
            className="w-28 px-2 py-1 text-xs font-mono-code border border-line-border rounded bg-white"
          />
          <button
            onClick={() => {
              if (tapeIndex >= inputString.length - 1) {
                resetAutomaton();
              }
              setIsRunning(!isRunning);
            }}
            className="px-3 py-1 text-xs font-mono-code bg-ink-900 text-white rounded hover:bg-ink-800 flex items-center gap-1"
          >
            <Play className="w-3 h-3" />
            {isRunning ? 'PAUSE' : 'RUN TAPE'}
          </button>
          <button
            onClick={stepForward}
            disabled={tapeIndex >= inputString.length - 1}
            className="px-2.5 py-1 text-xs font-mono-code bg-paper-200 border border-line-border rounded hover:bg-paper-300 flex items-center gap-1"
          >
            <ArrowRight className="w-3 h-3" />
            STEP
          </button>
          <button
            onClick={resetAutomaton}
            className="p-1 text-ink-600 border border-line-border rounded hover:bg-paper-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* State Machine SVG Diagram */}
      <div className="bg-white border border-line-border rounded p-4 relative overflow-hidden paper-grid">
        <svg viewBox="0 0 540 180" className="w-full h-44 select-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#52525B" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#C2410C" />
            </marker>
          </defs>

          {/* Start pointer arrow into q0 */}
          <line x1="15" y1="90" x2="60" y2="90" stroke="#71717A" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="18" y="82" fill="#71717A" fontSize="10" fontFamily="JetBrains Mono">START</text>

          {/* Transition: q0 -> q0 on '1' (loop) */}
          <path d="M 75,68 C 65,30 105,30 95,68" fill="none" stroke="#71717A" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="82" y="32" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">1</text>

          {/* Transition: q0 -> q1 on '0' */}
          <line x1="105" y1="90" x2="215" y2="90" stroke={currentState === 'q1' && tapeIndex >= 0 ? '#C2410C' : '#71717A'} strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="155" y="82" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">0</text>

          {/* Transition: q1 -> q1 on '0' (loop) */}
          <path d="M 225,68 C 215,30 255,30 245,68" fill="none" stroke="#71717A" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="232" y="32" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">0</text>

          {/* Transition: q1 -> q2 on '1' */}
          <line x1="255" y1="90" x2="365" y2="90" stroke={currentState === 'q2' && tapeIndex >= 0 ? '#C2410C' : '#71717A'} strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="305" y="82" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">1</text>

          {/* Transition: q2 -> q2 on '0, 1' (loop accept) */}
          <path d="M 375,68 C 365,30 405,30 395,68" fill="none" stroke="#71717A" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="375" y="32" fill="#3F3F46" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">0, 1</text>

          {/* Dead state transitions if triggered */}
          {trapTriggered && (
            <g>
              <line x1="85" y1="110" x2="230" y2="150" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow)" />
              <text x="140" y="145" fill="#DC2626" fontSize="10" fontFamily="JetBrains Mono">invalid symbol</text>
            </g>
          )}

          {/* Node q0 */}
          <g transform="translate(85, 90)">
            <circle r="22" fill={currentState === 'q0' ? '#FFEDD5' : '#FFFFFF'} stroke={currentState === 'q0' ? '#C2410C' : '#27272A'} strokeWidth={currentState === 'q0' ? 2.5 : 1.5} />
            <text textAnchor="middle" dy="4" fontFamily="JetBrains Mono" fontSize="12" fontWeight="600" fill="#18181B">q0</text>
          </g>

          {/* Node q1 */}
          <g transform="translate(235, 90)">
            <circle r="22" fill={currentState === 'q1' ? '#FFEDD5' : '#FFFFFF'} stroke={currentState === 'q1' ? '#C2410C' : '#27272A'} strokeWidth={currentState === 'q1' ? 2.5 : 1.5} />
            <text textAnchor="middle" dy="4" fontFamily="JetBrains Mono" fontSize="12" fontWeight="600" fill="#18181B">q1</text>
          </g>

          {/* Node q2 (Double Circle - Final Accepting State) */}
          <g transform="translate(385, 90)">
            <circle r="22" fill={currentState === 'q2' ? '#DCFCE7' : '#FFFFFF'} stroke={currentState === 'q2' ? '#15803D' : '#27272A'} strokeWidth={currentState === 'q2' ? 2.5 : 1.5} />
            <circle r="18" fill="none" stroke={currentState === 'q2' ? '#15803D' : '#27272A'} strokeWidth="1.5" />
            <text textAnchor="middle" dy="4" fontFamily="JetBrains Mono" fontSize="12" fontWeight="600" fill="#18181B">q2*</text>
          </g>

          {/* Node q_dead */}
          {trapTriggered && (
            <g transform="translate(250, 155)">
              <circle r="18" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
              <text textAnchor="middle" dy="3.5" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#991B1B">SINK</text>
            </g>
          )}
        </svg>

        {/* State readout bottom bar */}
        <div className="flex items-center justify-between text-xs font-mono-code text-ink-600 border-t border-line-border pt-2">
          <span>Active State: <strong className="text-ink-900 font-bold">{currentState}</strong></span>
          <span>Input Read: {tapeIndex >= 0 ? `char '${inputString[tapeIndex]}' at position ${tapeIndex}` : 'None (at start)'}</span>
          <span>Total States: 3 (Minimal DFA)</span>
        </div>
      </div>

      {/* Failure mode trigger */}
      <div className="border-t border-line-border pt-2 flex items-center justify-between text-xs">
        <span className="text-ink-600 font-mono-code">
          💡 What happens if the tape contains an illegal character?
        </span>
        <button
          onClick={() => {
            setInputString('01$0');
            resetAutomaton();
            setTrapTriggered(true);
          }}
          className="text-xs font-mono-code text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded hover:bg-red-100"
        >
          💥 Feed Illegal Symbol '$' into Automaton
        </button>
      </div>
    </div>
  );
};
