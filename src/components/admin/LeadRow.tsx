'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MessageCircle,
  Trash2,
  Loader2,
  Car as CarIcon,
  ExternalLink,
} from 'lucide-react';

import { deleteLead, updateLeadStatus } from '@/app/admin/actions';
import {
  LEAD_STATUSES,
  type Lead,
  type LeadKind,
  type LeadStatus,
} from '@/lib/types';

export type LeadWithCar = Lead & {
  cars: { slug: string; make: string; model: string } | null;
};

const KIND_LABEL: Record<LeadKind, string> = {
  contact: 'Contact',
  vehicule: 'Véhicule',
  dedouanement: 'Dédouanement',
  recherche: 'Recherche',
};

const KIND_BADGE: Record<LeadKind, string> = {
  contact: 'bg-sky-500/15 text-sky-300',
  vehicule: 'bg-violet-500/15 text-violet-300',
  dedouanement: 'bg-accent/15 text-accent',
  recherche: 'bg-emerald-500/15 text-emerald-300',
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  traite: 'Traité',
};

const STATUS_SELECT: Record<LeadStatus, string> = {
  nouveau: 'border-accent/50 text-accent',
  en_cours: 'border-amber-500/40 text-amber-300',
  traite: 'border-line text-muted',
};

/** Friendly labels for the payload keys the public forms are known to send. */
const PAYLOAD_LABEL: Record<string, string> = {
  priceEur: 'Prix (€)',
  engineCc: 'Cylindrée (cm³)',
  fuel: 'Carburant',
  condition: 'État',
  regime: 'Régime',
  age: 'Âge (0 = neuf, 1 = < 1 an … 5 = 4–5 ans)',
  referencePriceEur: 'Cote argus neuf (€)',
  amountDueDzd: 'Montant dû (DA)',
  freightEur: 'Fret (€)',
  insuranceEur: 'Assurance (€)',
  exchangeRate: 'Taux de change',
  netTaxes: 'Droits nets (DA)',
  totalDzd: 'Total (DA)',
  totalEur: 'Total (€)',
};

const dateFmt = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Europe/Paris',
});

const numberFmt = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });

function formatPayloadValue(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'number') return numberFmt.format(value);
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

/** wa.me wants the international number, digits only (no "+" / "00"). */
function whatsappUrl(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '').replace(/^00/, '')}`;
}

export function LeadRow({ lead }: { lead: LeadWithCar }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();

  function onStatusChange(next: LeadStatus) {
    const previous = status;
    setStatus(next); // optimistic
    setError(null);
    startSaving(async () => {
      const res = await updateLeadStatus(lead.id, next);
      if (!res.ok) {
        setStatus(previous);
        setError(res.error ?? 'Échec de la mise à jour');
      }
    });
  }

  function onDelete() {
    setError(null);
    startDeleting(async () => {
      const res = await deleteLead(lead.id);
      if (!res.ok) setError(res.error ?? 'Échec de la suppression');
    });
  }

  const payloadEntries = Object.entries(lead.payload ?? {});
  const statusId = `lead-status-${lead.id}`;

  return (
    <article
      className={`rounded-2xl border bg-surface p-5 shadow-[var(--shadow-card)] ${
        status === 'nouveau' ? 'border-accent/40' : 'border-line'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full px-2.5 py-1 font-semibold ${KIND_BADGE[lead.kind]}`}
            >
              {KIND_LABEL[lead.kind]}
            </span>
            <time dateTime={lead.created_at} className="text-muted">
              {dateFmt.format(new Date(lead.created_at))}
            </time>
            {lead.locale && (
              <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono uppercase text-muted">
                {lead.locale}
              </span>
            )}
          </div>
          <h2 className="mt-2 truncate font-display text-lg font-semibold text-primary">
            {lead.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={statusId} className="sr-only">
            Statut de la demande
          </label>
          {saving && (
            <Loader2 className="h-4 w-4 animate-spin text-muted" aria-hidden />
          )}
          <select
            id={statusId}
            value={status}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
            disabled={saving || deleting}
            className={`cursor-pointer rounded-full border bg-canvas px-3 py-1.5 text-xs font-semibold outline-none ${STATUS_SELECT[status]}`}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <a
          href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-primary transition-colors hover:bg-primary-50"
        >
          <Phone className="h-4 w-4 text-accent" aria-hidden />
          {lead.phone}
        </a>
        <a
          href={whatsappUrl(lead.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-primary transition-colors hover:bg-primary-50"
        >
          <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden />
          WhatsApp
        </a>
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-primary transition-colors hover:bg-primary-50"
          >
            <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span className="truncate">{lead.email}</span>
          </a>
        )}
      </div>

      {/* Linked car */}
      {lead.cars && (
        <Link
          href={`/voitures/${lead.cars.slug}`}
          target="_blank"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          <CarIcon className="h-4 w-4" aria-hidden />
          {lead.cars.make} {lead.cars.model}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}

      {/* Message */}
      {lead.message && (
        <details className="group mt-3 rounded-xl bg-primary-50 px-4 py-3 text-sm">
          <summary className="cursor-pointer list-none text-ink">
            <span className="line-clamp-2 group-open:hidden">
              {lead.message}
            </span>
            <span className="mt-1 block text-xs font-medium text-muted group-open:hidden">
              Afficher le message
            </span>
            <span className="hidden text-xs font-medium text-muted group-open:block">
              Réduire
            </span>
          </summary>
          <p className="mt-2 whitespace-pre-line text-ink">{lead.message}</p>
        </details>
      )}

      {/* Payload (customs quote details, search criteria…) */}
      {payloadEntries.length > 0 && (
        <div className="mt-3 rounded-xl border border-line px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            {lead.kind === 'dedouanement' ? 'Détail du calcul' : 'Détails'}
          </p>
          <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            {payloadEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between gap-3">
                <dt className="text-muted">{PAYLOAD_LABEL[key] ?? key}</dt>
                <dd className="break-all text-right font-medium text-primary">
                  {formatPayloadValue(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Delete */}
      <div className="mt-4 flex justify-end">
        {confirming ? (
          <span className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-red-500/90 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              )}
              Confirmer
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="cursor-pointer rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-primary-50"
            >
              Annuler
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Supprimer la demande de ${lead.name}`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Supprimer
          </button>
        )}
      </div>
    </article>
  );
}
