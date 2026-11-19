import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import './globals.css';

// Applies to every route (public site and /admin), so the root
// opengraph-image / twitter-image always resolve to the real domain.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
};

// Root layout is a pass-through. The real <html> wrapper lives in
// [locale]/layout.tsx (public site) and admin/layout.tsx (back office),
// so each can set its own lang / dir.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
