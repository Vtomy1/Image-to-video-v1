export type ModelId =
  | 'omni'
  | 'veo-3.1'
  | 'sora'
  | 'kling-2.0'
  | 'runway-gen3'
  | 'luma-dream'
  | 'pika-2.0'
  | 'wan-2.1';

export interface AIModel {
  id: ModelId;
  name: string;
  provider: string;
  badge: string;
  tagline: string;
  isUnlimitedFree: boolean;
  avatarColor: string;
  strengths: string[];
  maxFps: number;
  resolutions: string[];
  defaultMotion: string;
  description: string;
}

export type CameraPreset =
  | 'custom'
  | 'dolly-in'
  | 'dolly-out'
  | 'vertigo'
  | 'orbit-left'
  | 'orbit-right'
  | 'pan-left'
  | 'pan-right'
  | 'crane-up'
  | 'crane-down'
  | 'fpv-dive'
  | 'dutch-angle';

export type PhysicsEffect =
  | 'none'
  | 'cinematic_drift'
  | 'fluid_water'
  | 'wind_turbulence'
  | 'pika_melt'
  | 'pika_explode'
  | 'pika_levitate'
  | 'cyber_glitch'
  | 'heartbeat_pulse';

export type AtmosphereParticle =
  | 'none'
  | 'golden_embers'
  | 'cyber_rain'
  | 'anamorphic_flare'
  | 'cosmic_stardust'
  | 'smoke_fog';

export type AudioMood =
  | 'none'
  | 'cinematic_drone'
  | 'cyber_pulse'
  | 'deep_bass'
  | 'ethereal_pad'
  | 'nature_rain';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '21:9';

export interface MotionSettings {
  panX: number; // -1 to 1
  panY: number; // -1 to 1
  zoom: number; // 0 to 1 (0 = neutral, 1 = max 2.5x push)
  zoomDirection: 'in' | 'out';
  roll: number; // -0.5 to 0.5 (Dutch tilt)
  orbit: number; // -1 to 1
  speedCurve: 'smooth_ease' | 'linear' | 'ease_in' | 'ease_out' | 'surge';
  cameraShake: 'none' | 'subtle' | 'action' | 'handheld';
  intensity: number; // 1 to 10
  duration: number; // 3, 5, 8, 10 seconds
  fps: 24 | 30 | 60;
  aspectRatio: AspectRatio;
  resolution: '720p' | '1080p' | '4k';
  physicsEffect: PhysicsEffect;
  atmosphere: AtmosphereParticle;
  audioMood: AudioMood;
}

export interface MotionBrushStroke {
  id: string;
  points: { x: number; y: number }[];
  radius: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'outward' | 'inward';
  velocity: number;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  prompt: string;
  modelId: ModelId;
  videoUrl: string;
  blob?: Blob;
  thumbnailUrl: string;
  originalImageUrl: string;
  duration: number;
  fps: number;
  aspectRatio: AspectRatio;
  resolution: string;
  createdAt: number;
  settings: MotionSettings;
}

export interface SampleScene {
  id: string;
  title: string;
  category: 'Cinematic' | 'Sci-Fi' | 'Fantasy' | 'Nature' | 'Anime';
  imageUrl: string;
  prompt: string;
  recommendedModel: ModelId;
  cameraPreset: CameraPreset;
  physics: PhysicsEffect;
  atmosphere: AtmosphereParticle;
  audio: AudioMood;
}
