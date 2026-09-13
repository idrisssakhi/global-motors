import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getCars } from '@/lib/cars';

export const revalidate = 86400;

const STATIC_PATHS: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, freq: 'weekly' },
  { path: '/voitures', priority: 0.9, freq: 'daily' },
  { path: '/simulateur-dedouanement', priority: 0.9, freq: 'monthly' },
  { path: '/a-propos', priority: 0.5, freq: 'yearly' },
  { path: '/contact', priority: 0.6, freq: 'yearly' },
  { path: '/mentions-legales', priority: 0.2, freq: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, '');
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    lastModified: Date = new Date()
  ): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path || '/'}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: { fr: `${base}${path || '/'}`, ar: `${base}/ar${path}`, 'x-default': `${base}${path || '/'}` } },
  });

  const cars = await getCars();
  return [
    ...STATIC_PATHS.map((p) => entry(p.path, p.priority, p.freq)),
    ...cars.map((c) => entry(`/voitures/${c.slug}`, 0.8, 'weekly', new Date(c.updated_at))),
  ];
}
