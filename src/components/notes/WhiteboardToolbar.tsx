import React from 'react';
import { 
  Pen, 
  Highlighter, 
  Eraser, 
  Square, 
  Circle, 
  ArrowRight, 
  Minus, 
  Type, 
  MousePointer,
  Maximize2,
  Minimize2,
  Sparkles,
  Palette
} from 'lucide-react';
import { WhiteboardTool } from './NotebookWhiteboard';

interface WhiteboardToolbarProps {
  isDrawingEnabled: boolean;
  onToggleDrawing: () => void;
  activeTool: WhiteboardTool;
  onSelectTool: (tool: WhiteboardTool) => void;
  activeColor: string;
  onSelectColor: (color: string) => void;
  strokeWidth: number;
  onSelectStrokeWidth: (width: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  className?: string;
}

const COLORS = [
  { id: '#18181B', name: 'Charcoal Black' },
  { id: '#C2410C', name: 'Terracotta Red' },
  { id: '#2563EB', name: 'Engineering Blue' },
  { id: '#16A34A', name: 'Forest Green' },
  { id: '#D97706', name: 'Amber Gold' }
];

const STROKE_WIDTHS = [
  { width: 2, label: 'Thin' },
  { width: 4, label: 'Med' },
  { width: 8, label: 'Thick' }
];

export const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  isDrawingEnabled,
  onToggleDrawing,
  activeTool,
  onSelectTool,
  activeColor,
  onSelectColor,
  strokeWidth,
  onSelectStrokeWidth,
  isFullscreen,
  onToggleFullscreen,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1.5 flex-wrap font-mono text-xs select-none ${className}`}>
      {/* Drawing Mode Toggle */}
      <button
        onClick={onToggleDrawing}
        className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-2xs border ${
          isDrawingEnabled
            ? 'bg-accent text-white border-accent shadow-xs'
            : 'bg-paper text-charcoal border-line-border hover:border-accent hover:bg-paper-light'
        }`}
        title="Toggle Whiteboard & Annotation Pen"
      >
        <Pen className="w-3.5 h-3.5" />
        <span>{isDrawingEnabled ? 'Drawing: ON' : 'Draw / Annotate'}</span>
      </button>

      {/* Expanded Tools when Drawing is ON */}
      {isDrawingEnabled && (
        <div className="flex items-center gap-1 bg-white border border-line-border p-1 rounded shadow-xs animate-fade-in flex-wrap">
          {/* Tool selectors */}
          {[
            { id: 'select' as WhiteboardTool, icon: MousePointer, title: 'Select / Pointer' },
            { id: 'pen' as WhiteboardTool, icon: Pen, title: 'Smooth Ink Pen (Curved)' },
            { id: 'highlighter' as WhiteboardTool, icon: Highlighter, title: 'Smooth Fluorescent Highlighter' },
            { id: 'eraser' as WhiteboardTool, icon: Eraser, title: 'Eraser' },
            { id: 'rectangle' as WhiteboardTool, icon: Square, title: 'Rectangle / Box' },
            { id: 'circle' as WhiteboardTool, icon: Circle, title: 'Circle / Ellipse' },
            { id: 'arrow' as WhiteboardTool, icon: ArrowRight, title: 'Arrow Pointer' },
            { id: 'line' as WhiteboardTool, icon: Minus, title: 'Straight Line' },
            { id: 'text' as WhiteboardTool, icon: Type, title: 'Text Annotation' },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                className={`p-1.5 rounded transition-colors ${
                  isSelected
                    ? 'bg-ink-900 text-white shadow-2xs'
                    : 'text-charcoal hover:bg-paper-200'
                }`}
                title={t.title}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}

          <div className="w-[1px] h-4 bg-line-border mx-1" />

          {/* Color Palette */}
          <div className="flex items-center gap-1">
            {COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectColor(c.id)}
                style={{ backgroundColor: c.id }}
                className={`w-4 h-4 rounded-full transition-transform ${
                  activeColor === c.id
                    ? 'scale-125 ring-2 ring-accent ring-offset-1'
                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                title={c.name}
              />
            ))}
          </div>

          <div className="w-[1px] h-4 bg-line-border mx-1" />

          {/* Stroke Width */}
          <div className="flex items-center gap-1">
            {STROKE_WIDTHS.map((s) => (
              <button
                key={s.width}
                onClick={() => onSelectStrokeWidth(s.width)}
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                  strokeWidth === s.width
                    ? 'bg-ink-900 text-white font-bold'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-paper-200'
                }`}
                title={`${s.label} stroke`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Toggle */}
      <button
        onClick={onToggleFullscreen}
        className={`px-2.5 py-1 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors border ${
          isFullscreen
            ? 'bg-charcoal text-paper border-charcoal shadow-xs'
            : 'bg-paper text-charcoal border-line-border hover:border-charcoal hover:bg-paper-light'
        }`}
        title={isFullscreen ? 'Exit Full Screen Mode (Esc)' : 'Enter Full Screen Study View'}
      >
        {isFullscreen ? (
          <>
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Fullscreen</span>
          </>
        ) : (
          <>
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </>
        )}
      </button>
    </div>
  );
};
