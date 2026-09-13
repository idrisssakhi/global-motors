'use client';

import { useState, useTransition } from 'react';
import { Loader2, Save, CheckCircle2, Calculator } from 'lucide-react';

import { updateCustomsSettings } from '@/app/admin/actions';
import { computeCustoms, type CustomsSettings } from '@/lib/customs';
import { formatDzd, formatPrice } from '@/lib/format';

type Key = keyof CustomsSettings;

interface FieldDef {
  key: Key;
  label: string;
  /** Stored as a fraction (0.19) but edited as a percentage (19). */
  percent?: boolean;
  unit: string;
  hint?: string;
}

const GROUPS: { title: string; description?: string; fields: FieldDef[] }[] = [
  {
    title: 'Taux de change',
    fields: [
      {
        key: 'exchange_rate_dzd',
        label: 'Dinars pour 1 €',
        unit: 'DA',
        hint: 'Taux utilisé pour convertir la valeur CIF en dinars.',
      },
    ],
  },
  {
    title: 'Droit de douane',
    fields: [
      { key: 'dd_rate_small', label: 'Taux D.D — petite cylindrée', percent: true, unit: '%' },
      {
        key: 'small_engine_max_cc',
        label: 'Seuil petite cylindrée',
        unit: 'cm³',
        hint: 'Jusqu’à cette cylindrée incluse, le taux « petite cylindrée » s’applique.',
      },
      { key: 'dd_rate_large', label: 'Taux D.D — au-delà du seuil', percent: true, unit: '%' },
      { key: 'dd_rate_electric', label: 'Taux D.D — électrique', percent: true, unit: '%' },
    ],
  },
  {
    title: 'Taxes',
    fields: [
      { key: 'cs_rate', label: 'Contribution de solidarité (C.S)', percent: true, unit: '%' },
      { key: 'prct_rate', label: 'Prélèvement PRCT', percent: true, unit: '%' },
      { key: 'tva_rate', label: 'TVA', percent: true, unit: '%' },
    ],
  },
  {
    title: 'Abattement décret 23-74 — occasion < 3 ans',
    description: 'Appliqué sur le total des droits et taxes.',
    fields: [
      { key: 'abatt_electric', label: 'Électrique', percent: true, unit: '%' },
      {
        key: 'abatt_small',
        label: 'Essence / hybride ≤ seuil',
        percent: true,
        unit: '%',
      },
      { key: 'abatt_threshold_cc', label: 'Seuil de cylindrée', unit: 'cm³' },
      { key: 'abatt_large', label: 'Au-delà du seuil', percent: true, unit: '%' },
    ],
  },
  {
    title: 'Âge du véhicule — valeur de référence',
    description:
      'Quand la douane évalue sur la cote (argus) : retrait de la TVA étrangère puis dépréciation par année après la première. La valeur la plus élevée entre facture et cote est retenue.',
    fields: [
      { key: 'depreciation_per_year', label: 'Dépréciation par année', percent: true, unit: '%' },
      { key: 'foreign_vat_coef', label: 'Coefficient hors TVA étrangère', unit: '×', hint: '0,833 = retrait d’une TVA de 20 %.' },
    ],
  },
  {
    title: 'CCR — retour définitif',
    description: 'Exonération des droits et taxes sous conditions (loi de finances 2026).',
    fields: [
      { key: 'ccr_max_age_years', label: 'Âge maximum', unit: 'ans' },
      { key: 'ccr_max_cc', label: 'Cylindrée maximum', unit: 'cm³' },
      { key: 'ccr_ceiling_dzd', label: 'Plafond de valeur des biens', unit: 'DA' },
      { key: 'ccr_consular_fixed_eur', label: 'Droits de chancellerie — fixe', unit: '€' },
      { key: 'ccr_consular_rate', label: 'Droits de chancellerie — par tranche de 100 €', percent: true, unit: '%', hint: '4 % = 4 € par tranche de 100 € déclarés à l’inventaire (payé au consulat).' },
      { key: 'ccr_student_discount', label: 'Réduction étudiants / stagiaires', percent: true, unit: '%' },
      { key: 'ccr_inspection_dzd', label: 'Contrôle technique', unit: 'DA' },
    ],
  },
  {
    title: 'Valeurs par défaut du simulateur',
    fields: [
      { key: 'default_freight_eur', label: 'Fret maritime', unit: '€' },
      { key: 'default_insurance_eur', label: 'Assurance', unit: '€' },
    ],
  },
];

const PERCENT_KEYS = new Set<Key>(
  GROUPS.flatMap((g) => g.fields.filter((f) => f.percent).map((f) => f.key))
);

const LINE_LABEL = {
  dd: 'Droit de douane',
  cs: 'Contribution de solidarité',
  prct: 'PRCT',
  tva: 'TVA',
} as const;

/** Fraction → percentage string without float noise (0.15 → "15"). */
const toDisplay = (key: Key, value: number) =>
  String(PERCENT_KEYS.has(key) ? Number((value * 100).toFixed(4)) : value);

/** Parse the edited strings back into stored values (percent → fraction). */
function toSettings(values: Record<Key, string>): CustomsSettings {
  const out = {} as CustomsSettings;
  for (const key of Object.keys(values) as Key[]) {
    const n = Number(values[key].replace(',', '.'));
    out[key] = PERCENT_KEYS.has(key) ? Number((n / 100).toFixed(6)) : n;
  }
  return out;
}

