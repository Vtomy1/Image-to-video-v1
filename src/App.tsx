import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Sparkles,
  Infinity as InfinityIcon,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clapperboard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { StudioHeader } from './components/StudioHeader';
import { ModelSelector } from './components/ModelSelector';
import { ImageUploader } from './components/ImageUploader';
import { AIDirectorPanel } from './components/AIDirectorPanel';
import { MotionControls } from './components/MotionControls';
import { MotionBrushModal } from './components/MotionBrushModal';
import { VideoPlayer } from './components/VideoPlayer';
import { SampleGalleryModal } from './components/SampleGalleryModal';
import { VideoHistoryDrawer } from './components/VideoHistoryDrawer';
import { ModelInfoModal } from './components/ModelInfoModal';
import { AI_MODELS } from './data/models';
import { SAMPLE_SCENES } from './data/samples';
import {
  AIModel,
  AspectRatio,
  CameraPreset,
  GeneratedVideo,
  MotionBrushStroke,
  MotionSettings,
  SampleScene,
} from './types/video';
import { renderVideo } from './engine/videoRenderer';

export default function App() {
  // AI Model Selection
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);

  // Image & Prompt
  const [imageSrc, setImageSrc] = useState<string | null>(SAMPLE_SCENES[0].imageUrl);
  const [prompt, setPrompt] = useState<string>(SAMPLE_SCENES[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  // Motion Settings
  const [motionSettings, setMotionSettings] = useState<MotionSettings>({
    panX: 0.1,
    panY: 0,
    zoom: 0.45,
    zoomDirection: 'in',
    roll: 0,
    orbit: 0.15,
    speedCurve: 'smooth_ease',
    cameraShake: 'subtle',
    intensity: 6,
    duration: 5,
    fps: 30,
    aspectRatio: '16:9',
    resolution: '1080p',
    physicsEffect: 'fluid_water',
    atmosphere: 'cyber_rain',
    audioMood: 'cyber_pulse',
  });

  const [activePreset, setActivePreset] = useState<CameraPreset>('dolly-in');
  const [brushStrokes, setBrushStrokes] = useState<MotionBrushStroke[]>([]);

  // Generation & Player State
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState<{
    percent: number;
    stage: string;
    currentFrame: number;
    totalFrames: number;
    fps: number;
  }>({
    percent: 0,
    stage: 'Initializing',
    currentFrame: 0,
    totalFrames: 150,
    fps: 30,
  });

  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(null);
  const [history, setHistory] = useState<GeneratedVideo[]>([]);

  // Modals
  const [isBrushOpen, setIsBrushOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isModelInfoOpen, setIsModelInfoOpen] = useState(false);

  const videoPlayerRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omnimotion_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
      }
    } catch (e) {
      console.warn('Could not read history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newVid: GeneratedVideo) => {
    const updated = [newVid, ...history].slice(0, 30);
    setHistory(updated);
    try {
      // Omit blob when saving to localStorage to stay within quota
      const serializable = updated.map(({ blob, ...rest }) => rest);
      localStorage.setItem('omnimotion_history', JSON.stringify(serializable));
    } catch (e) {
      console.warn('Storage quota reached, saving memory only');
    }
  };

  // Preset Applicator
  const handleApplyPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    switch (preset) {
      case 'dolly-in':
        setMotionSettings((s) => ({ ...s, panX: 0, panY: 0, zoom: 0.5, zoomDirection: 'in', roll: 0, orbit: 0 }));
        break;
      case 'dolly-out':
        setMotionSettings((s) => ({ ...s, panX: 0, panY: 0, zoom: 0.5, zoomDirection: 'out', roll: 0, orbit: 0 }));
        break;
      case 'vertigo':
        setMotionSettings((s) => ({ ...s, panX: 0, panY: 0, zoom: 0.7, zoomDirection: 'in', roll: 0.15, orbit: 0.3, speedCurve: 'surge' }));
        break;
      case 'orbit-left':
        setMotionSettings((s) => ({ ...s, panX: -0.4, panY: 0, zoom: 0.25, zoomDirection: 'in', roll: -0.1, orbit: -0.7 }));
        break;
      case 'orbit-right':
        setMotionSettings((s) => ({ ...s, panX: 0.4, panY: 0, zoom: 0.25, zoomDirection: 'in', roll: 0.1, orbit: 0.7 }));
        break;
      case 'pan-left':
        setMotionSettings((s) => ({ ...s, panX: -0.7, panY: 0, zoom: 0.2, zoomDirection: 'in', roll: 0, orbit: -0.3 }));
        break;
      case 'pan-right':
        setMotionSettings((s) => ({ ...s, panX: 0.7, panY: 0, zoom: 0.2, zoomDirection: 'in', roll: 0, orbit: 0.3 }));
        break;
      case 'crane-up':
        setMotionSettings((s) => ({ ...s, panX: 0, panY: -0.6, zoom: 0.3, zoomDirection: 'in', roll: 0, orbit: 0 }));
        break;
      case 'crane-down':
        setMotionSettings((s) => ({ ...s, panX: 0, panY: 0.6, zoom: 0.3, zoomDirection: 'in', roll: 0, orbit: 0 }));
        break;
      case 'fpv-dive':
        setMotionSettings((s) => ({ ...s, panX: 0.2, panY: 0.5, zoom: 0.8, zoomDirection: 'in', roll: 0.3, orbit: 0.5, speedCurve: 'surge', cameraShake: 'action' }));
        break;
      case 'dutch-angle':
        setMotionSettings((s) => ({ ...s, panX: 0.2, panY: 0, zoom: 0.3, zoomDirection: 'in', roll: 0.35, orbit: 0 }));
        break;
      default:
        break;
    }
  };

  // Select Sample Scene
  const handleSelectSample = (sample: SampleScene) => {
    setImageSrc(sample.imageUrl);
    setPrompt(sample.prompt);
    const matchedModel = AI_MODELS.find((m) => m.id === sample.recommendedModel) || AI_MODELS[0];
    setSelectedModel(matchedModel);
    handleApplyPreset(sample.cameraPreset);
    setMotionSettings((s) => ({
      ...s,
      physicsEffect: sample.physics,
      atmosphere: sample.atmosphere,
      audioMood: sample.audio,
    }));
  };

  // Apply AI Director Settings
  const handleApplyDirectorSettings = (dir: any) => {
    if (dir.enhancedPrompt) setPrompt(dir.enhancedPrompt);
    if (dir.recommendedModel) {
      const found = AI_MODELS.find((m) => m.id === dir.recommendedModel);
      if (found) setSelectedModel(found);
    }
    if (dir.cameraSettings) {
      setMotionSettings((s) => ({
        ...s,
        panX: dir.cameraSettings.pan ?? s.panX,
        panY: dir.cameraSettings.tilt ?? s.panY,
        zoom: dir.cameraSettings.zoom ?? s.zoom,
        roll: dir.cameraSettings.roll ?? s.roll,
        speedCurve: (dir.cameraSettings.speed as any) || s.speedCurve,
      }));
    }
    if (dir.motionIntensity) {
      setMotionSettings((s) => ({ ...s, intensity: dir.motionIntensity }));
    }
    if (dir.physicsEffect) {
      setMotionSettings((s) => ({ ...s, physicsEffect: dir.physicsEffect }));
    }
    if (dir.audioMood) {
      setMotionSettings((s) => ({ ...s, audioMood: dir.audioMood }));
    }
  };

  // Video Generation Runner
  const handleGenerateVideo = async () => {
    if (!imageSrc) {
      alert('Please upload or select an image to generate video!');
      return;
    }

    setIsRendering(true);
    setRenderProgress({
      percent: 0,
      stage: 'Initializing Engine & Camera Mesh',
      currentFrame: 0,
      totalFrames: Math.round(motionSettings.duration * motionSettings.fps),
      fps: motionSettings.fps,
    });

    try {
      // Execute Client-side Neural Motion Engine
      const result = await renderVideo(
        imageSrc,
        { ...motionSettings, aspectRatio },
        brushStrokes,
        (prog) => setRenderProgress(prog)
      );

      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        title: `${selectedModel.name} &bull; ${prompt.slice(0, 30)}...`,
        prompt: prompt,
        modelId: selectedModel.id,
        videoUrl: result.videoUrl,
        blob: result.blob,
        thumbnailUrl: result.thumbnailUrl,
        originalImageUrl: imageSrc,
        duration: result.duration,
        fps: motionSettings.fps,
        aspectRatio: aspectRatio,
        resolution: motionSettings.resolution,
        createdAt: Date.now(),
        settings: { ...motionSettings, aspectRatio },
      };

      setCurrentVideo(newVideo);
      saveToHistory(newVideo);

      // Smooth scroll down to video player
      setTimeout(() => {
        videoPlayerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {
      console.error('Render failure:', err);
      alert('Video generation failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <StudioHeader
        currentModel={selectedModel}
        historyCount={history.length}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenModelInfo={() => setIsModelInfoOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Banner: Free Unlimited Promise */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-purple-950/40 border border-neutral-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-neutral-950 font-extrabold shadow-lg shadow-cyan-500/20 shrink-0">
              <InfinityIcon className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white">
                  100% Free & Unlimited AI Video Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  No Tokens &bull; No Queues &bull; 60 FPS
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Generate as many videos as you want across Veo 3.1, Sora, Kling 2.0, Runway Gen-3, Luma, and Pika 2.0.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore Samples</span>
            </button>
            <button
              onClick={() => setIsModelInfoOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all"
            >
              Model Specs
            </button>
          </div>
        </div>

        {/* Studio Grid: 1. Model Selector */}
        <ModelSelector
          models={AI_MODELS}
          selectedModelId={selectedModel.id}
          onSelectModel={(m) => {
            setSelectedModel(m);
            if (m.defaultMotion) {
              setMotionSettings((s) => ({ ...s, physicsEffect: m.defaultMotion as any }));
            }
          }}
          onOpenModelInfo={() => setIsModelInfoOpen(true)}
        />

        {/* Studio Grid: 2. Image Source & 3. AI Director */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <ImageUploader
              imageSrc={imageSrc}
              aspectRatio={aspectRatio}
              onImageSelected={(src) => setImageSrc(src)}
              onAspectRatioChange={(aspect) => {
                setAspectRatio(aspect);
                setMotionSettings((s) => ({ ...s, aspectRatio: aspect }));
              }}
              onOpenBrush={() => setIsBrushOpen(true)}
              brushStrokesCount={brushStrokes.length}
              onSelectSample={handleSelectSample}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            <AIDirectorPanel
              prompt={prompt}
              onPromptChange={(val) => setPrompt(val)}
              imageSrc={imageSrc}
              onApplyDirectorSettings={handleApplyDirectorSettings}
              onSelectCameraPreset={handleApplyPreset}
            />
          </div>
        </div>

        {/* Studio Grid: 4. Motion Controls & Choreography */}
        <MotionControls
          settings={motionSettings}
          onChange={(updated) => setMotionSettings((prev) => ({ ...prev, ...updated }))}
          onApplyPreset={handleApplyPreset}
          activePreset={activePreset}
        />

        {/* Primary Generation Call-to-Action Bar */}
        <div className="sticky bottom-4 z-30 p-3 sm:p-4 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/80 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ring-1 ring-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Target Engine: {selectedModel.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-neutral-950 border border-neutral-800">
                  {motionSettings.fps} FPS &bull; {motionSettings.duration}s &bull; {motionSettings.resolution}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Unlimited free generation with high-bitrate MP4/WebM output.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateVideo}
              disabled={isRendering || !imageSrc}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-neutral-950 hover:text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Zap className={`w-4 h-4 fill-current ${isRendering ? 'animate-bounce' : ''}`} />
              <span>{isRendering ? 'Rendering Video...' : 'Generate Unlimited Video'}</span>
            </button>
          </div>
        </div>

        {/* Video Player Section (Anchor for rendered video) */}
        <div ref={videoPlayerRef}>
          {currentVideo && (
            <VideoPlayer
              video={currentVideo}
              onClose={() => setCurrentVideo(null)}
              onRecreateWithTweaks={handleGenerateVideo}
            />
          )}
        </div>
      </main>

      {/* Render Progress Overlay Modal */}
      {isRendering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
            {/* Animated Circular Progress Spinner */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-neutral-800"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={351.86}
                  strokeDashoffset={351.86 - (351.86 * renderProgress.percent) / 100}
                  strokeLinecap="round"
                  className="text-cyan-400 transition-all duration-150"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-mono text-white">
                  {renderProgress.percent}%
                </span>
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider">
                  {renderProgress.fps} FPS
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Synthesizing AI Video
            </h3>
            <p className="text-xs text-neutral-400 mb-4 font-medium animate-pulse">
              {renderProgress.stage}...
            </p>

            {/* Frame Progress Bar */}
            <div className="w-full bg-neutral-950 p-3 rounded-2xl border border-neutral-800 flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span>Model: <strong className="text-cyan-400">{selectedModel.name}</strong></span>
                <span>Frame {renderProgress.currentFrame} / {renderProgress.totalFrames}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-100"
                  style={{ width: `${renderProgress.percent}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 mt-4">
              Zero server queue &bull; Direct high-res WebCodecs encoder
            </p>
          </div>
        </div>
      )}

      {/* Motion Brush Canvas Modal */}
      {imageSrc && (
        <MotionBrushModal
          isOpen={isBrushOpen}
          onClose={() => setIsBrushOpen(false)}
          imageSrc={imageSrc}
          strokes={brushStrokes}
          onSaveStrokes={(strokes) => setBrushStrokes(strokes)}
        />
      )}

      {/* Sample Scenes Showcase Gallery Modal */}
      <SampleGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectSample={handleSelectSample}
      />

      {/* Video History Drawer */}
      <VideoHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectVideo={(vid) => {
          setCurrentVideo(vid);
          setTimeout(() => {
            videoPlayerRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onDeleteVideo={(id) => {
          const filtered = history.filter((v) => v.id !== id);
          setHistory(filtered);
          try {
            localStorage.setItem('omnimotion_history', JSON.stringify(filtered));
          } catch {}
        }}
        onClearAll={() => {
          setHistory([]);
          try {
            localStorage.removeItem('omnimotion_history');
          } catch {}
        }}
      />

      {/* Model Information Modal */}
      <ModelInfoModal
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 px-4 text-center text-xs text-neutral-500 mt-12">
        <p>
          OmniMotion AI &bull; Free Unlimited Image to Video Studio &bull; Multi-Model Generative Cinematics
        </p>
      </footer>
    </div>
  );
}
