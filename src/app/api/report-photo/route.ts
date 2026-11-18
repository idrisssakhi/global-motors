import { type NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/report-photo?u=<original photo URL>
 *
 * Inspection PDFs only embed small thumbnails but link each one to its
 * full-size original. DEKRA's server sends no CORS header, so the admin
 * import (which runs in the browser) fetches those originals through here.
 *
 * Admin-only and limited to known report hosts — never an open proxy.
 */

const ALLOWED: { host: string; path: RegExp }[] = [
  { host: 'dis.dekra-automotivesolutions.com', path: /^\/Handlers\/d\.ashx$/i },
];

const MAX_BYTES = 25_000_000;
const TIMEOUT_MS = 20_000;

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  let target: URL;
  try {
    target = new URL(req.nextUrl.searchParams.get('u') ?? '');
  } catch {
    return new Response('Bad URL', { status: 400 });
  }
  const allowed =
    target.protocol === 'https:' &&
    !target.username &&
    !target.password &&
    ALLOWED.some((a) => a.host === target.hostname && a.path.test(target.pathname));
  if (!allowed) return new Response('Host not allowed', { status: 400 });

  let res: Response;
  try {
    res = await fetch(target, {
      cache: 'no-store',
      redirect: 'error', // a redirect could lead anywhere
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return new Response('Upstream unreachable', { status: 502 });
  }
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok || !type.startsWith('image/')) {
    return new Response('Upstream error', { status: 502 });
  }
  const body = await res.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > MAX_BYTES) {
    return new Response('Upstream error', { status: 502 });
  }
  return new Response(body, {
    headers: { 'content-type': type, 'cache-control': 'private, no-store' },
  });
}
