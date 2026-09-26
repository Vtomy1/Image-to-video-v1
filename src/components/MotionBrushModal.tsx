import React, { useRef, useState, useEffect } from 'react';
import { X, Brush, RotateCcw, Check, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Radio } from 'lucide-react';
import { MotionBrushStroke } from '../types/video';

interface MotionBrushModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  strokes: MotionBrushStroke[];
  onSaveStrokes: (strokes: MotionBrushStroke[]) => void;
}

export const MotionBrushModal: React.FC<MotionBrushModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  strokes,
  onSaveStrokes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStrokes, setCurrentStrokes] = useState<MotionBrushStroke[]>(strokes);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activePoints, setActivePoints] = useState<{ x: number; y: number }[]>([]);
  const [brushRadius, setBrushRadius] = useState<number>(24);
  const [direction, setDirection] = useState<MotionBrushStroke['direction']>('right');
  const [velocity, setVelocity] = useState<number>(1.5);

  useEffect(() => {
    if (isOpen) {
      setCurrentStrokes(strokes);
    }
  }, [isOpen, strokes]);

  // Redraw canvas whenever strokes change
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all saved strokes
    currentStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.save();
      ctx.beginPath();
      stroke.points.forEach((pt, i) => {
        const x = pt.x * canvas.width;
        const y = pt.y * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      // Color coding based on direction
      const colorMap: Record<string, string> = {
        right: 'rgba(6, 182, 212, 0.45)', // cyan
        left: 'rgba(59, 130, 246, 0.45)',  // blue
        up: 'rgba(168, 85, 247, 0.45)',    // purple
        down: 'rgba(236, 72, 153, 0.45)',  // pink
        outward: 'rgba(245, 158, 11, 0.45)', // amber
        inward: 'rgba(16, 185, 129, 0.45)',  // emerald
      };

      ctx.strokeStyle = colorMap[stroke.direction] || 'rgba(6, 182, 212, 0.45)';
      ctx.lineWidth = stroke.radius * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Draw direction arrows at midpoint
      const mid = stroke.points[Math.floor(stroke.points.length / 2)];
      if (mid) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        const arrow =
          stroke.direction === 'right' ? '➔' :
          stroke.direction === 'left' ? '⬅' :
          stroke.direction === 'up' ? '⬆' :
          stroke.direction === 'down' ? '⬇' : '✺';
        ctx.fillText(arrow, mid.x * canvas.width - 6, mid.y * canvas.height + 5);
      }

      ctx.restore();
    });

    // Draw current active stroke
    if (activePoints.length > 1) {
      ctx.save();
      ctx.beginPath();
      activePoints.forEach((pt, i) => {
        const x = pt.x * canvas.width;
        const y = pt.y * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = brushRadius * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();
    }
  }, [isOpen, currentStrokes, activePoints, brushRadius]);

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setIsDrawing(true);
    setActivePoints([{ x, y }]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setActivePoints((prev) => [...prev, { x, y }]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (activePoints.length > 1) {
      const newStroke: MotionBrushStroke = {
        id: Date.now().toString(),
        points: activePoints,
        radius: brushRadius,
        direction,
        velocity,
      };
      setCurrentStrokes((prev) => [...prev, newStroke]);
    }
    setActivePoints([]);
  };

  const handleSave = () => {
    onSaveStrokes(currentStrokes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brush className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Motion Brush Director</h3>
              <p className="text-xs text-neutral-400">
                Paint over elements (water, hair, clouds, fire) to command localized motion vectors.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Direction Tools */}
          <div className="flex items-center gap-1">
            <span className="text-neutral-400 font-semibold mr-1">Direction:</span>
            {[
              { id: 'left', icon: ArrowLeft, label: 'Left' },
              { id: 'right', icon: ArrowRight, label: 'Right' },
              { id: 'up', icon: ArrowUp, label: 'Up' },
              { id: 'down', icon: ArrowDown, label: 'Down' },
              { id: 'outward', icon: Radio, label: 'Outward' },
            ].map((dir) => {
              const Icon = dir.icon;
              return (
                <button
                  key={dir.id}
                  onClick={() => setDirection(dir.id as any)}
                  className={`p-1.5 px-2 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
                    direction === dir.id
                      ? 'bg-cyan-500 text-neutral-950 border-cyan-400'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{dir.label}</span>
                </button>
              );
            })}
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-semibold">Size:</span>
            <input
              type="range"
              min="8"
              max="50"
              value={brushRadius}
              onChange={(e) => setBrushRadius(parseInt(e.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span className="font-mono text-neutral-300">{brushRadius}px</span>
          </div>

          {/* Reset / Undo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStrokes((prev) => prev.slice(0, -1))}
              disabled={currentStrokes.length === 0}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40"
            >
              Undo
            </button>
            <button
              onClick={() => setCurrentStrokes([])}
              disabled={currentStrokes.length === 0}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-rose-400 hover:text-rose-300 disabled:opacity-40"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={containerRef}
          className="relative flex-1 bg-black flex items-center justify-center p-4 overflow-hidden select-none"
        >
          <div className="relative max-h-[55vh] max-w-full inline-block rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
            <img
              src={imageSrc}
              alt="Source for brush"
              className="max-h-[55vh] max-w-full object-contain pointer-events-none"
            />
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950">
          <span className="text-xs text-neutral-400">
            {currentStrokes.length} motion zone{currentStrokes.length === 1 ? '' : 's'} configured
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Apply Motion Zones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
