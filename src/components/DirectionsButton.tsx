'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ExternalLink, Navigation } from 'lucide-react';

import { DIRECTIONS } from '@/lib/site';

const APPS = [
  { key: 'waze', href: DIRECTIONS.waze, color: '#33ccff' },
  { key: 'google', href: DIRECTIONS.google, color: '#34a853' },
  { key: 'apple', href: DIRECTIONS.apple, color: '#a1a1aa' },
] as const;

/**
 * "Take me to the showroom" button: lets the visitor pick the navigation app
 * (Waze, Google Maps or Apple Plans). Each choice is a plain link, so it opens
 * the installed app on mobile and the web version on desktop.
 */
export function DirectionsButton({ className = '' }: { className?: string }) {
  const t = useTranslations('contact');
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={root} className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        className="btn-primary w-full cursor-pointer"
      >
        <Navigation className="h-4 w-4" aria-hidden />
        {t('guideMe')}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <div id={menuId} className="mt-3 rounded-2xl border border-white/[0.07] bg-surface p-2">
          <p className="px-3 pt-1 pb-2 text-xs uppercase tracking-wider text-muted">{t('openWith')}</p>
          <ul className="grid gap-1 sm:grid-cols-3">
            {APPS.map((app) => (
              <li key={app.key}>
                <a
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium text-white transition-colors hover:bg-white/[0.06]"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: app.color }} aria-hidden />
                  <span className="flex-1">{t(`apps.${app.key}`)}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
