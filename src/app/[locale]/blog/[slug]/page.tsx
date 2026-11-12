import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, MessageCircle } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { SITE, whatsappLink } from '@/lib/site';
import { pageMeta } from '@/lib/seo';
import { formatLongDate } from '@/lib/format';
import { POSTS, getPostContent, getPostMeta, readingMinutes } from '@/content/blog';
import { breadcrumbSchema } from '@/lib/structured-data';
import { PostBody } from '@/components/blog/PostBody';
import { PostCard } from '@/components/blog/PostCard';
import { JsonLd } from '@/components/JsonLd';

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => POSTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const found = getPostContent(locale, slug);
  const meta = getPostMeta(slug);
  if (!found || !meta) return { title: SITE.name };
  const base = pageMeta(locale, `/blog/${slug}`, `${found.content.title} — ${SITE.name}`, found.content.description);
  return {
    ...base,
    openGraph: { ...base.openGraph, type: 'article', publishedTime: meta.published, modifiedTime: meta.updated },
    // An untranslated (French fallback) page should not compete with the original.
    robots: found.translated ? undefined : { index: false, follow: true },
  };
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const found = getPostContent(locale, slug);
  const meta = getPostMeta(slug);
  if (!found || !meta) notFound();
  const { content } = found;
  const loc = locale as Locale;
  const t = await getTranslations('blog');
  const url = `${SITE.url}${locale === 'fr' ? '' : `/${locale}`}/blog/${slug}`;
  const headings = content.blocks.filter((b) => b.type === 'h2');
  const related = POSTS.filter((p) => p.slug !== slug).slice(0, 2);
  const wa = whatsappLink(content.title);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: content.title,
          description: content.description,
          inLanguage: found.translated ? locale : 'fr',
          datePublished: meta.published,
          dateModified: meta.updated,
          mainEntityOfPage: url,
          image: `${SITE.url}/opengraph-image`,
          author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: `${SITE.url}/apple-icon` } },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE.name, url: SITE.url },
          { name: t('title'), url: `${SITE.url}/blog` },
          { name: content.title, url },
        ])}
      />

      <article className="container-x pb-24 pt-28 sm:pb-20 sm:pt-32">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t('back')}
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_17rem]">
          <div className="min-w-0 max-w-3xl" lang={found.translated ? undefined : 'fr'} dir={found.translated ? undefined : 'ltr'}>
            <p className="text-sm text-muted">
              {t('updated', { date: formatLongDate(meta.updated, loc) })} · {t('minutes', { count: readingMinutes(content) })}
            </p>
            <h1 className="font-display mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">{content.title}</h1>
            <p className="mt-5 text-lg text-muted">{content.description}</p>
            <div className="mt-10">
              <PostBody blocks={content.blocks} />
            </div>
            <p className="mt-10 border-t border-white/[0.07] pt-6 text-xs leading-relaxed text-muted">{t('disclaimer')}</p>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {headings.length > 1 && (
              <nav aria-label={t('toc')} className="rounded-2xl border border-white/[0.07] bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('toc')}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-ink/80 hover:text-accent">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="glass rounded-2xl p-5">
              <p className="font-display text-lg font-semibold text-white">{t('ctaTitle')}</p>
              <p className="mt-1 text-sm text-muted">{t('ctaText')}</p>
              {wa ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 w-full text-sm">
                  <MessageCircle className="h-4 w-4" aria-hidden /> {t('ctaButton')}
                </a>
              ) : (
                <Link href="/contact" className="btn-primary mt-4 w-full text-sm">
                  {t('ctaButton')}
                </Link>
              )}
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="container-x pb-24">
          <h2 className="font-display text-2xl font-semibold text-white">{t('related')}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} locale={loc} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
