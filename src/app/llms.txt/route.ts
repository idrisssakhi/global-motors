import { SITE } from '@/lib/site';
import { getCars } from '@/lib/cars';

export const revalidate = 86400;

/**
 * /llms.txt (https://llmstxt.org) — plain-Markdown summary of the site for
 * AI assistants and crawlers: what the company does and where to find it.
 */
export async function GET() {
  const base = SITE.url.replace(/\/$/, '');
  const cars = await getCars();
  const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  const body = `# ${SITE.name}

> ${SITE.taglineFr}. ${SITE.legal.name} (${SITE.legal.legalForm}, SIREN ${SITE.legal.siren}) sells recent and premium vehicles in France, handles turnkey export to Algeria and offers an Algerian customs duty simulator. Site in French (default) and Arabic (/ar).

- Address: ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, ${SITE.address.country}
${SITE.phone ? `- Phone / WhatsApp: ${SITE.phone}\n` : ''}${SITE.email ? `- E-mail: ${SITE.email}\n` : ''}- Service areas: ${SITE.serviceAreas.join(', ')}

## Main pages

- [Vehicles for sale](${base}/voitures): current inventory with prices (EUR, VAT included unless marked HT)
- [Algeria customs simulator](${base}/simulateur-dedouanement): indicative estimate of Algerian customs duties and taxes (not an official quote)
- [About](${base}/a-propos)
- [Contact](${base}/contact)
- [Arabic version](${base}/ar)

## Vehicles currently listed

${cars.length ? cars.map((c) => `- [${c.make} ${c.model}${c.version ? ` ${c.version}` : ''} (${c.year})](${base}/voitures/${c.slug}): ${eur.format(c.price_eur)}, ${c.mileage_km.toLocaleString('fr-FR')} km${c.status === 'vendu' ? ' (SOLD)' : c.status === 'reserve' ? ' (reserved)' : ''}`).join('\n') : '- No vehicle listed at the moment.'}

## Legal

- [Legal notice](${base}/mentions-legales)
- [Terms of use](${base}/conditions-utilisation)
- [Privacy policy](${base}/confidentialite)
- [Cookie policy](${base}/cookies)
`;

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
