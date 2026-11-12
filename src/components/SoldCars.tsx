'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import type { Locale } from '@/i18n/routing';
import { SOLD_PAGE_SIZE, type CarSummary } from '@/lib/car-filters';
import { CarCard } from '@/components/CarCard';

type State = 'idle' | 'loading' | 'error';

/**
 * Sold cars are not rendered with the stock: they are fetched page by page
 * only when the visitor asks, so their photos cost nothing by default.
 * Remount (via `key`) whenever the filters change to start over.
 */
export function SoldCars({ query, locale }: { query: string; locale: Locale }) {
  const t = useTranslations('cars');
  const [cars, setCars] = useState<CarSummary[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [state, setState] = useState<State>('idle');

  async function load() {
    setState('loading');
    try {
      const sp = new URLSearchParams(query);
      sp.set('offset', String(cars.length));
      sp.set('limit', String(SOLD_PAGE_SIZE));
      const res = await fetch(`/api/cars/sold?${sp}`);
      if (!res.ok) throw new Error(String(res.status));
      const data: { cars: CarSummary[]; total: number } = await res.json();
      setCars((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...data.cars.filter((c) => !seen.has(c.id))];
      });
      setTotal(data.total);
      setState('idle');
    } catch {
      setState('error');
    }
  }

  const started = total !== null;
  const hasMore = !started || cars.length < total;
  const busy = state === 'loading';

  return (
    <section className="mt-16 border-t border-white/[0.07] pt-10" aria-labelledby="sold-title">
      <h2 id="sold-title" className="text-xl font-semibold">
        {t('soldTitle')}
      </h2>
      <p className="mt-1 text-sm text-muted">{t('soldIntro')}</p>

      {started && total === 0 && <p className="mt-6 text-sm text-muted">{t('soldEmpty')}</p>}

      {cars.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} locale={locale} />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4" aria-live="polite">
        {hasMore && (
          <button type="button" onClick={load} disabled={busy} className="btn-ghost text-sm disabled:opacity-60">
            {busy ? t('soldLoading') : started ? t('soldMore') : t('soldShow')}
          </button>
        )}
        {started && total! > 0 && (
          <span className="text-sm text-muted">
            {t('soldProgress', { shown: cars.length, total: total! })}
          </span>
        )}
        {state === 'error' && <span className="text-sm text-red-400">{t('soldError')}</span>}
      </div>
    </section>
  );
}
