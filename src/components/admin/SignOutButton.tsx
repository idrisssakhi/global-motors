'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      aria-label="Déconnexion"
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-50 sm:px-4"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">Déconnexion</span>
    </button>
  );
}
