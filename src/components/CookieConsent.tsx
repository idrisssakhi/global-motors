'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie, X } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { SITE } from '@/lib/site';
import { hasConsentChoice, onConsentDialogOpen, openConsentDialog, saveConsent, useConsent } from '@/lib/consent';

/**
 * Cookie preferences dialog. Opened from the footer link, from embed
 * placeholders and — when SITE.cookieBannerOnFirstVisit is on — automatically
 * until the visitor has chosen. "Refuse" and "Accept" carry equal weight
 * (CNIL: refusing must be as easy as accepting).
 */
export function CookieConsent() {
  const t = useTranslations('consent');
  const consent = useConsent();
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => onConsentDialogOpen(() => setOpen(true)), []);

  useEffect(() => {
    if (!SITE.cookieBannerOnFirstVisit) return;
    // Deferred: consent is read from storage, which only exists after hydration.
    const id = window.setTimeout(() => {
      if (!hasConsentChoice()) setOpen(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  function choose(external: boolean) {
    saveConsent(external);
    setOpen(false);
  }

  return (
    <dialog
      ref={ref}
      onClose={() => setOpen(false)}
      aria-labelledby="consent-title"
      data-lenis-prevent
      className="m-auto w-[min(34rem,calc(100%-2rem))] rounded-3xl border border-white/10 bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 id="consent-title" className="font-display flex items-center gap-2 text-xl font-semibold text-white">
            <Cookie className="h-5 w-5 text-accent" aria-hidden />
            {t('title')}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('close')}
            className="-m-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full text-muted hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t('intro')}</p>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="rounded-2xl border border-white/[0.08] bg-surface-2 p-4">
            <dt className="flex items-center justify-between gap-3 font-semibold text-white">
              {t('necessary')}
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-ink">{t('alwaysOn')}</span>
            </dt>
            <dd className="mt-1 text-muted">{t('necessaryDesc')}</dd>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-surface-2 p-4">
            <dt className="flex items-center justify-between gap-3 font-semibold text-white">
              {t('external')}
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-ink">
                {consent ? (consent.external ? t('allowed') : t('blocked')) : t('undecided')}
              </span>
            </dt>
            <dd className="mt-1 text-muted">{t('externalDesc')}</dd>
          </div>
        </dl>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => choose(false)} className="btn-ghost cursor-pointer !py-3">
            {t('rejectAll')}
          </button>
          <button type="button" onClick={() => choose(true)} className="btn-ghost cursor-pointer !py-3">
            {t('acceptAll')}
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          <Link href="/cookies" onClick={() => setOpen(false)} className="underline underline-offset-2 hover:text-accent">
            {t('policy')}
          </Link>
        </p>
      </div>
    </dialog>
  );
}

/** Footer link that reopens the preferences (lets visitors withdraw consent). */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  const t = useTranslations('consent');
  return (
    <button type="button" onClick={openConsentDialog} className={`cursor-pointer ${className}`}>
      {t('manage')}
    </button>
  );
}
