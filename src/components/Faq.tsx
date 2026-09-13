import { Plus } from 'lucide-react';

/** Accessible native accordion. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
      {items.map((it) => (
        <details key={it.q} className="group py-2">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-lg font-medium text-white">{it.q}</span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-accent transition-transform duration-300 group-open:rotate-45">
              <Plus className="h-4 w-4" aria-hidden />
            </span>
          </summary>
          <p className="max-w-3xl pb-5 leading-relaxed text-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
