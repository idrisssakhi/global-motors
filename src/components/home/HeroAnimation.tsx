import { Gauge, Ship } from 'lucide-react';
import { GOLF } from './golfPaths';

/**
 * Lightweight, CSS/SVG-only hero scene (no WebGL): a Volkswagen Golf VIII,
 * traced from a real photo, is drawn in brand-red line-art and drives along a road
 * while the Paris → Marseille → Alger skyline scrolls behind it. Everything is
 * transform/opacity animation and stops for prefers-reduced-motion
 * (globals.css). The scene mirrors in RTL so the car drives in reading order.
 */

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
        {/* Scene (mirrored in RTL). Physical left/right on purpose. */}
        <div className="absolute inset-x-0 top-1/2 aspect-[16/10] -translate-y-1/2 rtl:-scale-x-100">
          {/* Warm horizon glow */}
          <div className="absolute inset-x-[10%] bottom-[28%] h-[42%] rounded-full bg-accent/10 blur-3xl" />

          {/* Skyline: Paris → Marseille → Alger, looping */}
          <div className="absolute inset-x-0 bottom-[38%] h-[26%] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)]">
            <div className="gm-skyline flex h-full w-[200%]">
              <Skyline />
              <Skyline />
            </div>
          </div>

          {/* Road */}
          <div className="absolute inset-x-0 bottom-[6%] h-[30%] [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="absolute inset-0 bg-linear-to-b from-white/[0.05] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
            <div className="gm-road-dashes absolute inset-x-0 top-[50%] h-[3px]" />
            <div className="absolute inset-x-0 bottom-[16%] h-px bg-white/[0.06]" />
          </div>

          {/* Speed streaks */}
          {[
            ['top-[34%]', '0s', 'w-[22%]'],
            ['top-[46%]', '0.45s', 'w-[30%]'],
            ['top-[26%]', '0.9s', 'w-[16%]'],
            ['top-[56%]', '0.25s', 'w-[26%]'],
          ].map(([top, delay, width]) => (
            <span
              key={top}
              className={`gm-streak absolute left-0 h-px ${top} ${width} bg-linear-to-r from-transparent via-accent-soft/60 to-transparent`}
              style={{ animationDelay: delay }}
            />
          ))}

          {/* Car */}
          <div className="absolute bottom-[15%] left-[7%] w-[86%]">
            <div className="gm-bob">
              <CarSvg />
            </div>
          </div>
        </div>

        {/* HUD chips, stacked in the top corner (not mirrored, so text stays readable) */}
        <div className="absolute end-[6%] top-[12%] hidden flex-col items-stretch gap-3 sm:flex">
          <div className="glass gm-float flex items-center gap-3 rounded-2xl px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
              <Ship className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{labels.export}</p>
              <p className="font-display text-sm font-semibold text-white">{labels.route}</p>
              <div className="relative mt-1.5 h-px w-28 bg-white/15">
                <span className="gm-route-dot absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_10px_rgb(239_70_80)]" />
              </div>
            </div>
          </div>

          <div
            className="glass gm-float flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ animationDelay: '1.5s' }}
          >
            <svg viewBox="0 0 100 60" className="h-10 w-16" style={{ direction: 'ltr' }}>
              <path d="M12 54 A38 38 0 0 1 88 54" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="6" strokeLinecap="round" />
              <path
                d="M12 54 A38 38 0 0 1 88 54"
                fill="none"
                stroke="#d4101b"
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
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ transformOrigin: '50px 54px', transformBox: 'view-box' }}
              />
              <circle cx="50" cy="54" r="5" fill="#d4101b" />
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
    </div>
  );
}

