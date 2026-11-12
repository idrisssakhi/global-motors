import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site';
import { pageMeta } from '@/lib/seo';
import { POSTS } from '@/content/blog';
import { breadcrumbSchema } from '@/lib/structured-data';
import { PageHero } from '@/components/PageHero';
import { PostCard } from '@/components/blog/PostCard';
import { JsonLd } from '@/components/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return pageMeta(locale, '/blog', `${t('metaTitle')} — ${SITE.name}`, t('metaDescription'));
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE.name, url: SITE.url },
          { name: t('title'), url: `${SITE.url}/blog` },
        ])}
      />
      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      <div className="container-x grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale as Locale} />
        ))}
      </div>
    </>
  );
}
