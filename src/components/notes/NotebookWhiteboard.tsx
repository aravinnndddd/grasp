import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Pen, 
  Highlighter, 
  Eraser, 
  Square, 
  Circle, 
  ArrowRight, 
  Minus, 
  Type, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Download, 
  Palette,
  MousePointer
} from 'lucide-react';

export type WhiteboardTool = 'select' | 'pen' | 'highlighter' | 'eraser' | 'rectangle' | 'circle' | 'arrow' | 'line' | 'text';

export interface DrawElement {
  id: string;
  type: WhiteboardTool;
  color: string;
  width: number;
  points?: Array<{ x: number; y: number }>; // for pen / highlighter
  startX?: number; // for shapes
  startY?: number;
  endX?: number;
  endY?: number;
  text?: string; // for text tool
}

interface NotebookWhiteboardProps {
  pageKey: string; // unique key for this page (e.g., pccst503_m1_p1)
  isDrawingEnabled: boolean;
  activeTool: WhiteboardTool;
  activeColor: string;
  strokeWidth: number;
  onToolChange?: (tool: WhiteboardTool) => void;
  onColorChange?: (color: string) => void;
  onStrokeWidthChange?: (width: number) => void;
  className?: string;
}

export const NotebookWhiteboard: React.FC<NotebookWhiteboardProps> = ({
  pageKey,
  isDrawingEnabled,
  activeTool,
  activeColor,
  strokeWidth,
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const [elements, setElements] = useState<DrawElement[]>([]);
  const [history, setHistory] = useState<DrawElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(null);

  // Text tool inline input
  const [textInputPos, setTextInputPos] = useState<{ x: number; y: number } | null>(null);
  const [textInputValue, setTextInputValue] = useState<string>('');

  // Storage key
  const storageKey = `intuition_whiteboard_${pageKey}`;

  // Load saved elements on page change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setElements(parsed);
        setHistory([parsed]);
        setHistoryIndex(0);
      } else {
        setElements([]);
        setHistory([[]]);
        setHistoryIndex(0);
      }
    } catch (e) {
      console.error('Failed loading whiteboard data:', e);
      setElements([]);
    }
  }, [storageKey]);

  // Save elements to localStorage
  const saveToStorage = useCallback((newElements: DrawElement[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newElements));
    } catch (e) {
      console.warn('Storage limit reached for whiteboard:', e);
    }
  }, [storageKey]);

  // Push to undo history
  const pushHistory = useCallback((newElements: DrawElement[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newElements);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    saveToStorage(newElements);
  }, [history, historyIndex, saveToStorage]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setElements(prev);
      saveToStorage(prev);
    }
  }, [history, historyIndex, saveToStorage]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setElements(next);
      saveToStorage(next);
    }
  }, [history, historyIndex, saveToStorage]);

  // Clear page
  const handleClear = useCallback(() => {
    if (elements.length === 0) return;
    if (confirm('Clear all drawings and annotations on this page?')) {
      const empty: DrawElement[] = [];
      setElements(empty);
      pushHistory(empty);
    }
  }, [elements.length, pushHistory]);

  // Redraw all elements on canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = sizeRef.current;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, width || (canvas.width / dpr), height || (canvas.height / dpr));

    const all = currentElement ? [...elements, currentElement] : elements;

    all.forEach(el => {
      ctx.save();

      if (el.type === 'highlighter') {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.width * 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else {
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = el.color;
        ctx.fillStyle = el.color;
        ctx.lineWidth = el.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      // Freehand Pen / Highlighter
      if ((el.type === 'pen' || el.type === 'highlighter') && el.points && el.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      }

      // Rectangle
      if (el.type === 'rectangle' && el.startX !== undefined && el.startY !== undefined && el.endX !== undefined && el.endY !== undefined) {
        const x = Math.min(el.startX, el.endX);
        const y = Math.min(el.startY, el.endY);
        const w = Math.abs(el.endX - el.startX);
        const h = Math.abs(el.endY - el.startY);
        ctx.strokeRect(x, y, w, h);
      }

      // Circle / Ellipse
      if (el.type === 'circle' && el.startX !== undefined && el.startY !== undefined && el.endX !== undefined && el.endY !== undefined) {
        const cx = (el.startX + el.endX) / 2;
        const cy = (el.startY + el.endY) / 2;
        const rx = Math.abs(el.endX - el.startX) / 2;
        const ry = Math.abs(el.endY - el.startY) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Line
      if (el.type === 'line' && el.startX !== undefined && el.startY !== undefined && el.endX !== undefined && el.endY !== undefined) {
        ctx.beginPath();
        ctx.moveTo(el.startX, el.startY);
        ctx.lineTo(el.endX, el.endY);
        ctx.stroke();
      }

      // Arrow
      if (el.type === 'arrow' && el.startX !== undefined && el.startY !== undefined && el.endX !== undefined && el.endY !== undefined) {
        const dx = el.endX - el.startX;
        const dy = el.endY - el.startY;
        const angle = Math.atan2(dy, dx);
        const headLength = 12 + el.width;

        ctx.beginPath();
        ctx.moveTo(el.startX, el.startY);
        ctx.lineTo(el.endX, el.endY);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(el.endX, el.endY);
        ctx.lineTo(el.endX - headLength * Math.cos(angle - Math.PI / 6), el.endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(el.endX - headLength * Math.cos(angle + Math.PI / 6), el.endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      }

      // Text
      if (el.type === 'text' && el.text && el.startX !== undefined && el.startY !== undefined) {
        ctx.font = `${Math.max(14, el.width * 4)}px Inter, sans-serif`;
        ctx.fillText(el.text, el.startX, el.startY);
      }

      ctx.restore();
    });
  }, [elements, currentElement]);

  // Resize canvas according to container (ONLY when size changes, NOT on every stroke)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    sizeRef.current = { width: rect.width, height: rect.height };

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    redraw();
  }, [redraw]);

  // Mount resize listener
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [resizeCanvas]);

  // Trigger redraw when elements or current stroke updates
  useEffect(() => {
    redraw();
  }, [redraw, elements, currentElement]);

  // Pointer coordinate calculation using CSS pixels
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled || activeTool === 'select') return;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    const { x, y } = getCoordinates(e);

    // Text tool: open floating input
    if (activeTool === 'text') {
      setTextInputPos({ x, y });
      setTextInputValue('');
      return;
    }

    // Eraser tool: delete elements near click
    if (activeTool === 'eraser') {
      eraseAtPoint(x, y);
      setIsDrawing(true);
      return;
    }

    setIsDrawing(true);

    if (activeTool === 'pen' || activeTool === 'highlighter') {
      const newEl: DrawElement = {
        id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: activeTool,
        color: activeColor,
        width: strokeWidth,
        points: [{ x, y }]
      };
      setCurrentElement(newEl);
    } else {
      // Shapes
      const newEl: DrawElement = {
        id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: activeTool,
        color: activeColor,
        width: strokeWidth,
        startX: x,
        startY: y,
        endX: x,
        endY: y
      };
      setCurrentElement(newEl);
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);

    if (activeTool === 'eraser') {
      eraseAtPoint(x, y);
      return;
    }

    if (!currentElement) return;

    if (activeTool === 'pen' || activeTool === 'highlighter') {
      setCurrentElement(prev => {
        if (!prev) return null;
        return {
          ...prev,
          points: [...(prev.points || []), { x, y }]
        };
      });
    } else {
      setCurrentElement(prev => {
        if (!prev) return null;
        return {
          ...prev,
          endX: x,
          endY: y
        };
      });
    }
  };

  // Pointer Up
  const handlePointerUp = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    if (e) {
      try {
        if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
      } catch {}
    }

    if (!isDrawing && !currentElement) return;
    setIsDrawing(false);

    if (currentElement) {
      const updated = [...elements, currentElement];
      setElements(updated);
      pushHistory(updated);
      setCurrentElement(null);
    }
  };

  // Erase elements near coordinates
  const eraseAtPoint = (x: number, y: number) => {
    const threshold = 18;
    const remaining = elements.filter(el => {
      // Freehand points
      if (el.points) {
        return !el.points.some(p => Math.hypot(p.x - x, p.y - y) < threshold);
      }
      // Shapes bounding box
      if (el.startX !== undefined && el.startY !== undefined && el.endX !== undefined && el.endY !== undefined) {
        const minX = Math.min(el.startX, el.endX) - threshold;
        const maxX = Math.max(el.startX, el.endX) + threshold;
        const minY = Math.min(el.startY, el.endY) - threshold;
        const maxY = Math.max(el.startY, el.endY) + threshold;
        const isInside = x >= minX && x <= maxX && y >= minY && y <= maxY;
        return !isInside;
      }
      return true;
    });

    if (remaining.length !== elements.length) {
      setElements(remaining);
      pushHistory(remaining);
    }
  };

  // Submit typed text onto canvas
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInputPos || !textInputValue.trim()) {
      setTextInputPos(null);
      return;
    }

    const newEl: DrawElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'text',
      color: activeColor,
      width: strokeWidth,
      startX: textInputPos.x,
      startY: textInputPos.y,
      text: textInputValue.trim()
    };

    const updated = [...elements, newEl];
    setElements(updated);
    pushHistory(updated);
    setTextInputPos(null);
    setTextInputValue('');
  };

  // Export as PNG
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `intuition_whiteboard_${pageKey}.png`;
    a.click();
  };

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none overflow-hidden z-20 ${className}`}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full touch-none select-none ${
          isDrawingEnabled
            ? activeTool === 'eraser'
              ? 'cursor-cell pointer-events-auto'
              : activeTool === 'text'
              ? 'cursor-text pointer-events-auto'
              : activeTool === 'select'
              ? 'cursor-default pointer-events-none'
              : 'cursor-crosshair pointer-events-auto'
            : 'pointer-events-none'
        }`}
      />

      {/* Inline Text Tool Popover */}
      {textInputPos && isDrawingEnabled && (
        <form
          onSubmit={handleTextSubmit}
          style={{ left: `${textInputPos.x}px`, top: `${textInputPos.y - 12}px` }}
          className="absolute z-30 pointer-events-auto flex items-center gap-1 shadow-lg bg-white border border-charcoal p-1 rounded"
        >
          <input
            type="text"
            autoFocus
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setTextInputPos(null);
            }}
            placeholder="Type notes / equation here..."
            className="px-2 py-1 text-xs font-mono focus:outline-none min-w-[200px]"
          />
          <button
            type="submit"
            className="px-2 py-1 bg-accent text-white text-[10px] font-mono font-bold rounded cursor-pointer"
          >
            Add
          </button>
        </form>
      )}

      {/* Floating Undo/Redo & Clear Control (Bottom Left of Canvas) */}
      {isDrawingEnabled && (
        <div className="absolute bottom-4 left-4 z-30 pointer-events-auto bg-white/95 backdrop-blur-xs border border-line-border rounded shadow-md p-1 flex items-center gap-1 text-xs">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 text-charcoal hover:bg-paper-200 disabled:opacity-30 rounded transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 text-charcoal hover:bg-paper-200 disabled:opacity-30 rounded transition-colors cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-line-border mx-0.5" />
          <button
            onClick={handleClear}
            disabled={elements.length === 0}
            className="p-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-30 rounded transition-colors cursor-pointer"
            title="Clear All Annotations on Page"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExportPNG}
            disabled={elements.length === 0}
            className="p-1.5 text-charcoal hover:bg-paper-200 disabled:opacity-30 rounded transition-colors cursor-pointer"
            title="Export Page Drawing as PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
