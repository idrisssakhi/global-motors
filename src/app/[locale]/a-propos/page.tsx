import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Eye, FileCheck2, HeartHandshake } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { SITE } from '@/lib/site';
import { alternates } from '@/lib/seo';
import { formatDate } from '@/lib/format';
import { PageHero } from '@/components/PageHero';
import { AutoplayVideo } from '@/components/AutoplayVideo';
import { SpotlightCard } from '@/components/SpotlightCard';
import { FadeIn } from '@/components/FadeIn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: `${t('metaTitle')} — ${SITE.name}`,
    description: t('lead'),
    alternates: alternates(locale, '/a-propos'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tl] = await Promise.all([getTranslations('about'), getTranslations('legalPage')]);

  const values = [
    { icon: Eye, title: t('v1Title'), desc: t('v1Desc') },
    { icon: FileCheck2, title: t('v2Title'), desc: t('v2Desc') },
    { icon: HeartHandshake, title: t('v3Title'), desc: t('v3Desc') },
  ];

  const legal = [
    { label: tl('company'), value: SITE.legal.name },
    { label: tl('legalForm'), value: SITE.legal.legalForm },
    { label: tl('siren'), value: SITE.legal.siren },
    { label: tl('siret'), value: SITE.legal.siret },
    { label: tl('vat'), value: SITE.legal.vat },
    { label: tl('ape'), value: `${SITE.legal.ape} — ${SITE.legal.apeLabel}` },
    { label: tl('address'), value: `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}` },
    { label: tl('president'), value: SITE.legal.president },
    { label: 'Date', value: formatDate(SITE.legal.foundingDate) },
  ];

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('lead')} />

      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <FadeIn className="space-y-5 text-lg leading-relaxed text-muted">
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
            <p>{t('p3')}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07]">
              <AutoplayVideo src="/videos/aston-martin-valour.webm" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-canvas/70 to-transparent" aria-hidden />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="container-x pb-20">
        <FadeIn>
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{t('valuesTitle')}</h2>
        </FadeIn>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.06}>
              <SpotlightCard className="h-full">
                <v.icon className="h-6 w-6 text-accent" aria-hidden />
                <h3 className="font-display mt-5 text-lg font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="container-x pb-10">
        <FadeIn>
          <div className="rounded-3xl border border-white/[0.07] bg-surface p-7 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-white">{t('legalTitle')}</h2>
            <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {legal.map((l) => (
                <div key={l.label} className="border-t border-white/[0.06] pt-3">
                  <dt className="text-xs uppercase tracking-wider text-muted">{l.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-white" dir="auto">{l.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/contact" className="btn-gold mt-10">
              {t('ctaButton')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
