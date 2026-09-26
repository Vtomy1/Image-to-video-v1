import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  SlidersHorizontal,
  Share2,
  Check,
  Film,
  Zap,
} from 'lucide-react';
import { GeneratedVideo } from '../types/video';

interface VideoPlayerProps {
  video: GeneratedVideo;
  onClose?: () => void;
  onRecreateWithTweaks?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onClose,
  onRecreateWithTweaks,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [compareSplit, setCompareSplit] = useState(50);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [video.videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [0.5, 1, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = video.videoUrl;
    const ext = video.videoUrl.includes('mp4') ? 'mp4' : 'webm';
    a.download = `omnimotion-${video.modelId}-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
      {/* Player Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Generated Successfully &bull; 100% Free
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono">
              {video.fps} FPS &bull; {video.resolution}
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            {video.title || 'AI Cinematic Video'}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
            {video.prompt}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Compare Before / After Toggle */}
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showComparison
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Before / After Split</span>
          </button>

          {/* Download Video */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download HD</span>
          </button>
        </div>
      </div>

      {/* Video Viewport */}
      <div className="relative w-full rounded-xl overflow-hidden bg-black flex items-center justify-center min-h-[320px] max-h-[580px] shadow-2xl border border-neutral-800/80 group">
        {!showComparison ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            autoPlay
            loop={isLooping}
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            className="w-full h-full object-contain max-h-[580px] cursor-pointer"
          />
        ) : (
          /* Split View Slider */
          <div className="relative w-full h-[450px] overflow-hidden select-none">
            {/* Background: Original Image */}
            <img
              src={video.originalImageUrl}
              alt="Original static"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Foreground: Playing Video with clip-path */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - compareSplit}% 0 0)` }}
            >
              <video
                ref={videoRef}
                src={video.videoUrl}
                autoPlay
                loop={isLooping}
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Split Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] pointer-events-none"
              style={{ left: `${compareSplit}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-[10px] text-neutral-950 font-bold shadow-lg">
                &#8644;
              </div>
            </div>
            {/* Split controller slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={compareSplit}
              onChange={(e) => setCompareSplit(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
            />
            {/* Labels */}
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/70 text-[10px] font-bold text-cyan-400 backdrop-blur-sm pointer-events-none">
              AI Video ({video.modelId})
            </div>
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-[10px] font-bold text-neutral-300 backdrop-blur-sm pointer-events-none">
              Original Static Image
            </div>
          </div>
        )}

        {/* Center Big Play Pause icon overlay on pause */}
        {!isPlaying && !showComparison && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-cyan-500/90 text-neutral-950 flex items-center justify-center shadow-xl shadow-cyan-500/30">
              <Play className="w-8 h-8 ml-1 fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Video Control Bar */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
        {/* Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-neutral-400 min-w-[36px]">
            {currentTime.toFixed(1)}s
          </span>
          <input
            type="range"
            min="0"
            max={video.duration || 5}
            step="0.05"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-cyan-400 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-neutral-400 min-w-[36px] text-right">
            {(video.duration || 5).toFixed(1)}s
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play();
                  setIsPlaying(true);
                }
              }}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isLooping
                  ? 'bg-neutral-800 border-cyan-500 text-cyan-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
              title="Loop video"
            >
              Loop
            </button>

            <button
              onClick={cyclePlaybackRate}
              className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white"
            >
              {playbackRate}x
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
              title="Share / Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
