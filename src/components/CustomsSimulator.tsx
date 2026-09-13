'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Flame,
  Fuel,
  Home,
  Info,
  Leaf,
  Ship,
} from 'lucide-react';

import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import {
  AGE_BRACKETS,
  STANDARD_MAX_AGE,
  computeCustoms,
  type AgeBracket,
  type CustomsFuel,
  type CustomsInput,
  type CustomsIssue,
  type CustomsRegime,
  type CustomsSettings,
} from '@/lib/customs';
import { formatDzd, formatNumber, formatPercent, formatPrice } from '@/lib/format';
import { AnimatedNumber } from './AnimatedNumber';
import { LeadForm } from './LeadForm';

const FUELS: { key: CustomsFuel; label: 'fuelEssence' | 'fuelHybride' | 'fuelElectrique' | 'fuelDiesel'; icon: typeof Fuel }[] = [
  { key: 'essence', label: 'fuelEssence', icon: Flame },
  { key: 'hybride', label: 'fuelHybride', icon: Leaf },
  { key: 'electrique', label: 'fuelElectrique', icon: BatteryCharging },
  { key: 'diesel', label: 'fuelDiesel', icon: Fuel },
];

const SEGMENT_COLORS = {
  vehicle: '#3b414e',
  dd: '#d9a94e',
  cs: '#7fb7a8',
  prct: '#9b8cd9',
  tva: '#e07a5f',
  fees: '#5fa8e0',
} as const;

