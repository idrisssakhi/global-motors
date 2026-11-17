import { getTranslations } from 'next-intl/server';
import { ArrowRight, MessageCircle } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { whatsappLink } from '@/lib/site';
import { SectionHeading } from '@/components/SectionHeading';
import { SpotlightCard } from '@/components/SpotlightCard';
import { FadeIn } from '@/components/FadeIn';

const MARKETS = [
  { key: 'Fr', flag: '🇫🇷', href: '/voitures', cta: 'marketFrCta' },
  { key: 'Eu', flag: '🇪🇺', href: '/contact', cta: 'marketEuCta' },
  { key: 'Dz', flag: '🇩🇿', href: '/simulateur-dedouanement', cta: 'marketDzCta' },
  { key: 'Tn', flag: '🇹🇳', href: null, cta: 'marketAskCta' },
  { key: 'Ma', flag: '🇲🇦', href: null, cta: 'marketAskCta' },
] as const;

/** France & Europe (direct sale), Algeria (core export), Tunisia & Morocco (on request). */
export async function Markets() {
  const t = await getTranslations('home');

  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeading eyebrow={t('marketsEyebrow')} title={t('marketsTitle')} subtitle={t('marketsSubtitle')} />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {MARKETS.map((m, i) => {
          const title = t(`market${m.key}Title`);
          const wa = m.href ? null : whatsappLink(t('marketAskMsg', { country: title }));
          return (
            <FadeIn key={m.key} delay={i * 0.05} className="h-full">
              <SpotlightCard className="flex h-full flex-col">
                <span className="text-4xl leading-none" aria-hidden>
                  {m.flag}
                </span>
                <h3 className="font-display mt-5 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t(`market${m.key}Desc`)}</p>
                {m.href ? (
                  <Link href={m.href} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                    {t(m.cta)}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  </Link>
                ) : (
                  <a
                    href={wa ?? '/contact'}
                    target={wa ? '_blank' : undefined}
                    rel={wa ? 'noopener noreferrer' : undefined}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    {t(m.cta)}
                    <span className="sr-only"> — {title}</span>
                  </a>
                )}
              </SpotlightCard>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
