import { NextResponse, type NextRequest } from 'next/server';

import { getSoldCarsPage } from '@/lib/cars';
import { SOLD_PAGE_SIZE, toSummary, type CarFilters } from '@/lib/car-filters';

const MAX_LIMIT = 24;

function num(v: string | null): number | undefined {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/**
 * GET /api/cars/sold?offset=0&limit=12&make=…&q=…
 * Sold cars are hidden from the listing by default and paged in on request.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filters: CarFilters = {
    make: sp.get('make') || undefined,
    fuel: sp.get('fuel') || undefined,
    gearbox: sp.get('gearbox') || undefined,
    maxPrice: num(sp.get('maxPrice')),
    minYear: num(sp.get('minYear')),
    exportDz: sp.get('exportDz') === '1',
    dz: sp.get('dz') || undefined,
    q: sp.get('q')?.slice(0, 80) || undefined,
    sort: sp.get('sort') || undefined,
  };
  const offset = Math.max(0, Math.floor(num(sp.get('offset')) ?? 0));
  const limit = Math.min(MAX_LIMIT, Math.floor(num(sp.get('limit')) ?? SOLD_PAGE_SIZE));

  try {
    const { cars, total } = await getSoldCarsPage(filters, offset, limit);
    return NextResponse.json(
      { cars: cars.map(toSummary), total, nextOffset: offset + cars.length },
      { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' } }
    );
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
