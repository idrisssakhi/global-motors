'use client';

import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

/** Toggles between FR and AR while keeping the current path. */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const next: Locale = locale === 'fr' ? 'ar' : 'fr';

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-white/30 hover:bg-white/5 ${className}`}
      aria-label={next === 'ar' ? 'التبديل إلى العربية' : 'Passer au français'}
    >
      <Languages className="h-4 w-4" aria-hidden />
      {next === 'ar' ? 'العربية' : 'FR'}
    </button>
  );
}
