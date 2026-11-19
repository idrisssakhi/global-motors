'use client';

import { useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { FUEL_TYPES, GEARBOX_TYPES } from '@/lib/types';
import { DZ_ROUTES } from '@/lib/eligibility';
import { formatPrice } from '@/lib/format';
import type { Locale } from '@/i18n/routing';

type Params = Record<string, string | undefined>;

const BUDGETS = [10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000];
/** Filters inside the collapsible panel (search and sort stay visible on phones). */
const PANEL_KEYS = ['make', 'fuel', 'gearbox', 'maxPrice', 'minYear', 'dz'] as const;

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
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const update = (key: string, value: string) => onChange({ ...current, [key]: value || undefined });
  const hasFilters = Object.entries(current).some(([k, v]) => k !== 'sort' && v);
  const panelCount = PANEL_KEYS.filter((k) => current[k]).length;
  // Keep a budget from an older shared link selectable even if it isn't a preset.
  const budgets =
    current.maxPrice && !BUDGETS.includes(Number(current.maxPrice))
      ? [...BUDGETS, Number(current.maxPrice)].sort((a, b) => a - b)
      : BUDGETS;
  // Hidden on phones until the panel is opened; always shown from lg up.
  const panelItem = open ? 'block' : 'block max-lg:hidden';

  const chips = [
    current.q && { key: 'q', label: `“${current.q}”` },
    current.make && { key: 'make', label: current.make },
    current.fuel && { key: 'fuel', label: (FUEL_TYPES as readonly string[]).includes(current.fuel) ? tf(current.fuel) : current.fuel },
    current.gearbox && { key: 'gearbox', label: (GEARBOX_TYPES as readonly string[]).includes(current.gearbox) ? tg(current.gearbox) : current.gearbox },
    current.maxPrice && { key: 'maxPrice', label: t('upTo', { price: formatPrice(Number(current.maxPrice), locale) }) },
    current.minYear && { key: 'minYear', label: t('fromYear', { year: current.minYear }) },
    current.dz && {
      key: 'dz',
      label:
        current.dz === 'any' || !(DZ_ROUTES as string[]).includes(current.dz)
          ? t('exportDz')
          : t(`dzOption.${current.dz as (typeof DZ_ROUTES)[number]}`),
    },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="glass rounded-2xl p-4 sm:p-5" role="search" aria-label={t('filters')}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="hidden items-center gap-2 text-sm font-semibold text-white lg:inline-flex">
          <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
          {t('filters')}
        </span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-white lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
          {t('filters')}
          {panelCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent-600 px-1.5 text-[11px] font-bold text-white">
              {panelCount}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
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

      <div id={panelId} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative block sm:col-span-2 lg:col-span-1">
          <span className="sr-only">{t('search')}</span>
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={current.q ?? ''} placeholder={t('search')} onChange={(e) => update('q', e.target.value)} className="field ps-10" />
        </label>

        <label className={panelItem}>
          <span className="sr-only">{t('make')}</span>
          <select value={current.make ?? ''} onChange={(e) => update('make', e.target.value)} className="field">
            <option value="">{t('allMakes')}</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label className={panelItem}>
          <span className="sr-only">{t('fuel')}</span>
          <select value={current.fuel ?? ''} onChange={(e) => update('fuel', e.target.value)} className="field">
            <option value="">{t('allFuels')}</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>{tf(f)}</option>
            ))}
          </select>
        </label>

        <label className={panelItem}>
          <span className="sr-only">{t('gearbox')}</span>
          <select value={current.gearbox ?? ''} onChange={(e) => update('gearbox', e.target.value)} className="field">
            <option value="">{t('allGearboxes')}</option>
            {GEARBOX_TYPES.map((g) => (
              <option key={g} value={g}>{tg(g)}</option>
            ))}
          </select>
        </label>

        <label className={panelItem}>
          <span className="sr-only">{t('maxPrice')}</span>
          <select value={current.maxPrice ?? ''} onChange={(e) => update('maxPrice', e.target.value)} className="field">
            <option value="">{t('anyBudget')}</option>
            {budgets.map((b) => (
              <option key={b} value={String(b)}>{t('upTo', { price: formatPrice(b, locale) })}</option>
            ))}
          </select>
        </label>

        <label className={panelItem}>
          <span className="sr-only">{t('minYear')}</span>
          <input type="number" inputMode="numeric" min={1990} max={2030} value={current.minYear ?? ''} placeholder={t('minYear')} onChange={(e) => update('minYear', e.target.value)} className="field" />
        </label>

        <label className={panelItem}>
          <span className="sr-only">{t('dzRoute')}</span>
          <select value={current.dz ?? ''} onChange={(e) => update('dz', e.target.value)} className="field">
            <option value="">{t('dzAll')}</option>
            <option value="any">{t('exportDz')}</option>
            {DZ_ROUTES.map((r) => (
              <option key={r} value={r}>{t(`dzOption.${r}`)}</option>
            ))}
          </select>
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
      </div>

      {chips.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => update(c.key, '')}
                aria-label={`${t('removeFilter')}: ${c.label}`}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] py-1 pe-2 ps-3 text-xs font-medium text-white transition-colors hover:border-accent/50 hover:bg-accent/10"
              >
                {c.label}
                <X className="h-3.5 w-3.5 text-muted" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
