import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site';
import { pageMeta } from '@/lib/seo';
import { getCustomsSettings } from '@/lib/cars';
import { formatNumber, formatPercent } from '@/lib/format';
import { breadcrumbSchema, faqSchema } from '@/lib/structured-data';
import { PageHero } from '@/components/PageHero';
import { CustomsSimulator } from '@/components/CustomsSimulator';
import { SectionHeading } from '@/components/SectionHeading';
import { FadeIn } from '@/components/FadeIn';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sim' });
  return pageMeta(locale, '/simulateur-dedouanement', `${t('metaTitle')} — ${SITE.name}`, t('metaDescription'));
}

export default async function SimulatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const [t, th, s] = await Promise.all([
    getTranslations('sim'),
    getTranslations('home'),
    getCustomsSettings(),
  ]);

  const faq = [1, 2, 3, 6, 4].map((i) => ({ q: th(`faq${i}Q` as 'faq1Q'), a: th(`faq${i}A` as 'faq1A') }));
  const how = [1, 6, 2, 3, 4, 5].map((i) => t(`how${i}` as 'how1'));
  const ccr = [1, 2, 3, 4, 5].map((i) => t(`ccr${i}` as 'ccr1'));
  const small = formatNumber(s.small_engine_max_cc, loc);
  const abatt = formatNumber(s.abatt_threshold_cc, loc);

  const rows = [
    { category: t('ratesSmall', { cc: small }), dd: s.dd_rate_small },
    { category: t('ratesLarge', { cc: small }), dd: s.dd_rate_large },
    { category: t('ratesElectric'), dd: s.dd_rate_electric },
  ];
  const abattRows = [
    { category: t('ratesAbattSmall', { cc: abatt }), rate: s.abatt_small },
    { category: t('ratesAbattLarge', { cc: abatt }), rate: s.abatt_large },
    { category: t('ratesElectric'), rate: s.abatt_electric },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE.name, url: SITE.url },
          { name: t('eyebrow'), url: `${SITE.url}/simulateur-dedouanement` },
        ])}
      />
      <JsonLd data={faqSchema(faq)} />

      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

      <section className="container-x py-12 sm:py-16">
        <CustomsSimulator settings={s} variant="full" />
      </section>

      <section className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">{t('howTitle')}</h2>
            <ol className="mt-8 space-y-4">
              {how.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-display grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent/30 text-sm font-semibold text-accent">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 leading-relaxed text-muted">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.03] p-6">
              <h3 className="font-display text-lg font-semibold text-white">{t('ccrTitle')}</h3>
              <ul className="mt-4 space-y-2.5">
                {ccr.map((c) => (
                  <li key={c} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">{t('ratesTitle')}</h2>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.07]">
              <table className="w-full min-w-[22rem] text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3 text-start font-semibold">{t('ratesCategory')}</th>
                    <th className="px-4 py-3 text-end font-semibold">{t('ratesDd')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {rows.map((r) => (
                    <tr key={r.category}>
                      <td className="px-4 py-3 text-ink/90">{r.category}</td>
                      <td className="px-4 py-3 text-end font-semibold text-white">{formatPercent(r.dd, loc)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-4 py-3 text-ink/90">{t('cs')} · {t('prct')} · {t('tva')}</td>
                    <td className="px-4 py-3 text-end font-semibold text-white">
                      {formatPercent(s.cs_rate, loc)} · {formatPercent(s.prct_rate, loc)} · {formatPercent(s.tva_rate, loc)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-emerald-400/15">
              <table className="w-full min-w-[22rem] text-sm">
                <thead className="bg-emerald-400/[0.04] text-xs uppercase tracking-wider text-emerald-300/80">
                  <tr>
                    <th className="px-4 py-3 text-start font-semibold">{t('ratesCategory')}</th>
                    <th className="px-4 py-3 text-end font-semibold">{t('ratesAbatt')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {abattRows.map((r) => (
                    <tr key={r.category}>
                      <td className="px-4 py-3 text-ink/90">{r.category}</td>
                      <td className="px-4 py-3 text-end font-semibold text-emerald-300">−{formatPercent(r.rate, loc)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted">
              {t('rateUpdated', { rate: formatNumber(s.exchange_rate_dzd, loc) })}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow={th('faqEyebrow')} title={th('faqTitle')} />
          <FadeIn>
            <Faq items={faq} />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
