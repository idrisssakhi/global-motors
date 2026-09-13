'use client';

import { createBrowserClient } from '@supabase/ssr';

/** Browser Supabase client — used by client components (admin login, uploads). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
