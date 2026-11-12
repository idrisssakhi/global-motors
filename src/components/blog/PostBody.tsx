import type { ReactNode } from 'react';
import { Info, TriangleAlert } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import type { PostBlock } from '@/content/blog';

const LINK = 'text-accent underline underline-offset-2 hover:no-underline';

/** Inline "**bold**" and "[label](href)"; internal paths keep the current locale. */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(
        <strong key={m.index} className="font-semibold text-white">
          {m[1]}
        </strong>
      );
    } else if (m[3].startsWith('/')) {
      out.push(
        <Link key={m.index} href={m[3]} className={LINK}>
          {m[2]}
        </Link>
      );
    } else {
      out.push(
        <a key={m.index} href={m[3]} target="_blank" rel="noopener noreferrer" className={LINK}>
          {m[2]}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 id={block.id} className="font-display scroll-mt-28 pt-4 text-2xl font-semibold text-white">
          {block.text}
        </h2>
      );
    case 'p':
      return (
        <p>
          <Inline text={block.text} />
        </p>
      );
    case 'list':
      return (
        <ul className="list-disc space-y-2 ps-5 marker:text-accent">
          {block.items.map((it, i) => (
            <li key={i}>
              <Inline text={it} />
            </li>
          ))}
        </ul>
      );
    case 'steps':
      return (
        <ol className="space-y-3">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/10 text-xs font-semibold text-accent">
                {i + 1}
              </span>
              <span className="pt-0.5">
                <Inline text={it} />
              </span>
            </li>
          ))}
        </ol>
      );
    case 'callout': {
      const Icon = block.tone === 'warning' ? TriangleAlert : Info;
      const cls =
        block.tone === 'warning'
          ? 'border-amber-500/30 bg-amber-500/[0.07] text-amber-100'
          : 'border-sky-500/30 bg-sky-500/[0.07] text-sky-100';
      return (
        <div className={`flex gap-3 rounded-2xl border p-4 text-sm ${cls}`} role="note">
          <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p>
            <Inline text={block.text} />
          </p>
        </div>
      );
    }
  }
}

export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-5 text-[1.05rem] leading-relaxed text-ink/85">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}
