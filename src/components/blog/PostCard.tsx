import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { getPostContent, readingMinutes, type PostMeta } from '@/content/blog';
import { formatLongDate } from '@/lib/format';
import type { Locale } from '@/i18n/routing';

const MARKET_FLAG: Record<PostMeta['market'], string> = { dz: '🇩🇿', 'tn-ma': '🇹🇳 🇲🇦', 'fr-eu': '🇫🇷 🇪🇺', all: '🇫🇷 → 🌍' };

export async function PostCard({ post, locale }: { post: PostMeta; locale: Locale }) {
  const t = await getTranslations('blog');
  const found = getPostContent(locale, post.slug);
  if (!found) return null;
  const { content } = found;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent/30"
    >
      <p className="flex items-center gap-2 text-xs text-muted">
        <span aria-hidden>{MARKET_FLAG[post.market]}</span>
        <span>{t('updated', { date: formatLongDate(post.updated, locale) })}</span>
        <span aria-hidden>·</span>
        <span>{t('minutes', { count: readingMinutes(content) })}</span>
      </p>
      <h2 className="font-display mt-3 text-xl font-semibold leading-snug text-white">{content.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{content.description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        {t('readMore')}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
