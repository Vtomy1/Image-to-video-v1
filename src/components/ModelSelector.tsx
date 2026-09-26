import React, { useState } from 'react';
import { AIModel, ModelId } from '../types/video';
import { Check, Sparkles, Zap, Flame, Film, Wand2, ShieldCheck } from 'lucide-react';

interface ModelSelectorProps {
  models: AIModel[];
  selectedModelId: ModelId;
  onSelectModel: (model: AIModel) => void;
  onOpenModelInfo: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelId,
  onSelectModel,
  onOpenModelInfo,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlimited' | 'cinematic' | 'physics'>('all');

  const filteredModels = models.filter((m) => {
    if (filter === 'unlimited') return m.isUnlimitedFree;
    if (filter === 'cinematic') return m.id === 'veo-3.1' || m.id === 'runway-gen3' || m.id === 'sora' || m.id === 'luma-dream';
    if (filter === 'physics') return m.id === 'pika-2.0' || m.id === 'kling-2.0' || m.id === 'wan-2.1';
    return true;
  });

  return (
    <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
              <Film className="w-4 h-4 text-cyan-400" />
              1. Choose Video AI Engine
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              8 Models Available
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Switch between top generative video architectures — all equipped with free unlimited generation.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800/80 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unlimited')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filter === 'unlimited'
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Instant 60fps
          </button>
          <button
            onClick={() => setFilter('cinematic')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filter === 'cinematic'
                ? 'bg-neutral-800 text-purple-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Hollywood
          </button>
          <button
            onClick={() => setFilter('physics')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filter === 'physics'
                ? 'bg-neutral-800 text-rose-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Physics FX
          </button>
        </div>
      </div>

      {/* Grid of Models */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredModels.map((model) => {
          const isSelected = model.id === selectedModelId;
          return (
            <div
              key={model.id}
              onClick={() => onSelectModel(model)}
              className={`group relative rounded-xl p-3.5 cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                  : 'bg-neutral-950/60 border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900/60'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${model.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-md`}
                    >
                      {model.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {model.name}
                      </h3>
                      <p className="text-[10px] text-neutral-400">{model.provider}</p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-neutral-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider bg-neutral-800/80 text-neutral-400 group-hover:text-neutral-200">
                      {model.badge}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed mb-3">
                  {model.tagline}
                </p>
              </div>

              {/* Strengths Pills */}
              <div className="pt-2 border-t border-neutral-800/60">
                <div className="flex flex-wrap gap-1">
                  {model.strengths.slice(0, 2).map((strength, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-400 font-medium"
                    >
                      {strength}
                    </span>
                  ))}
                  {model.strengths.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-500 font-medium">
                      +{model.strengths.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
