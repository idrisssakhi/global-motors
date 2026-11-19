import { type NextRequest } from 'next/server';
import { createTranslator, hasLocale } from 'next-intl';

import { routing, type Locale } from '@/i18n/routing';
import { getCarBySlug, getCustomsSettings } from '@/lib/cars';
import { renderCarReport } from '@/lib/server/car-report';

/**
 * GET /api/cars/:slug/report?lang=fr|en|ar → branded PDF "fiche véhicule".
 *
 * Rendering embeds and re-encodes every photo, so finished PDFs are kept in a
 * small in-memory cache keyed by the car's last update and the customs
 * settings (a price or rate change produces a new document).
 */

const MAX_CACHED = 24;
const cache = new Map<string, Buffer>();
const inflight = new Map<string, Promise<Buffer>>();

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const lang = req.nextUrl.searchParams.get('lang');
  const locale: Locale = hasLocale(routing.locales, lang) ? lang : routing.defaultLocale;

  const [car, customs] = await Promise.all([getCarBySlug(slug).catch(() => null), getCustomsSettings()]);
  if (!car) return new Response('Not found', { status: 404 });

  const day = new Date().toISOString().slice(0, 10); // the PDF prints its issue date
  const key = `${car.id}:${car.updated_at}:${locale}:${day}:${JSON.stringify(customs)}`;
  let pdf = cache.get(key);
  if (!pdf) {
    let pending = inflight.get(key);
    if (!pending) {
      pending = (async () => {
        const messages = (await import(`../../../../../../messages/${locale}.json`)).default;
        const tr = (namespace?: string) => createTranslator({ locale, messages, namespace: namespace as never });
        const t = tr();
        const [fuel, gearbox, status, dz] = [tr('fuel'), tr('gearbox'), tr('status'), tr('dz')];
        return renderCarReport({
          car,
          locale,
          customs,
          L: {
            t: (k, v) => t(k as never, v as never),
            fuel: (k) => fuel(k as never),
            gearbox: (k) => gearbox(k as never),
            status: (k) => status(k as never),
            dz: (k) => dz(k as never),
          },
        });
      })().finally(() => inflight.delete(key));
      inflight.set(key, pending);
    }
    try {
      pdf = await pending;
    } catch (err) {
      console.error('[report] PDF generation failed', err);
      return new Response('Report unavailable', { status: 500 });
    }
    cache.set(key, pdf);
    while (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value!);
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(pdf.byteLength),
      'Content-Disposition': `attachment; filename="skh-global-motors-${slug}${locale === 'fr' ? '' : `-${locale}`}.pdf"`,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
    },
  });
}
