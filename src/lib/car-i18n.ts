import type { Car } from '@/lib/types';

type Titled = Pick<Car, 'make' | 'model' | 'title_fr' | 'title_ar'> & { title_en?: string | null };
type Described = Pick<Car, 'description_fr' | 'description_ar'> & { description_en?: string | null };

/** Localized car title; English falls back to French, then to make + model. */
export function carTitle(car: Titled, locale: string, fallback = `${car.make} ${car.model}`): string {
  const own = locale === 'ar' ? car.title_ar : locale === 'en' ? car.title_en : car.title_fr;
  return own || (locale === 'en' ? car.title_fr : null) || fallback;
}

/** Localized description; English falls back to French. */
export function carDescription(car: Described, locale: string): string | null {
  if (locale === 'ar') return car.description_ar;
  if (locale === 'en') return car.description_en || car.description_fr;
  return car.description_fr;
}
