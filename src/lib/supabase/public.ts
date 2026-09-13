import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cookieless Supabase client for PUBLIC reads and inserts (anon key).
 * Safe in generateStaticParams / generateMetadata / ISR / server actions.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
