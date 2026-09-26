import React from 'react';
import { X, Play, Download, Trash2, Film, Clock, Layers } from 'lucide-react';
import { GeneratedVideo } from '../types/video';

interface VideoHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedVideo[];
  onSelectVideo: (video: GeneratedVideo) => void;
  onDeleteVideo: (id: string) => void;
  onClearAll: () => void;
}

export const VideoHistoryDrawer: React.FC<VideoHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectVideo,
  onDeleteVideo,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-base font-bold text-white">Video Creations</h3>
              <p className="text-xs text-neutral-400">
                {history.length} video{history.length === 1 ? '' : 's'} rendered this session
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-500">
              <Film className="w-12 h-12 mb-3 stroke-[1.5] text-neutral-700" />
              <p className="text-sm font-semibold text-neutral-300">No videos rendered yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Upload an image or pick a sample above, adjust your motion script, and press "Generate Unlimited Video" to begin!
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-xl border border-neutral-800 bg-neutral-950/80 hover:border-cyan-500/80 transition-all flex gap-3"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => {
                    onSelectVideo(item);
                    onClose();
                  }}
                  className="relative w-24 h-24 rounded-lg overflow-hidden bg-black shrink-0 cursor-pointer group-hover:ring-2 group-hover:ring-cyan-400 transition-all"
                >
                  <img
                    src={item.thumbnailUrl || item.originalImageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white fill-current" />
                  </div>
                  <span className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[9px] font-mono text-white">
                    {item.duration}s
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                        {item.modelId}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 line-clamp-2 leading-snug">
                      {item.prompt || 'Cinematic Motion Sequence'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-xs">
                    <button
                      onClick={() => {
                        onSelectVideo(item);
                        onClose();
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <Play className="w-3 h-3 fill-current" /> Play
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={item.videoUrl}
                        download={`omnimotion-${item.id}.mp4`}
                        className="p-1 text-neutral-400 hover:text-white"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onDeleteVideo(item.id)}
                        className="p-1 text-neutral-500 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium"
            >
              Clear All History
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
