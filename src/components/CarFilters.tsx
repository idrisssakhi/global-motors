'use client';

import { useTranslations } from 'next-intl';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FUEL_TYPES, GEARBOX_TYPES } from '@/lib/types';

type Params = Record<string, string | undefined>;

export function CarFilters({
  makes,
  current,
  onChange,
}: {
  makes: string[];
  current: Params;
  onChange: (next: Params) => void;
}) {
  const t = useTranslations('cars');
  const tf = useTranslations('fuel');
  const tg = useTranslations('gearbox');

  const update = (key: string, value: string) => onChange({ ...current, [key]: value || undefined });
  const hasFilters = Object.entries(current).some(([k, v]) => k !== 'sort' && v);

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
          <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
          {t('filters')}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={() => onChange({ sort: current.sort })}
            className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            {t('reset')}
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative block sm:col-span-2 lg:col-span-1">
          <span className="sr-only">{t('search')}</span>
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={current.q ?? ''} placeholder={t('search')} onChange={(e) => update('q', e.target.value)} className="field ps-10" />
        </label>

        <label className="block">
          <span className="sr-only">{t('make')}</span>
          <select value={current.make ?? ''} onChange={(e) => update('make', e.target.value)} className="field">
            <option value="">{t('allMakes')}</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">{t('fuel')}</span>
          <select value={current.fuel ?? ''} onChange={(e) => update('fuel', e.target.value)} className="field">
            <option value="">{t('allFuels')}</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>{tf(f)}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">{t('gearbox')}</span>
          <select value={current.gearbox ?? ''} onChange={(e) => update('gearbox', e.target.value)} className="field">
            <option value="">{t('allGearboxes')}</option>
            {GEARBOX_TYPES.map((g) => (
              <option key={g} value={g}>{tg(g)}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">{t('maxPrice')}</span>
          <input type="number" min={0} step={1000} value={current.maxPrice ?? ''} placeholder={t('maxPrice')} onChange={(e) => update('maxPrice', e.target.value)} className="field" />
        </label>

        <label className="block">
          <span className="sr-only">{t('minYear')}</span>
          <input type="number" min={1990} max={2030} value={current.minYear ?? ''} placeholder={t('minYear')} onChange={(e) => update('minYear', e.target.value)} className="field" />
        </label>

        <label className="block">
          <span className="sr-only">{t('sort')}</span>
          <select value={current.sort ?? ''} onChange={(e) => update('sort', e.target.value)} className="field">
            <option value="">{t('sort')} · {t('sortRecent')}</option>
            <option value="price-asc">{t('sortPriceAsc')}</option>
            <option value="price-desc">{t('sortPriceDesc')}</option>
            <option value="km-asc">{t('sortKm')}</option>
            <option value="year-desc">{t('sortYear')}</option>
          </select>
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink/90">
          <input
            type="checkbox"
            checked={current.exportDz === '1'}
            onChange={(e) => update('exportDz', e.target.checked ? '1' : '')}
            className="h-4 w-4 cursor-pointer accent-accent"
          />
          {t('exportDz')}
        </label>
      </div>
    </div>
  );
}
