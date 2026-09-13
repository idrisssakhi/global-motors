/** Build a public URL for a "car-images" storage object path. Client-safe. */
export function carImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return `${base}/storage/v1/object/public/car-images/${path}`;
}
