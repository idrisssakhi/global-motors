/**
 * Algerian customs clearance estimate for a passenger car.
 *
 * Two regimes:
 *
 * ● Import classique (résident) — new car or used car < 3 years
 *   1. Base taxable : invoice price, unless customs values the car on its
 *      reference price (argus). The reference is taken net of foreign VAT
 *      (× 0.833) and depreciated per year of age; customs retains the
 *      HIGHER of the invoice and that depreciated reference. This is why
 *      a car of < 1 year, 1–2 years and 2–3 years is not taxed the same.
 *   2. Valeur en douane (CIF) = base + fret + assurance, converted to DZD
 *   3. D.D (by fuel / engine size), C.S 3 %, PRCT 2 % on CIF
 *   4. TVA 19 % on CIF + D.D + C.S + PRCT
 *   5. Abattement décret 23-74 on the total (used cars only):
 *      80 % électrique, 50 % essence/hybride ≤ 1 800 cm³, 20 % au-delà
 *
 * ● CCR (certificat de changement de résidence, LF 2026 art. 127)
 *   Car < 5 years, petrol / hybrid / electric, ≤ 1 800 cm³, goods value
 *   under a ceiling → duties & taxes exempted. Remaining costs:
 *   - at the consulate, before departure: chancellery fees of 40 € + 4 €
 *     per 100 € bracket of the declared inventory value (−50 % students);
 *   - in Algeria: the post-clearance technical inspection.
 *   When a CCR condition fails, the classic calculation is shown.
 *
 * Every rate lives in `customs_settings` so the admin can follow a finance
 * law change without a deploy. Results are an ESTIMATE.
 */

export interface CustomsSettings {
  exchange_rate_dzd: number;
  dd_rate_small: number;
  dd_rate_large: number;
  dd_rate_electric: number;
  small_engine_max_cc: number;
  cs_rate: number;
  prct_rate: number;
  tva_rate: number;
  abatt_electric: number;
  abatt_small: number;
  abatt_large: number;
  abatt_threshold_cc: number;
  default_freight_eur: number;
  default_insurance_eur: number;
  depreciation_per_year: number;
  foreign_vat_coef: number;
  ccr_max_age_years: number;
  ccr_max_cc: number;
  ccr_ceiling_dzd: number;
  ccr_consular_fixed_eur: number;
  /** Euros per euro, charged per started 100 € bracket (0.04 = 4 € / 100 €). */
  ccr_consular_rate: number;
  ccr_student_discount: number;
  ccr_inspection_dzd: number;
}

export const DEFAULT_CUSTOMS: CustomsSettings = {
  exchange_rate_dzd: 150,
  dd_rate_small: 0.15,
  dd_rate_large: 0.3,
  dd_rate_electric: 0.15,
  small_engine_max_cc: 1500,
  cs_rate: 0.03,
  prct_rate: 0.02,
  tva_rate: 0.19,
  abatt_electric: 0.8,
  abatt_small: 0.5,
  abatt_large: 0.2,
  abatt_threshold_cc: 1800,
  default_freight_eur: 600,
  default_insurance_eur: 150,
  depreciation_per_year: 0.1,
  foreign_vat_coef: 0.833,
  ccr_max_age_years: 5,
  ccr_max_cc: 1800,
  ccr_ceiling_dzd: 10_000_000,
  ccr_consular_fixed_eur: 40,
  ccr_consular_rate: 0.04,
  ccr_student_discount: 0.5,
  ccr_inspection_dzd: 8000,
};

/**
 * Every known key as a finite number, falling back to the default. Protects
 * the calculation from partial rows (e.g. settings cached before a new
 * column existed — which previously produced NaN in the CCR fees).
 */
export function withCustomsDefaults(row: Partial<Record<keyof CustomsSettings, unknown>>): CustomsSettings {
  const out = { ...DEFAULT_CUSTOMS };
  for (const key of Object.keys(DEFAULT_CUSTOMS) as (keyof CustomsSettings)[]) {
    const n = Number(row[key]);
    if (row[key] != null && row[key] !== '' && Number.isFinite(n)) out[key] = n;
  }
  return out;
}

export type CustomsFuel = 'essence' | 'hybride' | 'electrique' | 'diesel';
export type CustomsRegime = 'standard' | 'ccr';

/** 0 = neuf · 1 = moins d'1 an · 2 = 1–2 ans · 3 = 2–3 ans · 4 = 3–4 ans · 5 = 4–5 ans */
export type AgeBracket = 0 | 1 | 2 | 3 | 4 | 5;
export const AGE_BRACKETS: AgeBracket[] = [0, 1, 2, 3, 4, 5];
/** Oldest bracket allowed by the classic regime (< 3 years). */
export const STANDARD_MAX_AGE: AgeBracket = 3;

