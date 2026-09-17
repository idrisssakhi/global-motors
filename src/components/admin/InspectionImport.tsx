'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  FileText,
  ImagePlus,
  Loader2,
  RotateCcw,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { extensionFor, uploadCarImage } from '@/lib/car-images';
import { formatNumber } from '@/lib/format';
import {
  fetchOriginalPhoto,
  parseInspectionReport,
  type InspectionReport,
  type ReportDamage,
  type ReportPhoto,
} from '@/lib/inspection-report';
import type { CarInput } from '@/lib/types';

type PhotoWithUrl = ReportPhoto & { url: string };
type Review = Omit<InspectionReport, 'photos'> & { photos: PhotoWithUrl[] };
type Imported = {
  title: string;
  photoCount: number;
  /** Photos downloaded from their original link (the rest came from the PDF). */
  originals: number;
  vin: string | null;
  reportNumber: string | null;
  damages: ReportDamage[];
};

const FUEL_LABELS: Record<string, string> = {
  essence: 'Essence',
  diesel: 'Diesel',
  hybride: 'Hybride',
  electrique: 'Électrique',
  gpl: 'GPL',
};

function revokeAll(photos: PhotoWithUrl[]) {
  photos.forEach((p) => URL.revokeObjectURL(p.url));
}

function DamageList({ damages }: { damages: ReportDamage[] }) {
  const groups = Map.groupBy(damages, (d) => d.group || 'Dommages');
  return (
    <div className="space-y-3 text-sm">
      {[...groups].map(([group, list]) => (
        <div key={group}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {group} ({list.length})
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-ink">
            {list.map((d, i) => (
              <li key={i}>{d.label}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * "Importer un rapport d'inspection" — reads the PDF, lets the admin pick
 * which photos go on the listing, uploads them, then pre-fills the car form.
 */
export function InspectionImport({
  onImport,
}: {
  onImport: (draft: Partial<CarInput>) => void;
}) {
  const [review, setReview] = useState<Review | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState<Imported | null>(null);

  // Thumbnail object URLs are released on discard, import, and unmount.
  const photosRef = useRef<PhotoWithUrl[]>([]);
  useEffect(() => () => revokeAll(photosRef.current), []);

  function discard() {
    revokeAll(photosRef.current);
    photosRef.current = [];
    setReview(null);
    setSelected(new Set());
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    discard();
    setError(null);
    setImported(null);
    setBusy('Lecture du PDF…');
    try {
      const report = await parseInspectionReport(file, (page, total) =>
        setBusy(`Analyse du rapport — page ${page}/${total}…`)
      );
      const photos = report.photos.map((p) => ({ ...p, url: URL.createObjectURL(p.blob) }));
      photosRef.current = photos;
      setReview({ ...report, photos });
      setSelected(new Set(photos.filter((p) => p.suggested).map((p) => p.id)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lecture du PDF impossible.');
    } finally {
      setBusy(null);
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setGroup(section: ReportPhoto['section'], on: boolean) {
    if (!review) return;
    setSelected((prev) => {
      const next = new Set(prev);
      for (const p of review.photos) {
        if (p.section !== section) continue;
        if (on) next.add(p.id);
        else next.delete(p.id);
      }
      return next;
    });
  }

  async function confirm() {
    if (!review) return;
    const chosen = review.photos.filter((p) => selected.has(p.id));
    const supabase = createClient();
    const images: string[] = [];
    let originals = 0;
    setError(null);
    try {
      for (const [i, photo] of chosen.entries()) {
        setBusy(`Téléchargement et téléversement des photos — ${i + 1}/${chosen.length}…`);
        const { blob, original } = await fetchOriginalPhoto(photo);
        if (original) originals++;
        images.push(await uploadCarImage(supabase, blob, extensionFor(blob)));
      }
    } catch (e) {
      // Don't leave half an import in the bucket.
      if (images.length) await supabase.storage.from('car-images').remove(images);
      setError(e instanceof Error ? e.message : 'Échec du téléversement.');
      setBusy(null);
      return;
    }

    onImport({ ...review.car, images });
    setImported({
      title: [review.car.make, review.car.model].filter(Boolean).join(' '),
      photoCount: images.length,
      originals,
      vin: review.vin,
      reportNumber: review.reportNumber,
      damages: review.damages,
    });
    discard();
    setBusy(null);
  }

  const section =
    'rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]';
  const car = review?.car;
  const facts = car
    ? ([
        ['Marque', car.make],
        ['Modèle', car.model],
        ['1ère immatriculation', car.first_registration?.split('-').reverse().join('/')],
        ['Kilométrage', car.mileage_km != null ? `${formatNumber(car.mileage_km, 'fr')} km` : null],
        ['Carburant', car.fuel ? FUEL_LABELS[car.fuel] : null],
        ['Boîte', car.gearbox === 'manuelle' ? 'Manuelle' : car.gearbox ? 'Automatique' : null],
        ['Cylindrée', car.engine_cc ? `${formatNumber(car.engine_cc, 'fr')} cm³` : null],
        ['Puissance', car.power_hp ? `${car.power_hp} ch` : null],
        ['Portes / places', car.doors || car.seats ? `${car.doors ?? '–'} / ${car.seats ?? '–'}` : null],
        ['Couleur', car.color],
      ] as const)
    : [];

  return (
    <section className={`${section} mb-8`} aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
            <FileText className="h-5 w-5 text-accent" aria-hidden />
            Importer un rapport d’inspection
          </h2>
          <p className="mt-1 text-sm text-muted">
            PDF Macadam : les caractéristiques, l’équipement et les photos
            pré-remplissent la fiche. Le prix reste à saisir.
          </p>
        </div>
        {(review || imported) && !busy && (
          <button
            type="button"
            onClick={() => {
              discard();
              setImported(null);
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            {review ? 'Annuler' : 'Importer un autre rapport'}
          </button>
        )}
      </div>

      {busy && (
        <p className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
          <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden />
          {busy}
        </p>
      )}

      {!busy && !review && !imported && (
        <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line px-4 py-6 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-primary">
          <FileText className="h-5 w-5" aria-hidden />
          Choisir le PDF du rapport
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </label>
      )}

      {error && (
        <p
          role="alert"
          className="mt-5 flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      {!busy && imported && (
        <div className="mt-5 rounded-xl border border-accent/25 bg-accent-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Check className="h-4 w-4 text-accent" aria-hidden />
            {imported.title} importé · {imported.photoCount} photo(s) ajoutée(s).
            Vérifiez la fiche ci-dessous et renseignez le prix.
          </p>
          <p className="mt-1 text-xs text-muted">
            {imported.originals}/{imported.photoCount} photo(s) téléchargée(s)
            depuis le lien d’origine
            {imported.originals < imported.photoCount && ', les autres extraites du PDF'}
            {' · '}
            {imported.reportNumber && <>Rapport n° {imported.reportNumber} · </>}
            {imported.vin && <>VIN {imported.vin}</>}
          </p>
          {imported.damages.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-primary">
                Dommages relevés ({imported.damages.length}) — non publiés
              </summary>
              <div className="mt-3">
                <DamageList damages={imported.damages} />
              </div>
            </details>
          )}
        </div>
      )}

      {!busy && review && (
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-xs text-muted">
              {review.reportNumber && <>Rapport n° {review.reportNumber}</>}
              {review.inspectedAt && <> · inspecté le {review.inspectedAt}</>}
              {review.vin && <> · VIN {review.vin}</>}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="font-medium text-primary">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>

          {(['commercial', 'damage'] as const).map((group) => {
            const list = review.photos.filter((p) => p.section === group);
            if (!list.length) return null;
            const count = list.filter((p) => selected.has(p.id)).length;
            return (
              <div key={group}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-primary">
                    {group === 'commercial' ? 'Photos commerciales' : 'Photos des dommages'}{' '}
                    <span className="font-normal text-muted">
                      — {count}/{list.length} sélectionnée(s)
                    </span>
                  </h3>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setGroup(group, true)}
                      className="cursor-pointer rounded-lg border border-line px-2.5 py-1 text-primary hover:bg-primary-50"
                    >
                      Tout
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroup(group, false)}
                      className="cursor-pointer rounded-lg border border-line px-2.5 py-1 text-primary hover:bg-primary-50"
                    >
                      Aucune
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {list.map((photo) => {
                    const on = selected.has(photo.id);
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => toggle(photo.id)}
                        aria-pressed={on}
                        className={`group cursor-pointer overflow-hidden rounded-xl border text-left transition ${
                          on ? 'border-accent ring-2 ring-accent' : 'border-line opacity-60 hover:opacity-100'
                        }`}
                      >
                        <span className="relative block aspect-[4/3] bg-primary-50">
                          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                          <img
                            src={photo.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          {on && (
                            <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-accent-600 text-white">
                              <Check className="h-4 w-4" aria-hidden />
                            </span>
                          )}
                        </span>
                        <span className="block truncate px-2 py-1.5 text-xs text-muted" title={photo.caption}>
                          {photo.caption}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {review.damages.length > 0 && (
            <details>
              <summary className="cursor-pointer text-sm font-semibold text-primary">
                Dommages relevés ({review.damages.length}) — pour information, non publiés
              </summary>
              <div className="mt-3">
                <DamageList damages={review.damages} />
              </div>
            </details>
          )}

          <button
            type="button"
            onClick={confirm}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-700"
          >
            <ImagePlus className="h-5 w-5" aria-hidden />
            Pré-remplir la fiche ({selected.size} photo{selected.size > 1 ? 's' : ''})
          </button>
        </div>
      )}
    </section>
  );
}
