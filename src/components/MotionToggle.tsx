'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Pause, Play } from 'lucide-react';
import { restoreMotionPreference, setMotionPaused, useMotionPaused } from '@/lib/motion';

/** Pauses the looping animations and background videos site-wide (WCAG 2.2.2). */
export function MotionToggle({ className = '', withLabel = false }: { className?: string; withLabel?: boolean }) {
  const t = useTranslations('nav');
  const paused = useMotionPaused();

  useEffect(() => restoreMotionPreference(), []);

  const label = paused ? t('playMotion') : t('pauseMotion');
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-pressed={paused}
      aria-label={t('pauseMotion')}
      title={label}
      className={`inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 text-ink transition-colors hover:border-white/30 hover:bg-white/5 ${withLabel ? 'px-3.5 text-xs' : 'w-9'} ${className}`}
    >
      {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
      {/* Same text as the accessible name (WCAG 2.5.3); aria-pressed gives the state. */}
      {withLabel && <span aria-hidden>{t('pauseMotion')}</span>}
    </button>
  );
}
