const BRANDS = [
  'Mercedes-Benz',
  'BMW',
  'Audi',
  'Porsche',
  'Volkswagen',
  'Toyota',
  'Land Rover',
  'Peugeot',
  'Renault',
  'Hyundai',
  'Kia',
  'Tesla',
  'Seat',
  'Škoda',
];

/** Infinite, CSS-only brand ticker (reverses in RTL, stops for reduced motion). */
export function BrandMarquee({ title }: { title: string }) {
  const row = [...BRANDS, ...BRANDS];
  return (
    <section className="border-y border-white/[0.06] py-10" aria-label={title}>
      <p className="container-x text-center text-[11px] font-medium uppercase tracking-[0.3em] text-muted">
        {title}
      </p>
      <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" dir="ltr">
        <ul className="marquee-track animate-marquee flex w-max items-center gap-14 pe-14">
          {row.map((b, i) => (
            <li
              key={`${b}-${i}`}
              aria-hidden={i >= BRANDS.length}
              className="font-display whitespace-nowrap text-2xl font-semibold tracking-tight text-white/25 transition-colors hover:text-accent sm:text-3xl"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
