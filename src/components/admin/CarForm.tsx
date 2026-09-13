'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Upload, X, Save, Calculator, AlertTriangle } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { carImageUrl } from '@/lib/image';
import { createCar, updateCar } from '@/app/admin/actions';
import {
  ageBracketFromDate,
  computeCustoms,
  toCustomsFuel,
  type CustomsSettings,
} from '@/lib/customs';
import { formatDzd, formatPrice } from '@/lib/format';
import {
  FUEL_TYPES,
  GEARBOX_TYPES,
  CAR_STATUSES,
  type Car,
  type CarInput,
  type FuelType,
} from '@/lib/types';

const FUEL_LABELS: Record<FuelType, string> = {
  essence: 'Essence',
  diesel: 'Diesel',
  hybride: 'Hybride',
  electrique: 'Électrique',
  gpl: 'GPL',
};

const STATUS_LABELS: Record<CarInput['status'], string> = {
  disponible: 'Disponible',
  reserve: 'Réservé',
  vendu: 'Vendu',
};

// TVA France — used to derive HT ⇄ TTC automatically in the price fields.
const VAT_RATE = 0.2;
// Prices are whole euros only (no decimals on TTC / HT).
const roundEuro = (n: number) => Math.round(n);

// Phone photos are often 4–8 MB; the site never displays them wider than
// 1920px. Resizing before upload cuts Supabase storage + egress ~10–20×.
const MAX_IMAGE_EDGE = 1920;

/** Resize + re-encode a photo in the browser. Falls back to the original file. */
async function compressImage(file: File): Promise<{ blob: Blob; ext: string }> {
  const original = { blob: file as Blob, ext: file.name.split('.').pop() ?? 'jpg' };
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const encode = (type: string) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
    let blob = await encode('image/webp');
    // Browsers without WebP encoding silently return PNG — use JPEG instead.
    if (!blob || blob.type !== 'image/webp') blob = await encode('image/jpeg');

    if (!blob || blob.size >= file.size) return original;
    return { blob, ext: blob.type === 'image/webp' ? 'webp' : 'jpg' };
  } catch {
    // e.g. HEIC in a browser that can't decode it — upload as-is.
    return original;
  }
}

/** Trimmed string from FormData, or null when empty. */
function textOrNull(fd: FormData, name: string): string | null {
  return String(fd.get(name) ?? '').trim() || null;
}

/** Number from FormData, or null when empty. */
function numberOrNull(fd: FormData, name: string): number | null {
  const raw = String(fd.get(name) ?? '').trim();
  return raw === '' ? null : Number(raw);
}

