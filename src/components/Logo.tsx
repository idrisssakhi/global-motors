import { SITE } from '@/lib/site';

/**
 * SKH Global Motors wordmark — inline SVG so it stays crisp, themable and
 * weightless. A gold hexagon monogram + stacked "GLOBAL MOTORS" lettering.
 */
export function Logo({
  height = 36,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={SITE.name}
      viewBox="0 0 212 48"
      height={height}
      style={{ width: 'auto', direction: 'ltr' }}
      className={className}
    >
      <defs>
        <linearGradient id="gm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e1b0" />
          <stop offset="0.5" stopColor="#d9a94e" />
          <stop offset="1" stopColor="#a8772a" />
        </linearGradient>
      </defs>
      <path
        d="M24 2 43 13v22L24 46 5 35V13z"
        fill="none"
        stroke="url(#gm-gold)"
        strokeWidth="2.2"
      />
      <path d="M24 9.5 36.5 16.7v14.6L24 38.5 11.5 31.3V16.7z" fill="url(#gm-gold)" opacity="0.12" />
      <text
        x="24"
        y="29.5"
        textAnchor="middle"
        fontFamily="var(--font-sora), system-ui, sans-serif"
        fontWeight="800"
        fontSize="13"
        letterSpacing="0.5"
        fill="url(#gm-gold)"
      >
        SKH
      </text>
      <text
        x="56"
        y="22"
        fontFamily="var(--font-sora), system-ui, sans-serif"
        fontWeight="700"
        fontSize="16.5"
        letterSpacing="3.2"
        fill="#ffffff"
      >
        GLOBAL
      </text>
      <text
        x="56"
        y="40"
        fontFamily="var(--font-sora), system-ui, sans-serif"
        fontWeight="300"
        fontSize="12.5"
        letterSpacing="6.1"
        fill="#d9a94e"
      >
        MOTORS
      </text>
    </svg>
  );
}
