import React from 'react';
import { Film, Sparkles, Infinity as InfinityIcon, Compass, History, Info, Zap } from 'lucide-react';
import { AIModel } from '../types/video';

interface StudioHeaderProps {
  currentModel: AIModel;
  historyCount: number;
  onOpenGallery: () => void;
  onOpenHistory: () => void;
  onOpenModelInfo: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  currentModel,
  historyCount,
  onOpenGallery,
  onOpenHistory,
  onOpenModelInfo,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-xl px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-neutral-950 rounded-[11px] flex items-center justify-center">
              <Film className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                OmniMotion AI
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <InfinityIcon className="w-3 h-3" />
                Free Unlimited
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              All-Model Image-to-Video Creation Suite &bull; Veo &bull; Sora &bull; Kling &bull; Runway &bull; Pika
            </p>
          </div>
        </div>

        {/* Quick Nav & Status Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Model Pill */}
          <button
            onClick={onOpenModelInfo}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
            title="Click to view all model specifications"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline text-neutral-400">Active Model:</span>
            <span className="font-semibold text-white">{currentModel.name}</span>
          </button>

          {/* Sample Gallery Button */}
          <button
            onClick={onOpenGallery}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:bg-neutral-800 hover:border-cyan-500/40 text-xs font-medium text-neutral-300 hover:text-white transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Sample Gallery</span>
          </button>

          {/* History Drawer Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:bg-neutral-800 hover:border-purple-500/40 text-xs font-medium text-neutral-300 hover:text-white transition-all"
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">My Videos</span>
            {historyCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-purple-600 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          {/* All Models Guide */}
          <button
            onClick={onOpenModelInfo}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
            title="Learn about all AI models"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
