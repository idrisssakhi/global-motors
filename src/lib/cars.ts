import { unstable_cache } from 'next/cache';

import { createPublicClient } from '@/lib/supabase/public';
import { filterCars, type CarFilters } from '@/lib/car-filters';
import { withCustomsDefaults, type CustomsSettings } from '@/lib/customs';
import type { Car } from '@/lib/types';

export { carImageUrl } from '@/lib/image';
export type { CarFilters } from '@/lib/car-filters';

/** Cache tags — invalidated by the admin server actions. */
export const CARS_TAG = 'cars';
export const CUSTOMS_TAG = 'customs';

/** True when Supabase env vars are present (lets the app build without creds). */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** The whole inventory in ONE cached query; every public read derives from it. */
const getInventory = unstable_cache(
  async (): Promise<Car[]> => {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await createPublicClient()
      .from('cars')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    // Throw rather than return [] so a transient error is never cached.
    if (error) throw new Error(`getInventory: ${error.message}`);
    return (data ?? []) as Car[];
  },
  ['cars-inventory'],
  { tags: [CARS_TAG], revalidate: 86400 }
);

/** Public listing — never returns sold cars. */
export async function getCars(filters: CarFilters = {}): Promise<Car[]> {
  const cars = (await getInventory()).filter((c) => c.status !== 'vendu');
  return filterCars(cars, filters);
}

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  return (await getCars()).slice(0, limit);
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  return (await getInventory()).find((c) => c.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  return (await getInventory()).map((c) => c.slug);
}

export async function getMakes(): Promise<string[]> {
  return [...new Set((await getCars()).map((c) => c.make))].sort();
}

export async function getRelatedCars(car: Car, limit = 3): Promise<Car[]> {
  const others = (await getCars()).filter((c) => c.id !== car.id);
  const sameMake = others.filter((c) => c.make === car.make);
  return [...sameMake, ...others.filter((c) => c.make !== car.make)].slice(0, limit);
}

/** Customs rates edited from the admin; falls back to the defaults. */
const getCustomsRow = unstable_cache(
  async (): Promise<Record<string, unknown> | null> => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await createPublicClient()
      .from('customs_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (error) throw new Error(`getCustomsSettings: ${error.message}`);
    return data;
  },
  ['customs-settings-row'],
  { tags: [CUSTOMS_TAG], revalidate: 86400 }
);

/**
 * Customs rates edited from the admin. The raw row is cached and normalised
 * on every call, so keys added by later migrations always get a value.
 */
export async function getCustomsSettings(): Promise<CustomsSettings> {
  return normalizeCustoms((await getCustomsRow()) ?? {});
}

/** Postgres numerics arrive as strings — coerce every known key to a number. */
export function normalizeCustoms(row: Record<string, unknown>): CustomsSettings {
  return withCustomsDefaults(row);
}
