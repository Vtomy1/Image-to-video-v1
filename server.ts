import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Director Endpoint: Scene & Motion Analysis
app.post('/api/director/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png', prompt = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    if (!apiKey) {
      // Return smart fallback if no API key is available
      return res.json({
        enhancedPrompt: prompt
          ? `${prompt}, cinematic 35mm film grain, 4k ultra-detailed, slow camera push-in, volumetric lighting, photorealistic physics`
          : 'Cinematic slow push-in, 35mm film grain, 4k ultra-detailed, volumetric atmospheric lighting, photorealistic motion physics',
        recommendedCamera: 'Dolly In & Micro Pan',
        cameraSettings: { pan: 0.2, tilt: 0.1, zoom: 0.4, roll: 0, speed: 'smooth_ease' },
        motionIntensity: 6,
        physicsEffect: 'cinematic_drift',
        lightingShift: 'Subtle volumetric ray pulsation',
        recommendedModel: 'omni',
        audioMood: 'cinematic_drone',
        sceneSummary: 'High-contrast focal subject with atmospheric depth layers, ideal for forward dolly parallax.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `You are an expert Hollywood AI Cinematographer and Visual Effects Director.
Analyze this image and the user's intent: "${prompt || 'Make this image come alive with cinematic motion'}".
Determine optimal motion choreography, camera trajectory, physics deformation, atmospheric particles, and model recommendation.
Return a structured JSON with:
- enhancedPrompt: ultra-descriptive camera and motion prompt (40-70 words)
- recommendedCamera: concise camera motion label (e.g. "Dolly In & Pan Right", "FPV Crane Dive", "3D Arc Orbit", "Slow Dutch Tilt")
- cameraSettings: object with pan (-1 to 1), tilt (-1 to 1), zoom (0 to 1), roll (-0.5 to 0.5), speed ("slow" | "smooth_ease" | "dynamic" | "surge")
- motionIntensity: number 1 to 10
- physicsEffect: one of ["cinematic_drift", "fluid_water", "wind_turbulence", "pika_levitate", "ember_glow", "cyber_light", "none"]
- lightingShift: brief description of dynamic light changes
- recommendedModel: one of ["omni", "runway-gen3", "kling-2.0", "luma-dream", "sora", "veo-3.1", "pika-2.0"]
- audioMood: one of ["cinematic_drone", "cyber_pulse", "ethereal_pad", "deep_bass", "nature_breeze"]
- sceneSummary: 1-2 sentence director log notes about depth layers and movement focal points.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedPrompt: { type: Type.STRING },
            recommendedCamera: { type: Type.STRING },
            cameraSettings: {
              type: Type.OBJECT,
              properties: {
                pan: { type: Type.NUMBER },
                tilt: { type: Type.NUMBER },
                zoom: { type: Type.NUMBER },
                roll: { type: Type.NUMBER },
                speed: { type: Type.STRING },
              },
              required: ['pan', 'tilt', 'zoom', 'roll', 'speed'],
            },
            motionIntensity: { type: Type.INTEGER },
            physicsEffect: { type: Type.STRING },
            lightingShift: { type: Type.STRING },
            recommendedModel: { type: Type.STRING },
            audioMood: { type: Type.STRING },
            sceneSummary: { type: Type.STRING },
          },
          required: [
            'enhancedPrompt',
            'recommendedCamera',
            'cameraSettings',
            'motionIntensity',
            'physicsEffect',
            'lightingShift',
            'recommendedModel',
            'audioMood',
            'sceneSummary',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Director analyze error:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze scene with AI director',
      fallback: {
        enhancedPrompt: 'Cinematic slow push-in, 35mm film grain, 4k ultra-detailed, volumetric atmospheric lighting, photorealistic motion physics',
        recommendedCamera: 'Dolly In & Micro Pan',
        cameraSettings: { pan: 0.2, tilt: 0.1, zoom: 0.4, roll: 0, speed: 'smooth_ease' },
        motionIntensity: 6,
        physicsEffect: 'cinematic_drift',
        lightingShift: 'Subtle volumetric ray pulsation',
        recommendedModel: 'omni',
        audioMood: 'cinematic_drone',
        sceneSummary: 'Analysis fallback applied. Balanced forward motion recommended.',
      },
    });
  }
});

// AI Director Endpoint: Prompt Enhancement
app.post('/api/director/enhance-prompt', async (req, res) => {
  try {
    const { prompt, style = 'cinematic', cameraPreset = 'dolly-in' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!apiKey) {
      return res.json({
        enhancedPrompt: `${prompt}, masterwork shot in 8k, Panavision 35mm anamorphic lens, beautiful motion blur, cinematic lighting, ${cameraPreset} motion, photorealistic rendering`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an AI Video Prompt Engineer for state-of-the-art video models (Veo, Sora, Kling, Runway Gen-3).
Enrich this basic prompt: "${prompt}".
Style target: "${style}".
Camera movement target: "${cameraPreset}".
Return JSON with { "enhancedPrompt": "..." } containing a single master-level video generation prompt including lighting, camera angle, motion dynamics, visual fidelity, and physics behavior. Max 60 words.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedPrompt: { type: Type.STRING },
          },
          required: ['enhancedPrompt'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Prompt enhance error:', error);
    res.status(500).json({
      error: error.message || 'Failed to enhance prompt',
      enhancedPrompt: `${req.body.prompt || 'Cinematic shot'}, 8k resolution, smooth camera movement, volumetric light rays, hyper-detailed textures`,
    });
  }
});

// Google Veo 3.1 Video Generation Support
app.post('/api/veo/generate', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png', prompt, aspectRatio = '16:9' } = req.body;
    if (!apiKey) {
      return res.status(400).json({
        error: 'Veo requires a Gemini API key. Use OmniFlow Ultra for instant free unlimited generation!',
      });
    }

    const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, '') : '';

    const payload: any = {
      model: 'veo-3.1-lite-generate-preview',
      prompt: prompt || 'Cinematic camera movement bringing the image to life',
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
      },
    };

    if (cleanBase64) {
      payload.image = {
        imageBytes: cleanBase64,
        mimeType: mimeType,
      };
    }

    const operation = await ai.models.generateVideos(payload);
    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error('Veo generate error:', error);
    res.status(500).json({
      error: error.message || 'Veo generation request failed. You can use our instant unlimited engine instead!',
    });
  }
});

app.post('/api/veo/status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    res.json({ done: updated.done, error: updated.error });
  } catch (error: any) {
    console.error('Veo status error:', error);
    res.status(500).json({ error: error.message || 'Failed to check status' });
  }
});

app.post('/api/veo/download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: 'Video URI not found or video still processing' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).json({ error: 'Failed to fetch video stream from Google' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    videoRes.body!.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
      })
    );
  } catch (error: any) {
    console.error('Veo download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download video' });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`OmniMotion AI Studio Server listening on port ${PORT}`);
  });
}

startServer();
