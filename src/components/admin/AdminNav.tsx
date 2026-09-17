'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Inbox, Calculator, ExternalLink } from 'lucide-react';

import { Logo } from '@/components/Logo';
import { SignOutButton } from '@/components/admin/SignOutButton';

const TABS = [
  { href: '/admin', label: 'Véhicules', icon: Car },
  { href: '/admin/leads', label: 'Demandes', icon: Inbox },
  { href: '/admin/customs', label: 'Dédouanement', icon: Calculator },
] as const;

/** "Véhicules" also owns the car create/edit screens. */
function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') {
    return pathname === '/admin' || pathname.startsWith('/admin/cars');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ newLeads = 0 }: { newLeads?: number }) {
  const pathname = usePathname() ?? '/admin';

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo height={26} />
          <span className="hidden font-display text-sm font-semibold text-primary md:inline">
            Administration
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-1.5 text-sm font-medium text-muted hover:text-primary sm:inline-flex"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Voir le site
          </Link>
          <SignOutButton />
        </div>
      </div>

      <nav aria-label="Administration" className="container-x -mb-px">
        <ul className="flex gap-1 overflow-x-auto">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'border-accent text-primary'
                      : 'border-transparent text-muted hover:text-primary'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                  {href === '/admin/leads' && newLeads > 0 && (
                    <span
                      className="rounded-full bg-accent-600 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white"
                      aria-label={`${newLeads} nouvelle(s) demande(s)`}
                    >
                      {newLeads}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
