import React from 'react';
import { X, Check, Zap, Infinity as InfinityIcon, Sparkles, Shield, Cpu } from 'lucide-react';
import { AI_MODELS } from '../data/models';

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelInfoModal: React.FC<ModelInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <InfinityIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">All Models & Free Unlimited Architecture</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Every model profile is unlocked for infinite generation with zero subscription fees, queues, or watermarks.
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

        {/* Info Banner */}
        <div className="p-4 bg-cyan-950/20 border-b border-cyan-900/30 flex items-start gap-3">
          <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-300 leading-relaxed">
            <strong className="text-cyan-300">How Unlimited Free Generation Works:</strong> OmniMotion AI couples local WebCodecs, 2.5D depth parallax synthesis, and optical flow fields with Gemini 3.8 Flash cinematographic intelligence. Render videos directly in your browser with zero latency and unlimited renders, or connect directly to Google Veo for deep cloud diffusion.
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {AI_MODELS.map((model) => (
            <div
              key={model.id}
              className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${model.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow`}
                    >
                      {model.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{model.name}</h4>
                      <p className="text-[11px] text-neutral-400">{model.provider}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 text-cyan-400 border border-neutral-800">
                    {model.badge}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                  {model.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-col gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {model.strengths.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-300 font-medium"
                    >
                      &bull; {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1 font-mono">
                  <span>Max FPS: <strong className="text-white">{model.maxFps} FPS</strong></span>
                  <span>Free Unlimited: <strong className="text-emerald-400">&infin; Enabled</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            Got it, Let's Create!
          </button>
        </div>
      </div>
    </div>
  );
};
