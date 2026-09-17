'use client';

import { useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

import { submitLead, type LeadSubmission } from '@/app/actions/lead';
import type { LeadKind } from '@/lib/types';

export function LeadForm({
  kind,
  carId,
  payload,
  title,
  defaultMessage,
  className = '',
}: {
  kind: LeadKind;
  carId?: string;
  payload?: LeadSubmission['payload'];
  title?: string;
  defaultMessage?: string;
  className?: string;
}) {
  const t = useTranslations('lead');
  const locale = useLocale() as 'fr' | 'ar';
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitLead({
        kind,
        carId,
        payload,
        locale,
        name: String(fd.get('name') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        email: String(fd.get('email') ?? ''),
        message: String(fd.get('message') ?? ''),
        website: String(fd.get('website') ?? ''),
      });
      if (res.ok) setDone(true);
      else setError(res.error === 'invalid' ? t('invalid') : t('error'));
    });
  }

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-10 text-center"
            role="status"
          >
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent">
              <span className="animate-pulse-ring absolute inset-0 rounded-full border border-accent/40" />
              <CheckCircle2 className="h-8 w-8" aria-hidden />
            </span>
            <p className="font-display mt-5 text-xl font-semibold text-white">{t('successTitle')}</p>
            <p className="mt-2 max-w-sm text-sm text-muted">{t('successText')}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {title && (
              <p className="font-display mb-2 text-lg font-semibold text-white">{title}</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">{t('name')}</span>
                <input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder={t('name')} className="field" />
              </label>
              <label className="block">
                <span className="sr-only">{t('phone')}</span>
                <input name="phone" type="tel" required maxLength={40} autoComplete="tel" placeholder={t('phone')} className="field" dir="ltr" />
              </label>
            </div>
            <label className="block">
              <span className="sr-only">{t('email')}</span>
              <input name="email" type="email" maxLength={200} autoComplete="email" placeholder={t('email')} className="field" dir="ltr" />
            </label>
            <label className="block">
              <span className="sr-only">{t('message')}</span>
              <textarea
                name="message"
                rows={3}
                maxLength={4000}
                defaultValue={defaultMessage}
                placeholder={t('messagePlaceholder')}
                className="field resize-none"
              />
            </label>
            {/* Honeypot */}
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            {error && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={pending} className="btn-primary w-full cursor-pointer disabled:opacity-60">
              {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden />}
              {pending ? t('sending') : t('submit')}
            </button>
            <p className="text-center text-[11px] text-muted/80">{t('consent')}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
