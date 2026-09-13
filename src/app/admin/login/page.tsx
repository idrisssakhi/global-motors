'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  const field =
    'w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent';

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_top,rgb(217_169_78/0.12),transparent_60%)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-[var(--shadow-card)]">
        <div className="mb-6 flex flex-col items-start gap-3">
          <Logo height={34} />
          <div>
            <p className="font-display font-bold leading-none text-primary">
              Administration
            </p>
            <p className="mt-1 text-xs text-muted">SKH Global Motors</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-primary">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 ${field}`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-primary"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 ${field}`}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-canvas transition-colors hover:bg-accent-600 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <Lock className="h-5 w-5" aria-hidden />
            )}
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
