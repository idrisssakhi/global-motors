/**
 * "Showroom" staging for car photos, browser only.
 *
 * 1. A web worker cuts the car out of the photo (see remove-background.worker.ts).
 * 2. The cut-out is composited onto a procedurally drawn SKH showroom: dark
 *    slatted wall, backlit logo, red LED line, glossy floor with the car's
 *    reflection and a soft contact shadow. No external image asset is needed.
 */
import { BRAND_RED, LOGO } from '@/components/logoPaths';
import { encodeCanvas } from '@/lib/car-images';
import type { Backend, WorkerRequest, WorkerResponse } from './remove-background.worker';

/** Output size — 16:10 like the public gallery; 4:3 cards crop the sides. */
const OUT_W = 1920;
const OUT_H = 1200;

export type StageProgress =
  | { phase: 'download'; ratio: number }
  | { phase: 'process' }
  | { phase: 'compose' };

type Mask = { width: number; height: number; alpha: Uint8ClampedArray };

class BackendError extends Error {}

type Pending = { resolve: (r: Mask) => void; reject: (e: Error) => void };

// WebGPU is fastest; WASM (CPU) is the fallback when a GPU rejects the model.
const BACKENDS: Backend[] = [
  { device: 'webgpu', dtype: 'q8' },
  { device: 'wasm', dtype: 'q8' },
];
const BACKEND_PREF_KEY = 'skh-admin-showroom-backend';

let backendIndex = -1;
let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, Pending>();
let progressListener: ((p: StageProgress) => void) | null = null;

async function initialBackend(): Promise<number> {
  try {
    const saved = Number(localStorage.getItem(BACKEND_PREF_KEY));
    if (saved > 0 && saved < BACKENDS.length) return saved;
  } catch {
    /* storage unavailable */
  }
  try {
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
    if (gpu && (await gpu.requestAdapter())) return 0;
  } catch {
    /* no WebGPU */
  }
  return 1;
}

function rememberBackend() {
  try {
    localStorage.setItem(BACKEND_PREF_KEY, String(backendIndex));
  } catch {
    /* storage unavailable */
  }
}

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./remove-background.worker.ts', import.meta.url), {
    type: 'module',
  });
  worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
    const msg = e.data;
    if (msg.type === 'progress') {
      if (msg.total > 0) {
        progressListener?.({ phase: 'download', ratio: msg.loaded / msg.total });
      }
      return;
    }
    if (msg.type === 'ready') {
      progressListener?.({ phase: 'process' });
      return;
    }
    const job = pending.get(msg.id);
    if (!job) return;
    pending.delete(msg.id);
    if (msg.type === 'result') job.resolve(msg);
    else job.reject(msg.backendFailed ? new BackendError(msg.message) : new Error(msg.message));
  };
  worker.onerror = (e) => {
    for (const job of pending.values()) job.reject(new BackendError(e.message || 'Worker error'));
    pending.clear();
    resetWorker();
  };
  return worker;
}

function resetWorker() {
  worker?.terminate();
  worker = null;
}

function runWorker(image: Blob): Promise<Mask> {
  return new Promise<Mask>((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, image, backend: BACKENDS[backendIndex] } satisfies WorkerRequest);
  });
}

/** Segment the photo, moving down the backend list until one works. */
async function removeBackground(image: Blob): Promise<Mask> {
  if (backendIndex < 0) backendIndex = await initialBackend();
  for (;;) {
    try {
      const mask = await runWorker(image);
      rememberBackend();
      return mask;
    } catch (err) {
      if (!(err instanceof BackendError) || backendIndex >= BACKENDS.length - 1) throw err;
      console.warn(`[showroom] ${BACKENDS[backendIndex].device}/${BACKENDS[backendIndex].dtype} failed, falling back:`, err.message);
      resetWorker();
      backendIndex++;
    }
  }
}

/** Cut the car out and place it in the SKH showroom. Returns an encoded image. */
export async function stageCarPhoto(
  photo: Blob,
  onProgress?: (p: StageProgress) => void
): Promise<Blob> {
  progressListener = onProgress ?? null;
  onProgress?.({ phase: 'process' });
  try {
    const bitmap = await createImageBitmap(photo);
    const { width, height, alpha } = await removeBackground(photo);
    onProgress?.({ phase: 'compose' });

    const cutout = buildCutout(bitmap, width, height, alpha);
    bitmap.close();
    const canvas = composeShowroom(cutout);
    const blob = await encodeCanvas(canvas);
    if (!blob) throw new Error("Impossible d'encoder l'image");
    return blob;
  } finally {
    progressListener = null;
  }
}