export interface CustomsInput {
  regime: CustomsRegime;
  fuel: CustomsFuel;
  age: AgeBracket;
  engineCc: number;
  /** Invoice price (HT for export). */
  priceEur: number;
  /** Optional new-car reference price (argus) used by customs valuation. */
  referencePriceEur?: number;
  freightEur: number;
  insuranceEur: number;
  exchangeRate: number;
  /** CCR: value declared on the moving inventory (defaults to the car's value). */
  inventoryValueEur?: number;
  /** CCR: students and trainees pay reduced chancellery fees. */
  student?: boolean;
}

export interface CustomsLine {
  key: 'dd' | 'cs' | 'prct' | 'tva';
  rate: number;
  base: number;
  amount: number;
}

export interface CustomsFee {
  key: 'consular' | 'inspection';
  /** Where the fee is paid. */
  where: 'consulate' | 'algeria';
  amount: number; // DZD
  amountEur: number | null; // set when the fee is charged in euros
}

export type CustomsIssue = 'diesel' | 'too_old' | 'ccr_engine' | 'ccr_ceiling';

export interface CustomsResult {
  regime: CustomsRegime;
  /** True when the CCR exemption actually applies. */
  ccrExempt: boolean;
  issues: CustomsIssue[];
  valuation: {
    invoiceEur: number;
    /** Reference net of foreign VAT and age depreciation (null without argus). */
    referenceEur: number | null;
    depreciationRate: number;
    retained: 'invoice' | 'reference';
    baseEur: number;
  };
  cifEur: number;
  cifDzd: number;
  lines: CustomsLine[];
  grossTaxes: number;
  /** Decree 23-74 rate, or 1 for a CCR exemption. */
  abattementRate: number;
  abattement: number;
  netTaxes: number;
  fees: CustomsFee[];
  feesTotal: number;
  /** Paid at the consulate before leaving (euros). */
  consulateEur: number;
  /** Paid in Algeria: net duties & taxes + local fees (DZD). */
  algeriaDzd: number;
  /** Everything payable on top of the car: net duties & taxes + fees. */
  amountDue: number;
  amountDueEur: number;
  totalDzd: number;
  totalEur: number;
  effectiveRate: number;
}

const clampNum = (n: number | undefined) =>
  n != null && Number.isFinite(n) && n > 0 ? n : 0;

export function ddRateFor(fuel: CustomsFuel, engineCc: number, s: CustomsSettings): number {
  if (fuel === 'electrique') return s.dd_rate_electric;
  return engineCc > 0 && engineCc <= s.small_engine_max_cc ? s.dd_rate_small : s.dd_rate_large;
}

/** Decree 23-74 reduction — used cars (age ≥ 1) of the classic regime only. */
export function abattementRateFor(
  fuel: CustomsFuel,
  age: AgeBracket,
  engineCc: number,
  s: CustomsSettings
): number {
  if (age === 0 || age > STANDARD_MAX_AGE || fuel === 'diesel') return 0;
  if (fuel === 'electrique') return s.abatt_electric;
  return engineCc > 0 && engineCc <= s.abatt_threshold_cc ? s.abatt_small : s.abatt_large;
}

/** Depreciation of the reference value: nothing during the first year, then per year. */
export function depreciationFor(age: AgeBracket, s: CustomsSettings): number {
  return Math.min(0.9, Math.max(0, age - 1) * s.depreciation_per_year);
}

/** CCR chancellery fees in euros: fixed part + rate × started 100 € brackets. */
export function consularFeeEur(inventoryEur: number, student: boolean, s: CustomsSettings): number {
  const brackets = Math.ceil(clampNum(inventoryEur) / 100);
  const fee = s.ccr_consular_fixed_eur + brackets * 100 * s.ccr_consular_rate;
  return student ? fee * (1 - s.ccr_student_discount) : fee;
}

