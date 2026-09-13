export type FuelType = 'essence' | 'diesel' | 'hybride' | 'electrique' | 'gpl';
export type GearboxType = 'manuelle' | 'automatique';
export type CarStatus = 'disponible' | 'reserve' | 'vendu';
export type LeadKind = 'contact' | 'vehicule' | 'dedouanement' | 'recherche';
export type LeadStatus = 'nouveau' | 'en_cours' | 'traite';

export interface Car {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  make: string;
  model: string;
  version: string | null;
  year: number;
  first_registration: string | null; // ISO date (YYYY-MM-DD)
  immatriculation: string | null;
  price_eur: number; // prix TTC
  price_ht: number | null; // prix HT (si TVA récupérable)
  vat_recoverable: boolean;
  mileage_km: number;
  fuel: FuelType;
  gearbox: GearboxType;
  engine_cc: number | null; // cylindrée (cm³)
  power_hp: number | null;
  doors: number | null;
  seats: number | null;
  color: string | null;
  location: string | null;
  title_fr: string | null;
  title_ar: string | null;
  description_fr: string | null;
  description_ar: string | null;
  images: string[];
  video_url: string | null;
  featured: boolean;
  export_dz: boolean;
  status: CarStatus;
}

/** Shape used by the admin create/update form. */
export type CarInput = Omit<Car, 'id' | 'created_at' | 'updated_at'>;

export interface Lead {
  id: string;
  created_at: string;
  kind: LeadKind;
  status: LeadStatus;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  car_id: string | null;
  locale: 'fr' | 'ar' | null;
  payload: Record<string, unknown>;
}

export const FUEL_TYPES: FuelType[] = [
  'essence',
  'hybride',
  'electrique',
  'diesel',
  'gpl',
];
export const GEARBOX_TYPES: GearboxType[] = ['automatique', 'manuelle'];
export const CAR_STATUSES: CarStatus[] = ['disponible', 'reserve', 'vendu'];
export const LEAD_STATUSES: LeadStatus[] = ['nouveau', 'en_cours', 'traite'];
