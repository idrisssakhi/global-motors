import { zipSync, type Zippable } from 'fflate';
import sharp from 'sharp';

import { getCarBySlug } from '@/lib/cars';
import { loadCarImages } from '@/lib/server/car-image-store';

/**
 * GET /api/cars/:slug/photos → ZIP of every photo of the car.
 *
 * Photos are stored as WebP; they are re-encoded as JPEG because WhatsApp
 * (how most customers forward them) treats WebP files as stickers and older
 * phones/PCs can't open them.
 */

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const car = await getCarBySlug(slug).catch(() => null);
  if (!car) return new Response('Not found', { status: 404 });

  const images = await loadCarImages(car.images);
  if (images.length === 0) return new Response('Not found', { status: 404 });

  const pad = String(images.length).length < 2 ? 2 : String(images.length).length;
  const files: Zippable = {};
  await Promise.all(
    images.map(async (img, i) => {
      const n = String(i + 1).padStart(pad, '0');
      let data: Uint8Array = img.body;
      let ext = img.ext === 'jpeg' ? 'jpg' : img.ext;
      if (img.ext !== 'jpg' && img.ext !== 'jpeg') {
        try {
          data = await sharp(img.body).rotate().jpeg({ quality: 90, mozjpeg: true }).toBuffer();
          ext = 'jpg';
        } catch {
          // Undecodable — ship the original.
        }
      }
      // Already-compressed images: store, don't deflate.
      files[`${slug}-${n}.${ext}`] = [data, { level: 0 }];
    })
  );

  const zip = zipSync(files, { level: 0 });
  return new Response(new Uint8Array(zip), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Length': String(zip.byteLength),
      'Content-Disposition': `attachment; filename="skh-global-motors-${slug}-photos.zip"`,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
    },
  });
}
