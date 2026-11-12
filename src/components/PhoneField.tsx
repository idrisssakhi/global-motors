'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

/**
 * Country dial code + national number, combined into one international
 * "+CC NUMBER" value in a hidden `phone` input, so every lead can be reached
 * on WhatsApp (wa.me needs the country code).
 *
 * Ordered by how often each market writes to us; names come from
 * Intl.DisplayNames, so no translations are needed.
 */
const COUNTRIES: { iso: string; dial: string }[] = [
  { iso: 'FR', dial: '33' },
  { iso: 'DZ', dial: '213' },
  { iso: 'TN', dial: '216' },
  { iso: 'MA', dial: '212' },
  { iso: 'BE', dial: '32' },
  { iso: 'CH', dial: '41' },
  { iso: 'LU', dial: '352' },
  { iso: 'DE', dial: '49' },
  { iso: 'ES', dial: '34' },
  { iso: 'IT', dial: '39' },
  { iso: 'NL', dial: '31' },
  { iso: 'PT', dial: '351' },
  { iso: 'GB', dial: '44' },
  { iso: 'IE', dial: '353' },
  { iso: 'CA', dial: '1' },
  { iso: 'US', dial: '1' },
  { iso: 'AE', dial: '971' },
  { iso: 'SA', dial: '966' },
  { iso: 'QA', dial: '974' },
  { iso: 'KW', dial: '965' },
  { iso: 'TR', dial: '90' },
  { iso: 'LY', dial: '218' },
  { iso: 'MR', dial: '222' },
  { iso: 'EG', dial: '20' },
  { iso: 'SN', dial: '221' },
  { iso: 'CI', dial: '225' },
];

const DEFAULT_BY_LOCALE: Record<string, string> = { fr: 'FR', ar: 'DZ', en: 'FR' };

/** 🇫🇷 from "FR" (regional indicator symbols). */
const flag = (iso: string) =>
  String.fromCodePoint(...[...iso].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

/** "+33 612345678" — drops a trunk "0" and any dial code typed by hand. */
export function toInternational(dial: string, national: string): string {
  let digits = national.replace(/\D/g, '');
  if (national.trim().startsWith('+') || digits.startsWith('00')) {
    // The visitor typed a full international number: keep it as is.
    return `+${digits.replace(/^00/, '')}`;
  }
  if (digits.startsWith(dial) && digits.length > dial.length + 7) digits = digits.slice(dial.length);
  digits = digits.replace(/^0+/, '');
  return digits ? `+${dial} ${digits}` : '';
}

export function PhoneField({ required = true }: { required?: boolean }) {
  const t = useTranslations('lead');
  const locale = useLocale();
  const [iso, setIso] = useState(DEFAULT_BY_LOCALE[locale] ?? 'FR');
  const [national, setNational] = useState('');

  const names = useMemo(() => {
    let dn: Intl.DisplayNames | null = null;
    try {
      dn = new Intl.DisplayNames([locale], { type: 'region' });
    } catch {
      /* very old browser: fall back to ISO codes */
    }
    return Object.fromEntries(COUNTRIES.map((c) => [c.iso, dn?.of(c.iso) ?? c.iso]));
  }, [locale]);

  const country = COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];
  const value = toInternational(country.dial, national);

  return (
    <fieldset className="block min-w-0">
      <legend className="mb-1.5 block text-sm font-medium text-white">
        {t('phone')} <span aria-hidden className="text-accent">*</span>
      </legend>
      {/* Phone numbers read left-to-right even in Arabic. */}
      <div className="flex gap-2" dir="ltr">
        {/* The native select stays (keyboard, screen readers, mobile pickers)
            but is invisible: the box only shows "🇫🇷 +33", while the open
            list shows full country names. */}
        <label className="field relative flex w-[6.5rem] shrink-0 cursor-pointer items-center gap-1.5 pe-2 focus-within:border-accent">
          <span className="sr-only">{t('phoneCountry')}</span>
          <span aria-hidden className="text-base leading-none">{flag(country.iso)}</span>
          <span aria-hidden className="text-sm">+{country.dial}</span>
          <ChevronDown aria-hidden className="ms-auto h-4 w-4 text-muted" />
          <select
            value={iso}
            onChange={(e) => setIso(e.target.value)}
            autoComplete="tel-country-code"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            {COUNTRIES.map((c) => (
              <option key={c.iso} value={c.iso}>
                {flag(c.iso)} +{c.dial} {names[c.iso]}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 flex-1">
          <span className="sr-only">{t('phoneNumber')}</span>
          <input
            type="tel"
            inputMode="tel"
            required={required}
            minLength={6}
            maxLength={24}
            autoComplete="tel-national"
            value={national}
            onChange={(e) => setNational(e.target.value)}
            placeholder={iso === 'DZ' ? '5 51 23 45 67' : iso === 'FR' ? '6 12 34 56 78' : ''}
            className="field"
          />
        </label>
      </div>
      <input type="hidden" name="phone" value={value} />
      <p className="mt-1 text-xs text-muted">{t('phoneHint')}</p>
    </fieldset>
  );
}
