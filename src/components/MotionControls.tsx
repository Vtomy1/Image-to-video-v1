import React, { useState } from 'react';
import {
  Camera,
  Sliders,
  Move,
  Maximize2,
  RotateCw,
  Gauge,
  Waves,
  Sparkles,
  Music,
  Clock,
  Layers,
  Zap,
  RotateCcw,
} from 'lucide-react';
import {
  MotionSettings,
  CameraPreset,
  PhysicsEffect,
  AtmosphereParticle,
  AudioMood,
} from '../types/video';

interface MotionControlsProps {
  settings: MotionSettings;
  onChange: (updated: Partial<MotionSettings>) => void;
  onApplyPreset: (preset: CameraPreset) => void;
  activePreset: CameraPreset;
}

export const MotionControls: React.FC<MotionControlsProps> = ({
  settings,
  onChange,
  onApplyPreset,
  activePreset,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'physics' | 'atmosphere' | 'output'>('camera');

  const presets: { id: CameraPreset; label: string }[] = [
    { id: 'dolly-in', label: 'Dolly In' },
    { id: 'dolly-out', label: 'Dolly Out' },
    { id: 'vertigo', label: 'Vertigo Zoom' },
    { id: 'orbit-left', label: '3D Orbit Left' },
    { id: 'orbit-right', label: '3D Orbit Right' },
    { id: 'pan-right', label: 'Pan Right' },
    { id: 'crane-up', label: 'Crane Up' },
    { id: 'fpv-dive', label: 'FPV Dive' },
    { id: 'dutch-angle', label: 'Dutch Angle' },
  ];

  const physicsOptions: { id: PhysicsEffect; label: string; desc: string }[] = [
    { id: 'none', label: 'Standard Motion', desc: 'Natural perspective movement' },
    { id: 'cinematic_drift', label: 'Cinematic Drift', desc: 'Subtle floating depth parallax' },
    { id: 'fluid_water', label: 'Fluid Ripples', desc: 'Liquid water wave distortion' },
    { id: 'wind_turbulence', label: 'Wind Turbulence', desc: 'Breeze wave on hair & cloth' },
    { id: 'pika_melt', label: 'Pika Melt FX', desc: 'Surreal downward liquid drip' },
    { id: 'pika_explode', label: 'Pika Explode FX', desc: 'Outward radial particle dispersal' },
    { id: 'pika_levitate', label: 'Anti-Gravity Levitate', desc: 'Zero-G upward float' },
    { id: 'cyber_glitch', label: 'Cyber Glitch Warp', desc: 'Digital chromatic displacement' },
    { id: 'heartbeat_pulse', label: 'Heartbeat Pulse', desc: 'Rhythmic living breath pulse' },
  ];

  const atmosphereOptions: { id: AtmosphereParticle; label: string }[] = [
    { id: 'none', label: 'Clear Atmosphere' },
    { id: 'golden_embers', label: 'Golden Fire Embers' },
    { id: 'cyber_rain', label: 'Cyber Rain & Mist' },
    { id: 'anamorphic_flare', label: 'Anamorphic Light Streaks' },
    { id: 'cosmic_stardust', label: 'Cosmic Star Dust' },
    { id: 'smoke_fog', label: 'Volumetric Smoke / Fog' },
  ];

  const audioOptions: { id: AudioMood; label: string }[] = [
    { id: 'none', label: 'Mute (No Audio)' },
    { id: 'cinematic_drone', label: 'Cinematic Analog Drone' },
    { id: 'cyber_pulse', label: 'Cyber Synth 120BPM' },
    { id: 'deep_bass', label: 'Deep Sub Boom' },
    { id: 'ethereal_pad', label: 'Ethereal Celestial Pad' },
    { id: 'nature_rain', label: 'Rain & Wind Ambience' },
  ];

  // Gizmo interaction
  const handleGizmoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    onChange({
      panX: parseFloat(x.toFixed(2)),
      panY: parseFloat(y.toFixed(2)),
    });
  };

  return (
    <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-4 sm:p-5 flex flex-col gap-4">
      {/* Header and Section Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            4. Motion Choreography & FX
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Fine-tune 3D camera path, physics deformers, particle weather, and soundscape.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('camera')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'bg-neutral-800 text-cyan-400 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Camera
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'physics'
                ? 'bg-neutral-800 text-rose-400 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            Physics FX
          </button>
          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'atmosphere'
                ? 'bg-neutral-800 text-amber-400 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Atmosphere
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'output'
                ? 'bg-neutral-800 text-purple-400 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Output
          </button>
        </div>
      </div>

      {/* Tab 1: Camera Controls */}
      {activeTab === 'camera' && (
        <div className="flex flex-col gap-4">
          {/* Quick Camera Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-400">Cinematic Camera Presets:</span>
              <button
                onClick={() =>
                  onChange({
                    panX: 0,
                    panY: 0,
                    zoom: 0.35,
                    zoomDirection: 'in',
                    roll: 0,
                    orbit: 0,
                    intensity: 5,
                  })
                }
                className="text-[10px] text-neutral-500 hover:text-neutral-300 flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset Defaults
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onApplyPreset(preset.id)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all text-center truncate ${
                    activePreset === preset.id
                      ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                  }`}
                  title={preset.label}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive D-Pad Gizmo + Sliders Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* 3D Camera Gizmo Target */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                2D Camera Vector Pad (Click or Drag)
              </span>
              <div
                onClick={handleGizmoClick}
                className="relative w-36 h-36 rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-inner flex items-center justify-center cursor-crosshair overflow-hidden group"
              >
                {/* Crosshairs */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-neutral-800 pointer-events-none" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-neutral-800 pointer-events-none" />
                <div className="absolute w-20 h-20 rounded-full border border-neutral-800 pointer-events-none" />

                {/* Vector Joystick Handle */}
                <div
                  className="absolute w-6 h-6 rounded-full bg-cyan-500 border-2 border-white shadow-lg shadow-cyan-500/50 transition-all flex items-center justify-center pointer-events-none"
                  style={{
                    left: `calc(50% + ${settings.panX * 55}px - 12px)`,
                    top: `calc(50% + ${settings.panY * 55}px - 12px)`,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
                </div>
              </div>

              <div className="flex items-center justify-between w-full mt-2 text-[10px] font-mono text-neutral-400 px-2">
                <span>Pan X: {settings.panX > 0 ? `+${settings.panX}` : settings.panX}</span>
                <span>Pan Y: {settings.panY > 0 ? `+${settings.panY}` : settings.panY}</span>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Zoom & Direction */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    Zoom Amplitude
                  </span>
                  <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-md text-[10px]">
                    <button
                      onClick={() => onChange({ zoomDirection: 'in' })}
                      className={`px-1.5 py-0.5 rounded ${
                        settings.zoomDirection === 'in' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Push In
                    </button>
                    <button
                      onClick={() => onChange({ zoomDirection: 'out' })}
                      className={`px-1.5 py-0.5 rounded ${
                        settings.zoomDirection === 'out' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Pull Out
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.zoom}
                  onChange={(e) => onChange({ zoom: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                  <span>Static</span>
                  <span>{Math.round(settings.zoom * 100)}%</span>
                  <span>Extreme 2.5x</span>
                </div>
              </div>

              {/* 3D Orbit Arc */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                    3D Orbit Arc
                  </span>
                  <span className="text-[10px] font-mono text-purple-400">
                    {settings.orbit > 0 ? `+${settings.orbit}` : settings.orbit}
                  </span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={settings.orbit}
                  onChange={(e) => onChange({ orbit: parseFloat(e.target.value) })}
                  className="w-full accent-purple-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                  <span>Left Orbit</span>
                  <span>Center</span>
                  <span>Right Orbit</span>
                </div>
              </div>

              {/* Dutch Roll Tilt */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    Dutch Angle Roll
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">
                    {Math.round(settings.roll * 45)}&deg;
                  </span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="0.5"
                  step="0.05"
                  value={settings.roll}
                  onChange={(e) => onChange({ roll: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                  <span>-22&deg;</span>
                  <span>Level</span>
                  <span>+22&deg;</span>
                </div>
              </div>

              {/* Motion Intensity */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-rose-400" />
                    Motion Velocity
                  </span>
                  <span className="text-[10px] font-mono font-bold text-rose-400">
                    {settings.intensity} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={settings.intensity}
                  onChange={(e) => onChange({ intensity: parseInt(e.target.value) })}
                  className="w-full accent-rose-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                  <span>Subtle</span>
                  <span>Cinematic</span>
                  <span>High Action</span>
                </div>
              </div>
            </div>
          </div>

          {/* Speed Ramp & Camera Shake */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/60">
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 mb-1.5 block">
                Camera Speed Ramp:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 text-[11px]">
                {[
                  { id: 'smooth_ease', label: 'Smooth' },
                  { id: 'linear', label: 'Linear' },
                  { id: 'ease_in', label: 'Accelerate' },
                  { id: 'ease_out', label: 'Decelerate' },
                  { id: 'surge', label: 'Surge' },
                ].map((curve) => (
                  <button
                    key={curve.id}
                    onClick={() => onChange({ speedCurve: curve.id as any })}
                    className={`py-1 rounded-lg border text-center font-medium transition-all ${
                      settings.speedCurve === curve.id
                        ? 'bg-neutral-800 border-cyan-500 text-cyan-400 font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {curve.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-neutral-400 mb-1.5 block">
                Handheld Camera Wobble:
              </span>
              <div className="grid grid-cols-4 gap-1 text-[11px]">
                {[
                  { id: 'none', label: 'Tripod Still' },
                  { id: 'subtle', label: 'Subtle' },
                  { id: 'handheld', label: 'Handheld' },
                  { id: 'action', label: 'Action Shake' },
                ].map((shake) => (
                  <button
                    key={shake.id}
                    onClick={() => onChange({ cameraShake: shake.id as any })}
                    className={`py-1 rounded-lg border text-center font-medium transition-all ${
                      settings.cameraShake === shake.id
                        ? 'bg-neutral-800 border-purple-500 text-purple-400 font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {shake.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Physics FX */}
      {activeTab === 'physics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {physicsOptions.map((opt) => (
            <div
              key={opt.id}
              onClick={() => onChange({ physicsEffect: opt.id })}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                settings.physicsEffect === opt.id
                  ? 'bg-rose-950/30 border-rose-500 ring-1 ring-rose-500'
                  : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{opt.label}</span>
                {settings.physicsEffect === opt.id && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 shadow-sm shadow-rose-400" />
                )}
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{opt.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Atmosphere Particles & Sound */}
      {activeTab === 'atmosphere' && (
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold text-neutral-300 mb-2 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Atmospheric Particle Simulation:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {atmosphereOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ atmosphere: opt.id })}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    settings.atmosphere === opt.id
                      ? 'bg-amber-950/30 border-amber-500 text-amber-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800/60">
            <span className="text-xs font-bold text-neutral-300 mb-2 block flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              Synthesized Audio Soundscape (Embedded into MP4):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {audioOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ audioMood: opt.id })}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    settings.audioMood === opt.id
                      ? 'bg-cyan-950/30 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Video Output Settings */}
      {activeTab === 'output' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Duration */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-xs font-bold text-neutral-300 mb-2 block flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Duration:
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {[3, 5, 8, 10].map((dur) => (
                <button
                  key={dur}
                  onClick={() => onChange({ duration: dur })}
                  className={`py-2 rounded-lg font-bold transition-all border ${
                    settings.duration === dur
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>

          {/* Framerate */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-xs font-bold text-neutral-300 mb-2 block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Framerate:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[24, 30, 60].map((fpsVal) => (
                <button
                  key={fpsVal}
                  onClick={() => onChange({ fps: fpsVal as any })}
                  className={`py-2 rounded-lg font-bold transition-all border ${
                    settings.fps === fpsVal
                      ? 'bg-cyan-600 border-cyan-500 text-neutral-950'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {fpsVal} FPS
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-xs font-bold text-neutral-300 mb-2 block flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Resolution Quality:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: '720p', label: '720p HD' },
                { id: '1080p', label: '1080p FHD' },
                { id: '4k', label: '4K Ultra' },
              ].map((res) => (
                <button
                  key={res.id}
                  onClick={() => onChange({ resolution: res.id as any })}
                  className={`py-2 rounded-lg font-bold transition-all border ${
                    settings.resolution === res.id
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {res.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
