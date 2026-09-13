'use server';

import { createPublicClient } from '@/lib/supabase/public';
import { isSupabaseConfigured } from '@/lib/cars';
import type { LeadKind } from '@/lib/types';

export interface LeadSubmission {
  kind: LeadKind;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  carId?: string;
  locale: 'fr' | 'ar';
  payload?: Record<string, string | number | boolean | null>;
  /** Honeypot — real visitors never fill it. */
  website?: string;
}

const KINDS: LeadKind[] = ['contact', 'vehicule', 'dedouanement', 'recherche'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Stores a visitor request in `leads`. RLS lets anonymous visitors insert
 * (status 'nouveau' only) but never read, so no service key is needed.
 */
export async function submitLead(
  input: LeadSubmission
): Promise<{ ok: boolean; error?: 'invalid' | 'failed' }> {
  // Bots filling the honeypot get a silent success.
  if (input.website) return { ok: true };

  const name = input.name?.trim() ?? '';
  const phone = input.phone?.trim() ?? '';
  const email = input.email?.trim() || null;
  const message = input.message?.trim() || null;

  if (
    name.length < 2 ||
    name.length > 120 ||
    phone.replace(/\D/g, '').length < 6 ||
    phone.length > 40 ||
    (email && (email.length > 200 || !email.includes('@'))) ||
    (message && message.length > 4000) ||
    !KINDS.includes(input.kind)
  ) {
    return { ok: false, error: 'invalid' };
  }

  if (!isSupabaseConfigured()) return { ok: false, error: 'failed' };

  const { error } = await createPublicClient()
    .from('leads')
    .insert({
      kind: input.kind,
      name,
      phone,
      email,
      message,
      car_id: input.carId && UUID.test(input.carId) ? input.carId : null,
      locale: input.locale === 'ar' ? 'ar' : 'fr',
      payload: input.payload ?? {},
    });

  if (error) {
    console.error('submitLead:', error.message);
    return { ok: false, error: 'failed' };
  }
  return { ok: true };
}
