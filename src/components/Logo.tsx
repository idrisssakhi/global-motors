import { SITE } from '@/lib/site';
import { BRAND_RED, LOGO, type LogoVariant } from './logoPaths';

/**
 * SKH Global Motors logo — inline SVG traced from the official artwork so it
 * stays crisp at any size. The globe/ribbon/lettering that is black in print
 * switches to white on the dark site (`tone="dark"`, the default).
 */
export function Logo({
  variant = 'horizontal',
  tone = 'dark',
  height = 36,
  className,
}: {
  variant?: LogoVariant;
  /** Background the logo sits on. */
  tone?: 'dark' | 'light';
  height?: number;
  className?: string;
}) {
  const art = LOGO[variant];
  return (
    <svg
      role="img"
      aria-label={SITE.name}
      viewBox={art.viewBox}
      height={height}
      style={{ width: 'auto', direction: 'ltr' }}
      className={className}
    >
      <path fillRule="evenodd" fill={BRAND_RED} d={art.red} />
      <path fillRule="evenodd" fill={tone === 'dark' ? '#ffffff' : '#000000'} d={art.dark} />
    </svg>
  );
}
