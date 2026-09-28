import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';

import { getLegalDoc, LEGAL_PATHS, type LegalDocKey } from '@/content/legal';
import { LegalDocument } from '@/components/LegalDocument';
import { SITE } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

type Params = { params: Promise<{ locale: string }> };

/** generateMetadata + page component for a document of src/content/legal.ts. */
export function legalPage(key: LegalDocKey, extra?: ReactNode) {
  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { locale } = await params;
    const doc = getLegalDoc(locale, key);
    return pageMeta(locale, LEGAL_PATHS[key], `${doc.title} — ${SITE.name}`, doc.metaDescription);
  }

  async function Page({ params }: Params) {
    const { locale } = await params;
    setRequestLocale(locale);
    const [t, format] = await Promise.all([getTranslations('legalDocs'), getFormatter()]);
    const date = format.dateTime(new Date(SITE.policiesUpdatedAt), { dateStyle: 'long' });
    return (
      <LegalDocument doc={getLegalDoc(locale, key)} updatedLabel={t('updated', { date })} tocLabel={t('toc')}>
        {extra}
      </LegalDocument>
    );
  }

  return { generateMetadata, Page };
}
