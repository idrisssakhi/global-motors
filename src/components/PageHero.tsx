import type { ReactNode } from 'react';

/** Top band for inner pages — sits under the fixed header. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="grain relative isolate overflow-hidden border-b border-white/[0.06] pb-16 pt-36 sm:pt-40">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="absolute -top-32 start-1/4 -z-10 h-80 w-[36rem] rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className="container-x">
        <span className="eyebrow animate-fade-up">{eyebrow}</span>
        <h1
          className="font-display animate-fade-up mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          style={{ animationDelay: '0.08s' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg leading-relaxed text-muted"
            style={{ animationDelay: '0.16s' }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
