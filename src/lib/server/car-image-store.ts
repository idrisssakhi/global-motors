import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Disk-backed copy of the Supabase "car-images" bucket.
 *
 * Every original is downloaded from Supabase at most ONCE per server disk and
 * then served from IMAGE_CACHE_DIR. Supabase Free caps egress, so everything
 * that needs a car photo on the server (the /img proxy, the photo ZIP, the PDF
 * report) goes through here — never fetch the bucket directly.
 * In production set IMAGE_CACHE_DIR to a Railway volume (e.g. /data/car-images)
 * so originals survive deploys.
 */

const CACHE_DIR =
  process.env.IMAGE_CACHE_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), '.next', 'cache', 'car-images');

export const IMAGE_CONTENT_TYPES: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  avif: 'image/avif',
  gif: 'image/gif',
};

const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const MAX_BYTES = 25_000_000;

/** Concurrent misses for the same file share one upstream download. */
const inflight = new Map<string, Promise<Buffer | null>>();

async function fetchUpstream(key: string, file: string): Promise<Buffer | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const res = await fetch(`${base}/storage/v1/object/public/car-images/${key}`, {
    cache: 'no-store', // we keep our own disk copy; don't duplicate it in the data cache
  });
  if (!res.ok) return null;
  const body = Buffer.from(await res.arrayBuffer());
  if (body.byteLength === 0 || body.byteLength > MAX_BYTES) return null;
  // Best effort: a read-only disk must not break image serving.
  try {
    await mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tmp, body);
    await rename(tmp, file); // atomic, so readers never see a partial file
  } catch (err) {
    console.warn('[img] could not write cache file', err);
  }
  return body;
}

export interface StoredImage {
  body: Buffer;
  type: string;
  ext: string;
}

/**
 * Load one stored photo by its bucket path (e.g. "uuid.webp").
 * Returns null for invalid paths, unknown types or a missing upstream file.
 */
export async function loadCarImage(storagePath: string): Promise<StoredImage | null> {
  const segments = storagePath.replace(/^\/+/, '').split('/');
  if (!segments.length || !segments.every((s) => SEGMENT.test(s) && !s.includes('..'))) return null;
  const ext = segments.at(-1)!.split('.').pop()!.toLowerCase();
  const type = IMAGE_CONTENT_TYPES[ext];
  if (!type) return null;

  const key = segments.join('/');
  const file = path.join(/*turbopackIgnore: true*/ CACHE_DIR, ...segments);

  let body: Buffer | null = await readFile(file).catch(() => null);
  if (!body) {
    let pending = inflight.get(key);
    if (!pending) {
      pending = fetchUpstream(key, file)
        .catch(() => null)
        .finally(() => inflight.delete(key));
      inflight.set(key, pending);
    }
    body = await pending;
  }
  return body ? { body, type, ext } : null;
}

/** Bucket path for a value of `car.images` (legacy rows hold full Supabase URLs). */
export function storagePathOf(image: string): string | null {
  if (!image) return null;
  if (!image.startsWith('http')) return image.replace(/^\/+/, '');
  const m = /\/storage\/v1\/object\/public\/car-images\/(.+)$/.exec(image);
  return m ? decodeURIComponent(m[1]) : null;
}

/** Load every photo of a car, in display order, skipping missing ones. */
export async function loadCarImages(images: string[]): Promise<StoredImage[]> {
  const out: StoredImage[] = [];
  // Small batches: a cold cache must not open dozens of upstream requests at once.
  for (let i = 0; i < images.length; i += 4) {
    const batch = await Promise.all(
      images.slice(i, i + 4).map((img) => {
        const p = storagePathOf(img);
        return p ? loadCarImage(p) : null;
      })
    );
    for (const b of batch) if (b) out.push(b);
  }
  return out;
}
