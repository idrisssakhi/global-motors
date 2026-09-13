import { SITE } from '@/lib/site';

/** TikTok brand glyph (lucide has no TikTok icon). */
export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}

interface SocialLink {
  name: string;
  href: string;
  Icon: typeof TikTokIcon;
}

/** Social profile pills (only configured networks are shown). */
export function SocialLinks({ className = '', label }: { className?: string; label?: string }) {
  const links: SocialLink[] = [];
  const tiktok: string = SITE.social.tiktok;
  if (tiktok) links.push({ name: 'TikTok', href: tiktok, Icon: TikTokIcon });

  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {label && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</span>}
      {links.map(({ name, href, Icon }) => {
        const handle = href.includes('@') ? `@${href.split('@')[1].replace(/\/$/, '')}` : name;
        return (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} ${handle}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-sm text-ink/85 transition-colors hover:border-accent/50 hover:text-accent"
          >
            <Icon className="h-4 w-4" />
            <span dir="ltr">{handle}</span>
          </a>
        );
      })}
    </div>
  );
}
