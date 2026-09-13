'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { whatsappLink } from '@/lib/site';

// Pages whose own bottom controls would sit under the floating button.
const HIDDEN_ON: string[] = [];

/** Floating WhatsApp shortcut, bottom corner of every public page. */
export function WhatsAppButton() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const href = whatsappLink(t('whatsappMessage'));
  if (!href || HIDDEN_ON.includes(pathname)) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsappLabel')}
      className="group fixed bottom-5 end-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/0.6)] transition-transform duration-300 hover:scale-105 sm:bottom-6 sm:end-6"
    >
      <span className="animate-pulse-ring absolute inset-0 rounded-full border-2 border-[#25D366]/60" aria-hidden />
      <svg viewBox="0 0 24 24" className="relative h-6 w-6 fill-current" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.41zm8.02-17.45A11.3 11.3 0 0 0 12.04.72C5.79.72.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.3 11.3 0 0 0 5.41 1.38h.01c6.25 0 11.34-5.08 11.34-11.33 0-3.03-1.18-5.88-3.32-8.02z" />
      </svg>
      <span className="relative hidden pe-1 text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