export function CustomsSettingsForm({ initial }: { initial: CustomsSettings }) {
  const [values, setValues] = useState<Record<Key, string>>(() => {
    const out = {} as Record<Key, string>;
    for (const key of Object.keys(initial) as Key[]) {
      out[key] = toDisplay(key, initial[key]);
    }
    return out;
  });
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  const settings = toSettings(values);
  const invalid = (Object.keys(settings) as Key[]).filter(
    (k) => values[k].trim() === '' || !Number.isFinite(settings[k]) || settings[k] < 0
  );

  // Reference example: 20 000 € essence 1 400 cm³, used car < 3 years.
  const example =
    invalid.length === 0
      ? computeCustoms(
          {
            regime: 'standard',
            fuel: 'essence',
            age: 1,
            engineCc: 1400,
            priceEur: 20000,
            freightEur: settings.default_freight_eur,
            insuranceEur: settings.default_insurance_eur,
            exchangeRate: settings.exchange_rate_dzd,
          },
          settings
        )
      : null;

  function onChange(key: Key, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (invalid.length) {
      setMessage({ ok: false, text: 'Certaines valeurs sont invalides.' });
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const res = await updateCustomsSettings(settings);
      setMessage(
        res.ok
          ? { ok: true, text: 'Paramètres enregistrés.' }
          : { ok: false, text: res.error ?? 'Une erreur est survenue.' }
      );
    });
  }

  const field =
    'w-full rounded-xl border bg-canvas py-2.5 pl-3.5 pr-12 text-sm text-ink outline-none transition-colors focus:border-accent';
  const section =
    'rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]';

  return (
    <form
      onSubmit={onSubmit}
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div className="space-y-6">
        {GROUPS.map((group) => (
          <fieldset key={group.title} className={section}>
            <legend className="sr-only">{group.title}</legend>
            <h2 aria-hidden className="font-display text-lg font-semibold text-primary">
              {group.title}
            </h2>
            {group.description && (
              <p className="mt-1 text-sm text-muted">{group.description}</p>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.fields.map((f) => {
                const id = `customs-${f.key}`;
                const bad = invalid.includes(f.key);
                return (
                  <div key={f.key}>
                    <label
                      htmlFor={id}
                      className="mb-1 block text-sm font-medium text-primary"
                    >
                      {f.label}
                    </label>
                    <div className="relative">
                      <input
                        id={id}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        required
                        value={values[f.key]}
                        onChange={(e) => onChange(f.key, e.target.value)}
                        aria-invalid={bad || undefined}
                        aria-describedby={f.hint ? `${id}-hint` : undefined}
                        className={`${field} ${bad ? 'border-red-400' : 'border-line'}`}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs text-muted"
                      >
                        {f.unit}
                      </span>
                    </div>
                    {f.hint && (
                      <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
                        {f.hint}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {/* Sticky live example + save */}
      <aside className="space-y-4 lg:sticky lg:top-32">
        <div className={section} aria-live="polite">
          <p className="flex items-center gap-2 font-display font-semibold text-primary">
            <Calculator className="h-4 w-4 text-accent" aria-hidden />
            Exemple en direct
          </p>
          <p className="mt-1 text-xs text-muted">
            Essence 1 400 cm³ · occasion &lt; 3 ans · {formatPrice(20000, 'fr')}{' '}
            + fret et assurance par défaut.
          </p>

          {example ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Valeur CIF</dt>
                <dd className="text-primary">{formatDzd(example.cifDzd, 'fr')}</dd>
              </div>
              {example.lines.map((line) => (
                <div key={line.key} className="flex justify-between gap-3">
                  <dt className="text-muted">
                    {LINE_LABEL[line.key]} ({Number((line.rate * 100).toFixed(2))} %)
                  </dt>
                  <dd className="text-primary">{formatDzd(line.amount, 'fr')}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 border-t border-line pt-2">
                <dt className="text-muted">Total brut</dt>
                <dd className="text-primary">{formatDzd(example.grossTaxes, 'fr')}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">
                  Abattement ({Number((example.abattementRate * 100).toFixed(2))} %)
                </dt>
                <dd className="text-emerald-300">
                  − {formatDzd(example.abattement, 'fr')}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-line pt-2">
                <dt className="font-semibold text-primary">Droits &amp; taxes nets</dt>
                <dd className="font-display text-lg font-bold text-accent">
                  {formatDzd(example.netTaxes, 'fr')}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Coût total rendu</dt>
                <dd className="font-semibold text-primary">
                  {formatDzd(example.totalDzd, 'fr')}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-red-300">
              Corrigez les valeurs invalides pour voir l’exemple.
            </p>
          )}
        </div>

        {message && (
          <p
            role={message.ok ? 'status' : 'alert'}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
              message.ok
                ? 'bg-emerald-500/10 text-emerald-300'
                : 'bg-red-500/10 text-red-300'
            }`}
          >
            {message.ok && <CheckCircle2 className="h-4 w-4" aria-hidden />}
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-canvas transition-colors hover:bg-accent-600 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Save className="h-5 w-5" aria-hidden />
          )}
          Enregistrer
        </button>
      </aside>
    </form>
  );
}