type Cutout = { canvas: HTMLCanvasElement; w: number; h: number };

/** Apply the mask to the photo and crop to the car's bounding box. */
function buildCutout(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  alpha: Uint8ClampedArray
): Cutout {
  const full = document.createElement('canvas');
  full.width = width;
  full.height = height;
  const ctx = full.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  const img = ctx.getImageData(0, 0, width, height);

  // Bounding box of solid pixels; rows/cols with a few stray pixels are noise.
  const rowCount = new Uint32Array(height);
  const colCount = new Uint32Array(width);
  let solid = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      let a = alpha[i];
      if (a < 24) a = 0; // drop the faint haze around the car
      img.data[i * 4 + 3] = a;
      if (a > 128) {
        rowCount[y]++;
        colCount[x]++;
        solid++;
      }
    }
  }
  if (solid < width * height * 0.03) {
    throw new Error('Aucune voiture détectée sur la photo');
  }
  ctx.putImageData(img, 0, 0);

  const minRun = 3;
  let top = 0;
  while (top < height - 1 && rowCount[top] < minRun) top++;
  let bottom = height - 1;
  while (bottom > top && rowCount[bottom] < minRun) bottom--;
  let left = 0;
  while (left < width - 1 && colCount[left] < minRun) left++;
  let right = width - 1;
  while (right > left && colCount[right] < minRun) right--;

  const w = right - left + 1;
  const h = bottom - top + 1;
  const crop = document.createElement('canvas');
  crop.width = w;
  crop.height = h;
  crop.getContext('2d')!.drawImage(full, left, top, w, h, 0, 0, w, h);
  return { canvas: crop, w, h };
}

