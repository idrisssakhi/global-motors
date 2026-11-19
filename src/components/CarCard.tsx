import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import type { CarSummary } from '@/lib/car-filters';
import type { Locale } from '@/i18n/routing';
import { carImageUrl } from '@/lib/image';
import { carTitle } from '@/lib/car-i18n';
import { DzBadges } from '@/components/DzBadges';
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
  const title = carTitle(car, locale);
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
            <Logo variant="mark" height={56} decorative />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" aria-hidden />

        {isSold && (
          <div className="absolute inset-0 grid place-items-center bg-black/60">
            <span className="-rotate-12 rounded-md border-2 border-white px-4 py-1.5 text-lg font-black uppercase tracking-widest text-white">
              {t('status.vendu')}
            </span>
          </div>
        )}

        {car.status === 'reserve' && (
          <div className="absolute inset-x-0 top-0 bg-amber-500/90 py-1.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-black backdrop-blur">
            {t('status.reserve')}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">{car.make}</p>
        <h3 className="font-display mt-1 text-lg font-semibold leading-snug text-white">{title}</h3>
        {car.version && <p className="mt-0.5 truncate text-sm text-muted">{car.version}</p>}
        {!isSold && <DzBadges routes={car.dzRoutes} className="mt-3" size="sm" />}

        <ul className="mb-5 mt-4 flex flex-wrap items-center text-sm text-muted">
          {[
            String(car.year),
            `${formatNumber(car.mileage_km, locale)} ${t('car.km')}`,
            t(`fuel.${car.fuel}`),
            t(`gearbox.${car.gearbox}`),
          ].map((v, i) => (
            <li key={i} className="flex items-center">
              {i > 0 && (
                <span className="mx-2 text-white/25" aria-hidden>
                  ·
                </span>
              )}
              {v}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/[0.07] pt-4">
          <div className="min-w-0">
            {car.vat_recoverable && car.price_ht != null ? (
              <>
                <span className="font-display text-2xl font-semibold text-emerald-300">
                  {formatPrice(car.price_ht, locale)}{' '}
                  <span className="text-sm font-medium">{t('car.priceHT')}</span>
                </span>
                <span className="block text-[11px] text-muted">
                  {formatPrice(car.price_eur, locale)} {t('car.priceTTC')}
                </span>
              </>
            ) : (
              <>
                <span className="font-display text-2xl font-semibold text-white">{formatPrice(car.price_eur, locale)}</span>
                <span className="block text-[11px] text-muted">
                  {t('car.priceTTC')}
                  {car.vat_recoverable ? ` · ${t('car.vatRecoverable')}` : null}
                </span>
              </>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent transition-colors group-hover:text-white">
            {t('car.view')}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

