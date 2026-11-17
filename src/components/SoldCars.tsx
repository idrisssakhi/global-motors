'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
/** Anchor used by the "see sold cars" links (/voitures#vendus). */
export const SOLD_ANCHOR = 'vendus';

export function SoldCars({ query, locale, total: knownTotal }: { query: string; locale: Locale; total?: number }) {
  const t = useTranslations('cars');
  const [cars, setCars] = useState<CarSummary[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [state, setState] = useState<State>('idle');

  const loadedRef = useRef(0);

  const load = useCallback(async () => {
    setState('loading');
    try {
      const sp = new URLSearchParams(query);
      sp.set('offset', String(loadedRef.current));
      sp.set('limit', String(SOLD_PAGE_SIZE));
      const res = await fetch(`/api/cars/sold?${sp}`);
      if (!res.ok) throw new Error(String(res.status));
      const data: { cars: CarSummary[]; total: number } = await res.json();
      setCars((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        const next = [...prev, ...data.cars.filter((c) => !seen.has(c.id))];
        loadedRef.current = next.length;
        return next;
      });
      setTotal(data.total);
      setState('idle');
    } catch {
      setState('error');
    }
  }, [query]);

  // Arriving on /voitures#vendus (or clicking a link to it) opens the section.
  useEffect(() => {
    let requested = false;
    const open = () => {
      if (requested || loadedRef.current > 0 || window.location.hash !== `#${SOLD_ANCHOR}`) return;
      requested = true;
      void load();
      document.getElementById(SOLD_ANCHOR)?.scrollIntoView({ block: 'start' });
    };
    open();
    // A client-side navigation can commit the URL hash just after mount.
    const timer = window.setTimeout(open, 300);
    window.addEventListener('hashchange', open);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', open);
    };
  }, [load]);

  const started = total !== null;
  const hasMore = !started || cars.length < total;
  const busy = state === 'loading';

  return (
    <section
      id={SOLD_ANCHOR}
      className="mt-16 scroll-mt-28 rounded-3xl border border-accent/25 bg-surface p-6 sm:p-10"
      aria-labelledby="sold-title"
    >
      <h2 id="sold-title" className="font-display text-2xl font-semibold sm:text-3xl">
        {t('soldTitle')}
        {knownTotal ? <span className="ms-3 align-middle text-base font-medium text-accent">({knownTotal})</span> : null}
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
          <button type="button" onClick={load} disabled={busy} className={`${started ? 'btn-ghost' : 'btn-primary'} text-sm disabled:opacity-60`}>
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
