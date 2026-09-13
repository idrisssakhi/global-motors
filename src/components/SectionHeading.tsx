import type { ReactNode } from 'react';
import { FadeIn } from './FadeIn';

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'start',
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  children?: ReactNode;
}) {
  const centered = align === 'center';
  return (
    <FadeIn
      className={`flex flex-wrap items-end justify-between gap-6 ${
        centered ? 'flex-col items-center text-center' : ''
      }`}
    >
      <div className={centered ? 'mx-auto max-w-3xl' : 'max-w-2xl'}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="font-display mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>}
      </div>
      {children}
    </FadeIn>
  );
}
