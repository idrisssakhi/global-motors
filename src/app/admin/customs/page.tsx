import { createClient } from '@/lib/supabase/server';
import { normalizeCustoms } from '@/lib/cars';
import { DEFAULT_CUSTOMS } from '@/lib/customs';
import { formatDate } from '@/lib/format';
import { AdminNav } from '@/components/admin/AdminNav';
import { CustomsSettingsForm } from '@/components/admin/CustomsSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminCustomsPage() {
  const supabase = await createClient();
  const [{ data }, { count: newLeads }] = await Promise.all([
    supabase.from('customs_settings').select('*').eq('id', 1).maybeSingle(),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'nouveau'),
  ]);
  const settings = data ? normalizeCustoms(data) : DEFAULT_CUSTOMS;
  const updatedAt =
    data && typeof data.updated_at === 'string' ? data.updated_at : null;

  return (
    <div>
      <AdminNav newLeads={newLeads ?? 0} />

      <main className="container-x py-10">
        <h1 className="font-display text-2xl font-bold text-primary">
          Dédouanement Algérie
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Taux utilisés par le simulateur public et les fiches véhicules.
          Mettez-les à jour à chaque loi de finances — aucun redéploiement
          nécessaire.
          {updatedAt && <> Dernière mise à jour : {formatDate(updatedAt)}.</>}
        </p>

        <div className="mt-8">
          <CustomsSettingsForm initial={settings} />
        </div>
      </main>
    </div>
  );
}
