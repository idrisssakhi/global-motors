/// <reference lib="webworker" />
/**
 * Background-removal worker for the admin "showroom" photo staging.
 *
 * Runs ISNet "general use" (DIS, weight-only int8 export, MIT) fully in the
 * browser through transformers.js: no paid API, the photo never leaves the
 * machine. The 44 MB model is downloaded from the Hugging Face hub once, then
 * served from the browser's Cache Storage. ISNet is convolutional, so unlike
 * Swin-based models (BiRefNet, BEN2) it runs on Apple GPUs and on plain WASM.
 */
import { env, pipeline, RawImage } from '@huggingface/transformers';

const MODEL_ID = 'xrds/isnet-general-onnx-int8';

type Segmenter = (image: RawImage) => Promise<RawImage>;

export type Backend = { device: 'webgpu' | 'wasm'; dtype: 'q8' | 'fp32' };

export type WorkerRequest = { id: number; image: Blob; backend: Backend };
export type WorkerResponse =
  | { type: 'progress'; loaded: number; total: number }
  | { type: 'ready'; device: string }
  | { type: 'result'; id: number; width: number; height: number; alpha: Uint8ClampedArray }
  /** `backendFailed`: the model could not load or run here — retry elsewhere. */
  | { type: 'error'; id: number; message: string; backendFailed: boolean };

const post = (msg: WorkerResponse, transfer: Transferable[] = []) =>
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(msg, transfer);

env.allowLocalModels = false;

// A worker is bound to the backend of its first request: ONNX Runtime keeps
// global state per backend, so falling back means a fresh worker (stage.ts).
let segmenterPromise: Promise<Segmenter> | null = null;

// Aggregate download progress over the model's files.
const files = new Map<string, { loaded: number; total: number }>();
const progress_callback = (p: { status: string; file?: string; loaded?: number; total?: number }) => {
  if (p.status !== 'progress' || !p.file) return;
  files.set(p.file, { loaded: p.loaded ?? 0, total: p.total ?? 0 });
  let loaded = 0;
  let total = 0;
  for (const f of files.values()) {
    loaded += f.loaded;
    total += f.total;
  }
  post({ type: 'progress', loaded, total });
};

function loadSegmenter({ device, dtype }: Backend): Promise<Segmenter> {
  segmenterPromise ??= (async () => {
    const segmenter = await pipeline('background-removal', MODEL_ID, {
      device,
      dtype,
      progress_callback,
    });
    post({ type: 'ready', device });
    return segmenter as unknown as Segmenter;
  })();
  return segmenterPromise;
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, image, backend } = e.data;
  let input: RawImage;
  try {
    input = await RawImage.fromBlob(image);
  } catch (err) {
    post({ type: 'error', id, message: `Image illisible : ${String(err)}`, backendFailed: false });
    return;
  }
  try {
    const segmenter = await loadSegmenter(backend);
    const output = await segmenter(input);
    const rgba = output.channels === 4 ? output : output.rgba();
    // Only the alpha channel is needed: the colour comes from the original.
    const n = rgba.width * rgba.height;
    const alpha = new Uint8ClampedArray(n);
    for (let i = 0; i < n; i++) alpha[i] = rgba.data[i * 4 + 3];
    post(
      { type: 'result', id, width: rgba.width, height: rgba.height, alpha },
      [alpha.buffer]
    );
  } catch (err) {
    post({
      type: 'error',
      id,
      message: err instanceof Error ? err.message : String(err),
      backendFailed: true,
    });
  }
};
