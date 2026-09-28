import type { ReactNode } from 'react';

import { Link } from '@/i18n/navigation';
import type { LegalBlock, LegalDoc } from '@/content/legal';

/** Renders "[label](href)" Markdown links; internal paths keep the current locale. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    parts.push(
      href.startsWith('/') ? (
        <Link key={m.index} href={href} className="text-accent underline underline-offset-2 hover:no-underline">
          {label}
        </Link>
      ) : (
        <a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:no-underline">
          {label}
        </a>
      )
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === 'p')
    return (
      <p>
        <RichText text={block.text} />
      </p>
    );
  if (block.type === 'list')
    return (
      <ul className="list-disc space-y-2 ps-5 marker:text-accent">
        {block.items.map((it) => (
          <li key={it}>
            <RichText text={it} />
          </li>
        ))}
      </ul>
    );
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
      <table className="w-full min-w-[32rem] text-start text-sm">
        <thead className="bg-surface-2 text-ink">
          <tr>
            {block.head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 text-start font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {block.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-4 py-3 text-start font-medium text-ink">
                    {cell}
                  </th>
                ) : (
                  <td key={i} className="px-4 py-3">
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A titled section, shared with the legal notice page. */
export function LegalSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-28">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export function LegalDocument({
  doc,
  updatedLabel,
  tocLabel,
  children,
}: {
  doc: LegalDoc;
  /** e.g. "Dernière mise à jour : 28 septembre 2026" */
  updatedLabel: string;
  tocLabel: string;
  /** Extra content after the sections (e.g. a "manage cookies" button). */
  children?: ReactNode;
}) {
  return (
    <article className="container-x max-w-3xl pb-10 pt-36">
      <h1 className="font-display text-4xl font-semibold text-white">{doc.title}</h1>
      <p className="mt-3 text-sm text-muted">{updatedLabel}</p>
      <p className="mt-6 leading-relaxed text-ink/90">
        <RichText text={doc.intro} />
      </p>

      <nav aria-label={tocLabel} className="mt-8 rounded-2xl border border-white/[0.08] bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{tocLabel}</p>
        <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
          {doc.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-ink/90 hover:text-accent">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {doc.sections.map((s) => (
        <LegalSection key={s.id} id={s.id} title={s.title}>
          {s.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </LegalSection>
      ))}

      {children}
    </article>
  );
}