function CarSvg() {
  return (
    <svg viewBox="0 -6 1000 404" className="h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="hc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a404d" />
          <stop offset="0.42" stopColor="#171a22" />
          <stop offset="1" stopColor="#07080b" />
        </linearGradient>
        <linearGradient id="hc-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2e4057" />
          <stop offset="0.55" stopColor="#0e1520" />
          <stop offset="1" stopColor="#070b12" />
        </linearGradient>
        <linearGradient id="hc-red" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f0a12" />
          <stop offset="0.5" stopColor="#ff5a63" />
          <stop offset="1" stopColor="#d4101b" />
        </linearGradient>
        <linearGradient id="hc-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hc-rim">
          <stop offset="0" stopColor="#4a505e" />
          <stop offset="1" stopColor="#15181f" />
        </radialGradient>
        <filter id="hc-glow" x="-10%" y="-20%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Body stops at the sill: no traced ground fringe under the tyres. */}
        <clipPath id="hc-sill">
          <rect x="-60" y="-60" width="1120" height={GOLF.sillY + 60} />
        </clipPath>
      </defs>

      <ellipse cx="500" cy="376" rx="470" ry="13" fill="#000" opacity="0.7" />
      <path className="gm-beam" d={GOLF.beam} fill="url(#hc-beam)" />

      {/* Body + glass: stroke draws in, then the fill fades up */}
      <g clipPath="url(#hc-sill)">
        <path
          className="gm-draw gm-fill"
          pathLength={1}
          d={GOLF.body}
          fill="url(#hc-body)"
          stroke="url(#hc-red)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          filter="url(#hc-glow)"
        />
      </g>
      <path className="gm-draw" pathLength={1} d={GOLF.bottom} stroke="url(#hc-red)" strokeWidth="2.6" strokeLinecap="round" filter="url(#hc-glow)" />

      {GOLF.windows.map((d) => (
        <path
          key={d.slice(0, 16)}
          className="gm-draw gm-fill"
          pathLength={1}
          d={d}
          fill="url(#hc-glass)"
          stroke="url(#hc-red)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          style={{ animationDelay: '0.5s, 1.9s' }}
        />
      ))}
      <path className="gm-fill" d={GOLF.pillar} fill="#0a0c11" />

      {/* Roof line, panel lines, arches */}
      <g
        className="gm-draw"
        fill="none"
        stroke="#bdbcbc"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animationDelay: '0.9s' }}
      >
        <path pathLength={1} d={GOLF.roof} strokeOpacity="0.4" />
        {GOLF.lines.map((d) => (
          <path key={d.slice(0, 16)} pathLength={1} d={d} />
        ))}
      </g>

      {/* Golf VIII creases catch the light */}
      <g
        className="gm-draw"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="1.1"
        strokeLinecap="round"
        style={{ animationDelay: '1.2s' }}
      >
        {GOLF.creases.map((d) => (
          <path key={d.slice(0, 16)} pathLength={1} d={d} />
        ))}
      </g>
      <g className="gm-fill" fill="none" stroke="#bdbcbc" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round">
        {GOLF.details.map((d) => (
          <path key={d.slice(0, 16)} d={d} />
        ))}
      </g>

      {GOLF.handles.map((d) => (
        <path key={d.slice(0, 16)} className="gm-fill" d={d} fill="#1d212b" stroke="#bdbcbc" strokeOpacity="0.8" strokeWidth="1" />
      ))}
      <path className="gm-fill" d={GOLF.mirror} fill="#141821" stroke="#bdbcbc" strokeWidth="1.2" />

      {/* Lights */}
      <path className="gm-light" d={GOLF.headlight} fill="#ffffff" filter="url(#hc-glow)" />
      <path d={GOLF.taillight} fill="#d4101b" opacity="0.92" />

      {GOLF.wheels.map((w) => (
        <Wheel key={w.cx} cx={w.cx} cy={w.cy} r={w.r} rim={w.rim} />
      ))}
    </svg>
  );
}

/** Tyre in a dark arch gap + Golf-style twisted twin-spoke alloy that spins while driving. */
function Wheel({ cx, cy, r, rim }: { cx: number; cy: number; r: number; rim: number }) {
  return (
    <g>
      {/* Arch gap: cuts the body outline cleanly around the tyre */}
      <circle cx={cx} cy={cy} r={r + 6} fill="#07080b" />
      <circle cx={cx} cy={cy} r={r} fill="#0a0b0f" stroke="#2c313c" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r - 8} fill="none" stroke="#1c2029" strokeWidth="1.5" />
      <g className="gm-spin" style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' }}>
        <circle cx={cx} cy={cy} r={rim} fill="url(#hc-rim)" stroke="url(#hc-red)" strokeWidth="1.8" />
        {[0, 72, 144, 216, 288].map((a) => (
          <path
            key={a}
            transform={`rotate(${a} ${cx} ${cy})`}
            d={`M${cx - 4} ${cy - 10} Q${cx + 8} ${cy - rim * 0.55} ${cx + 2} ${cy - rim + 3} M${cx + 4} ${cy - 10} Q${cx + 18} ${cy - rim * 0.52} ${cx + 13} ${cy - rim + 4}`}
            fill="none"
            stroke="#d7d7d7"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
        ))}
        <circle cx={cx} cy={cy} r={rim - 3} fill="none" stroke="#bdbcbc" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={11} fill="#1a1e27" stroke="#d4101b" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={4} fill="#ef4650" />
      </g>
    </g>
  );
}

/** Abstract skyline strip: Paris (Eiffel Tower) · Marseille port · Alger (Maqam Echahid). */
function Skyline() {
  return (
    <svg viewBox="0 0 800 120" preserveAspectRatio="none" className="h-full w-1/2">
      <g fill="none" stroke="rgb(189 188 188 / 0.28)" strokeWidth="1.3" strokeLinejoin="round">
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