const num = (s: string) => {
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export function CustomsSimulator({
  settings,
  initial,
  variant = 'full',
  carId,
}: {
  settings: CustomsSettings;
  initial?: Partial<CustomsInput>;
  /** "compact" hides the quote form and links to the full simulator. */
  variant?: 'full' | 'compact';
  carId?: string;
}) {
  const t = useTranslations('sim');
  const locale = useLocale() as Locale;

  const [regime, setRegime] = useState<CustomsRegime>(initial?.regime ?? 'standard');
  const [fuel, setFuel] = useState<CustomsFuel>(initial?.fuel ?? 'essence');
  const [age, setAge] = useState<AgeBracket>(initial?.age ?? 1);
  const [engineCc, setEngineCc] = useState(String(initial?.engineCc ?? 1400));
  const [price, setPrice] = useState(String(initial?.priceEur ?? 20000));
  const [reference, setReference] = useState(initial?.referencePriceEur ? String(initial.referencePriceEur) : '');
  const [freight, setFreight] = useState(String(initial?.freightEur ?? settings.default_freight_eur));
  const [insurance, setInsurance] = useState(String(initial?.insuranceEur ?? settings.default_insurance_eur));
  const [rate, setRate] = useState(String(initial?.exchangeRate ?? settings.exchange_rate_dzd));
  const [currency, setCurrency] = useState<'dzd' | 'eur'>('dzd');
  const [inventory, setInventory] = useState('');
  const [student, setStudent] = useState(false);

  const maxAge = regime === 'ccr' ? Math.min(5, settings.ccr_max_age_years) : STANDARD_MAX_AGE;
  const ages = AGE_BRACKETS.filter((a) => a <= maxAge);

  function changeRegime(next: CustomsRegime) {
    setRegime(next);
    if (next === 'standard' && age > STANDARD_MAX_AGE) setAge(STANDARD_MAX_AGE);
  }

  const input: CustomsInput = {
    regime,
    fuel,
    age,
    engineCc: num(engineCc),
    priceEur: num(price),
    referencePriceEur: num(reference) || undefined,
    inventoryValueEur: num(inventory) || undefined,
    student,
    freightEur: num(freight),
    insuranceEur: num(insurance),
    exchangeRate: num(rate) || settings.exchange_rate_dzd,
  };
  const r = computeCustoms(input, settings);
  const fx = input.exchangeRate;

  const money = (dzd: number) => (currency === 'dzd' ? formatDzd(dzd, locale) : formatPrice(dzd / fx, locale));
  const alt = (dzd: number) => (currency === 'dzd' ? formatPrice(dzd / fx, locale) : formatDzd(dzd, locale));

  const keep = 1 - r.abattementRate;
  const segments = [
    { key: 'vehicle', value: r.cifDzd, color: SEGMENT_COLORS.vehicle },
    ...r.lines.map((l) => ({ key: l.key, value: l.amount * keep, color: SEGMENT_COLORS[l.key] })),
    { key: 'fees', value: r.feesTotal, color: SEGMENT_COLORS.fees },
  ];

  const issueText = (issue: CustomsIssue) => {
    switch (issue) {
      case 'diesel':
        return t('dieselWarning');
      case 'too_old':
        return regime === 'ccr'
          ? t('issueTooOldCcr', { years: settings.ccr_max_age_years })
          : t('issueTooOldStandard');
      case 'ccr_engine':
        return t('issueCcrEngine', { cc: formatNumber(settings.ccr_max_cc, locale) });
      case 'ccr_ceiling':
        return t('issueCcrCeiling', { ceiling: formatDzd(settings.ccr_ceiling_dzd, locale) });
    }
  };

  const compact = variant === 'compact';

  return (
    <div className={`grid gap-6 ${compact ? 'lg:grid-cols-2' : 'lg:grid-cols-[1fr_1.05fr]'}`}>
      {/* ── Inputs ── */}
      <div className="glass rounded-3xl p-5 sm:p-7 lg:self-start">
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('regime')}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(['standard', 'ccr'] as const).map((key) => {
              const Icon = key === 'ccr' ? Home : Ship;
              const on = regime === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => changeRegime(key)}
                  className={`cursor-pointer rounded-2xl border p-4 text-start transition-all ${
                    on ? 'border-accent/60 bg-accent/10' : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <span className={`flex items-center gap-2 text-sm font-semibold ${on ? 'text-accent-soft' : 'text-white'}`}>
                    <Icon className="h-4 w-4" aria-hidden />
                    {key === 'ccr' ? t('regimeCcr') : t('regimeStandard')}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {key === 'ccr' ? t('regimeCcrHint') : t('regimeStandardHint')}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('vehicle')}</p>

        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-medium text-white">{t('fuel')}</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {FUELS.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={fuel === f.key}
                onClick={() => setFuel(f.key)}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  fuel === f.key ? 'border-accent/60 bg-accent/15 text-accent-soft' : 'border-white/10 text-ink/80 hover:border-white/25'
                }`}
              >
                <f.icon className="h-4 w-4" aria-hidden />
                {t(f.label)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-medium text-white">{t('age')}</legend>
          <div className={`grid gap-1.5 rounded-xl border border-white/10 p-1 ${ages.length > 4 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-4'}`}>
            {ages.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={age === a}
                onClick={() => setAge(a)}
                className={`cursor-pointer rounded-lg px-2 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  age === a ? 'bg-white text-canvas' : 'text-ink/75 hover:text-white'
                }`}
              >
                {t(`age${a}` as 'age0')}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {t('ageHint', { rate: formatPercent(settings.depreciation_per_year, locale) })}
          </p>
        </fieldset>

        {fuel !== 'electrique' && (
          <div className="mt-5">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="sim-cc" className="text-sm font-medium text-white">{t('engineCc')}</label>
              <span className="font-display text-sm font-semibold text-accent" dir="ltr">
                {formatNumber(input.engineCc, locale)} cm³
              </span>
            </div>
            <input
              type="range"
              min={800}
              max={5000}
              step={50}
              value={input.engineCc || 800}
              onChange={(e) => setEngineCc(e.target.value)}
              className="mt-3 w-full cursor-pointer accent-accent"
              aria-label={t('engineCc')}
            />
            <div className="mt-2 flex items-center gap-3">
              <input
                id="sim-cc"
                type="number"
                inputMode="numeric"
                min={0}
                step={10}
                value={engineCc}
                onChange={(e) => setEngineCc(e.target.value)}
                className="field max-w-[9rem]"
                dir="ltr"
              />
              <p className="text-xs text-muted">
                {regime === 'ccr'
                  ? t('engineHintCcr', { cc: formatNumber(settings.ccr_max_cc, locale) })
                  : t('engineHint', {
                      small: formatNumber(settings.small_engine_max_cc, locale),
                      abatt: formatNumber(settings.abatt_threshold_cc, locale),
                    })}
              </p>
            </div>
          </div>
        )}

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('costs')}</p>

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="sim-price" className="text-sm font-medium text-white">{t('price')}</label>
            <span className="font-display text-sm font-semibold text-accent">{formatPrice(input.priceEur, locale)}</span>
          </div>
          <input
            type="range"
            min={3000}
            max={150000}
            step={500}
            value={Math.min(150000, input.priceEur || 3000)}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-3 w-full cursor-pointer accent-accent"
            aria-label={t('price')}
          />
          <NumberField id="sim-price" value={price} onChange={setPrice} suffix="€" hint={t('priceHint')} />
        </div>

        <div className="mt-4">
          <NumberField
            id="sim-reference"
            label={`${t('referencePrice')} · ${t('referencePriceOptional')}`}
            value={reference}
            onChange={setReference}
            suffix="€"
            hint={t('referencePriceHint', { coef: formatNumber(settings.foreign_vat_coef, locale) })}
          />
        </div>

        {regime === 'ccr' && (
          <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.03] p-4">
            <p className="text-sm font-semibold text-emerald-200">{t('consulateTitle')}</p>
            <div className="mt-3">
              <NumberField
                id="sim-inventory"
                label={t('inventoryValue')}
                value={inventory}
                onChange={setInventory}
                suffix="€"
                hint={t('inventoryHint', {
                  fixed: formatPrice(settings.ccr_consular_fixed_eur, locale),
                  per100: formatPrice(settings.ccr_consular_rate * 100, locale),
                })}
              />
            </div>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink/90">
              <input
                type="checkbox"
                checked={student}
                onChange={(e) => setStudent(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-accent"
              />
              {t('student', { rate: formatPercent(settings.ccr_student_discount, locale) })}
            </label>
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <NumberField id="sim-freight" label={t('freight')} value={freight} onChange={setFreight} suffix="€" />
          <NumberField id="sim-insurance" label={t('insurance')} value={insurance} onChange={setInsurance} suffix="€" />
          <NumberField id="sim-rate" label={t('exchangeRate')} value={rate} onChange={setRate} suffix="DA" />
        </div>
        <p className="mt-2 text-xs text-muted">{t('exchangeHint')}</p>
      </div>

      {/* ── Result ── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-linear-to-b from-accent/[0.09] to-surface p-5 sm:p-7">
          <div className="absolute -top-24 end-[-4rem] h-60 w-60 rounded-full bg-accent/15 blur-3xl" aria-hidden />

          <div className="relative flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t('resultTitle')} · {regime === 'ccr' ? t('regimeCcr') : t('regimeStandard')}
            </p>
            <div className="flex rounded-full border border-white/10 p-0.5 text-xs font-semibold" role="group">
              {(['dzd', 'eur'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={currency === c}
                  onClick={() => setCurrency(c)}
                  className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${
                    currency === c ? 'bg-accent text-canvas' : 'text-muted hover:text-white'
                  }`}
                >
                  {c === 'dzd' ? 'DA' : '€'}
                </button>
              ))}
            </div>
          </div>

          <p className="relative mt-5 text-sm text-muted">{r.ccrExempt ? t('ccrDue') : t('netTaxes')}</p>
          <p className="relative mt-1" aria-live="polite">
            <AnimatedNumber
              value={currency === 'dzd' ? r.amountDue : r.amountDueEur}
              format={(v) => (currency === 'dzd' ? formatDzd(v, locale) : formatPrice(v, locale))}
              className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            />
          </p>
          <p className="relative mt-1 text-sm text-muted">{t('inEur', { value: alt(r.amountDue) })}</p>

          {r.ccrExempt && (
            <p className="relative mt-4 flex gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t('ccrEligible', { value: money(r.grossTaxes) })}
            </p>
          )}

          {regime === 'ccr' && (
            <div className="relative mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs text-muted">{t('payConsulate')}</p>
                <p className="font-display mt-1 text-lg font-semibold text-white">{formatPrice(r.consulateEur, locale)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs text-muted">{t('payAlgeria')}</p>
                <p className="font-display mt-1 text-lg font-semibold text-white">{formatDzd(r.algeriaDzd, locale)}</p>
              </div>
            </div>
          )}

          {r.issues.length > 0 && (
            <ul className="relative mt-4 space-y-2">
              {r.issues.map((issue) => (
                <li key={issue} className="flex gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {issueText(issue)}
                </li>
              ))}
            </ul>
          )}

          <div className="relative mt-6 flex h-3 overflow-hidden rounded-full bg-white/5" aria-hidden>
            {segments.map((s) => (
              <div
                key={s.key}
                className="h-full transition-[width] duration-700 ease-out"
                style={{ width: `${r.totalDzd ? (s.value / r.totalDzd) * 100 : 0}%`, background: s.color }}
              />
            ))}
          </div>

          <table className="relative mt-6 w-full text-sm">
            <caption className="sr-only">{t('resultTitle')}</caption>
            <thead>
              <tr className="text-xs text-muted">
                <th className="pb-2 text-start font-medium" />
                <th className="pb-2 text-end font-medium">{t('rate')}</th>
                <th className="pb-2 text-end font-medium">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {r.valuation.referenceEur != null && (
                <>
                  <tr className="text-muted">
                    <td className="py-2 text-xs">{t('invoice')}</td>
                    <td />
                    <td className={`py-2 text-end text-xs ${r.valuation.retained === 'invoice' ? 'font-semibold text-white' : ''}`}>
                      {formatPrice(r.valuation.invoiceEur, locale)}
                    </td>
                  </tr>
                  <tr className="text-muted">
                    <td className="py-2 text-xs">{t('referenceValue')}</td>
                    <td className="py-2 text-end text-xs">
                      {r.valuation.depreciationRate ? `−${formatPercent(r.valuation.depreciationRate, locale)}` : '—'}
                    </td>
                    <td className={`py-2 text-end text-xs ${r.valuation.retained === 'reference' ? 'font-semibold text-white' : ''}`}>
                      {formatPrice(r.valuation.referenceEur, locale)}
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td className="py-2.5 text-ink/90">
                  <Swatch color={SEGMENT_COLORS.vehicle} />
                  {t('cif')}
                </td>
                <td className="py-2.5 text-end text-muted" dir="ltr">{formatPrice(r.cifEur, locale)}</td>
                <td className="py-2.5 text-end font-medium text-white">{money(r.cifDzd)}</td>
              </tr>
              {r.lines.map((l) => (
                <tr key={l.key} className={r.ccrExempt ? 'text-muted line-through decoration-white/30' : ''}>
                  <td className="py-2.5 text-ink/90">
                    <Swatch color={SEGMENT_COLORS[l.key]} />
                    {t(l.key)}
                  </td>
                  <td className="py-2.5 text-end text-muted">{formatPercent(l.rate, locale)}</td>
                  <td className="py-2.5 text-end font-medium text-white">{money(l.amount)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2.5 text-ink/90">{t('gross')}</td>
                <td />
                <td className="py-2.5 text-end font-medium text-white">{money(r.grossTaxes)}</td>
              </tr>
              <tr className="text-emerald-300">
                <td className="py-2.5">
                  {r.ccrExempt ? t('exemption') : r.abattementRate ? t('abattement') : t('abattementNone')}
                </td>
                <td className="py-2.5 text-end">{r.abattementRate ? `−${formatPercent(r.abattementRate, locale)}` : '—'}</td>
                <td className="py-2.5 text-end font-medium">{r.abattement ? `−${money(r.abattement)}` : '—'}</td>
              </tr>
              {r.fees.map((f) => (
                <tr key={f.key}>
                  <td className="py-2.5 text-ink/90">
                    <Swatch color={SEGMENT_COLORS.fees} />
                    {f.key === 'consular' ? t('consularFee') : t('inspectionFee')}
                    <span className="block ps-4 text-xs text-muted">
                      {f.where === 'consulate' ? t('payConsulate') : t('payAlgeria')}
                    </span>
                  </td>
                  <td className="py-2.5 text-end text-muted" dir="ltr">
                    {f.amountEur != null ? formatPrice(f.amountEur, locale) : ''}
                  </td>
                  <td className="py-2.5 text-end font-medium text-white">{money(f.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-accent/30">
                <td className="pt-4 font-semibold text-white">
                  {t('total')}
                  <span className="block text-xs font-normal text-muted">{t('totalHint')}</span>
                </td>
                <td />
                <td className="pt-4 text-end font-display text-lg font-semibold text-accent">{money(r.totalDzd)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="relative mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
            <span>
              {t('effectiveRate')} : <strong className="text-white">{formatPercent(r.effectiveRate, locale)}</strong>
            </span>
            <span dir="ltr">1 € = {formatNumber(fx, locale)} DA</span>
          </div>

          <p className="relative mt-4 flex gap-2 text-xs leading-relaxed text-muted/90">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {t('disclaimer')}
          </p>

          {compact && (
            <Link href="/simulateur-dedouanement" className="btn-ghost relative mt-6 w-full text-sm">
              {t('quoteCta')} · {t('resultTitle')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          )}
        </div>

        {!compact && (
          <div className="glass mt-6 rounded-3xl p-5 sm:p-7">
            <p className="font-display text-lg font-semibold text-white">{t('quoteTitle')}</p>
            <p className="mt-1 text-sm text-muted">{t('quoteText')}</p>
            <LeadForm
              kind="dedouanement"
              carId={carId}
              className="mt-5"
              payload={{
                regime,
                fuel,
                age,
                engineCc: input.engineCc,
                priceEur: input.priceEur,
                referencePriceEur: input.referencePriceEur ?? null,
                inventoryValueEur: input.inventoryValueEur ?? null,
                student,
                freightEur: input.freightEur,
                insuranceEur: input.insuranceEur,
                exchangeRate: fx,
                amountDueDzd: Math.round(r.amountDue),
                totalDzd: Math.round(r.totalDzd),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Swatch({ color }: { color: string }) {
  return <span className="me-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: color }} aria-hidden />;
}

function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  hint,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  hint?: string;
}) {
  return (
    <div className={label ? '' : 'mt-2'}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-white">
          {label}
        </label>
      )}
      <div className="relative" dir="ltr">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field pe-12"
        />
        <span className="pointer-events-none absolute inset-y-0 end-4 grid place-items-center text-sm text-muted">
          {suffix}
        </span>
      </div>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}
