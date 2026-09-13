import type { ReactNode } from 'react';
import './globals.css';

// Root layout is a pass-through. The real <html> wrapper lives in
// [locale]/layout.tsx (public site) and admin/layout.tsx (back office),
// so each can set its own lang / dir.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