export function CarForm({
  car,
  customs,
}: {
  car?: Car;
  customs: CustomsSettings;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(car?.images ?? []);

  // Price fields are controlled so HT and TTC can be derived from each other.
  const [priceTtc, setPriceTtc] = useState(
    car?.price_eur != null ? String(Number(car.price_eur)) : ''
  );
  const [priceHt, setPriceHt] = useState(
    car?.price_ht != null ? String(Number(car.price_ht)) : ''
  );

  // Inputs of the live customs preview.
  const [fuel, setFuel] = useState<FuelType>(car?.fuel ?? 'essence');
  const [engineCc, setEngineCc] = useState(
    car?.engine_cc != null ? String(car.engine_cc) : ''
  );
  const [firstRegistration, setFirstRegistration] = useState(
    car?.first_registration ?? ''
  );

  // Typing the TTC price fills the HT price (and vice-versa) at 20% VAT.
  function onTtcChange(value: string) {
    setPriceTtc(value);
    const n = Number(value);
    setPriceHt(value !== '' && n > 0 ? String(roundEuro(n / (1 + VAT_RATE))) : '');
  }

  function onHtChange(value: string) {
    setPriceHt(value);
    const n = Number(value);
    if (value !== '' && n > 0) setPriceTtc(String(roundEuro(n * (1 + VAT_RATE))));
  }

  const vatAmount =
    priceTtc !== '' && priceHt !== '' && Number(priceTtc) > 0
      ? roundEuro(Number(priceTtc) - Number(priceHt))
      : null;

  // Export buyers pay the HT price when VAT is recoverable, else TTC.
  const exportPrice = Number(priceHt) > 0 ? Number(priceHt) : Number(priceTtc);
  // Age bracket from the first registration (unknown or > 5 years → treated as new).
  const ageBracket = ageBracketFromDate(firstRegistration || null);
  const underThree = ageBracket != null && ageBracket <= 3;
  const customsFuel = toCustomsFuel(fuel);
  const customsPreview =
    exportPrice > 0
      ? computeCustoms(
          {
            regime: 'standard',
            fuel: customsFuel,
            age: underThree && ageBracket != null ? ageBracket : 0,
            engineCc: Number(engineCc) || 0,
            priceEur: exportPrice,
            freightEur: customs.default_freight_eur,
            insuranceEur: customs.default_insurance_eur,
            exchangeRate: customs.exchange_rate_dzd,
          },
          customs
        )
      : null;

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const { blob, ext } = await compressImage(file);
        const path = `${crypto.randomUUID()}.${ext}`;
        // Paths are unique and never overwritten → cache for a year.
        const { error } = await supabase.storage
          .from('car-images')
          .upload(path, blob, {
            cacheControl: '31536000',
            contentType: blob.type || file.type,
            upsert: false,
          });
        if (error) throw error;
        uploaded.push(path);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec du téléversement');
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(path: string) {
    setImages((prev) => prev.filter((p) => p !== path));
    // best-effort cleanup of the storage object
    await supabase.storage.from('car-images').remove([path]);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const priceHtValue = numberOrNull(fd, 'price_ht');

    const input: CarInput = {
      slug: car?.slug ?? '',
      make: String(fd.get('make') ?? '').trim(),
      model: String(fd.get('model') ?? '').trim(),
      version: textOrNull(fd, 'version'),
      year: Number(fd.get('year')),
      immatriculation:
        textOrNull(fd, 'immatriculation')?.toUpperCase() ?? null,
      first_registration: textOrNull(fd, 'first_registration'),
      price_eur: Number(fd.get('price_eur')),
      // Filling an HT price marks the car as "TVA récupérable".
      price_ht: priceHtValue,
      vat_recoverable: priceHtValue != null && priceHtValue > 0,
      mileage_km: Number(fd.get('mileage_km') ?? 0),
      fuel: fd.get('fuel') as CarInput['fuel'],
      gearbox: fd.get('gearbox') as CarInput['gearbox'],
      engine_cc: numberOrNull(fd, 'engine_cc'),
      power_hp: numberOrNull(fd, 'power_hp'),
      doors: numberOrNull(fd, 'doors'),
      seats: numberOrNull(fd, 'seats'),
      color: textOrNull(fd, 'color'),
      location: textOrNull(fd, 'location') ?? 'Argenteuil, France',
      title_fr: textOrNull(fd, 'title_fr'),
      title_ar: textOrNull(fd, 'title_ar'),
      description_fr: textOrNull(fd, 'description_fr'),
      description_ar: textOrNull(fd, 'description_ar'),
      images,
      video_url: textOrNull(fd, 'video_url'),
      featured: fd.get('featured') === 'on',
      export_dz: fd.get('export_dz') === 'on',
      status: fd.get('status') as CarInput['status'],
    };

    if (!input.make || !input.model || !input.year || !input.price_eur) {
      setError('Marque, modèle, année et prix sont obligatoires.');
      return;
    }

    startTransition(async () => {
      const res = car
        ? await updateCar(car.id, input)
        : await createCar(input);
      if (!res.ok) {
        setError(res.error ?? 'Une erreur est survenue.');
        return;
      }
      router.push('/admin');
      router.refresh();
    });
  }

  const field =
    'w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent';
  const label = 'mb-1 block text-sm font-medium text-primary';
  const section =
    'rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]';

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Identity */}
      <section className={section}>
        <h2 className="mb-4 font-display text-lg font-semibold text-primary">
          Identité
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={label} htmlFor="make">
              Marque *
            </label>
            <input
              id="make"
              name="make"
              defaultValue={car?.make}
              required
              className={field}
              placeholder="Mercedes-Benz"
            />
          </div>
          <div>
            <label className={label} htmlFor="model">
              Modèle *
            </label>
            <input
              id="model"
              name="model"
              defaultValue={car?.model}
              required
              className={field}
              placeholder="Classe A"
            />
          </div>
          <div>
            <label className={label} htmlFor="version">
              Finition
            </label>
            <input
              id="version"
              name="version"
              defaultValue={car?.version ?? ''}
              className={field}
              placeholder="AMG Line"
            />
          </div>
          <div>
            <label className={label} htmlFor="year">
              Année *
            </label>
            <input
              id="year"
              name="year"
              type="number"
              min={1990}
              max={2035}
              defaultValue={car?.year ?? new Date().getFullYear()}
              required
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="first_registration">
              1ère mise en circulation
            </label>
            <input
              id="first_registration"
              name="first_registration"
              type="date"
              value={firstRegistration}
              onChange={(e) => setFirstRegistration(e.target.value)}
              className={`${field} cursor-pointer`}
            />
          </div>
          <div>
            <label className={label} htmlFor="immatriculation">
              Immatriculation
            </label>
            <input
              id="immatriculation"
              name="immatriculation"
              defaultValue={car?.immatriculation ?? ''}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
              className={`${field} font-mono uppercase tracking-wider`}
              placeholder="AA-123-AA"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={label} htmlFor="title_fr">
              Titre (FR)
            </label>
            <input
              id="title_fr"
              name="title_fr"
              defaultValue={car?.title_fr ?? ''}
              className={field}
              placeholder="Mercedes Classe A 200 AMG Line"
            />
          </div>
          <div dir="rtl" className="sm:col-span-2">
            <label className={label} htmlFor="title_ar">
              العنوان (AR)
            </label>
            <input
              id="title_ar"
              name="title_ar"
              defaultValue={car?.title_ar ?? ''}
              className={`${field} font-[family-name:var(--font-cairo)]`}
              placeholder="مرسيدس الفئة A"
            />
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className={section}>
        <h2 className="mb-4 font-display text-lg font-semibold text-primary">
          Caractéristiques
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={label} htmlFor="price_eur">
              Prix TTC (€) *
            </label>
            <input
              id="price_eur"
              name="price_eur"
              type="number"
              min={0}
              step={1}
              value={priceTtc}
              onChange={(e) => onTtcChange(e.target.value)}
              required
              className={field}
            />
            <p className="mt-1 text-xs text-muted">
              Calcule automatiquement le prix HT (TVA {VAT_RATE * 100} %).
            </p>
          </div>
          <div>
            <label className={label} htmlFor="price_ht">
              Prix HT (€){' '}
              <span className="font-normal text-muted">
                — TVA récupérable
              </span>
            </label>
            <input
              id="price_ht"
              name="price_ht"
              type="number"
              min={0}
              step={1}
              value={priceHt}
              onChange={(e) => onHtChange(e.target.value)}
              className={field}
            />
            <p className="mt-1 text-xs text-muted">
              {vatAmount != null ? (
                <>TVA {VAT_RATE * 100} % : {vatAmount.toLocaleString('fr-FR')} €. </>
              ) : null}
              Renseigné → le véhicule est marqué « TVA récupérable » et les prix
              HT &amp; TTC sont affichés. Vide → « TVA non récupérable ».
            </p>
          </div>
          <div>
            <label className={label} htmlFor="mileage_km">
              Kilométrage
            </label>
            <input
              id="mileage_km"
              name="mileage_km"
              type="number"
              min={0}
              defaultValue={car?.mileage_km ?? 0}
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="fuel">
              Carburant
            </label>
            <select
              id="fuel"
              name="fuel"
              value={fuel}
              onChange={(e) => setFuel(e.target.value as FuelType)}
              className={`${field} cursor-pointer`}
            >
              {FUEL_TYPES.map((f) => (
                <option key={f} value={f}>
                  {FUEL_LABELS[f]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="gearbox">
              Boîte
            </label>
            <select
              id="gearbox"
              name="gearbox"
              defaultValue={car?.gearbox ?? 'automatique'}
              className={`${field} cursor-pointer`}
            >
              {GEARBOX_TYPES.map((g) => (
                <option key={g} value={g}>
                  {g === 'manuelle' ? 'Manuelle' : 'Automatique'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="engine_cc">
              Cylindrée (cm³)
            </label>
            <input
              id="engine_cc"
              name="engine_cc"
              type="number"
              min={0}
              step={1}
              value={engineCc}
              onChange={(e) => setEngineCc(e.target.value)}
              aria-describedby="engine_cc_hint"
              className={field}
              placeholder="1332"
            />
            <p id="engine_cc_hint" className="mt-1 text-xs text-muted">
              Utilisée par le simulateur de dédouanement Algérie
            </p>
          </div>
          <div>
            <label className={label} htmlFor="power_hp">
              Puissance (ch)
            </label>
            <input
              id="power_hp"
              name="power_hp"
              type="number"
              min={0}
              defaultValue={car?.power_hp ?? ''}
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="doors">
              Portes
            </label>
            <input
              id="doors"
              name="doors"
              type="number"
              min={0}
              defaultValue={car?.doors ?? ''}
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="seats">
              Places
            </label>
            <input
              id="seats"
              name="seats"
              type="number"
              min={0}
              defaultValue={car?.seats ?? ''}
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="color">
              Couleur
            </label>
            <input
              id="color"
              name="color"
              defaultValue={car?.color ?? ''}
              className={field}
              placeholder="Noir cosmos"
            />
          </div>
          <div>
            <label className={label} htmlFor="location">
              Localisation
            </label>
            <input
              id="location"
              name="location"
              defaultValue={car?.location ?? 'Argenteuil, France'}
              className={field}
            />
          </div>
        </div>

        {/* Live customs preview — same engine as the public simulator. */}
        <div
          className="mt-6 rounded-xl border border-accent/25 bg-accent-50 p-4"
          aria-live="polite"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Calculator className="h-4 w-4 text-accent" aria-hidden />
            Aperçu dédouanement Algérie
          </p>
          {customsPreview ? (
            <>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted">Droits &amp; taxes nets</p>
                  <p className="font-display text-xl font-bold text-accent">
                    {formatDzd(customsPreview.netTaxes, 'fr')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Coût total rendu (CIF + taxes)</p>
                  <p className="font-display text-xl font-bold text-primary">
                    {formatDzd(customsPreview.totalDzd, 'fr')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Soit environ</p>
                  <p className="font-display text-xl font-bold text-primary">
                    {formatPrice(customsPreview.totalEur, 'fr')}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">
                Base {formatPrice(exportPrice, 'fr')}{' '}
                {Number(priceHt) > 0 ? 'HT' : 'TTC'} · {FUEL_LABELS[fuel]}
                {customsFuel !== 'electrique' && Number(engineCc) > 0
                  ? ` · ${Number(engineCc).toLocaleString('fr-FR')} cm³`
                  : ''}{' '}
                · fret {formatPrice(customs.default_freight_eur, 'fr')} + assurance{' '}
                {formatPrice(customs.default_insurance_eur, 'fr')} · 1 € ={' '}
                {customs.exchange_rate_dzd.toLocaleString('fr-FR')} DA ·{' '}
                {underThree
                  ? `occasion < 3 ans, abattement ${Math.round(customsPreview.abattementRate * 100)} %`
                  : 'sans abattement (neuf ou ≥ 3 ans)'}
              </p>
              {customsFuel !== 'electrique' && !(Number(engineCc) > 0) && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                  Renseignez la cylindrée pour un calcul précis.
                </p>
              )}
              {customsPreview.issues.includes('diesel') && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                  Diesel : importation interdite aux particuliers.
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 text-xs text-muted">
              Saisissez un prix pour afficher l’estimation.
            </p>
          )}
        </div>
      </section>

      {/* Descriptions */}
      <section className={section}>
        <h2 className="mb-4 font-display text-lg font-semibold text-primary">
          Descriptions
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className={label} htmlFor="description_fr">
              Description (FR)
            </label>
            <textarea
              id="description_fr"
              name="description_fr"
              rows={6}
              defaultValue={car?.description_fr ?? ''}
              className={field}
            />
          </div>
          <div dir="rtl">
            <label className={label} htmlFor="description_ar">
              الوصف (AR)
            </label>
            <textarea
              id="description_ar"
              name="description_ar"
              rows={6}
              defaultValue={car?.description_ar ?? ''}
              className={`${field} font-[family-name:var(--font-cairo)]`}
            />
          </div>
        </div>
      </section>

      {/* Media */}
      <section className={section}>
        <h2 className="mb-1 font-display text-lg font-semibold text-primary">
          Photos &amp; vidéo
        </h2>
        <p className="mb-4 text-sm text-muted">
          La première photo sert de couverture.
        </p>

        {images.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((path, i) => (
              <div
                key={path}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-primary-50"
              >
                <Image
                  src={carImageUrl(path)}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-canvas">
                    Couverture
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(path)}
                  className="absolute right-2 top-2 grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-black/60 text-white opacity-100 transition-opacity focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Supprimer la photo"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line px-4 py-6 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-primary">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-5 w-5" aria-hidden />
          )}
          {uploading ? 'Téléversement…' : 'Ajouter des photos'}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>

        <div className="mt-5">
          <label className={label} htmlFor="video_url">
            URL vidéo{' '}
            <span className="font-normal text-muted">
              — YouTube ou MP4, optionnel
            </span>
          </label>
          <input
            id="video_url"
            name="video_url"
            type="url"
            defaultValue={car?.video_url ?? ''}
            className={field}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </div>
      </section>

      {/* Status & flags */}
      <section className={section}>
        <h2 className="mb-4 font-display text-lg font-semibold text-primary">
          Statut
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label} htmlFor="status">
              Disponibilité
            </label>
            <select
              id="status"
              name="status"
              defaultValue={car?.status ?? 'disponible'}
              className={`${field} cursor-pointer`}
            >
              {CAR_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-primary">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={car?.featured ?? false}
              className="h-4 w-4 cursor-pointer accent-accent"
            />
            En vedette (page d’accueil)
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-primary">
            <input
              type="checkbox"
              name="export_dz"
              defaultChecked={car?.export_dz ?? true}
              className="h-4 w-4 cursor-pointer accent-accent"
            />
            Éligible export Algérie
          </label>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-canvas transition-colors hover:bg-accent-600 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Save className="h-5 w-5" aria-hidden />
          )}
          {car ? 'Enregistrer' : 'Ajouter le véhicule'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="cursor-pointer rounded-full border border-line px-6 py-3 font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
