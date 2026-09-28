'use client';

import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

/**
 * Link to the same page in the other language. A real <a> (crawlable) with
 * lang/hreflang so screen readers pronounce the label in its own language.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const next: Locale = locale === 'fr' ? 'ar' : 'fr';

  return (
    <Link
      href={pathname}
      locale={next}
      hrefLang={next}
      lang={next}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-white/30 hover:bg-white/5 ${className}`}
      aria-label={next === 'ar' ? 'التبديل إلى العربية' : 'Passer au français (FR)'}
    >
      <Languages className="h-4 w-4" aria-hidden />
      {next === 'ar' ? 'العربية' : 'FR'}
    </Link>
  );
}
