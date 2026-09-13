import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site';
import { pageMeta } from '@/lib/seo';
import { getCars, getMakes } from '@/lib/cars';
import { toSummary } from '@/lib/car-filters';
import { breadcrumbSchema } from '@/lib/structured-data';
import { CarList } from '@/components/CarList';
import { PageHero } from '@/components/PageHero';
import { JsonLd } from '@/components/JsonLd';

// Static + on-demand revalidation from the admin actions; filtering is client-side.
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cars' });
  return pageMeta(locale, '/voitures', `${t('metaTitle')} — ${SITE.name}`, t('subtitle'));
}

export default async function CarsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('cars');
  const [cars, makes] = await Promise.all([getCars(), getMakes()]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE.name, url: SITE.url },
          { name: t('title'), url: `${SITE.url}/voitures` },
        ])}
      />
      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      <div className="container-x py-12">
        <CarList cars={cars.map(toSummary)} makes={makes} locale={locale as Locale} />
      </div>
    </>
  );
}
