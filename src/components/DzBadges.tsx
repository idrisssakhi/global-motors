import { useTranslations } from 'next-intl';
import { BadgeCheck, Plane, TriangleAlert } from 'lucide-react';

import type { DzRoute } from '@/lib/eligibility';

const STYLE: Record<DzRoute, { cls: string; Icon: typeof BadgeCheck }> = {
  res3: { cls: 'bg-emerald-500/10 text-emerald-300', Icon: BadgeCheck },
  ccr5: { cls: 'bg-sky-500/10 text-sky-300', Icon: Plane },
  diesel: { cls: 'bg-amber-500/10 text-amber-300', Icon: TriangleAlert },
};

/** Algerian import routes a car qualifies for (see lib/eligibility). */
export function DzBadges({
  routes,
  size = 'md',
  className = '',
}: {
  routes: DzRoute[];
  size?: 'sm' | 'md';
  className?: string;
}) {
  const t = useTranslations('dz');
  if (routes.length === 0) return null;
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label={t('label')}>
      {routes.map((r) => {
        const { cls, Icon } = STYLE[r];
        return (
          <li key={r} className={`inline-flex items-center gap-1 rounded-full font-medium ${pad} ${cls}`} title={t(`${r}Hint`)}>
            <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden />
            {t(r)}
          </li>
        );
      })}
    </ul>
  );
}
