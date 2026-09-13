import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  Languages,
  Search,
  Receipt,
  Ship,
  MessageCircle,
} from 'lucide-react';

import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { SITE, whatsappLink } from '@/lib/site';
import { alternates } from '@/lib/seo';
import { getCustomsSettings, getFeaturedCars } from '@/lib/cars';
import { toSummary } from '@/lib/car-filters';
import { autoDealerSchema, faqSchema } from '@/lib/structured-data';
import { Hero } from '@/components/home/Hero';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { VideoShowcase } from '@/components/home/VideoShowcase';
import { ProcessRoute } from '@/components/home/ProcessRoute';
import { SectionHeading } from '@/components/SectionHeading';
import { CarCard } from '@/components/CarCard';
import { CustomsSimulator } from '@/components/CustomsSimulator';
import { SpotlightCard } from '@/components/SpotlightCard';
import { AutoplayVideo } from '@/components/AutoplayVideo';
import { LeadForm } from '@/components/LeadForm';
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
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: alternates(locale, ''),
    openGraph: { title: t('metaTitle'), description: t('metaDescription'), url: SITE.url, siteName: SITE.name },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tl = await getTranslations('lead');
  const [cars, customs] = await Promise.all([getFeaturedCars(6), getCustomsSettings()]);
  const wa = whatsappLink();

  const why = [
    { icon: BadgeCheck, title: t('why1Title'), desc: t('why1Desc') },
    { icon: Receipt, title: t('why2Title'), desc: t('why2Desc') },
    { icon: Calculator, title: t('why3Title'), desc: t('why3Desc') },
    { icon: Ship, title: t('why4Title'), desc: t('why4Desc') },
    { icon: Building2, title: t('why5Title'), desc: t('why5Desc') },
    { icon: Languages, title: t('why6Title'), desc: t('why6Desc') },
  ];
  const faq = [1, 2, 3, 6, 4, 5].map((i) => ({
    q: t(`faq${i}Q` as 'faq1Q'),
    a: t(`faq${i}A` as 'faq1A'),
  }));

  return (
    <>
      <JsonLd data={autoDealerSchema()} />
      <JsonLd data={faqSchema(faq)} />

      <Hero />
      <BrandMarquee title={t('marqueeTitle')} />

      {/* Featured stock */}
      <section className="container-x py-24 sm:py-32">
        <SectionHeading eyebrow={t('featuredEyebrow')} title={t('featuredTitle')} subtitle={t('featuredSubtitle')}>
          {cars.length > 0 && (
            <Link href="/voitures" className="btn-ghost text-sm">
              {t('viewAll')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          )}
        </SectionHeading>

        {cars.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car, i) => (
              <FadeIn key={car.id} delay={i * 0.06}>
                <CarCard car={toSummary(car)} locale={locale as Locale} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <div className="bg-grid relative mt-12 overflow-hidden rounded-3xl border border-white/[0.07] p-10 text-center sm:p-16">
              <p className="font-display text-2xl font-semibold text-white sm:text-3xl">{t('emptyTitle')}</p>
              <p className="mx-auto mt-3 max-w-xl text-muted">{t('emptyText')}</p>
              <Link href="/contact" className="btn-gold mt-8">
                {t('emptyCta')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </FadeIn>
        )}
      </section>

      <ProcessRoute />

      {/* Customs simulator teaser */}
      <section className="relative border-y border-white/[0.06] bg-surface/60 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t('simEyebrow')} title={t('simTitle')} subtitle={t('simSubtitle')}>
            <Link href="/simulateur-dedouanement" className="btn-ghost text-sm">
              {t('simCta')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </SectionHeading>
          <FadeIn className="mt-12">
            <CustomsSimulator settings={customs} variant="compact" />
          </FadeIn>
        </div>
      </section>

      {/* Tailored search */}
      <section className="container-x py-24 sm:py-32">
        <FadeIn>
          <Link href="/contact" className="group relative block overflow-hidden rounded-3xl border border-white/[0.07]">
            <AutoplayVideo
              src="/videos/aston-martin-valour.webm"
              className="h-[60svh] min-h-[420px] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/50 to-transparent" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-7 sm:p-12 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="eyebrow">{t('searchEyebrow')}</span>
                <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">{t('searchTitle')}</h2>
                <p className="mt-4 text-white/75">{t('searchText')}</p>
              </div>
              <span className="btn-gold shrink-0">
                <Search className="h-4 w-4" aria-hidden />
                {t('searchCta')}
              </span>
            </div>
          </Link>
        </FadeIn>
      </section>

      {/* Why us */}
      <section className="container-x pb-24 sm:pb-32">
        <SectionHeading eyebrow={t('whyEyebrow')} title={t('whyTitle')} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {why.map((w, i) => (
            <FadeIn key={w.title} delay={i * 0.05}>
              <SpotlightCard className="h-full">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <w.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display mt-5 text-lg font-semibold text-white">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{w.desc}</p>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x pb-24 sm:pb-32">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow={t('faqEyebrow')} title={t('faqTitle')} />
          <FadeIn>
            <Faq items={faq} />
          </FadeIn>
        </div>
      </section>

      {/* Premium sourcing — video, near the end of the page */}
      <VideoShowcase
        src="/videos/ferrari-f80.webm"
        eyebrow={t('videoEyebrow')}
        title={t('videoTitle')}
        text={t('videoText')}
      />

      {/* CTA */}
      <section className="container-x">
        <FadeIn>
          <div className="grain relative overflow-hidden rounded-3xl border border-accent/20">
            <AutoplayVideo src="/videos/aston-martin-valour.webm" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-linear-to-r from-canvas via-canvas/90 to-canvas/60 rtl:bg-linear-to-l" aria-hidden />
            <div className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">{t('ctaTitle')}</h2>
                <p className="mt-4 max-w-lg text-lg text-muted">{t('ctaSubtitle')}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {wa ? (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold">
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      {t('ctaPrimary')}
                    </a>
                  ) : null}
                  <Link href="/voitures" className="btn-ghost">
                    {t('ctaSecondary')}
                  </Link>
                </div>
              </div>
              <div className="glass rounded-2xl p-5 sm:p-6">
                <LeadForm kind="recherche" title={tl('titleSearch')} />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
