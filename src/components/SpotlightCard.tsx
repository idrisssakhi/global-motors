'use client';

import type { ReactNode } from 'react';

/** Card with a soft gold light that follows the pointer. */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-surface p-7 transition-colors duration-300 hover:border-accent/25 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgb(217 169 78 / 0.12), transparent 45%)',
        }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
