import { DEFAULT_CUSTOMS, STANDARD_MAX_AGE } from '@/lib/customs';
import type { Car } from '@/lib/types';

/**
 * Which Algerian import routes a car qualifies for, derived from its data.
 * Client-safe and indicative only: the customs simulator and an advisor
 * confirm each case.
 *
 * - 'res3'   : resident in Algeria, new or used car under 3 years, not diesel
 * - 'ccr5'   : permanent return with a CCR (LF 2026), under 5 years, not
 *              diesel, engine ≤ ccr_max_cc (any size when electric)
 * - 'diesel' : diesel — no exemption or reduction, full duties
 */
export type DzRoute = 'res3' | 'ccr5' | 'diesel';
export const DZ_ROUTES: Exclude<DzRoute, 'diesel'>[] = ['res3', 'ccr5'];

type EligibilityInput = Pick<Car, 'fuel' | 'engine_cc' | 'first_registration' | 'year' | 'mileage_km' | 'export_dz'>;

const YEAR_MS = 365.25 * 24 * 3600 * 1000;

/** Age in years: first registration when known, else conservatively from the model year. */
export function carAgeYears(car: EligibilityInput, now: Date = new Date()): number | null {
  if (car.first_registration) {
    const d = new Date(car.first_registration);
    if (!Number.isNaN(d.getTime())) return Math.max(0, (now.getTime() - d.getTime()) / YEAR_MS);
  }
  if (car.mileage_km < 100) return 0; // new car, never registered
  if (!car.year) return null;
  // Model year only: assume registration on 1 January (oldest possible).
  return Math.max(0, now.getFullYear() - car.year + now.getMonth() / 12);
}

export function dzRoutes(
  car: EligibilityInput,
  ccrMaxCc: number = DEFAULT_CUSTOMS.ccr_max_cc,
  ccrMaxAge: number = DEFAULT_CUSTOMS.ccr_max_age_years,
  now: Date = new Date()
): DzRoute[] {
  if (!car.export_dz) return [];
  if (car.fuel === 'diesel') return ['diesel'];
  const age = carAgeYears(car, now);
  if (age == null) return [];
  const routes: DzRoute[] = [];
  if (age < STANDARD_MAX_AGE) routes.push('res3');
  const engineOk = car.fuel === 'electrique' || (car.engine_cc != null && car.engine_cc <= ccrMaxCc);
  if (age < ccrMaxAge && engineOk) routes.push('ccr5');
  return routes;
}
