import { Gauge, Ship } from 'lucide-react';

/**
 * Lightweight, CSS/SVG-only hero scene (no WebGL): a car drawn in gold
 * line-art drives along a road while the Paris → Marseille → Alger skyline
 * scrolls behind it. Everything is transform/opacity animation, so it runs
 * on the compositor and stops for prefers-reduced-motion (globals.css).
 * The scene mirrors in RTL so the car drives in the reading direction.
 */

// Compact five-door hatchback profile: short roof, steep tailgate, long windscreen.
const BODY =
  'M40 160 L40 126 Q42 110 60 104 L112 66 Q122 58 140 57 L284 55 Q310 55 330 68 L430 106 Q520 112 556 122 Q574 128 574 146 L572 160 L520 160 A48 48 0 0 0 424 160 L188 160 A48 48 0 0 0 92 160 Z';
const GLASS = 'M124 102 L150 72 Q156 66 168 66 L282 64 Q304 64 320 74 L400 104 Z';

export function HeroAnimation({
  className,
  labels,
}: {
  className?: string;
  labels: { sim: string; simValue: string; export: string; route: string };
}) {
  return (
    <div className={className} aria-hidden>
      <div className="hero-anim absolute inset-0 overflow-hidden">
        {/* Scene (mirrored in RTL) */}
        <div className="absolute inset-x-0 top-1/2 aspect-[16/10] -translate-y-1/2 rtl:-scale-x-100">
          {/* Warm horizon glow */}
          <div className="absolute inset-x-[10%] bottom-[30%] h-[40%] rounded-full bg-accent/10 blur-3xl" />

          {/* Skyline: Paris → Marseille → Alger, looping */}
          <div className="absolute inset-x-0 bottom-[36%] h-[26%] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)]">
            <div className="gm-skyline flex h-full w-[200%]">
              <Skyline />
              <Skyline />
            </div>
          </div>

          {/* Road */}
          <div className="absolute inset-x-0 bottom-[8%] h-[28%] [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="absolute inset-0 bg-linear-to-b from-white/[0.05] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
            <div className="gm-road-dashes absolute inset-x-0 top-[46%] h-[3px]" />
            <div className="absolute inset-x-0 bottom-[18%] h-px bg-white/[0.06]" />
          </div>

          {/* Speed streaks */}
          {[
            ['top-[38%]', '0s', 'w-[22%]'],
            ['top-[50%]', '0.45s', 'w-[30%]'],
            ['top-[30%]', '0.9s', 'w-[16%]'],
            ['top-[58%]', '0.25s', 'w-[26%]'],
          ].map(([top, delay, width]) => (
            <span
              key={top}
              className={`gm-streak absolute start-0 h-px ${top} ${width} bg-linear-to-r from-transparent via-accent-soft/60 to-transparent`}
              style={{ animationDelay: delay }}
            />
          ))}

          {/* Car */}
          <div className="absolute bottom-[19%] left-[11%] w-[78%]">
            <div className="gm-bob">
              <CarSvg />
            </div>
          </div>
        </div>

        {/* HUD chips (not mirrored, so text stays readable) */}
        <div className="glass gm-float absolute end-[6%] top-[14%] hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
            <Ship className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{labels.export}</p>
            <p className="font-display text-sm font-semibold text-white">{labels.route}</p>
            <div className="relative mt-1.5 h-px w-28 bg-white/15">
              <span className="gm-route-dot absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_10px_rgb(217_169_78)]" />
            </div>
          </div>
        </div>

        <div
          className="glass gm-float absolute bottom-[23%] start-[4%] hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex"
          style={{ animationDelay: '1.5s' }}
        >
          <svg viewBox="0 0 100 60" className="h-10 w-16" style={{ direction: 'ltr' }}>
            <path d="M12 54 A38 38 0 0 1 88 54" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="6" strokeLinecap="round" />
            <path
              d="M12 54 A38 38 0 0 1 88 54"
              fill="none"
              stroke="#d9a94e"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.72 1"
            />
            <line
              className="gm-needle"
              x1="50"
              y1="54"
              x2="50"
              y2="22"
              stroke="#f6e1b0"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transformOrigin: '50px 54px', transformBox: 'view-box' }}
            />
            <circle cx="50" cy="54" r="5" fill="#d9a94e" />
          </svg>
          <div>
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted">
              <Gauge className="h-3 w-3" /> {labels.sim}
            </p>
            <p className="font-display text-sm font-semibold text-white">{labels.simValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarSvg() {
  return (
    <svg viewBox="0 0 600 210" className="h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="hc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c313c" />
          <stop offset="0.55" stopColor="#12151c" />
          <stop offset="1" stopColor="#07080b" />
        </linearGradient>
        <linearGradient id="hc-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#223246" />
          <stop offset="1" stopColor="#070b12" />
        </linearGradient>
        <linearGradient id="hc-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a8772a" />
          <stop offset="0.5" stopColor="#f1d49a" />
          <stop offset="1" stopColor="#d9a94e" />
        </linearGradient>
        <linearGradient id="hc-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6e1b0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f6e1b0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hc-rim">
          <stop offset="0" stopColor="#434957" />
          <stop offset="1" stopColor="#15181f" />
        </radialGradient>
        <filter id="hc-glow" x="-10%" y="-20%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="306" cy="199" rx="280" ry="9" fill="#000" opacity="0.65" />
      <path className="gm-beam" d="M566 128 L820 90 L820 180 Z" fill="url(#hc-beam)" />

      {/* Body + glass: stroke draws in, then the fill fades up */}
      <path
        className="gm-draw gm-fill"
        pathLength={1}
        d={BODY}
        fill="url(#hc-body)"
        stroke="url(#hc-gold)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        filter="url(#hc-glow)"
      />
      <path
        className="gm-draw gm-fill"
        pathLength={1}
        d={GLASS}
        fill="url(#hc-glass)"
        stroke="url(#hc-gold)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        style={{ animationDelay: '0.5s, 1.9s' }}
      />
      <path className="gm-fill" d="M182 70 L216 69 L180 102 L148 102 Z" fill="#fff" opacity="0.07" />

      {/* Panel lines & details */}
      <g
        className="gm-draw"
        fill="none"
        stroke="#d9a94e"
        strokeOpacity="0.55"
        strokeWidth="1.3"
        strokeLinecap="round"
        style={{ animationDelay: '0.9s' }}
      >
        <path pathLength={1} d="M250 65 L250 104 L252 156" />
        <path pathLength={1} d="M402 104 L406 150" />
        <path pathLength={1} d="M62 122 Q300 114 556 128" />
        <path pathLength={1} d="M212 120 h18 M350 120 h18" />
      </g>
      <path d="M398 100 L414 94 L418 106 L404 108 Z" fill="#12151c" stroke="#d9a94e" strokeWidth="1" className="gm-fill" />

      {/* Lights */}
      <path className="gm-light" d="M540 118 L568 126 L562 136 L534 128 Z" fill="#f6e1b0" filter="url(#hc-glow)" />
      <path d="M42 118 L60 110 L62 124 L42 130 Z" fill="#c0392b" opacity="0.9" />

      <Wheel cx={140} />
      <Wheel cx={472} />
    </svg>
  );
}

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy={160} r={36} fill="#08090c" stroke="#2a2f3a" strokeWidth="2" />
      <g className="gm-spin" style={{ transformOrigin: `${cx}px 160px`, transformBox: 'view-box' }}>
        <circle cx={cx} cy={160} r={24} fill="url(#hc-rim)" stroke="url(#hc-gold)" strokeWidth="1.5" />
        {[0, 72, 144, 216, 288].map((a) => (
          <line
            key={a}
            x1={cx}
            y1={160}
            x2={cx}
            y2={139}
            stroke="#d9a94e"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
            transform={`rotate(${a} ${cx} 160)`}
          />
        ))}
        <circle cx={cx} cy={160} r={5} fill="#f1d49a" />
      </g>
    </g>
  );
}

