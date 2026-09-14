import type { createClient } from '@/lib/supabase/client';

type BrowserSupabase = ReturnType<typeof createClient>;

// Phone photos are often 4–8 MB; the site never displays them wider than
// 1920px. Resizing before upload cuts Supabase storage + egress ~10–20×.
const MAX_IMAGE_EDGE = 1920;
const QUALITY = 0.82;

/** Encode a canvas as WebP, falling back to JPEG. Browser only. */
export async function encodeCanvas(canvas: HTMLCanvasElement): Promise<Blob | null> {
  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
  const webp = await encode('image/webp');
  // Browsers without WebP encoding silently return PNG — use JPEG instead.
  return webp?.type === 'image/webp' ? webp : encode('image/jpeg');
}

export function extensionFor(blob: Blob): string {
  if (blob.type === 'image/webp') return 'webp';
  if (blob.type === 'image/png') return 'png';
  return 'jpg';
}

/** Resize + re-encode a photo in the browser. Falls back to the original file. */
export async function compressImage(file: File): Promise<{ blob: Blob; ext: string }> {
  const original = { blob: file as Blob, ext: file.name.split('.').pop() ?? 'jpg' };
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await encodeCanvas(canvas);
    if (!blob || blob.size >= file.size) return original;
    return { blob, ext: extensionFor(blob) };
  } catch {
    // e.g. HEIC in a browser that can't decode it — upload as-is.
    return original;
  }
}

/** Upload one photo to the "car-images" bucket and return its storage path. */
export async function uploadCarImage(
  supabase: BrowserSupabase,
  blob: Blob,
  ext: string
): Promise<string> {
  const path = `${crypto.randomUUID()}.${ext}`;
  // Paths are unique and never overwritten → cache for a year.
  const { error } = await supabase.storage.from('car-images').upload(path, blob, {
    cacheControl: '31536000',
    contentType: blob.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return path;
}
