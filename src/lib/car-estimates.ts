import { computeCustoms, toCustomsFuel, type AgeBracket, type CustomsRegime, type CustomsSettings } from '@/lib/customs';
import { carAgeYears, dzRoutes, type DzRoute } from '@/lib/eligibility';
import type { Car } from '@/lib/types';

/** Customs age bracket for a car (new, never registered → 0; unknown → 3). */
export function ageBracketOf(car: Car): AgeBracket {
  const years = carAgeYears(car);
  if (years == null) return 3;
  if (car.mileage_km < 100 && !car.first_registration) return 0;
  return Math.min(5, Math.max(1, Math.ceil(years))) as AgeBracket;
}

/** Price used for export: HT when VAT is recoverable, TTC otherwise. */
export function exportPriceOf(car: Car): number {
  return car.vat_recoverable && car.price_ht ? car.price_ht : car.price_eur;
}

export interface DeliveredEstimate {
  route: Exclude<DzRoute, 'diesel'>;
  totalEur: number;
  totalDzd: number;
}

/** "Delivered to Algeria" estimate for each route the car qualifies for. */
export function deliveredEstimates(car: Car, customs: CustomsSettings): DeliveredEstimate[] {
  if (car.status === 'vendu') return [];
  const routes = dzRoutes(car, customs.ccr_max_cc, customs.ccr_max_age_years);
  return (['res3', 'ccr5'] as const)
    .filter((r) => routes.includes(r))
    .map((r) => {
      const regime: CustomsRegime = r === 'res3' ? 'standard' : 'ccr';
      const res = computeCustoms(
        {
          regime,
          fuel: toCustomsFuel(car.fuel),
          age: ageBracketOf(car),
          engineCc: car.engine_cc ?? 1400,
          priceEur: exportPriceOf(car),
          freightEur: customs.default_freight_eur,
          insuranceEur: customs.default_insurance_eur,
          exchangeRate: customs.exchange_rate_dzd,
        },
        customs
      );
      return { route: r, totalEur: res.totalEur, totalDzd: res.totalDzd };
    });
}
