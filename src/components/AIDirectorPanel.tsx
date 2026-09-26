import React, { useState } from 'react';
import { Sparkles, Wand2, Compass, Bot, Check, AlertCircle, ArrowUpRight, Clapperboard } from 'lucide-react';
import { CameraPreset, MotionSettings, AIModel } from '../types/video';

interface AIDirectorPanelProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  imageSrc: string | null;
  onApplyDirectorSettings: (settings: {
    enhancedPrompt: string;
    recommendedCamera: string;
    cameraSettings: { pan: number; tilt: number; zoom: number; roll: number; speed: string };
    motionIntensity: number;
    physicsEffect: any;
    lightingShift: string;
    recommendedModel: string;
    audioMood: any;
    sceneSummary: string;
  }) => void;
  onSelectCameraPreset: (preset: CameraPreset) => void;
}

export const AIDirectorPanel: React.FC<AIDirectorPanelProps> = ({
  prompt,
  onPromptChange,
  imageSrc,
  onApplyDirectorSettings,
  onSelectCameraPreset,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [directorLog, setDirectorLog] = useState<{
    sceneSummary: string;
    recommendedCamera: string;
    lightingShift: string;
    recommendedModel: string;
  } | null>(null);

  const promptPresets = [
    { label: '35mm Panavision Dolly', text: 'Cinematic slow push-in, 35mm film grain, 4k ultra-detailed, volumetric atmospheric lighting, photorealistic motion physics' },
    { label: 'Neo-Tokyo Cyberpunk', text: 'Neon reflections glistening on wet ground, rain cascading with dynamic light streaks, gentle camera pan, shallow depth of field' },
    { label: 'Ethereal Zero-G Float', text: 'Zero gravity weightless drift, floating stardust particles reflecting soft purple backlight, subtle rotational roll' },
    { label: 'Pika Liquid Melt', text: 'Dynamic viscous liquid melting effect, bubbling surreal transformation, whimsical physics, vibrant color pop' },
    { label: 'Dramatic Golden Hour', text: 'Low-angle sun flare, warm golden rays filtering through atmosphere, wind blowing particles, majestic slow motion' },
  ];

  const handleAutoDirect = async () => {
    if (!imageSrc) {
      alert('Please upload or select an image first so the AI Director can analyze it!');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/director/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc,
          prompt: prompt,
        }),
      });

      const data = await response.json();
      if (data && !data.error) {
        onApplyDirectorSettings(data);
        setDirectorLog({
          sceneSummary: data.sceneSummary,
          recommendedCamera: data.recommendedCamera,
          lightingShift: data.lightingShift,
          recommendedModel: data.recommendedModel,
        });
      } else if (data.fallback) {
        onApplyDirectorSettings(data.fallback);
        setDirectorLog({
          sceneSummary: data.fallback.sceneSummary,
          recommendedCamera: data.fallback.recommendedCamera,
          lightingShift: data.fallback.lightingShift,
          recommendedModel: data.fallback.recommendedModel,
        });
      }
    } catch (err) {
      console.error('Failed to auto-direct:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      onPromptChange('Cinematic 35mm slow push-in, shallow depth of field, natural motion blur, 4k photorealistic lighting');
      return;
    }

    setIsEnhancing(true);
    try {
      const res = await fetch('/api/director/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        onPromptChange(data.enhancedPrompt);
      }
    } catch (err) {
      console.error('Failed to enhance prompt:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-4 sm:p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
            <Clapperboard className="w-4 h-4 text-cyan-400" />
            3. AI Director & Motion Script
          </h2>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
            <Bot className="w-3 h-3" />
            Gemini 3.8 Flash Powered
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoDirect}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            title="Inspect image and automatically choreograph camera, lighting, and prompt"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing Scene...' : 'AI Auto-Direct'}
          </button>

          <button
            type="button"
            onClick={handleEnhancePrompt}
            disabled={isEnhancing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium transition-all disabled:opacity-50"
          >
            <Wand2 className={`w-3.5 h-3.5 text-cyan-400 ${isEnhancing ? 'animate-pulse' : ''}`} />
            {isEnhancing ? 'Polishing...' : 'Enhance Prompt'}
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe how the scene should move, camera angles, lighting, or physics (e.g. 'Slow cinematic camera push-in, hair blowing in the wind, neon reflections shimmering in puddles')..."
          className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-cyan-500/80 rounded-xl p-3.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none transition-all leading-relaxed"
        />
        {prompt && (
          <button
            onClick={() => onPromptChange('')}
            className="absolute top-2.5 right-2.5 text-neutral-500 hover:text-neutral-300 text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Preset Prompt Pills */}
      <div>
        <div className="text-[11px] font-semibold text-neutral-400 mb-1.5 flex items-center gap-1">
          <span>Prompt Inspirations:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {promptPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPromptChange(preset.text)}
              className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800/80 hover:border-neutral-700 text-[11px] text-neutral-300 hover:text-white transition-all flex items-center gap-1"
            >
              <span>{preset.label}</span>
              <ArrowUpRight className="w-2.5 h-2.5 text-neutral-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Director's Log Card (if auto-directed) */}
      {directorLog && (
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs flex flex-col gap-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
              <Bot className="w-3.5 h-3.5" />
              Director Choreography Applied:
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-[10px] text-purple-200 font-semibold border border-purple-700/50">
              {directorLog.recommendedCamera}
            </span>
          </div>
          <p className="text-neutral-300 text-[11px] leading-relaxed">
            {directorLog.sceneSummary}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-purple-900/40 text-[10px] text-purple-300">
            <span>Lighting: <strong className="text-white">{directorLog.lightingShift}</strong></span>
            &bull;
            <span>Model Profile: <strong className="text-cyan-300 uppercase">{directorLog.recommendedModel}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
