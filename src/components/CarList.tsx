'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';

import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { filterCars, type CarSummary } from '@/lib/car-filters';
import { CarCard } from '@/components/CarCard';
import { CarFilters } from '@/components/CarFilters';
import { SOLD_ANCHOR, SoldCars } from '@/components/SoldCars';

type Params = Record<string, string | undefined>;

const KEYS = ['q', 'make', 'fuel', 'gearbox', 'maxPrice', 'minYear', 'exportDz', 'dz', 'sort'];

/**
 * Filters the inventory in the browser: the page stays static (ISR) and the
 * filters are mirrored to the URL so filtered links remain shareable.
 */
export function CarList({
  cars,
  makes,
  soldTotal = 0,
  locale,
}: {
  /** Cars still for sale; sold ones are paged in by <SoldCars>. */
  cars: CarSummary[];
  makes: string[];
  soldTotal?: number;
  locale: Locale;
}) {
  const t = useTranslations('cars');
  const [params, setParams] = useState<Params>({});

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const initial: Params = {};
    for (const k of KEYS) initial[k] = sp.get(k) ?? undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time URL sync after hydration keeps the SSR list static
    setParams(initial);
  }, []);

  function update(next: Params) {
    setParams(next);
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) sp.set(k, v);
    const qs = sp.toString();
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }

  const filtered = useMemo(
    () =>
      filterCars([...cars], {
        make: params.make,
        fuel: params.fuel,
        gearbox: params.gearbox,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        minYear: params.minYear ? Number(params.minYear) : undefined,
        // Old shared links used ?exportDz=1; it now maps to dz=any.
        dz: params.dz ?? (params.exportDz === '1' ? 'any' : undefined),
        q: params.q,
        sort: params.sort,
      }),
    [cars, params]
  );
  const count = filtered.length;
  // Same filters for the sold section; changing them remounts it.
  const soldQuery = useMemo(() => {
    const sp = new URLSearchParams();
    for (const k of KEYS) if (params[k]) sp.set(k, params[k]!);
    return sp.toString();
  }, [params]);

  return (
    <>
      <CarFilters makes={makes} current={params} onChange={update} />

      {/* h2 keeps the outline h1 → h2 → h3 (card titles); live so filter
          results are announced (WCAG 4.1.3). */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-muted" aria-live="polite">
          {t(count === 1 ? 'resultsOne' : 'resultsOther', { count })}
        </h2>
        <a href={`#${SOLD_ANCHOR}`} className="btn-ghost !px-4 !py-2 text-sm">
          {t('soldShow')}
          {soldTotal > 0 ? ` (${soldTotal})` : ''}
        </a>
      </div>

      {count > 0 ? (
        <motion.div layout className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <CarCard car={car} locale={locale} priority={i < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-muted">{t('empty')}</p>
          <Link href="/contact" className="btn-ghost mt-6 text-sm">
            {t('emptyCta')}
          </Link>
        </div>
      )}

      {/* Always rendered: the ISR count can lag behind the admin. */}
      <SoldCars key={soldQuery} query={soldQuery} locale={locale} total={soldTotal} />
    </>
  );
}
