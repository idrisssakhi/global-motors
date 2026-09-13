import type { Car } from '@/lib/types';

/** Client-safe filtering helpers shared by the server data layer and CarList. */

export interface CarFilters {
  make?: string;
  fuel?: string;
  gearbox?: string;
  maxPrice?: number;
  minYear?: number;
  exportDz?: boolean;
  q?: string;
  sort?: string;
}

/** The fields a CarCard needs — keeps the listing payload small. */
export type CarSummary = Pick<
  Car,
  | 'id'
  | 'slug'
  | 'make'
  | 'model'
  | 'version'
  | 'year'
  | 'price_eur'
  | 'price_ht'
  | 'vat_recoverable'
  | 'mileage_km'
  | 'fuel'
  | 'gearbox'
  | 'power_hp'
  | 'title_fr'
  | 'title_ar'
  | 'images'
  | 'featured'
  | 'export_dz'
  | 'status'
  | 'created_at'
>;

export function toSummary(car: Car): CarSummary {
  return {
    id: car.id,
    slug: car.slug,
    make: car.make,
    model: car.model,
    version: car.version,
    year: car.year,
    price_eur: car.price_eur,
    price_ht: car.price_ht,
    vat_recoverable: car.vat_recoverable,
    mileage_km: car.mileage_km,
    fuel: car.fuel,
    gearbox: car.gearbox,
    power_hp: car.power_hp,
    title_fr: car.title_fr,
    title_ar: car.title_ar,
    images: car.images.slice(0, 2), // cover + hover photo
    featured: car.featured,
    export_dz: car.export_dz,
    status: car.status,
    created_at: car.created_at,
  };
}

export function filterCars<T extends CarSummary>(cars: T[], f: CarFilters): T[] {
  const q = f.q?.trim().toLowerCase();
  const out = cars.filter(
    (car) =>
      (!f.make || car.make === f.make) &&
      (!f.fuel || car.fuel === f.fuel) &&
      (!f.gearbox || car.gearbox === f.gearbox) &&
      (!f.maxPrice || car.price_eur <= f.maxPrice) &&
      (!f.minYear || car.year >= f.minYear) &&
      (!f.exportDz || car.export_dz) &&
      (!q ||
        `${car.make} ${car.model} ${car.version ?? ''}`.toLowerCase().includes(q))
  );

  switch (f.sort) {
    case 'price-asc':
      return out.sort((a, b) => a.price_eur - b.price_eur);
    case 'price-desc':
      return out.sort((a, b) => b.price_eur - a.price_eur);
    case 'km-asc':
      return out.sort((a, b) => a.mileage_km - b.mileage_km);
    case 'year-desc':
      return out.sort((a, b) => b.year - a.year);
    default:
      return out;
  }
}