/** Abstract skyline strip: Paris (Eiffel Tower) · Marseille port · Alger (Maqam Echahid). */
function Skyline() {
  return (
    <svg viewBox="0 0 800 120" preserveAspectRatio="none" className="h-full w-1/2">
      <g fill="none" stroke="rgb(217 169 78 / 0.32)" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M0 119.5 H800" />
        {/* Paris */}
        <path d="M10 120 V88 H34 V120 M40 120 V70 H62 V120 M66 120 V96 H90 V120" />
        <path d="M112 120 L126 66 L131 18 L136 66 L150 120 M119 92 H143 M123 72 H139" />
        <path d="M170 120 V80 H196 V120 M200 120 V92 H230 V120 M236 120 V74 H252 V120" />
        <path d="M268 120 V96 Q283 76 298 96 V120" />
        {/* Marseille port */}
        <path d="M336 120 V40 H392 M336 52 L378 40 M388 40 V62" />
        <path d="M418 110 H520 L508 120 H430 Z M448 110 V96 H490 V110" />
        <path d="M530 116 q10 -4 20 0 t20 0 t20 0" />
        {/* Alger */}
        <path d="M612 120 Q622 62 634 16 Q646 62 656 120 M634 16 V120 M618 94 H650" />
        <path d="M680 120 V100 H700 V92 H720 V104 H740 V86 H760 V120 M770 120 V96 H796 V120" />
      </g>
    </svg>
  );
}
