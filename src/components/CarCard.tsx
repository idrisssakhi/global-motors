import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Gauge, Calendar, Fuel, Cog, Ship } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import type { CarSummary } from '@/lib/car-filters';
import type { Locale } from '@/i18n/routing';
import { carImageUrl } from '@/lib/image';
import { formatPrice, formatNumber } from '@/lib/format';
import { Logo } from './Logo';

export function CarCard({
  car,
  locale,
  priority = false,
}: {
  car: CarSummary;
  locale: Locale;
  priority?: boolean;
}) {
  const t = useTranslations();
  const title = (locale === 'ar' ? car.title_ar : car.title_fr) || `${car.make} ${car.model}`;
  const [cover, hover] = car.images.map(carImageUrl);
  const isSold = car.status === 'vendu';

  return (
    <Link
      href={`/voitures/${car.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-surface shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        {cover ? (
          <>
            <div className="skeleton-shimmer absolute inset-0" aria-hidden />
            <Image
              src={cover}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
              quality={68}
              priority={priority}
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${isSold ? 'grayscale' : ''} ${hover ? 'group-hover:opacity-0' : ''}`}
            />
            {hover && (
              <Image
                src={hover}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                quality={68}
                className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="grid h-full place-items-center opacity-30">
            <Logo height={44} />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" aria-hidden />

        {isSold && (
          <div className="absolute inset-0 grid place-items-center bg-black/50">
            <span className="-rotate-12 rounded-md border-2 border-white px-4 py-1.5 text-lg font-black uppercase tracking-widest text-white">
              {t('status.vendu')}
            </span>
          </div>
        )}

        <div className="absolute start-3 top-3 flex flex-wrap gap-2">
          {car.status === 'reserve' && (
            <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-semibold text-black">{t('status.reserve')}</span>
          )}
          {car.export_dz && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              <Ship className="h-3 w-3 text-accent" aria-hidden /> DZ
            </span>
          )}
        </div>

        {car.vat_recoverable && car.price_ht != null && (
          <span className="absolute end-3 top-3 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-bold text-black">
            {formatPrice(car.price_ht, locale)} {t('car.priceHT')}
          </span>
        )}

        <span className="absolute bottom-3 end-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-accent text-canvas opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">{car.make}</p>
        <h3 className="font-display mt-1 text-lg font-semibold leading-snug text-white">{title}</h3>
        {car.version && <p className="mt-0.5 truncate text-sm text-muted">{car.version}</p>}

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-muted">
          <Spec icon={Calendar} label={t('car.year')} value={String(car.year)} />
          <Spec icon={Gauge} label={t('car.mileage')} value={`${formatNumber(car.mileage_km, locale)} ${t('car.km')}`} />
          <Spec icon={Fuel} label={t('car.fuel')} value={t(`fuel.${car.fuel}`)} />
          <Spec icon={Cog} label={t('car.gearbox')} value={t(`gearbox.${car.gearbox}`)} />
        </dl>

        <div className="mt-5 flex items-end justify-between border-t border-white/[0.07] pt-4">
          <div>
            <span className="font-display text-2xl font-semibold text-white">{formatPrice(car.price_eur, locale)}</span>
            <span className="block text-[11px] text-muted">
              {t('car.priceTTC')}
              {car.vat_recoverable ? ` · ${t('car.vatRecoverable')}` : ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Spec({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-4 w-4 shrink-0 text-white/35" aria-hidden />
      <dt className="sr-only">{label}</dt>
      <dd className="truncate">{value}</dd>
    </div>
  );
}
