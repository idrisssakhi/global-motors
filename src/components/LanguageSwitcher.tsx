'use client';

import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const LABEL: Record<Locale, { short: string; aria: string }> = {
  fr: { short: 'FR', aria: 'Passer au français' },
  ar: { short: 'العربية', aria: 'التبديل إلى العربية' },
  en: { short: 'EN', aria: 'Switch to English' },
};

/**
 * Links to the same page in the other languages. Real <a> (crawlable) with
 * lang/hreflang so screen readers pronounce each label in its own language.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const others = routing.locales.filter((l) => l !== locale);

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-white/15 px-1.5 py-1 text-sm font-medium text-ink ${className}`}
    >
      <Languages className="ms-1 h-4 w-4 shrink-0" aria-hidden />
      {others.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          hrefLang={l}
          lang={l}
          aria-label={LABEL[l].aria}
          className="cursor-pointer rounded-full px-2 py-0.5 transition-colors hover:bg-white/10 hover:text-accent"
        >
          {LABEL[l].short}
        </Link>
      ))}
    </div>
  );
}
