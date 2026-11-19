/**
 * Central company / site configuration.
 * Edit phone, e-mail and social links here — they propagate everywhere
 * (header, footer, contact page, WhatsApp buttons, structured data).
 * Empty values are hidden in the UI.
 */
export const SITE = {
  name: 'SKH Global Motors',
  legalName: 'SKH GLOBAL MOTORS',
  taglineFr: 'Vente de véhicules récents et premium en France, en Europe & export vers le Maghreb',
  taglineAr: 'بيع سيارات حديثة وفاخرة في فرنسا وأوروبا والتصدير إلى المغرب العربي',
  taglineEn: 'Recent & premium cars for sale in France, Europe & export to the Maghreb',

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skh-global-motors.fr',

  phone: '+33 6 03 04 26 48',
  phoneHref: 'tel:+33603042648',
  whatsapp: '33603042648', // digits only, international format, no "+"
  email: 'skh.global.motors@gmail.com',

  /** Registered office (domiciliation) — legal notices only, no vehicles on site. */
  address: {
    street: '7 rue de la Grande Ceinture',
    city: 'Argenteuil',
    postalCode: '95100',
    country: 'France',
  },

  /** Showroom / depot where the vehicles are on display — the address visitors should go to. */
  showroom: {
    street: '9 avenue du Général de Gaulle',
    city: 'Montmagny',
    postalCode: '95360',
    country: 'France',
    lat: 48.974051,
    lng: 2.348428,
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
    rcs: 'RCS Pontoise 991 121 880',
    capital: '1 000 €',
    /** Natural person responsible for the content (LCEN) — usually HOLDING SKH's legal representative. */
    publicationDirector: 'Idris Sakhi',
    /**
     * Consumer mediator (Code de la consommation L612-1) — mandatory for any
     * professional selling to consumers. Leave empty until a membership is signed.
     */
    mediator: { name: '', address: '', url: '' },
  },

  /** Web host (LCEN art. 1-1) and data processors listed in the privacy policy. */
  hosting: {
    name: 'Railway Corporation',
    address: '548 Market St PMB 68956, San Francisco, CA 94104, États-Unis',
    url: 'https://railway.com',
    contact: 'privacy@railway.com',
  },
  dataHost: {
    name: 'Supabase Pte. Ltd.',
    location: 'Union européenne (Irlande, région eu-west-1)',
    url: 'https://supabase.com',
  },

  /** How long visitor requests are kept (months) — must match the purge job in supabase/migrations. */
  leadRetentionMonths: 36,
  /** Cookie consent is asked again after this many months (CNIL recommendation: 6). */
  consentMaxAgeMonths: 6,
  /**
   * Show the cookie dialog automatically on the first visit. Off by default:
   * the only optional trackers are click-to-load embeds, which ask for consent
   * in place, so CNIL does not require a site-wide banner.
   */
  cookieBannerOnFirstVisit: false,
  policiesUpdatedAt: '2026-09-28',

  social: {
    instagram: '',
    tiktok: 'https://www.tiktok.com/@skh.global.motors',
    facebook: '',
    /** Google Business Profile (share link from Google Maps). */
    google: 'https://share.google/6tL8FzaoFelJ3KVvT',
  },

  serviceAreas: ['France', 'Europe', 'Belgique / Belgium', 'Allemagne / Germany', 'Espagne / Spain', 'Italie / Italy', 'Pays-Bas / Netherlands', 'Luxembourg', 'Algérie / Algeria', 'Tunisie / Tunisia', 'Maroc / Morocco'],

  /**
   * Markets served. Algeria is the core export market (customs simulator);
   * Tunisia and Morocco are handled on request; France is direct sale.
   */
  markets: ['fr', 'dz', 'tn', 'ma'] as const,

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
    'garage automobile Montmagny',
    'voiture occasion Montmagny',
    'garage automobile Argenteuil',
    'mandataire automobile Val-d’Oise',
    'export voiture Tunisie',
    'export voiture Maroc',
    'car export France Algeria',
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

/** One-line showroom address, e.g. "9 avenue du Général de Gaulle, 95360 Montmagny". */
export const SHOWROOM_ADDRESS = `${SITE.showroom.street}, ${SITE.showroom.postalCode} ${SITE.showroom.city}`;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOWROOM_ADDRESS)}`;

/** Turn-by-turn links to the showroom, one per navigation app. */
export const DIRECTIONS = {
  waze: `https://waze.com/ul?ll=${SITE.showroom.lat},${SITE.showroom.lng}&navigate=yes`,
  google: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SHOWROOM_ADDRESS)}`,
  apple: `https://maps.apple.com/?daddr=${encodeURIComponent(SHOWROOM_ADDRESS)}&dirflg=d`,
} as const;
