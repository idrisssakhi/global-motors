'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Calculator, Phone } from 'lucide-react';

import { Link, usePathname } from '@/i18n/navigation';
import { SITE } from '@/lib/site';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

const links = [
  { href: '/voitures', key: 'cars' },
  { href: '/simulateur-dedouanement', key: 'simulator' },
  { href: '/a-propos', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'border-b border-white/[0.06] bg-canvas/75 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div
        className={`container-x flex items-center justify-between gap-4 transition-[height] duration-500 ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        <Link
          href="/"
          className="relative z-10 flex items-center"
          aria-label={SITE.name}
          onClick={() => setOpen(false)}
        >
          <Logo height={scrolled ? 34 : 40} className="transition-all duration-500" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(l.href) ? 'text-accent' : 'text-ink/80 hover:text-white'
              }`}
            >
              {t(l.key)}
              <span
                className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 rtl:origin-right ${
                  isActive(l.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {SITE.phone && (
            <a
              href={SITE.phoneHref}
              className="hidden items-center gap-2 text-sm font-medium text-ink/85 transition-colors hover:text-accent xl:inline-flex"
              aria-label={t('call')}
            >
              <Phone className="h-4 w-4 text-accent" aria-hidden />
              <span dir="ltr">{SITE.phone}</span>
            </a>
          )}
          <LanguageSwitcher />
          <Link href="/simulateur-dedouanement" className="btn-primary !px-5 !py-2.5 text-sm">
            <Calculator className="h-4 w-4" aria-hidden />
            {t('cta')}
          </Link>
        </div>

        <button
          type="button"
          className="relative z-10 inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 p-2.5 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('close') : t('menu')}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 top-0 -z-0 flex h-dvh flex-col bg-canvas/95 px-6 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col">
              {[{ href: '/', key: 'home' as const }, ...links].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`font-display block border-b border-white/[0.06] py-4 text-3xl font-semibold tracking-tight ${
                      (l.href === '/' ? pathname === '/' : isActive(l.href))
                        ? 'text-accent'
                        : 'text-white'
                    }`}
                  >
                    {t(l.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto flex items-center justify-between gap-3">
              <LanguageSwitcher />
              <Link
                href="/simulateur-dedouanement"
                onClick={() => setOpen(false)}
                className="btn-primary flex-1 !py-3 text-sm"
              >
                <Calculator className="h-4 w-4" aria-hidden />
                {t('cta')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
