import { createClient } from '@/lib/supabase/server';
import { formatNumber } from '@/lib/format';
import { AdminNav } from '@/components/admin/AdminNav';
import { LeadRow, type LeadWithCar } from '@/components/admin/LeadRow';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*, cars(slug, make, model)')
    .order('created_at', { ascending: false });
  const leads = (data ?? []) as LeadWithCar[];
  const newLeads = leads.filter((l) => l.status === 'nouveau').length;

  return (
    <div>
      <AdminNav newLeads={newLeads} />

      <main className="container-x py-10">
        <h1 className="font-display text-2xl font-bold text-primary">
          Demandes
        </h1>
        <p className="mt-1 text-sm text-muted">
          {formatNumber(leads.length, 'fr')} demande(s) ·{' '}
          {formatNumber(newLeads, 'fr')} nouvelle(s)
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error.message}
          </p>
        )}

        {leads.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="text-muted">Aucune demande pour le moment.</p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 lg:grid-cols-2">
            {leads.map((lead) => (
              <li key={lead.id}>
                <LeadRow lead={lead} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
