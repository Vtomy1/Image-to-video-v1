import { MotionSettings, MotionBrushStroke, AspectRatio } from '../types/video';

interface RenderProgress {
  percent: number;
  stage: string;
  currentFrame: number;
  totalFrames: number;
  fps: number;
}

export interface RenderResult {
  videoUrl: string;
  blob: Blob;
  thumbnailUrl: string;
  duration: number;
  width: number;
  height: number;
}

// Helper: load HTMLImageElement from URL or Base64
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));
    img.src = src;
  });
}

// Compute aspect ratio dimensions
export function getDimensionsForAspect(aspect: AspectRatio, resolution: '720p' | '1080p' | '4k'): { width: number; height: number } {
  const baseH = resolution === '4k' ? 2160 : resolution === '1080p' ? 1080 : 720;
  
  switch (aspect) {
    case '16:9':
      return { width: Math.round((baseH * 16) / 9 / 2) * 2, height: baseH };
    case '9:16':
      return { width: baseH, height: Math.round((baseH * 16) / 9 / 2) * 2 };
    case '1:1':
      return { width: baseH, height: baseH };
    case '21:9':
      return { width: Math.round((baseH * 21) / 9 / 2) * 2, height: baseH };
    default:
      return { width: 1280, height: 720 };
  }
}

// Easing function calculator
function calculateEase(t: number, curve: MotionSettings['speedCurve']): number {
  switch (curve) {
    case 'linear':
      return t;
    case 'ease_in':
      return t * t * t;
    case 'ease_out':
      return 1 - Math.pow(1 - t, 3);
    case 'surge':
      // Slow start, explosive mid-section, smooth deceleration
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    case 'smooth_ease':
    default:
      // Standard smooth cubic ease-in-out
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}

// Web Audio Ambient Synthesizer
function setupAudioTrack(audioMood: MotionSettings['audioMood'], duration: number): { track: MediaStreamTrack | null; cleanup: () => void } {
  if (audioMood === 'none' || typeof window === 'undefined') {
    return { track: null, cleanup: () => {} };
  }

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const dest = ctx.createMediaStreamDestination();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1.2);
    masterGain.gain.setValueAtTime(0.4, ctx.currentTime + Math.max(1, duration - 1.5));
    masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
    masterGain.connect(dest);

    const nodesToStop: { stop: (time: number) => void }[] = [];

    if (audioMood === 'cinematic_drone') {
      // Warm analog chord drone
      const freqs = [55, 110, 164.81, 220]; // A1, A2, E3, A3
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Gentle pitch drift
        osc.frequency.exponentialRampToValueAtTime(freq * 1.03, ctx.currentTime + duration);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320 + idx * 80, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.value = 0.18 / (idx + 1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + duration + 0.5);
        nodesToStop.push(osc);
      });
    } else if (audioMood === 'cyber_pulse') {
      // 120bpm cyber synth rhythm
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65.41, ctx.currentTime); // C2

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.value = 4;

      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      const gain = ctx.createGain();
      gain.gain.value = 0.25;

      osc.connect(filter);
      if (panner) {
        filter.connect(panner);
        panner.connect(gain);
      } else {
        filter.connect(gain);
      }
      gain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + duration + 0.5);
      nodesToStop.push(osc);
    } else if (audioMood === 'deep_bass') {
      // Cinematic sub boom & low rumble
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 3.5);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + duration + 0.5);
      nodesToStop.push(osc);
    } else if (audioMood === 'ethereal_pad') {
      // Shimmering celestial pad
      [261.63, 329.63, 392.00, 523.25].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.value = 0.12;

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + duration + 0.5);
        nodesToStop.push(osc);
      });
    } else if (audioMood === 'nature_rain') {
      // Filtered pink noise for rain/breeze
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.1) * 0.15;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, ctx.currentTime);
      filter.Q.value = 1.2;

      whiteNoise.connect(filter);
      filter.connect(masterGain);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + duration + 0.5);
      nodesToStop.push(whiteNoise);
    }

    const track = dest.stream.getAudioTracks()[0] || null;

    const cleanup = () => {
      try {
        nodesToStop.forEach((n) => {
          try {
            n.stop(0);
          } catch {}
        });
        ctx.close();
      } catch {}
    };

    return { track, cleanup };
  } catch (e) {
    console.warn('Audio synthesis disabled:', e);
    return { track: null, cleanup: () => {} };
  }
}

