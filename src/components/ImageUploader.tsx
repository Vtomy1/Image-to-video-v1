import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Sparkles, Brush, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { AspectRatio, SampleScene } from '../types/video';
import { SAMPLE_SCENES } from '../data/samples';

interface ImageUploaderProps {
  imageSrc: string | null;
  aspectRatio: AspectRatio;
  onImageSelected: (src: string) => void;
  onAspectRatioChange: (aspect: AspectRatio) => void;
  onOpenBrush: () => void;
  brushStrokesCount: number;
  onSelectSample: (sample: SampleScene) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageSrc,
  aspectRatio,
  onImageSelected,
  onAspectRatioChange,
  onOpenBrush,
  brushStrokesCount,
  onSelectSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number } | null>(null);

  // Load image dimensions
  useEffect(() => {
    if (!imageSrc) {
      setImageMeta(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageMeta({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Handle global paste for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                onImageSelected(event.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelected(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelected(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlValue.trim()) {
      onImageSelected(urlValue.trim());
      setShowUrlInput(false);
      setUrlValue('');
    }
  };

  return (
    <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-4 sm:p-5 flex flex-col gap-4">
      {/* Header and Aspect Ratio Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            2. Source Image & Format
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Upload any photo, portrait, illustration, or render to bring it to life.
          </p>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          {(['16:9', '9:16', '1:1', '21:9'] as AspectRatio[]).map((aspect) => (
            <button
              key={aspect}
              onClick={() => onAspectRatioChange(aspect)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                aspectRatio === aspect
                  ? 'bg-neutral-800 text-cyan-400 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {aspect}
              <span className="text-[10px] text-neutral-500 ml-1">
                {aspect === '16:9' ? 'Cinema' : aspect === '9:16' ? 'Reels' : aspect === '1:1' ? 'Square' : 'Wide'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Image Area or Dropzone */}
      {!imageSrc ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/20'
              : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 hover:bg-neutral-950/70'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400 shadow-inner group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-200">
              Drag & drop image here, or <span className="text-cyan-400 underline">browse files</span>
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Supports PNG, JPG, WEBP, GIF &bull; Paste directly with Ctrl+V / Cmd+V
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800"
            >
              <LinkIcon className="w-3 h-3" />
              Load from URL
            </button>
          </div>

          {showUrlInput && (
            <form
              onSubmit={handleUrlSubmit}
              onClick={(e) => e.stopPropagation()}
              className="mt-3 flex items-center gap-2 w-full max-w-md"
            >
              <input
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
              >
                Load
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 group">
          {/* Aspect-constrained Preview Container */}
          <div
            className={`w-full max-h-[380px] flex items-center justify-center bg-black/40 overflow-hidden relative`}
          >
            <img
              src={imageSrc}
              alt="Source preview"
              className="w-full h-full object-contain max-h-[380px] transition-transform duration-300"
            />

            {/* Overlay Info Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-[11px] font-mono text-neutral-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {imageMeta ? `${imageMeta.width} × ${imageMeta.height}px` : 'Image Loaded'}
              </span>
              {brushStrokesCount > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/80 backdrop-blur-md border border-cyan-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <Brush className="w-3.5 h-3.5" />
                  {brushStrokesCount} Motion Zones Active
                </span>
              )}
            </div>

            {/* Action Bar over image */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenBrush}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-cyan-600 hover:text-neutral-950 border border-neutral-700 hover:border-cyan-500 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all"
              >
                <Brush className="w-3.5 h-3.5 text-cyan-400" />
                Motion Brush ({brushStrokesCount})
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-xs font-medium text-neutral-300 hover:text-white shadow-lg backdrop-blur-md transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                Change
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick 1-Click Sample Showcase Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Quick 1-Click Presets (Try Now):
          </span>
          <span className="text-[10px] text-neutral-500">Instant load & settings</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {SAMPLE_SCENES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group relative rounded-xl overflow-hidden border border-neutral-800/90 hover:border-cyan-500 aspect-video transition-all hover:scale-[1.02] shadow-sm text-left"
              title={`${sample.title} (${sample.category})`}
            >
              <img
                src={sample.imageUrl}
                alt={sample.title}
                className="w-full h-full object-cover group-hover:brightness-110 transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                <span className="text-[10px] font-bold text-white truncate drop-shadow">
                  {sample.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
