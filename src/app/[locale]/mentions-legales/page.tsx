import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SITE } from '@/lib/site';
import { alternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legalPage' });
  return {
    title: `${t('metaTitle')} — ${SITE.name}`,
    alternates: alternates(locale, '/mentions-legales'),
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legalPage');

  const publisher = [
    [t('company'), SITE.legal.name],
    [t('legalForm'), SITE.legal.legalForm],
    [t('siren'), SITE.legal.siren],
    [t('siret'), SITE.legal.siret],
    [t('vat'), SITE.legal.vat],
    [t('ape'), `${SITE.legal.ape} — ${SITE.legal.apeLabel}`],
    [t('address'), `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, ${SITE.address.country}`],
    [t('president'), SITE.legal.president],
  ];

  return (
    <div className="container-x max-w-3xl pb-10 pt-36">
      <h1 className="font-display text-4xl font-semibold text-white">{t('title')}</h1>

      <Block title={t('publisher')}>
        <dl className="divide-y divide-white/[0.06]">
          {publisher.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr]">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="text-sm font-medium text-white" dir="auto">{v}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block title={t('hosting')}>
        <p>{t('hostingText')}</p>
      </Block>
      <Block title={t('data')}>
        <p>{t('dataText')}</p>
      </Block>
      <Block title={t('simulator')}>
        <p>{t('simulatorText')}</p>
      </Block>
      <Block title={t('credits')}>
        <ul className="space-y-2">
          {SITE.credits.map((c) => (
            <li key={c.href}>
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                {c.label}
              </a>{' '}
              — {c.license}
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 leading-relaxed text-muted">{children}</div>
    </section>
  );
}