// Main Video Render Function
export async function renderVideo(
  imageSource: string | HTMLImageElement,
  settings: MotionSettings,
  brushStrokes: MotionBrushStroke[] = [],
  onProgress?: (progress: RenderProgress) => void
): Promise<RenderResult> {
  const img = typeof imageSource === 'string' ? await loadImage(imageSource) : imageSource;
  const { width, height } = getDimensionsForAspect(settings.aspectRatio, settings.resolution);

  const fps = settings.fps || 30;
  const duration = settings.duration || 5;
  const totalFrames = Math.max(30, Math.round(duration * fps));

  // Create render canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true, alpha: false });
  if (!ctx) throw new Error('Could not get 2D canvas rendering context');

  // Pre-render image to base offscreen canvas to avoid repeated scaling
  const offCanvas = document.createElement('canvas');
  offCanvas.width = width;
  offCanvas.height = height;
  const offCtx = offCanvas.getContext('2d')!;

  // Fill canvas preserving aspect ratio with cover scaling
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const targetAspect = width / height;
  let sWidth = img.naturalWidth;
  let sHeight = img.naturalHeight;
  let sx = 0;
  let sy = 0;

  if (imgAspect > targetAspect) {
    sWidth = img.naturalHeight * targetAspect;
    sx = (img.naturalWidth - sWidth) / 2;
  } else {
    sHeight = img.naturalWidth / targetAspect;
    sy = (img.naturalHeight - sHeight) / 2;
  }
  offCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);

  // Setup Particles for Atmosphere
  const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; color: string }[] = [];
  const particleCount = settings.atmosphere !== 'none' ? 90 : 0;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: settings.atmosphere === 'cyber_rain' ? Math.random() * 12 + 10 : (Math.random() - 0.8) * 2,
      opacity: Math.random() * 0.7 + 0.2,
      color:
        settings.atmosphere === 'golden_embers'
          ? `rgba(255, ${Math.floor(Math.random() * 100 + 120)}, 40, `
          : settings.atmosphere === 'cyber_rain'
          ? 'rgba(96, 210, 255, '
          : settings.atmosphere === 'cosmic_stardust'
          ? 'rgba(230, 210, 255, '
          : 'rgba(255, 255, 255, ',
    });
  }

  // Setup Audio Track
  const { track: audioTrack, cleanup: cleanupAudio } = setupAudioTrack(settings.audioMood, duration);

  // Capture canvas stream
  const canvasStream = canvas.captureStream(fps);
  if (audioTrack) {
    canvasStream.addTrack(audioTrack);
  }

  // Determine supported mimeType
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }
    }
  }

  const recordedChunks: Blob[] = [];
  const recorder = new MediaRecorder(canvasStream, {
    mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
    videoBitsPerSecond: 8000000, // High quality 8 Mbps
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  recorder.start();

  // Draw loop
  let firstFrameThumbnail = '';

  for (let frame = 0; frame < totalFrames; frame++) {
    const rawT = frame / (totalFrames - 1);
    const easedT = calculateEase(rawT, settings.speedCurve);

    // Camera Physics calculations
    const intensity = settings.intensity / 5; // normalize ~1.0
    const zoomProgress = settings.zoomDirection === 'in' ? easedT : 1 - easedT;
    const currentZoom = 1 + zoomProgress * (settings.zoom * 0.65) * intensity;

    const currentPanX = (settings.panX * width * 0.12 * easedT) * intensity;
    const currentPanY = (settings.panY * height * 0.12 * easedT) * intensity;
    const currentRoll = (settings.roll * 0.2 * easedT) * intensity;
    const currentOrbit = (settings.orbit * 0.15 * Math.sin(easedT * Math.PI)) * intensity;

    // Handheld camera shake
    let shakeX = 0;
    let shakeY = 0;
    if (settings.cameraShake !== 'none') {
      const shakeAmp = settings.cameraShake === 'action' ? 7 : settings.cameraShake === 'handheld' ? 4 : 1.5;
      shakeX = (Math.sin(frame * 0.5) + Math.cos(frame * 0.83)) * shakeAmp;
      shakeY = (Math.cos(frame * 0.45) + Math.sin(frame * 0.72)) * shakeAmp;
    }

    // Clear frame
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply Camera Transform: Center -> Orbit/Roll -> Zoom/Pan -> Restore Center
    ctx.translate(width / 2, height / 2);
    ctx.rotate(currentRoll);
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(-width / 2 + currentPanX + shakeX + currentOrbit * 30, -height / 2 + currentPanY + shakeY);

    // 1. Draw Base Scene with Parallax / Depth Simulation
    ctx.drawImage(offCanvas, 0, 0, width, height);

    // 2. Physics Effects Simulation
    if (settings.physicsEffect !== 'none') {
      const timeSec = frame / fps;

      if (settings.physicsEffect === 'fluid_water') {
        // Horizontal water wave ripple
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.globalCompositeOperation = 'overlay';
        const waveOffset = Math.sin(timeSec * 3 + frame * 0.1) * 15;
        ctx.drawImage(offCanvas, waveOffset, 0, width, height);
        ctx.restore();
      } else if (settings.physicsEffect === 'wind_turbulence') {
        // Wind wave across vertical bands
        ctx.save();
        ctx.globalAlpha = 0.25;
        const windDrift = Math.sin(timeSec * 4) * 12;
        ctx.drawImage(offCanvas, windDrift, -windDrift * 0.3, width, height);
        ctx.restore();
      } else if (settings.physicsEffect === 'pika_melt') {
        // Viscous downward dripping effect
        ctx.save();
        ctx.globalAlpha = Math.min(0.65, rawT * 0.85);
        const drip = rawT * rawT * 35;
        ctx.filter = `blur(${rawT * 4}px)`;
        ctx.drawImage(offCanvas, 0, drip, width, height);
        ctx.restore();
      } else if (settings.physicsEffect === 'pika_explode') {
        // Outward radial shatter dispersal
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - rawT * 0.7);
        const expand = 1 + rawT * 0.45;
        ctx.translate(width / 2, height / 2);
        ctx.scale(expand, expand);
        ctx.translate(-width / 2, -height / 2);
        ctx.drawImage(offCanvas, 0, 0, width, height);
        ctx.restore();
      } else if (settings.physicsEffect === 'pika_levitate') {
        // Anti-gravity upward float
        const lev = Math.sin(timeSec * 2.5) * 18 - rawT * 25;
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.drawImage(offCanvas, 0, lev, width, height);
        ctx.restore();
      } else if (settings.physicsEffect === 'heartbeat_pulse') {
        // Rhythmic breathing pulse
        const pulse = Math.sin(timeSec * 5) * 0.04;
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.translate(width / 2, height / 2);
        ctx.scale(1 + pulse, 1 + pulse);
        ctx.translate(-width / 2, -height / 2);
        ctx.drawImage(offCanvas, 0, 0, width, height);
        ctx.restore();
      } else if (settings.physicsEffect === 'cyber_glitch') {
        // Periodic digital chromatic glitch
        if (frame % 16 === 0 || frame % 17 === 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = 'rgba(255, 0, 80, 0.2)';
          ctx.fillRect(0, Math.random() * height, width, 25);
          ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
          ctx.fillRect(0, Math.random() * height, width, 18);
          ctx.restore();
        }
      }
    }

    // 3. Motion Brush deformation vectors
    if (brushStrokes.length > 0) {
      brushStrokes.forEach((stroke) => {
        const vel = (stroke.velocity || 1) * easedT * 22;
        let dx = 0;
        let dy = 0;
        if (stroke.direction === 'left') dx = -vel;
        else if (stroke.direction === 'right') dx = vel;
        else if (stroke.direction === 'up') dy = -vel;
        else if (stroke.direction === 'down') dy = vel;
        else if (stroke.direction === 'outward') {
          dx = Math.sin(frame * 0.1) * vel;
          dy = Math.cos(frame * 0.1) * vel;
        }

        ctx.save();
        ctx.beginPath();
        stroke.points.forEach((pt, idx) => {
          const px = pt.x * width;
          const py = pt.y * height;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.lineWidth = stroke.radius * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.clip();

        // Draw displaced region
        ctx.drawImage(offCanvas, dx, dy, width, height);
        ctx.restore();
      });
    }

    // 4. Atmospheric Particles
    if (settings.atmosphere !== 'none') {
      ctx.save();
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        if (settings.atmosphere === 'cyber_rain') {
          // Rain streaks
          ctx.strokeStyle = p.color + (p.opacity * 0.7) + ')';
          ctx.lineWidth = 1.4;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 3, p.y + 14);
          ctx.stroke();
        } else if (settings.atmosphere === 'anamorphic_flare') {
          // Horizontal lens streak
          const gradient = ctx.createLinearGradient(p.x - 40, p.y, p.x + 40, p.y);
          gradient.addColorStop(0, 'rgba(0, 220, 255, 0)');
          gradient.addColorStop(0.5, 'rgba(0, 220, 255, 0.45)');
          gradient.addColorStop(1, 'rgba(0, 220, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(p.x - 40, p.y - 1, 80, 2.5);
        } else if (settings.atmosphere === 'smoke_fog') {
          // Soft rolling mist circles
          const fogGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 18);
          fogGrad.addColorStop(0, 'rgba(230, 240, 255, 0.12)');
          fogGrad.addColorStop(1, 'rgba(230, 240, 255, 0)');
          ctx.fillStyle = fogGrad;
          ctx.arc(p.x, p.y, p.size * 18, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Circular particle (embers, stardust)
          ctx.fillStyle = p.color + p.opacity + ')';
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();
    }

    // 5. Cinematic Vignette & Lighting Shift
    ctx.restore(); // Return to screen space
    ctx.save();
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.38,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.48)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // Subtle 35mm film grain simulation
    const grainAlpha = 0.035;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${grainAlpha})` : `rgba(0,0,0,${grainAlpha})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Capture thumbnail from middle frame
    if (frame === Math.floor(totalFrames / 2) || !firstFrameThumbnail) {
      firstFrameThumbnail = canvas.toDataURL('image/jpeg', 0.85);
    }

    // Report Progress
    if (onProgress) {
      const pct = Math.round(((frame + 1) / totalFrames) * 100);
      onProgress({
        percent: pct,
        stage: pct < 20 ? 'Synthesizing 3D Motion Mesh' : pct < 70 ? 'Rendering Cinematic Vectors' : 'Encoding High-Res Video',
        currentFrame: frame + 1,
        totalFrames,
        fps,
      });
    }

    // Yield execution briefly to keep UI ultra responsive
    await new Promise((resolve) => setTimeout(resolve, 8));
  }

  // Finalize Video Recording
  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      cleanupAudio();
      try {
        const finalBlob = new Blob(recordedChunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(finalBlob);
        resolve({
          videoUrl,
          blob: finalBlob,
          thumbnailUrl: firstFrameThumbnail,
          duration,
          width,
          height,
        });
      } catch (err) {
        reject(err);
      }
    };

    recorder.stop();
  });
}
