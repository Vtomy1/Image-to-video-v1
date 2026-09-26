import { SampleScene } from '../types/video';

export const SAMPLE_SCENES: SampleScene[] = [
  {
    id: 'cyberpunk-neon-ronin',
    title: 'Cyberpunk Neon Ronin',
    category: 'Sci-Fi',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Slow cinematic push-in on futuristic cyber warrior standing in Shibuya rain, neon signs flickering in puddles, steam rising from grates, dynamic light reflections',
    recommendedModel: 'runway-gen3',
    cameraPreset: 'dolly-in',
    physics: 'fluid_water',
    atmosphere: 'cyber_rain',
    audio: 'cyber_pulse'
  },
  {
    id: 'mystic-volcanic-dragon',
    title: 'Volcanic Fire Drake',
    category: 'Fantasy',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Majestic red dragon perched atop jagged obsidian cliff, breathing subtle plumes of glowing smoke, molten lava cascading below, heat haze shimmers',
    recommendedModel: 'kling-2.0',
    cameraPreset: 'orbit-left',
    physics: 'wind_turbulence',
    atmosphere: 'golden_embers',
    audio: 'deep_bass'
  },
  {
    id: 'cosmic-astronaut-drift',
    title: 'Nebula Stargazer',
    category: 'Sci-Fi',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Ethereal astronaut floating weightlessly in deep purple nebula, starlight refracting through visor, micro-meteorites drifting slowly past in zero gravity',
    recommendedModel: 'sora',
    cameraPreset: 'dutch-angle',
    physics: 'pika_levitate',
    atmosphere: 'cosmic_stardust',
    audio: 'ethereal_pad'
  },
  {
    id: 'golden-savanna-lion',
    title: 'Golden Savanna King',
    category: 'Nature',
    imageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Majestic male lion turning head towards golden hour sunset, warm wind rustling through thick mane, airborne dust particles illuminated by backlighting',
    recommendedModel: 'veo-3.1',
    cameraPreset: 'pan-right',
    physics: 'wind_turbulence',
    atmosphere: 'golden_embers',
    audio: 'cinematic_drone'
  },
  {
    id: 'noir-detective-fog',
    title: '1940s Noir Alleyway',
    category: 'Cinematic',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Moody trenchcoat silhouette under lone flickering gaslamp, rolling dense fog sweeping through cobblestone street, soft anamorphic street reflections',
    recommendedModel: 'omni',
    cameraPreset: 'vertigo',
    physics: 'cinematic_drift',
    atmosphere: 'smoke_fog',
    audio: 'nature_rain'
  },
  {
    id: 'anime-sorceress-runes',
    title: 'Arcane Runecaster',
    category: 'Anime',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Magical anime sorceress conjuring spinning luminous cyan glyphs, vibrant magical turbulence warping air, hair billowing upwards with arcane energy',
    recommendedModel: 'wan-2.1',
    cameraPreset: 'fpv-dive',
    physics: 'pika_explode',
    atmosphere: 'anamorphic_flare',
    audio: 'cyber_pulse'
  }
];
