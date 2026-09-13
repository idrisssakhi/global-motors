import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  Cog,
  DoorOpen,
  Fuel,
  Gauge,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Ship,
  Sparkles,
  Users,
  Zap,
  Cylinder,
} from 'lucide-react';

import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { SITE, whatsappLink } from '@/lib/site';
import { alternates, videoEmbed } from '@/lib/seo';
import { carImageUrl } from '@/lib/image';
import { getAllSlugs, getCarBySlug, getCustomsSettings, getRelatedCars } from '@/lib/cars';
import { toSummary } from '@/lib/car-filters';
import { ageBracketFromDate, isUnderThreeYears, toCustomsFuel } from '@/lib/customs';
import { formatDate, formatNumber, formatPrice } from '@/lib/format';
import { breadcrumbSchema, vehicleSchema } from '@/lib/structured-data';
import { CarGallery } from '@/components/CarGallery';
import { CarCard } from '@/components/CarCard';
import { CustomsSimulator } from '@/components/CustomsSimulator';
import { LeadForm } from '@/components/LeadForm';
import { SectionHeading } from '@/components/SectionHeading';
import { FadeIn } from '@/components/FadeIn';
import { JsonLd } from '@/components/JsonLd';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: SITE.name };

  const title = (locale === 'ar' ? car.title_ar : car.title_fr) || `${car.make} ${car.model} ${car.year}`;
  const description =
    (locale === 'ar' ? car.description_ar : car.description_fr) ||
    `${title} — ${formatPrice(car.price_eur, locale as Locale)}`;

  return {
    title: `${title} — ${SITE.name}`,
    description,
    alternates: alternates(locale, `/voitures/${slug}`),
    openGraph: {
      title,
      description,
      url: `${SITE.url}/voitures/${slug}`,
      images: car.images[0] ? [carImageUrl(car.images[0])] : undefined,
    },
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const loc = locale as Locale;
  const [t, tf, tg, ts, tl, customs, related] = await Promise.all([
    getTranslations('car'),
    getTranslations('fuel'),
    getTranslations('gearbox'),
    getTranslations('status'),
    getTranslations('lead'),
    getCustomsSettings(),
    getRelatedCars(car),
  ]);

  const title = (loc === 'ar' ? car.title_ar : car.title_fr) || `${car.make} ${car.model}`;
  const description = loc === 'ar' ? car.description_ar : car.description_fr;
  const under3 = isUnderThreeYears(car.first_registration);
  const ageBracket = ageBracketFromDate(car.first_registration);
  const wa = whatsappLink(t('whatsappMsg', { car: `${car.make} ${car.model}`, year: car.year }));
  const video = car.video_url ? videoEmbed(car.video_url) : null;

  const specs = [
    { icon: Calendar, label: t('year'), value: String(car.year) },
    car.first_registration && { icon: CalendarClock, label: t('firstRegistration'), value: formatDate(car.first_registration) },
    { icon: Gauge, label: t('mileage'), value: `${formatNumber(car.mileage_km, loc)} ${t('km')}` },
    { icon: Fuel, label: t('fuel'), value: tf(car.fuel) },
    { icon: Cog, label: t('gearbox'), value: tg(car.gearbox) },
    car.engine_cc && { icon: Cylinder, label: t('engine'), value: `${formatNumber(car.engine_cc, loc)} ${t('cc')}` },
    car.power_hp && { icon: Zap, label: t('power'), value: `${car.power_hp} ${t('ch')}` },
    car.doors && { icon: DoorOpen, label: t('doors'), value: String(car.doors) },
    car.seats && { icon: Users, label: t('seats'), value: String(car.seats) },
    car.color && { icon: Palette, label: t('color'), value: car.color },
    car.location && { icon: MapPin, label: t('location'), value: car.location },
  ].filter(Boolean) as { icon: typeof Calendar; label: string; value: string }[];

  return (
    <>
      <JsonLd data={vehicleSchema(car, loc)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE.name, url: SITE.url },
          { name: t('back'), url: `${SITE.url}/voitures` },
          { name: title, url: `${SITE.url}/voitures/${car.slug}` },
        ])}
      />

      <div className="container-x pb-8 pt-28 sm:pt-32">
        <Link href="/voitures" className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t('back')}
        </Link>

        <div className="mt-6 grid gap-x-10 gap-y-10 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <div className="min-w-0 space-y-10">
            <div className="animate-fade-up">
              <CarGallery images={car.images} alt={title} />
            </div>

            {video && (
              <FadeIn>
                <h2 className="font-display text-xl font-semibold text-white">{t('video')}</h2>
                <div className="mt-4 aspect-video overflow-hidden rounded-3xl border border-white/[0.07] bg-surface">
                  {video.kind === 'youtube' ? (
                    <iframe
                      src={video.src}
                      title={title}
                      className="h-full w-full"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <video src={video.src} controls playsInline preload="metadata" className="h-full w-full object-cover" />
                  )}
                </div>
              </FadeIn>
            )}

            {description && (
              <FadeIn>
                <h2 className="font-display text-xl font-semibold text-white">{t('description')}</h2>
                <p className="mt-4 whitespace-pre-line break-words leading-relaxed text-muted">{description}</p>
              </FadeIn>
            )}

            <FadeIn>
              <h2 className="font-display text-xl font-semibold text-white">{t('specs')}</h2>
              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-surface p-4">
                    <s.icon className="h-5 w-5 text-accent" aria-hidden />
                    <dt className="mt-3 text-xs text-muted">{s.label}</dt>
                    <dd className="mt-0.5 break-words text-sm font-semibold text-white">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-24">
            <div className="animate-fade-up rounded-3xl border border-white/[0.08] bg-surface p-6 sm:p-7" style={{ animationDelay: '0.1s' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {car.make} · {car.year}
              </p>
              <h1 className="font-display mt-2 text-3xl font-semibold leading-tight text-white">{title}</h1>
              {car.version && <p className="mt-1 text-muted">{car.version}</p>}

              <div className="mt-4 flex flex-wrap gap-2">
                {car.status !== 'disponible' && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{ts(car.status)}</span>
                )}
                {car.export_dz && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    <Ship className="h-3.5 w-3.5" aria-hidden /> {t('exportEligible')}
                  </span>
                )}
                {under3 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden /> {t('under3')}
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-2 border-t border-white/[0.07] pt-5">
                {car.vat_recoverable && car.price_ht != null && (
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-muted">{t('priceHT')}</span>
                    <span className="font-display text-xl font-semibold text-emerald-300">{formatPrice(car.price_ht, loc)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-muted">
                    {t('priceTTC')} · {car.vat_recoverable ? t('vatRecoverable') : t('vatNotRecoverable')}
                  </span>
                  <span className="font-display text-3xl font-semibold text-white">{formatPrice(car.price_eur, loc)}</span>
                </div>
              </div>

              {(wa || SITE.phone) && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold text-sm">
                      <MessageCircle className="h-4 w-4" aria-hidden /> {t('whatsapp')}
                    </a>
                  )}
                  {SITE.phone && (
                    <a href={SITE.phoneHref} className="btn-ghost text-sm">
                      <Phone className="h-4 w-4" aria-hidden /> {t('call')}
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="glass rounded-3xl p-6 sm:p-7">
              <p className="font-display text-lg font-semibold text-white">{t('interested')}</p>
              <p className="mt-1 text-sm text-muted">{t('interestedDesc')}</p>
              <LeadForm
                kind="vehicule"
                carId={car.id}
                className="mt-5"
                defaultMessage={`${car.make} ${car.model} ${car.version ?? ''} (${car.year})`.replace(/\s+/g, ' ')}
                title={undefined}
              />
              <span className="sr-only">{tl('titleCar')}</span>
            </div>
          </aside>
        </div>
      </div>

      {car.export_dz && (
        <section className="border-y border-white/[0.06] bg-surface/60 py-20">
          <div className="container-x">
            <SectionHeading eyebrow="DZ" title={t('customsTitle')} subtitle={t('customsText')} />
            <FadeIn className="mt-10">
              <CustomsSimulator
                settings={customs}
                variant="compact"
                carId={car.id}
                initial={{
                  regime: 'standard',
                  fuel: toCustomsFuel(car.fuel),
                  age: ageBracket ?? (car.mileage_km < 100 ? 0 : 3),
                  engineCc: car.engine_cc ?? 1400,
                  priceEur: car.vat_recoverable && car.price_ht ? car.price_ht : car.price_eur,
                }}
              />
            </FadeIn>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading title={t('related')} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c, i) => (
              <FadeIn key={c.id} delay={i * 0.06}>
                <CarCard car={toSummary(c)} locale={loc} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
