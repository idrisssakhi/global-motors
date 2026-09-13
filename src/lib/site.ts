/**
 * Central company / site configuration.
 * Edit phone, e-mail and social links here — they propagate everywhere
 * (header, footer, contact page, WhatsApp buttons, structured data).
 * Empty values are hidden in the UI.
 */
export const SITE = {
  name: 'SKH Global Motors',
  legalName: 'SKH GLOBAL MOTORS',
  taglineFr: 'Véhicules d’exception en France & export vers l’Algérie',
  taglineAr: 'سيارات مميزة في فرنسا والتصدير إلى الجزائر',

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skh-global-motors.fr',

  phone: '+33 6 03 04 26 48',
  phoneHref: 'tel:+33603042648',
  whatsapp: '33603042648', // digits only, international format, no "+"
  email: '', // TODO: ex. 'contact@skh-global-motors.fr'

  address: {
    street: '7 rue de la Grande Ceinture',
    city: 'Argenteuil',
    postalCode: '95100',
    country: 'France',
    lat: 48.948911713693,
    lng: 2.25896764104141,
  },

  // Official registration data (annuaire-entreprises.data.gouv.fr).
  legal: {
    name: 'SKH GLOBAL MOTORS',
    legalForm: 'SAS',
    siren: '991 121 880',
    siret: '991 121 880 00017',
    vat: 'FR14991121880',
    ape: '45.11Z',
    apeLabel: 'Commerce de voitures et de véhicules automobiles légers',
    foundingDate: '2025-09-09',
    president: 'HOLDING SKH',
  },

  social: {
    instagram: '',
    tiktok: 'https://www.tiktok.com/@skh.global.motors',
    facebook: '',
    google: '',
  },

  serviceAreas: ['France', 'Algérie / Algeria', 'Europe'],

  keywords: [
    'SKH Global Motors',
    'achat voiture France',
    'voiture occasion récente',
    'véhicule moins de 3 ans',
    'export voiture Algérie',
    'exportation véhicule Algérie',
    'simulateur dédouanement Algérie',
    'calcul dédouanement voiture Algérie',
    'droits de douane voiture Algérie',
    'décret 23-74 abattement',
    'voiture hors taxe export',
    'TVA récupérable export',
    'garage automobile Argenteuil',
    'mandataire automobile Val-d’Oise',
    'voiture premium occasion',
  ] as string[],

  developer: {
    name: 'SKH Tech Labs',
  },

  /** Media credits (CC BY 4.0) — displayed in the footer. */
  credits: [
    {
      label: 'Ferrari F80 — VictorDoesCars',
      href: 'https://commons.wikimedia.org/wiki/File:2025-08-15_Monterey_Ferrari_F80.webm',
      license: 'CC BY 4.0',
    },
    {
      label: 'Aston Martin Valour — VictorDoesCars',
      href: 'https://commons.wikimedia.org/wiki/File:2025-08-14_Monterey_Aston_Martin_Valour.webm',
      license: 'CC BY 4.0',
    },
    {
      label: 'Silhouette Golf VIII tracée d’après une photo de Vauxford',
      href: 'https://commons.wikimedia.org/wiki/File:2020_Volkswagen_Golf_Style_1.5_Side.jpg',
      license: 'CC BY-SA 4.0',
    },
  ],
} as const;

/** WhatsApp deep link, or null when no WhatsApp number is configured. */
export function whatsappLink(message?: string): string | null {
  if (!SITE.whatsapp) return null;
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}`
)}`;
