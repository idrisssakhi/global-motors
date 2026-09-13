/** hreflang + canonical for a public path ('' for the home page). */
export function alternates(locale: string, path: string) {
  return {
    canonical: locale === 'fr' ? path || '/' : `/${locale}${path}`,
    languages: { fr: path || '/', ar: `/ar${path}` },
  };
}

/** Turn a YouTube link into a privacy-friendly embed URL; other URLs are returned as-is. */
export function videoEmbed(url: string): { kind: 'youtube' | 'file'; src: string } {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (m) return { kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${m[1]}` };
  return { kind: 'file', src: url };
}
