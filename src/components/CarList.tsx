'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';

import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { filterCars, type CarSummary } from '@/lib/car-filters';
import { CarCard } from '@/components/CarCard';
import { CarFilters } from '@/components/CarFilters';

type Params = Record<string, string | undefined>;

const KEYS = ['q', 'make', 'fuel', 'gearbox', 'maxPrice', 'minYear', 'exportDz', 'sort'];

/**
 * Filters the inventory in the browser: the page stays static (ISR) and the
 * filters are mirrored to the URL so filtered links remain shareable.
 */
export function CarList({
  cars,
  makes,
  locale,
}: {
  cars: CarSummary[];
  makes: string[];
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
        exportDz: params.exportDz === '1',
        q: params.q,
        sort: params.sort,
      }),
    [cars, params]
  );
  const count = filtered.length;

  return (
    <>
      <CarFilters makes={makes} current={params} onChange={update} />

      <p className="mt-8 text-sm font-medium text-muted">
        {t(count === 1 ? 'resultsOne' : 'resultsOther', { count })}
      </p>

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
    </>
  );
}
