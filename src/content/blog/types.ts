/**
 * Blog / guides content model. Posts live in code (no CMS): one shared list of
 * slugs + dates, and one content file per locale. A locale without a
 * translation for a post falls back to French.
 *
 * Inline links use Markdown syntax: [label](/path) or [label](https://…).
 */
export type PostBlock =
  | { type: 'h2'; id: string; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'callout'; tone: 'info' | 'warning'; text: string };

export interface PostContent {
  title: string;
  /** Meta description and card excerpt (≤ 160 characters). */
  description: string;
  blocks: PostBlock[];
}

export interface PostMeta {
  slug: string;
  /** ISO date of first publication. */
  published: string;
  /** ISO date of the last factual review. */
  updated: string;
  /** Market the guide is about (for the card label). */
  market: 'dz' | 'tn-ma' | 'fr-eu' | 'all';
}
