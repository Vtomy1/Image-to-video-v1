import React, { useState } from 'react';
import { X, Sparkles, Film, ArrowRight } from 'lucide-react';
import { SAMPLE_SCENES } from '../data/samples';
import { SampleScene } from '../types/video';

interface SampleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleScene) => void;
}

export const SampleGalleryModal: React.FC<SampleGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  const [filter, setFilter] = useState<string>('All');
  if (!isOpen) return null;

  const categories = ['All', 'Sci-Fi', 'Fantasy', 'Nature', 'Cinematic', 'Anime'];

  const filtered = filter === 'All'
    ? SAMPLE_SCENES
    : SAMPLE_SCENES.filter((s) => s.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Cinematic Sample Showcase</h3>
              <p className="text-xs text-neutral-400">
                Click any scene to instantly load its high-res source image, camera choreography, and motion prompt.
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

        {/* Filter Pills */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center gap-2 bg-neutral-950 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-cyan-500 text-neutral-950'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Samples */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample);
                onClose();
              }}
              className="group rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer transition-all flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-bold text-neutral-200">
                  {sample.category}
                </span>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                    {sample.prompt}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Model: <strong className="text-cyan-300 uppercase">{sample.recommendedModel}</strong></span>
                  <span className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    Load Scene <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
