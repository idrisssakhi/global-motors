import { useTranslations } from 'next-intl';
import { ArrowRight, Calculator } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { HeroAnimation } from './HeroAnimation';

/**
 * Full-screen hero. Server component: the headline paints immediately (CSS
 * entrance) and the car scene is pure SVG/CSS — no WebGL, no JS bundle.
 */
export function Hero() {
  const t = useTranslations('home');

  const stats = [1, 2, 3, 4].map((i) => ({
    value: t(`stat${i}Value` as 'stat1Value'),
    label: t(`stat${i}Label` as 'stat1Label'),
  }));

  return (
    <section className="grain relative isolate overflow-hidden">
      <div className="absolute -top-48 start-[-10%] -z-10 h-[40rem] w-[40rem] rounded-full bg-accent/[0.08] blur-3xl" aria-hidden />
      <div className="bg-grid absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_65%)]" aria-hidden />

      <div className="container-x flex min-h-[100svh] flex-col pb-8 pt-28 lg:pt-40">
        <div className="relative z-10 max-w-2xl">
          <span className="eyebrow animate-fade-up">{t('heroEyebrow')}</span>

          <h1 className="font-display mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl xl:text-7xl">
            <span className="animate-fade-up block" style={{ animationDelay: '0.08s' }}>
              {t('heroTitleA')}
            </span>
            <span className="text-brand animate-fade-up block pb-2" style={{ animationDelay: '0.18s' }}>
              {t('heroTitleB')}
            </span>
          </h1>

          <p className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg" style={{ animationDelay: '0.28s' }}>
            {t('heroSubtitle')}
          </p>

          <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '0.36s' }}>
            <Link href="/voitures" className="btn-primary">
              {t('heroPrimary')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
            <Link href="/simulateur-dedouanement" className="btn-ghost">
              <Calculator className="h-4 w-4" aria-hidden />
              {t('heroSecondary')}
            </Link>
          </div>
        </div>

        <HeroAnimation
          className="animate-fade relative -mx-5 mt-6 h-[40svh] min-h-[260px] lg:absolute lg:inset-y-0 lg:end-0 lg:start-[44%] lg:mx-0 lg:mt-0 lg:h-auto"
          labels={{
            sim: t('heroHudSim'),
            simValue: t('heroHudSimValue'),
            export: t('heroHudExport'),
            route: t('heroHudRoute'),
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-canvas to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-canvas via-canvas/60 to-transparent" aria-hidden />

        <dl
          className="glass animate-fade-up relative z-10 mt-auto grid grid-cols-2 divide-white/[0.06] overflow-hidden rounded-2xl lg:grid-cols-4 lg:divide-x rtl:lg:divide-x-reverse"
          style={{ animationDelay: '0.6s' }}
        >
          {stats.map((s) => (
            <div key={s.label} className="px-5 py-5 sm:px-7">
              <dt className="font-display text-2xl font-semibold text-white sm:text-3xl">{s.value}</dt>
              <dd className="mt-1 text-xs leading-snug text-muted sm:text-sm">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
