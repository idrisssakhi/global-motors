/**
 * URL for a "car-images" storage object path. Client-safe.
 *
 * Served same-origin through src/app/img/[...path]/route.ts, which keeps a disk
 * copy of each original so Supabase egress is paid once per image, never per
 * visitor, crawler or optimizer variant. Never link the Supabase URL directly.
 */
export function carImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `/img/${path.replace(/^\/+/, '')}`;
}

/** Absolute variant for JSON-LD / feeds read off-site. */
export function absoluteCarImageUrl(path: string, siteUrl: string): string {
  const url = carImageUrl(path);
  return url.startsWith('/') ? `${siteUrl.replace(/\/$/, '')}${url}` : url;
}
