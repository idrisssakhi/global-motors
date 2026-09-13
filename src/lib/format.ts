import type { Locale } from '@/i18n/routing';

const numberLocale = (locale: Locale) => (locale === 'ar' ? 'ar-DZ' : 'fr-FR');

export function formatPrice(value: number, locale: Locale): string {
  return new Intl.NumberFormat(numberLocale(locale), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDzd(value: number, locale: Locale): string {
  const n = new Intl.NumberFormat(numberLocale(locale), {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
  return locale === 'ar' ? `${n} د.ج` : `${n} DA`;
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(numberLocale(locale)).format(value);
}

export function formatPercent(rate: number, locale: Locale): string {
  return new Intl.NumberFormat(numberLocale(locale), {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(rate);
}

/** Format an ISO date (YYYY-MM-DD) as DD/MM/YYYY. */
export function formatDate(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('T')[0].split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/** Build a URL-safe slug from make + model + year + a short id. */
export function buildSlug(
  make: string,
  model: string,
  year: number,
  id?: string
): string {
  const base = `${make}-${model}-${year}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = id ? `-${id.slice(0, 6)}` : '';
  return `${base}${suffix}`;
}