export function computeCustoms(input: CustomsInput, settings: CustomsSettings): CustomsResult {
  const s = withCustomsDefaults(settings);
  const fx = clampNum(input.exchangeRate) || s.exchange_rate_dzd;
  const cc = input.fuel === 'electrique' ? 0 : clampNum(input.engineCc);
  const regime = input.regime;

  // 1. Valuation: invoice vs depreciated reference (argus).
  const invoiceEur = clampNum(input.priceEur);
  const depreciationRate = depreciationFor(input.age, s);
  const ref = clampNum(input.referencePriceEur);
  const referenceEur = ref ? ref * s.foreign_vat_coef * (1 - depreciationRate) : null;
  const retained = referenceEur != null && referenceEur > invoiceEur ? 'reference' : 'invoice';
  const baseEur = retained === 'reference' ? (referenceEur as number) : invoiceEur;

  // 2. Customs value.
  const cifEur = baseEur + clampNum(input.freightEur) + clampNum(input.insuranceEur);
  const cifDzd = cifEur * fx;

  // 3–4. Duties & taxes.
  const ddRate = ddRateFor(input.fuel, cc, s);
  const dd = cifDzd * ddRate;
  const cs = cifDzd * s.cs_rate;
  const prct = cifDzd * s.prct_rate;
  const tvaBase = cifDzd + dd + cs + prct;
  const tva = tvaBase * s.tva_rate;
  const lines: CustomsLine[] = [
    { key: 'dd', rate: ddRate, base: cifDzd, amount: dd },
    { key: 'cs', rate: s.cs_rate, base: cifDzd, amount: cs },
    { key: 'prct', rate: s.prct_rate, base: cifDzd, amount: prct },
    { key: 'tva', rate: s.tva_rate, base: tvaBase, amount: tva },
  ];
  const grossTaxes = dd + cs + prct + tva;

  // Eligibility.
  const issues: CustomsIssue[] = [];
  if (input.fuel === 'diesel') issues.push('diesel');
  if (regime === 'standard') {
    if (input.age > STANDARD_MAX_AGE) issues.push('too_old');
  } else {
    if (input.age > s.ccr_max_age_years) issues.push('too_old');
    if (input.fuel !== 'electrique' && cc > s.ccr_max_cc) issues.push('ccr_engine');
    if (cifDzd > s.ccr_ceiling_dzd) issues.push('ccr_ceiling');
  }
  const ccrExempt = regime === 'ccr' && issues.length === 0;

  // 5. Reduction / exemption.
  const abattementRate = ccrExempt ? 1 : abattementRateFor(input.fuel, input.age, cc, s);
  const abattement = grossTaxes * abattementRate;
  const netTaxes = grossTaxes - abattement;

  // CCR fees: consulate (euros, before departure) + inspection in Algeria.
  const fees: CustomsFee[] = [];
  if (regime === 'ccr') {
    const inventoryEur = clampNum(input.inventoryValueEur) || baseEur;
    const consular = consularFeeEur(inventoryEur, Boolean(input.student), s);
    fees.push(
      { key: 'consular', where: 'consulate', amount: consular * fx, amountEur: consular },
      { key: 'inspection', where: 'algeria', amount: s.ccr_inspection_dzd, amountEur: null }
    );
  }
  const feesTotal = fees.reduce((sum, f) => sum + f.amount, 0);
  const consulateEur = fees.reduce((sum, f) => sum + (f.where === 'consulate' ? f.amountEur ?? 0 : 0), 0);
  const algeriaDzd = netTaxes + fees.reduce((sum, f) => sum + (f.where === 'algeria' ? f.amount : 0), 0);

  const amountDue = netTaxes + feesTotal;
  const totalDzd = cifDzd + amountDue;

  return {
    regime,
    ccrExempt,
    issues,
    valuation: { invoiceEur, referenceEur, depreciationRate, retained, baseEur },
    cifEur,
    cifDzd,
    lines,
    grossTaxes,
    abattementRate,
    abattement,
    netTaxes,
    fees,
    feesTotal,
    consulateEur,
    algeriaDzd,
    amountDue,
    amountDueEur: amountDue / fx,
    totalDzd,
    totalEur: totalDzd / fx,
    effectiveRate: cifDzd ? amountDue / cifDzd : 0,
  };
}

/** Age bracket at `now` from an ISO first-registration date (null if unknown or > 5 years). */
export function ageBracketFromDate(
  firstRegistration: string | null,
  now: Date = new Date()
): AgeBracket | null {
  if (!firstRegistration) return null;
  const d = new Date(firstRegistration);
  if (Number.isNaN(d.getTime())) return null;
  const years = (now.getTime() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
  if (years < 0) return 1;
  if (years >= 5) return null;
  return Math.max(1, Math.ceil(years)) as AgeBracket;
}

/** True when the first registration is less than 3 years before `now`. */
export function isUnderThreeYears(firstRegistration: string | null, now: Date = new Date()): boolean {
  const age = ageBracketFromDate(firstRegistration, now);
  return age != null && age <= STANDARD_MAX_AGE;
}

/** Map an inventory fuel type onto the simulator's categories. */
export function toCustomsFuel(fuel: string): CustomsFuel {
  if (fuel === 'electrique' || fuel === 'hybride' || fuel === 'diesel') return fuel;
  return 'essence';
}
