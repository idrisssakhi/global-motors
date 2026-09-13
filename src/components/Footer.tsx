import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { SITE, MAPS_URL, whatsappLink } from '@/lib/site';
import { Logo } from './Logo';

export function Footer() {
  const t = useTranslations();
  const wa = whatsappLink();
  const year = 2026;

  const explore = [
    { href: '/voitures', label: t('nav.cars') },
    { href: '/a-propos', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];
  const services = [
    { href: '/simulateur-dedouanement', label: t('footer.serviceCustoms') },
    { href: '/contact', label: t('footer.serviceSearch') },
    { href: '/voitures', label: t('footer.serviceExport') },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/[0.06] bg-surface">
      <div
        className="pointer-events-none absolute -top-40 start-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl rtl:translate-x-1/2"
        aria-hidden
      />

      <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo height={44} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            {t('footer.tagline')}
          </p>
        </div>

        <FooterCol title={t('footer.explore')} links={explore} />
        <FooterCol title={t('footer.services')} links={services} />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {t('footer.contact')}
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {SITE.phone && (
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-2 text-ink/80 hover:text-accent">
                  <Phone className="h-4 w-4" aria-hidden /> <span dir="ltr">{SITE.phone}</span>
                </a>
              </li>
            )}
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-ink/80 hover:text-accent">
                  <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
                </a>
              </li>
            )}
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-ink/80 hover:text-accent">
                  <Mail className="h-4 w-4" aria-hidden /> {SITE.email}
                </a>
              </li>
            )}
            <li>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-ink/80 hover:text-accent">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  {SITE.address.street}
                  <br />
                  {SITE.address.postalCode} {SITE.address.city}, {SITE.address.country}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Oversized outlined wordmark */}
      <div className="container-x relative select-none" aria-hidden>
        <p
          className="font-display whitespace-nowrap text-center text-[13vw] font-extrabold leading-none tracking-tighter text-transparent lg:text-[10.5rem]"
          style={{ WebkitTextStroke: '1px rgb(255 255 255 / 0.07)' }}
          dir="ltr"
        >
          GLOBAL MOTORS
        </p>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-x space-y-3 py-6 text-xs text-muted">
          <p>
            {SITE.legal.name} · {SITE.legal.legalForm} · SIREN {SITE.legal.siren} · TVA{' '}
            {SITE.legal.vat} · {SITE.address.street}, {SITE.address.postalCode}{' '}
            {SITE.address.city}
          </p>
          <p className="text-muted/70">
            {t('footer.credits')} :{' '}
            {SITE.credits.map((c, i) => (
              <span key={c.href}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                  {c.label}
                </a>{' '}
                ({c.license}){i < SITE.credits.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
          <div className="flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-4 sm:flex-row">
            <p>
              © {year} {SITE.name}. {t('footer.rights')}{' '}
              <Link href="/mentions-legales" className="hover:text-accent">
                {t('footer.legal')}
              </Link>
            </p>
            <p>
              {t('footer.developedBy')}{' '}
              <span className="font-semibold text-ink/80">{SITE.developer.name}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-ink/80 transition-colors hover:text-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
