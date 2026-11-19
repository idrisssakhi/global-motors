import { loadCarImage } from '@/lib/server/car-image-store';

/**
 * Same-origin proxy for the Supabase "car-images" bucket (see car-image-store).
 * Paths are random UUIDs never overwritten, so responses are immutable and
 * can be cached for a year by browsers and any CDN in front of the site.
 */

const IMMUTABLE = 'public, max-age=31536000, immutable';

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await ctx.params;
  const img = segments?.length ? await loadCarImage(segments.join('/')) : null;

  if (!img) {
    // Short cache so a transient Supabase outage doesn't stick.
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  }

  return new Response(new Uint8Array(img.body), {
    headers: {
      'Content-Type': img.type,
      'Content-Length': String(img.body.byteLength),
      'Cache-Control': IMMUTABLE,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
