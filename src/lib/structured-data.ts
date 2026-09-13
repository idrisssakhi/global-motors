import { SITE } from '@/lib/site';
import { carImageUrl } from '@/lib/image';
import type { Car } from '@/lib/types';
import type { Locale } from '@/i18n/routing';

const FUEL_SCHEMA: Record<string, string> = {
  essence: 'Gasoline',
  diesel: 'Diesel',
  hybride: 'Hybrid',
  electrique: 'Electric',
  gpl: 'LPG',
};

/** AutoDealer / Organization — emitted on the home page. */
export function autoDealerSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    telephone: SITE.phone || undefined,
    email: SITE.email || undefined,
    image: `${SITE.url}/opengraph-image`,
    areaServed: SITE.serviceAreas,
    foundingDate: SITE.legal.foundingDate,
    vatID: SITE.legal.vat,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'SIREN',
      value: SITE.legal.siren.replace(/\s/g, ''),
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressLocality: SITE.address.city,
      postalCode: SITE.address.postalCode,
      streetAddress: SITE.address.street,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.address.lat,
      longitude: SITE.address.lng,
    },
    sameAs: Object.values(SITE.social).filter(Boolean),
  };
}

/** Vehicle + Offer — emitted on each car detail page. */
export function vehicleSchema(car: Car, locale: Locale) {
  const name =
    (locale === 'ar' ? car.title_ar : car.title_fr) ||
    `${car.make} ${car.model} ${car.year}`;
  const description =
    (locale === 'ar' ? car.description_ar : car.description_fr) || name;

  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name,
    description,
    brand: { '@type': 'Brand', name: car.make },
    model: car.model,
    vehicleModelDate: String(car.year),
    dateVehicleFirstRegistered: car.first_registration || undefined,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage_km,
      unitCode: 'KMT',
    },
    vehicleEngine: car.engine_cc
      ? {
          '@type': 'EngineSpecification',
          engineDisplacement: {
            '@type': 'QuantitativeValue',
            value: car.engine_cc,
            unitCode: 'CMQ',
          },
        }
      : undefined,
    fuelType: FUEL_SCHEMA[car.fuel] ?? car.fuel,
    vehicleTransmission: car.gearbox,
    color: car.color || undefined,
    numberOfDoors: car.doors || undefined,
    vehicleSeatingCapacity: car.seats || undefined,
    image: (car.images ?? []).map(carImageUrl),
    offers: {
      '@type': 'Offer',
      price: car.price_eur,
      priceCurrency: 'EUR',
      availability:
        car.status === 'disponible'
          ? 'https://schema.org/InStock'
          : car.status === 'reserve'
            ? 'https://schema.org/LimitedAvailability'
            : 'https://schema.org/OutOfStock',
      url: `${SITE.url}/voitures/${car.slug}`,
      seller: { '@type': 'AutoDealer', name: SITE.name },
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}
