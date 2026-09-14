import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { normalizeCustoms } from '@/lib/cars';
import { DEFAULT_CUSTOMS } from '@/lib/customs';
import { AdminNav } from '@/components/admin/AdminNav';
import { NewCarEditor } from '@/components/admin/NewCarEditor';

export const dynamic = 'force-dynamic';

export default async function NewCarPage() {
  const supabase = await createClient();
  const [{ data: customsRow }, { count: newLeads }] = await Promise.all([
    supabase.from('customs_settings').select('*').eq('id', 1).maybeSingle(),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'nouveau'),
  ]);
  const customs = customsRow ? normalizeCustoms(customsRow) : DEFAULT_CUSTOMS;

  return (
    <div>
      <AdminNav newLeads={newLeads ?? 0} />
      <main className="container-x py-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Retour
        </Link>
        <h1 className="mb-8 mt-4 font-display text-2xl font-bold text-primary">
          Ajouter un véhicule
        </h1>
        <NewCarEditor customs={customs} />
      </main>
    </div>
  );
}
