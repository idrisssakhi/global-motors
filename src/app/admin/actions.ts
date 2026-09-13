'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { CARS_TAG, CUSTOMS_TAG } from '@/lib/cars';
import { DEFAULT_CUSTOMS, type CustomsSettings } from '@/lib/customs';
import { buildSlug } from '@/lib/format';
import { LEAD_STATUSES, type CarInput, type LeadStatus } from '@/lib/types';

export type ActionResult = { ok: boolean; error?: string };

/**
 * Returns an authenticated Supabase client, or redirects to login.
 * Writes go through the admin's own session — RLS already restricts
 * insert/update/delete to authenticated users, so no service-role key needed.
 */
async function getAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return supabase;
}

function revalidateCars() {
  updateTag(CARS_TAG); // drop the cached inventory query (lib/cars.ts)
  revalidatePath('/', 'layout'); // refresh public listing in both locales
  revalidatePath('/admin');
}

/** Lead changes only affect the back office (lists + "nouveau" badge). */
function revalidateLeads() {
  revalidatePath('/admin', 'layout');
}

// ── Cars ─────────────────────────────────────────────────────────────

export async function createCar(input: CarInput): Promise<ActionResult> {
  const supabase = await getAdminClient();

  const slug = buildSlug(
    input.make,
    input.model,
    input.year,
    crypto.randomUUID()
  );

  const { error } = await supabase.from('cars').insert({ ...input, slug });
  if (error) return { ok: false, error: error.message };

  revalidateCars();
  return { ok: true };
}

export async function updateCar(
  id: string,
  input: CarInput
): Promise<ActionResult> {
  const supabase = await getAdminClient();

  // Don't overwrite the slug on edit — keep the original permalink.
  const { slug: _slug, ...rest } = input;
  void _slug;
  const { error } = await supabase.from('cars').update(rest).eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateCars();
  return { ok: true };
}

export async function deleteCar(
  id: string,
  images: string[] = []
): Promise<ActionResult> {
  const supabase = await getAdminClient();

  if (images.length) {
    await supabase.storage.from('car-images').remove(images);
  }
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateCars();
  return { ok: true };
}

// ── Leads ────────────────────────────────────────────────────────────

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<ActionResult> {
  if (!LEAD_STATUSES.includes(status)) {
    return { ok: false, error: 'Statut invalide.' };
  }
  const supabase = await getAdminClient();

  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateLeads();
  return { ok: true };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const supabase = await getAdminClient();

  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateLeads();
  return { ok: true };
}

// ── Customs settings ─────────────────────────────────────────────────

export async function updateCustomsSettings(
  values: CustomsSettings
): Promise<ActionResult> {
  // Only persist known keys, and only finite non-negative numbers.
  const row = {} as CustomsSettings;
  for (const key of Object.keys(DEFAULT_CUSTOMS) as (keyof CustomsSettings)[]) {
    const n = Number(values[key]);
    if (!Number.isFinite(n) || n < 0) {
      return { ok: false, error: `Valeur invalide pour « ${key} ».` };
    }
    row[key] = n;
  }

  const supabase = await getAdminClient();

  const { error } = await supabase
    .from('customs_settings')
    .update(row)
    .eq('id', 1);
  if (error) return { ok: false, error: error.message };

  updateTag(CUSTOMS_TAG); // drop the cached settings (lib/cars.ts)
  revalidatePath('/', 'layout'); // simulator + car pages in both locales
  revalidatePath('/admin', 'layout');
  return { ok: true };
}
