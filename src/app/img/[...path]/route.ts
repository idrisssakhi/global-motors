import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Same-origin proxy for the Supabase "car-images" bucket.
 *
 * Every original is downloaded from Supabase at most ONCE per server disk and
 * then served from IMAGE_CACHE_DIR. Supabase Free caps egress, and without this
 * the Next image optimizer re-downloads each original for every width/quality
 * variant after each deploy (its cache lives in .next/cache, wiped by Railway).
 * In production set IMAGE_CACHE_DIR to a Railway volume (e.g. /data/car-images)
 * so originals survive deploys; resized variants are then rebuilt locally.
 *
 * Paths are random UUIDs never overwritten, so responses are immutable and
 * can be cached for a year by browsers and any CDN in front of the site.
 */

const CACHE_DIR =
  process.env.IMAGE_CACHE_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), '.next', 'cache', 'car-images');

const CONTENT_TYPES: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  avif: 'image/avif',
  gif: 'image/gif',
};

const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const MAX_BYTES = 25_000_000;
const IMMUTABLE = 'public, max-age=31536000, immutable';

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

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await ctx.params;
  if (!segments?.length || !segments.every((s) => SEGMENT.test(s) && !s.includes('..'))) {
    return new Response('Not found', { status: 404 });
  }
  const ext = segments.at(-1)!.split('.').pop()!.toLowerCase();
  const type = CONTENT_TYPES[ext];
  if (!type) return new Response('Not found', { status: 404 });

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

  if (!body) {
    // Short cache so a transient Supabase outage doesn't stick.
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  }

  return new Response(new Uint8Array(body), {
    headers: {
      'Content-Type': type,
      'Content-Length': String(body.byteLength),
      'Cache-Control': IMMUTABLE,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
