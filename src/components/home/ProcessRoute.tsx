'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Search, ShieldCheck, Ship, KeyRound } from 'lucide-react';

const ROUTE = 'M232 64 C 262 128, 300 186, 276 252 S 168 356, 190 446';
const NODES = [
  { x: 232, y: 64, key: 'routeFrom' },
  { x: 276, y: 252, key: 'routePort' },
  { x: 190, y: 446, key: 'routeTo' },
] as const;

const ICONS = [Search, ShieldCheck, Ship, KeyRound];

/** Four export steps + a schematic France → Algeria route drawn on scroll. */
export function ProcessRoute() {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] });
  const draw = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);
  const shipDistance = useTransform(draw, (v) => `${v * 100}%`);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(3, Math.max(0, Math.floor(v * 4.2))));
  });

  const steps = [1, 2, 3, 4].map((i) => ({
    title: t(`step${i}Title` as 'step1Title'),
    desc: t(`step${i}Desc` as 'step1Desc'),
  }));

  return (
    <section ref={ref} className="container-x py-24 sm:py-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <span className="eyebrow">{t('processEyebrow')}</span>
          <h2 className="font-display mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t('processTitle')}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted">{t('processSubtitle')}</p>

          <ol className="relative mt-12 space-y-3">
            {steps.map((s, i) => {
              const Icon = ICONS[i];
              const on = reduce || i <= active;
              return (
                <li
                  key={s.title}
                  className={`relative flex gap-5 rounded-2xl border p-5 transition-all duration-500 sm:p-6 ${
                    i === active && !reduce
                      ? 'border-accent/30 bg-accent/[0.06]'
                      : 'border-white/[0.06] bg-white/[0.015]'
                  }`}
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition-colors duration-500 ${
                      on ? 'border-accent/40 bg-accent/15 text-accent' : 'border-white/10 text-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted">0{i + 1}</p>
                    <h3 className="font-display mt-1 text-lg font-semibold text-white">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass relative overflow-hidden rounded-3xl p-6">
            <svg viewBox="0 0 420 500" className="h-auto w-full" style={{ direction: 'ltr' }} role="img" aria-label={`${t('routeFrom')} → ${t('routePort')} → ${t('routeTo')}`}>
              <defs>
                <linearGradient id="route-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f1d49a" />
                  <stop offset="1" stopColor="#c4923a" />
                </linearGradient>
                <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1.2" fill="rgb(255 255 255 / 0.09)" />
                </pattern>
              </defs>

              {/* Land masses (schematic) */}
              <path d="M120 20 L330 10 L380 120 L350 210 L300 268 L220 280 L150 250 L90 170 L70 80 Z" fill="url(#dots)" />
              <path d="M40 420 L400 400 L420 500 L20 500 Z" fill="url(#dots)" />
              {/* Mediterranean */}
              {[310, 335, 360, 385].map((y, i) => (
                <path
                  key={y}
                  d={`M${30 + i * 10} ${y} q 25 -8 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0`}
                  fill="none"
                  stroke="rgb(120 170 200 / 0.14)"
                  strokeWidth="1.2"
                />
              ))}
              <text x="330" y="352" fill="rgb(150 158 172 / 0.55)" fontSize="10" letterSpacing="3" textAnchor="middle">
                MÉDITERRANÉE
              </text>

              <path d={ROUTE} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="2" strokeDasharray="4 6" />
              <motion.path
                d={ROUTE}
                fill="none"
                stroke="url(#route-gold)"
                strokeWidth="2.6"
                strokeLinecap="round"
                style={{ pathLength: reduce ? 1 : draw }}
              />

              {!reduce && (
                <motion.g style={{ offsetPath: `path('${ROUTE}')`, offsetDistance: shipDistance, offsetRotate: '0deg' }}>
                  <circle r="9" fill="#07080b" stroke="#d9a94e" strokeWidth="2" />
                  <circle r="3" fill="#f1d49a" />
                </motion.g>
              )}

              {NODES.map((n, i) => (
                <g key={n.key}>
                  <circle cx={n.x} cy={n.y} r="14" fill="rgb(217 169 78 / 0.12)" />
                  <circle cx={n.x} cy={n.y} r="5" fill="#d9a94e" />
                  <text
                    x={n.x + (i === 2 ? -22 : 22)}
                    y={n.y + 5}
                    fill="#ffffff"
                    fontSize="15"
                    fontWeight="600"
                    textAnchor={i === 2 ? 'end' : 'start'}
                  >
                    {t(n.key)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
