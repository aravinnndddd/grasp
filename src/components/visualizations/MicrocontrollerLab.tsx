import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, AlertTriangle, Layers, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const MicrocontrollerLab: React.FC<{ isBreakMode?: boolean }> = ({ isBreakMode = false }) => {
  const [activeBank, setActiveBank] = useState<number>(0);
  const [sp, setSp] = useState<number>(isBreakMode ? 0x07 : 0x30);
  const [stackValues, setStackValues] = useState<Array<{ addr: string; val: string }>>([]);
  const [isCollision, setIsCollision] = useState<boolean>(isBreakMode);

  const resetMCU = (defaultSp = 0x30) => {
    setActiveBank(0);
    setSp(defaultSp);
    setStackValues([]);
    setIsCollision(defaultSp === 0x07);
  };

  const pushToStack = () => {
    const nextSp = sp + 1;
    const hexAddr = '0x' + nextSp.toString(16).toUpperCase().padStart(2, '0');
    const randomHex = '0x' + Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');

    // If nextSp is between 0x08 and 0x0F, it directly collides with Register Bank 1!
    if (nextSp >= 0x08 && nextSp <= 0x0f) {
      setIsCollision(true);
    }

    setSp(nextSp);
    setStackValues(prev => [...prev, { addr: hexAddr, val: randomHex }]);
  };

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 font-sans space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-border pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
            SILICON ARCHITECTURE // 8051 MEMORY &amp; REGISTER LAB
          </div>
          <h4 className="text-base font-semibold text-ink-900 font-serif-heading">
            128-Byte Internal RAM Partitioning &amp; Stack Collision Invariant
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {isCollision ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-red-100 text-red-800 border border-red-300 rounded font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              STACK COLLISION! Overwriting Register Bank 1 (08H-0FH)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code bg-green-100 text-green-800 border border-green-300 rounded font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              SAFE STACK (SP initialized above 30H)
            </span>
          )}
        </div>
      </div>

      {/* Memory Map & Registers layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Internal RAM Map */}
        <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-2 font-mono-code text-xs paper-grid">
          <div className="text-[11px] font-bold text-ink-900 border-b border-line-border pb-1 uppercase">
            INTERNAL RAM MAP (00H - 7FH):
          </div>

          <div className="space-y-1.5 pt-1 text-[11px]">
            {/* Bank 0 */}
            <div className={`p-2 rounded border flex justify-between items-center ${activeBank === 0 ? 'bg-amber-100 border-amber-400 font-bold' : 'bg-paper-100 border-line-border'}`}>
              <span>00H - 07H</span>
              <span>Register Bank 0 (R0 - R7)</span>
              <span>{activeBank === 0 ? 'ACTIVE' : ''}</span>
            </div>

            {/* Bank 1 */}
            <div className={`p-2 rounded border flex justify-between items-center ${
              isCollision
                ? 'bg-red-100 border-red-400 text-red-950 font-bold animate-pulse'
                : activeBank === 1
                ? 'bg-amber-100 border-amber-400 font-bold'
                : 'bg-paper-100 border-line-border'
            }`}>
              <span>08H - 0FH</span>
              <span>Register Bank 1 (R0 - R7)</span>
              <span>{isCollision ? 'CORRUPTED BY PUSH' : activeBank === 1 ? 'ACTIVE' : ''}</span>
            </div>

            {/* Bank 2 */}
            <div className={`p-2 rounded border flex justify-between items-center ${activeBank === 2 ? 'bg-amber-100 border-amber-400 font-bold' : 'bg-paper-100 border-line-border'}`}>
              <span>10H - 17H</span>
              <span>Register Bank 2 (R0 - R7)</span>
              <span>{activeBank === 2 ? 'ACTIVE' : ''}</span>
            </div>

            {/* Bank 3 */}
            <div className={`p-2 rounded border flex justify-between items-center ${activeBank === 3 ? 'bg-amber-100 border-amber-400 font-bold' : 'bg-paper-100 border-line-border'}`}>
              <span>18H - 1FH</span>
              <span>Register Bank 3 (R0 - R7)</span>
              <span>{activeBank === 3 ? 'ACTIVE' : ''}</span>
            </div>

            {/* Bit addressable */}
            <div className="p-2 rounded border bg-blue-50 border-blue-200 text-blue-900 flex justify-between">
              <span>20H - 2FH</span>
              <span>Bit-Addressable RAM (128 bits)</span>
              <span>16 Bytes</span>
            </div>

            {/* Scratchpad RAM & Safe Stack */}
            <div className="p-2 rounded border bg-green-50 border-green-200 text-green-900 flex justify-between">
              <span>30H - 7FH</span>
              <span>Scratchpad RAM &amp; Safe Stack</span>
              <span>80 Bytes</span>
            </div>
          </div>
        </div>

        {/* Registers & Stack Visualizer */}
        <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-3 font-mono-code text-xs">
          <div className="text-[11px] font-bold text-ink-900 border-b border-line-border pb-1 uppercase">
            SPECIAL FUNCTION REGISTERS (SFR):
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-paper-100 p-2 rounded border border-line-border">
              <span className="text-ink-500 text-[10px] block">ACCUMULATOR (A):</span>
              <span className="font-bold text-ink-900">0x45 (01000101b)</span>
            </div>

            <div className="bg-paper-100 p-2 rounded border border-line-border">
              <span className="text-ink-500 text-[10px] block">STACK POINTER (SP):</span>
              <span className={`font-bold ${isCollision ? 'text-red-700' : 'text-ink-900'}`}>
                0x{sp.toString(16).toUpperCase().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Program Status Word Register */}
          <div className="bg-paper-100 p-2.5 rounded border border-line-border space-y-1">
            <span className="text-ink-500 text-[10px] block">PROGRAM STATUS WORD (PSW):</span>
            <div className="grid grid-cols-8 gap-1 text-center text-[10px]">
              <div className="bg-white p-1 rounded border">CY<br/>0</div>
              <div className="bg-white p-1 rounded border">AC<br/>0</div>
              <div className="bg-white p-1 rounded border">F0<br/>0</div>
              <div className="bg-amber-100 p-1 rounded border font-bold">RS1<br/>{(activeBank >> 1) & 1}</div>
              <div className="bg-amber-100 p-1 rounded border font-bold">RS0<br/>{activeBank & 1}</div>
              <div className="bg-white p-1 rounded border">OV<br/>0</div>
              <div className="bg-white p-1 rounded border">-<br/>0</div>
              <div className="bg-white p-1 rounded border">P<br/>1</div>
            </div>
          </div>

          {/* Bank Switch Buttons */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] text-ink-500 block uppercase">Switch Register Bank (R0-R7):</span>
            <div className="grid grid-cols-4 gap-1">
              {[0, 1, 2, 3].map(b => (
                <button
                  key={b}
                  onClick={() => setActiveBank(b)}
                  className={`py-1 rounded text-[11px] font-mono-code border transition-all ${
                    activeBank === b
                      ? 'bg-ink-900 text-white font-bold'
                      : 'bg-paper-200 text-ink-700 hover:bg-paper-300'
                  }`}
                >
                  Bank {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={pushToStack}
            className="px-3.5 py-1.5 text-xs font-mono-code bg-ink-900 text-white rounded hover:bg-ink-800 flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            EXECUTE: PUSH A (Increment SP &amp; Store)
          </button>

          <button
            onClick={() => resetMCU(0x30)}
            className="p-1.5 text-ink-600 border border-line-border rounded hover:bg-paper-200"
            title="Reset with safe SP = 0x30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Break mode trigger */}
        <button
          onClick={() => resetMCU(0x07)}
          className="text-xs font-mono-code px-3 py-1 rounded border bg-red-50 text-red-800 border-red-300 hover:bg-red-100 font-semibold"
        >
          💥 Force Power-On Reset Stack Collision (Default SP = 07H)
        </button>
      </div>
    </div>
  );
};