function composeShowroom(car: Cutout): HTMLCanvasElement {
  const W = OUT_W;
  const H = OUT_H;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  // High wall/floor line: on 3/4 views the far wheels sit well above the
  // bumper, and they must still land on the floor, not on the wall.
  const horizon = Math.round(H * 0.46);

  // --- Back wall -----------------------------------------------------------
  const wall = ctx.createLinearGradient(0, 0, 0, horizon);
  wall.addColorStop(0, '#0a0b0e');
  wall.addColorStop(1, '#1d1f25');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, horizon);

  // Vertical acoustic slats.
  for (let x = 0; x < W; x += 40) {
    ctx.fillStyle = 'rgba(255,255,255,0.028)';
    ctx.fillRect(x, 0, 2, horizon);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x + 2, 0, 1, horizon);
  }

  // Ceiling downlights washing the wall.
  for (let i = 0; i < 5; i++) {
    const x = W * (0.1 + i * 0.2);
    const g = ctx.createRadialGradient(x, -20, 0, x, -20, H * 0.42);
    g.addColorStop(0, 'rgba(255,248,235,0.16)');
    g.addColorStop(1, 'rgba(255,248,235,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, horizon);
  }

  // Soft key light behind the car.
  const halo = ctx.createRadialGradient(W / 2, horizon * 0.75, 0, W / 2, horizon * 0.75, W * 0.48);
  halo.addColorStop(0, 'rgba(255,255,255,0.10)');
  halo.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, horizon);

  // --- Backlit logo --------------------------------------------------------
  const logo = LOGO.horizontal;
  const [, , vbW, vbH] = logo.viewBox.split(' ').map(Number);
  const logoW = W * 0.25;
  const logoScale = logoW / vbW;
  const logoH = vbH * logoScale;
  const logoX = (W - logoW) / 2;
  const logoY = H * 0.06;
  ctx.save();
  ctx.translate(logoX, logoY);
  ctx.scale(logoScale, logoScale);
  ctx.shadowColor = 'rgba(255,255,255,0.35)';
  ctx.shadowBlur = 40; // shadows ignore the transform: device pixels
  ctx.fillStyle = 'rgba(245,245,245,0.94)';
  ctx.fill(new Path2D(logo.dark), 'evenodd');
  ctx.shadowColor = 'rgba(212,16,27,0.55)';
  ctx.fillStyle = BRAND_RED;
  ctx.fill(new Path2D(logo.red), 'evenodd');
  ctx.restore();

  // --- Floor ---------------------------------------------------------------
  const floor = ctx.createLinearGradient(0, horizon, 0, H);
  floor.addColorStop(0, '#191a1f');
  floor.addColorStop(1, '#060608');
  ctx.fillStyle = floor;
  ctx.fillRect(0, horizon, W, H - horizon);

  // Light pool on the floor under the car.
  ctx.save();
  ctx.translate(W / 2, H * 0.9);
  ctx.scale(1, 0.18);
  const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.5);
  pool.addColorStop(0, 'rgba(255,255,255,0.10)');
  pool.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = pool;
  ctx.fillRect(-W, -W, W * 2, W * 2);
  ctx.restore();

  // Red LED line at the wall/floor junction, with its glossy reflection.
  ctx.save();
  ctx.shadowColor = BRAND_RED;
  ctx.shadowBlur = 24;
  ctx.fillStyle = BRAND_RED;
  ctx.fillRect(0, horizon - 2, W, 3);
  ctx.restore();
  const ledGlow = ctx.createLinearGradient(0, horizon, 0, horizon + H * 0.08);
  ledGlow.addColorStop(0, 'rgba(212,16,27,0.22)');
  ledGlow.addColorStop(1, 'rgba(212,16,27,0)');
  ctx.fillStyle = ledGlow;
  ctx.fillRect(0, horizon, W, H * 0.08);

  // --- Car placement -------------------------------------------------------
  const groundY = H * 0.9;
  const topLimit = logoY + logoH + H * 0.04;
  const scale = Math.min((W * 0.82) / car.w, (groundY - topLimit) / car.h);
  const cw = car.w * scale;
  const ch = car.h * scale;
  const cx = (W - cw) / 2;
  const cy = groundY - ch;

  // Reflection: mirrored car, faded out towards the viewer.
  const refH = Math.min(ch * 0.45, H - groundY);
  if (refH > 4) {
    const refl = document.createElement('canvas');
    refl.width = Math.ceil(cw);
    refl.height = Math.ceil(refH);
    const rctx = refl.getContext('2d')!;
    rctx.save();
    rctx.translate(0, ch);
    rctx.scale(1, -1);
    rctx.drawImage(car.canvas, 0, 0, cw, ch);
    rctx.restore();
    const fade = rctx.createLinearGradient(0, 0, 0, refH);
    fade.addColorStop(0, 'rgba(0,0,0,0.30)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    rctx.globalCompositeOperation = 'destination-in';
    rctx.fillStyle = fade;
    rctx.fillRect(0, 0, refl.width, refl.height);
    ctx.save();
    ctx.filter = 'blur(2px)';
    ctx.drawImage(refl, cx, groundY);
    ctx.restore();
  }

  // Contact shadow: the car's own silhouette squashed flat, plus a tight core.
  const sil = document.createElement('canvas');
  sil.width = Math.ceil(cw);
  sil.height = Math.ceil(ch);
  const sctx = sil.getContext('2d')!;
  sctx.drawImage(car.canvas, 0, 0, cw, ch);
  sctx.globalCompositeOperation = 'source-in';
  sctx.fillStyle = '#000';
  sctx.fillRect(0, 0, sil.width, sil.height);
  ctx.save();
  ctx.filter = 'blur(14px)';
  ctx.globalAlpha = 0.85;
  const shadowH = Math.max(12, ch * 0.08);
  ctx.drawImage(sil, cx + cw * 0.02, groundY - shadowH * 0.7, cw * 0.96, shadowH);
  ctx.restore();
  ctx.save();
  ctx.filter = 'blur(10px)';
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.beginPath();
  ctx.ellipse(W / 2, groundY - 2, cw * 0.44, Math.max(6, ch * 0.025), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // The car itself.
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(car.canvas, cx, cy, cw, ch);

  // --- Vignette ------------------------------------------------------------
  const vig = ctx.createRadialGradient(W / 2, H * 0.55, H * 0.35, W / 2, H * 0.55, W * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  return canvas;
}
