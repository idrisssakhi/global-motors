'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteCar } from '@/app/admin/actions';

export function DeleteCarButton({
  id,
  images,
  label,
}: {
  id: string;
  images: string[];
  label: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteCar(id, images);
      if (!res.ok) setError(res.error ?? 'Échec de la suppression');
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          title={error ?? undefined}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-red-500/90 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
          )}
          {error ? 'Réessayer' : 'Confirmer'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="cursor-pointer rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-primary-50"
        >
          Annuler
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={`Supprimer ${label}`}
      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10"
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden />
      Supprimer
    </button>
  );
}
