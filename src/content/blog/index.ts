import type { PostContent, PostMeta } from './types';
import { POSTS_FR } from './posts-fr';
import { POSTS_AR } from './posts-ar';
import { POSTS_EN } from './posts-en';

export type { PostBlock, PostContent, PostMeta } from './types';

/** Newest first. `updated` = last time the facts were checked. */
export const POSTS: PostMeta[] = [
  { slug: 'importer-voiture-algerie-2026', published: '2026-11-12', updated: '2026-11-12', market: 'dz' },
  { slug: 'acheter-voiture-france-export-eviter-arnaques', published: '2026-11-12', updated: '2026-11-12', market: 'all' },
  { slug: 'importer-voiture-moins-3-ans-algerie', published: '2026-11-12', updated: '2026-11-12', market: 'dz' },
  { slug: 'ports-alger-oran-restriction-ete', published: '2026-11-12', updated: '2026-11-12', market: 'dz' },
  { slug: 'export-voiture-tunisie-maroc', published: '2026-11-12', updated: '2026-11-12', market: 'tn-ma' },
];

const BY_LOCALE: Record<string, Record<string, PostContent>> = { fr: POSTS_FR, ar: POSTS_AR, en: POSTS_EN };

/** Post content in `locale`, falling back to French. */
export function getPostContent(locale: string, slug: string): { content: PostContent; translated: boolean } | null {
  const own = BY_LOCALE[locale]?.[slug];
  if (own) return { content: own, translated: true };
  const fr = POSTS_FR[slug];
  return fr ? { content: fr, translated: locale === 'fr' } : null;
}

export function getPostMeta(slug: string): PostMeta | null {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

/** Rough reading time (200 words per minute). */
export function readingMinutes(content: PostContent): number {
  const text = content.blocks
    .map((b) => ('text' in b ? b.text : b.items.join(' ')))
    .join(' ');
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}
