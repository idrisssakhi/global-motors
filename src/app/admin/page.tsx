import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Star, Car as CarIcon, CheckCircle2, Clock, Inbox } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { carImageUrl } from '@/lib/image';
import { formatPrice, formatNumber } from '@/lib/format';
import type { Car, CarStatus } from '@/lib/types';
import { AdminNav } from '@/components/admin/AdminNav';
import { DeleteCarButton } from '@/components/admin/DeleteCarButton';

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<CarStatus, string> = {
  disponible: 'bg-emerald-500/15 text-emerald-300',
  reserve: 'bg-amber-500/15 text-amber-300',
  vendu: 'bg-white/10 text-muted',
};

const STATUS_LABEL: Record<CarStatus, string> = {
  disponible: 'Disponible',
  reserve: 'Réservé',
  vendu: 'Vendu',
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ data }, { count: newLeads }] = await Promise.all([
    supabase.from('cars').select('*').order('created_at', { ascending: false }),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'nouveau'),
  ]);
  const cars = (data ?? []) as Car[];

  const kpis = [
    { label: 'Véhicules', value: cars.length, icon: CarIcon, href: undefined },
    {
      label: 'Disponibles',
      value: cars.filter((c) => c.status === 'disponible').length,
      icon: CheckCircle2,
      href: undefined,
    },
    {
      label: 'Réservés',
      value: cars.filter((c) => c.status === 'reserve').length,
      icon: Clock,
      href: undefined,
    },
    {
      label: 'Nouvelles demandes',
      value: newLeads ?? 0,
      icon: Inbox,
      href: '/admin/leads',
    },
  ];

  return (
    <div>
      <AdminNav newLeads={newLeads ?? 0} />

      <main className="container-x py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary">
              Véhicules
            </h1>
            <p className="mt-1 text-sm text-muted">
              {formatNumber(cars.length, 'fr')} véhicule(s) au total
            </p>
          </div>
          <Link
            href="/admin/cars/new"
            className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-accent-700"
          >
            <Plus className="h-5 w-5" aria-hidden />
            Ajouter un véhicule
          </Link>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ label, value, icon: Icon, href }) => {
            const body = (
              <>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
                  <Icon className="h-4 w-4 text-accent" aria-hidden />
                  {label}
                </p>
                <p className="mt-2 font-display text-3xl font-bold text-primary">
                  {formatNumber(value, 'fr')}
                </p>
              </>
            );
            const cls =
              'block rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]';
            return href ? (
              <Link
                key={label}
                href={href}
                className={`${cls} transition-colors hover:border-accent/50`}
              >
                {body}
              </Link>
            ) : (
              <div key={label} className={cls}>
                {body}
              </div>
            );
          })}
        </div>

        {cars.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="text-muted">
              Aucun véhicule. Ajoutez votre premier véhicule.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="border-b border-line bg-primary-50 text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Véhicule</th>
                  <th className="px-4 py-3 font-semibold">Prix</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">
                    Année
                  </th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {cars.map((car) => {
                  const cover = car.images?.[0]
                    ? carImageUrl(car.images[0])
                    : null;
                  const title =
                    car.title_fr ||
                    [car.make, car.model, car.version].filter(Boolean).join(' ');
                  return (
                    <tr key={car.id} className="hover:bg-primary-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-primary-50">
                            {cover && (
                              <Image
                                src={cover}
                                alt=""
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="flex items-center gap-1.5 font-semibold text-primary">
                              {car.featured && (
                                <Star
                                  className="h-3.5 w-3.5 fill-accent text-accent"
                                  aria-label="En vedette"
                                />
                              )}
                              {title}
                            </p>
                            <p className="text-xs text-muted">
                              {car.make} · {car.model}
                              {car.version ? ` · ${car.version}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">
                        {formatPrice(Number(car.price_eur), 'fr')}
                      </td>
                      <td className="hidden px-4 py-3 text-muted md:table-cell">
                        {car.year}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                            STATUS_BADGE[car.status]
                          }`}
                        >
                          {STATUS_LABEL[car.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/cars/${car.id}/edit`}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-50"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                            Modifier
                          </Link>
                          <DeleteCarButton
                            id={car.id}
                            images={car.images}
                            label={title}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
