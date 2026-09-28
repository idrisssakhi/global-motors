'use client';

import type { IframeHTMLAttributes, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { SITE } from '@/lib/site';
import { saveConsent, useConsent } from '@/lib/consent';

/**
 * Third-party iframe (map, video) that is only loaded once the visitor has
 * allowed external content. Until then no request reaches the provider:
 * a placeholder explains why and offers to load it (CNIL "click to load").
 */
export function ConsentEmbed({
  provider,
  kind,
  className = '',
  overlay,
  ...iframe
}: {
  provider: string;
  kind: 'map' | 'video';
  className?: string;
  /** Rendered on top of the loaded iframe (e.g. a "directions" button). */
  overlay?: ReactNode;
} & IframeHTMLAttributes<HTMLIFrameElement> & { src: string; title: string }) {
  const t = useTranslations('consent');
  const consent = useConsent();

  if (consent?.external) {
    return (
      <>
        <iframe {...iframe} className={className} />
        {overlay}
      </>
    );
  }

  return (
    <div className={`${className} grid place-items-center bg-surface-2 p-6 text-center`}>
      <div className="max-w-sm">
        <ShieldCheck className="mx-auto h-7 w-7 text-accent" aria-hidden />
        <p className="mt-3 text-sm font-semibold text-white">
          {t(kind === 'map' ? 'embedMap' : 'embedVideo', { provider })}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{t('embedText')}</p>
        <button type="button" onClick={() => saveConsent(true)} className="btn-primary mt-4 cursor-pointer !px-5 !py-2.5 text-sm">
          {t('embedLoad')}
        </button>
        <p className="mt-3 text-xs text-muted">
          {t('embedRemember', { months: SITE.consentMaxAgeMonths })}{' '}
          <Link href="/cookies" className="underline underline-offset-2 hover:text-accent">
            {t('learnMore')}
          </Link>
        </p>
      </div>
    </div>
  );
}
