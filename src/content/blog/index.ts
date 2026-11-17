import type { PostContent, PostMeta } from './types';
import { POSTS_FR } from './posts-fr';
import { POSTS_AR } from './posts-ar';
import { POSTS_EN } from './posts-en';
import { POSTS_FRANCE_FR } from './posts-france-fr';
import { POSTS_FRANCE_EN } from './posts-france-en';
import { POSTS_EUROPE_FR } from './posts-europe-fr';
import { POSTS_EUROPE_EN } from './posts-europe-en';

export type { PostBlock, PostContent, PostMeta } from './types';

/** Newest first. `updated` = last time the facts were checked. */
export const POSTS: PostMeta[] = [
  { slug: 'acheter-voiture-france-livraison-europe', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'tva-voiture-occasion-achat-europe', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'acheter-voiture-occasion-professionnel-garanties', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'documents-achat-voiture-occasion-france', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'voiture-occasion-ex-leasing-lld-loa', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'marche-voiture-occasion-premium-europe-2026', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'importer-voiture-europe-en-france-quitus-fiscal', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'plaques-ww-transit-export-voiture', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'verifier-historique-voiture-kilometrage-histovec', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'financer-voiture-occasion-credit-loa', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'essence-hybride-electrique-quelle-occasion-choisir', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'vendre-sa-voiture-a-un-professionnel-reprise', published: '2026-11-17', updated: '2026-11-17', market: 'fr-eu' },
  { slug: 'importer-voiture-algerie-2026', published: '2026-11-12', updated: '2026-11-12', market: 'dz' },
  { slug: 'acheter-voiture-france-export-eviter-arnaques', published: '2026-11-12', updated: '2026-11-12', market: 'all' },
  { slug: 'importer-voiture-moins-3-ans-algerie', published: '2026-11-12', updated: '2026-11-12', market: 'dz' },
  { slug: 'ports-alger-oran-restriction-ete', published: '2026-11-12', updated: '2026-11-12', market: 'dz' },
  { slug: 'export-voiture-tunisie-maroc', published: '2026-11-12', updated: '2026-11-12', market: 'tn-ma' },
];

const ALL_FR: Record<string, PostContent> = { ...POSTS_FR, ...POSTS_FRANCE_FR, ...POSTS_EUROPE_FR };
const ALL_EN: Record<string, PostContent> = { ...POSTS_EN, ...POSTS_FRANCE_EN, ...POSTS_EUROPE_EN };
const BY_LOCALE: Record<string, Record<string, PostContent>> = { fr: ALL_FR, ar: POSTS_AR, en: ALL_EN };

/** Post content in `locale`, falling back to French. */
export function getPostContent(locale: string, slug: string): { content: PostContent; translated: boolean } | null {
  const own = BY_LOCALE[locale]?.[slug];
  if (own) return { content: own, translated: true };
  const fr = ALL_FR[slug];
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
