/**
 * Reads a vehicle inspection PDF in the browser: vehicle data, equipment
 * highlights, damage list and the embedded photos (with captions).
 *
 * Supported layouts (detected from the first page):
 * - Macadam "Rapport d'inspection du véhicule" (» section banners)
 * - Macadam appraisal ("AppraisalPdf", photos linked to their originals)
 * - Macadam "Rapport d'évaluation" (Leasys…)
 * - Openlane "CarReport"
 *
 * Parsing happens client-side on purpose — reports weigh 5–15 MB, well above
 * server-action / serverless body limits, and photos go straight to Storage.
 */
import type { PDFPageProxy } from 'pdfjs-dist';

import { encodeCanvas } from '@/lib/car-images';
import type { CarInput, FuelType } from '@/lib/types';

export interface ReportPhoto {
  id: string;
  section: 'commercial' | 'damage';
  caption: string;
  /** Pre-selected for the public listing (exterior 3/4 views, interior…). */
  suggested: boolean;
  /** Copy embedded in the PDF — used for previews and as upload fallback. */
  blob: Blob;
  /** Link to the original photo on Macadam's servers, when the PDF has one. */
  sourceUrl: string | null;
}

export interface ReportDamage {
  group: string;
  label: string;
}

export interface InspectionReport {
  reportNumber: string | null;
  inspectedAt: string | null;
  vin: string | null;
  car: Partial<CarInput>;
  photos: ReportPhoto[];
  damages: ReportDamage[];
}

type Item = { str: string; x: number; y: number; w: number };
type Matrix = [number, number, number, number, number, number];

/** Where an image is drawn on the page (PDF points, origin bottom-left). */
type Placement = { id: string; name: string; x: number; y: number; w: number; h: number };

type PageData = { num: number; items: Item[]; images: Placement[] };

/** A drawn image the layout parser wants extracted, and how to label it. */
type PhotoSpec = {
  image: Placement;
  section: ReportPhoto['section'];
  caption: string;
  suggested: boolean;
};

interface LayoutParser {
  /** Called for every page in order; returns the photos to extract from it. */
  page(page: PageData): PhotoSpec[];
  finish(fileName: string): Omit<InspectionReport, 'photos'>;
}

// Smaller drawings are logos/icons, not photos.
const MIN_PHOTO_WIDTH = 60;
const MIN_PHOTO_HEIGHT = 40;
// Galleries without captions open with the exterior views.
const UNCAPTIONED_SUGGESTED = 4;

/** Lowercase, accent-free, no trailing colon — used to match labels. */
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/:\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function multiply(a: Matrix, b: number[]): Matrix {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ];
}

/** Group text items into visual rows (top to bottom, left to right). */
function toRows(items: Item[], tolerance = 2): Item[][] {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows: Item[][] = [];
  for (const item of sorted) {
    const row = rows[rows.length - 1];
    if (row && Math.abs(row[0].y - item.y) <= tolerance) row.push(item);
    else rows.push([item]);
  }
  return rows.map((row) => row.sort((a, b) => a.x - b.x));
}

const rowText = (row: Item[]) => row.map((it) => it.str).join(' ');

/**
 * Read "label  value" rows laid out in columns starting at `columns` (x).
 * A label without value is stored as '' (e.g. an option that is present).
 */
function collectFields(row: Item[], columns: number[], fields: Map<string, string>) {
  const buckets = new Map<number, Item[]>();
  for (const it of row) {
    const col = columns.findLast((c) => it.x >= c - 1) ?? columns[0];
    buckets.set(col, [...(buckets.get(col) ?? []), it]);
  }
  for (const [label, ...value] of buckets.values()) {
    const key = norm(label.str);
    if (!fields.has(key)) fields.set(key, rowText(value));
  }
}

type PdfImage = {
  width: number;
  height: number;
  kind?: number;
  data?: Uint8Array | Uint8ClampedArray;
  bitmap?: ImageBitmap;
};

/** Draw a decoded PDF image object onto a canvas. */
function imageToCanvas(img: PdfImage): HTMLCanvasElement | null {
  const { width, height } = img;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (img.bitmap) {
    ctx.drawImage(img.bitmap, 0, 0);
    return canvas;
  }
  if (!img.data) return null;

  const pixels = width * height;
  const rgba = new Uint8ClampedArray(pixels * 4);
  if (img.kind === 3) {
    rgba.set(img.data.subarray(0, pixels * 4));
  } else if (img.kind === 2) {
    for (let i = 0, j = 0; i < pixels; i++, j += 3) {
      rgba[i * 4] = img.data[j];
      rgba[i * 4 + 1] = img.data[j + 1];
      rgba[i * 4 + 2] = img.data[j + 2];
      rgba[i * 4 + 3] = 255;
    }
  } else {
    return null; // 1-bit masks — never photos
  }
  ctx.putImageData(new ImageData(rgba, width, height), 0, 0);
  return canvas;
}

const IMAGE_TIMEOUT_MS = 15_000;

/**
 * Resolve a decoded image object. In browsers pdf.js decodes images off the
 * main thread, so they are usually NOT ready when the operator list returns —
 * wait for them instead of reading synchronously.
 */
function getImageObject(page: PDFPageProxy, name: string): Promise<PdfImage | null> {
  const store = name.startsWith('g_') ? page.commonObjs : page.objs;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), IMAGE_TIMEOUT_MS);
    try {
      store.get(name, (data: PdfImage) => {
        clearTimeout(timer);
        resolve(data ?? null);
      });
    } catch {
      clearTimeout(timer);
      resolve(null);
    }
  });
}

// ── Field mapping ────────────────────────────────────────────────────

/** "25.11.2020", "28/06/2024" or "6/12/2023" (day first) → ISO date. */
function isoDate(value?: string): string | null {
  const m = value?.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
}

function integer(value?: string): number | null {
  const digits = value?.replace(/\D/g, '');
  return digits ? Number(digits) : null;
}

function toFuel(value?: string): FuelType | undefined {
  if (!value) return undefined;
  const v = norm(value);
  if (v.includes('hybride')) return 'hybride';
  if (v.includes('electrique')) return 'electrique';
  if (v.includes('diesel') || v.includes('gazole')) return 'diesel';
  if (v.includes('gpl')) return 'gpl';
  return 'essence';
}

function toGearbox(value?: string): CarInput['gearbox'] | undefined {
  if (!value) return undefined;
  return /auto|bva|dsg|edc|eat|cvt/i.test(value) ? 'automatique' : 'manuelle';
}

/** "MAN 6 VIT" → "Boîte manuelle 6 vitesses". */
function gearboxLabel(value?: string): string | null {
  const gearbox = toGearbox(value);
  if (!gearbox) return null;
  const speeds = value?.match(/(\d+)/)?.[1];
  return `Boîte ${gearbox}${speeds ? ` ${speeds} vitesses` : ''}`;
}

function toPowerHp(value?: string): number | null {
  if (!value) return null;
  const cv = value.match(/(\d+)\s*(?:CV|ch)\b/i);
  if (cv) return Number(cv[1]);
  const kw = value.match(/(\d+)\s*kW/i);
  return kw ? Math.round(Number(kw[1]) * 1.36) : null;
}

/** "OPEL" → "Opel", "MERCEDES-BENZ" → "Mercedes-Benz"; BMW, DS, VW stay. */
function brandCase(make: string): string {
  if (make !== make.toUpperCase() || make.length <= 3) return make;
  return make.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (c) => c.toUpperCase());
}

const MULTI_WORD_MAKES = /^(land rover|alfa romeo|aston martin|mercedes benz|rolls royce)\b/i;

/** "Volkswagen Polo 1.0 TSI Life" → make, model and the rest as version. */
function splitName(name: string): { make: string; model?: string; version?: string } {
  const words = name.trim().split(/\s+/);
  const makeWords = MULTI_WORD_MAKES.test(name) ? 2 : 1;
  return {
    make: brandCase(words.slice(0, makeWords).join(' ')),
    model: words[makeWords],
    version: words.slice(makeWords + 1).join(' ') || undefined,
  };
}

function cleanVin(value?: string): string | null {
  const vin = value?.replace(/\s+/g, '');
  return vin && /^[A-HJ-NPR-Z0-9]{11,17}$/i.test(vin) ? vin.toUpperCase() : null;
}

/** Equipment worth advertising, matched against the report's equipment list. */
const HIGHLIGHTS: [RegExp, string | ((m: RegExpMatchArray) => string)][] = [
  [/phares principaux à (?:del|led)|phares - phares led/i, 'Phares LED'],
  [/phares x[ée]non\/led/i, 'Phares Xénon / LED'],
  [/cam[ée]ra (?:de recul|arri[èe]re)/i, 'Caméra de recul'],
  [/aide au stationnement à l'avant et à l'arrière/i, 'Radars de stationnement avant et arrière'],
  [/capteurs arri[èe]re/i, 'Radars de stationnement arrière'],
  [/appareil de navigation|syst[èe]me de navigation/i, 'GPS / navigation'],
  [/full link|mirror ?link|carplay|android auto/i, 'Apple CarPlay / Android Auto'],
  [/climatronic|clim(?:atisation|\.)? automatique/i, 'Climatisation automatique'],
  [/r[ée]gulateur de vitesse adaptatif/i, 'Régulateur de vitesse adaptatif'],
  [/r[ée]gulateur de vitesse(?! adaptatif)/i, 'Régulateur de vitesse'],
  [/cockpit num[ée]rique/i, 'Cockpit numérique'],
  [/recharge par induction/i, 'Recharge smartphone sans fil'],
  [/commande vocale/i, 'Commande vocale'],
  [/d[ée]tecteur de lumi[èe]re\/pluie/i, 'Allumage automatique des feux et essuie-glaces'],
  [/r[ée]tro(?:viseur)?\.? ext[^,]*rabattable [ée]lectr/i, 'Rétroviseurs électriques rabattables'],
  [/volant cuir multifonction|volant en cuir\s*•\s*multifonction/i, 'Volant cuir multifonction'],
  [/palettes de changement de vitesse/i, 'Palettes au volant'],
  [/si[èe]ges? chauffants?/i, 'Sièges chauffants'],
  [/jantes en alliage l[ée]ger\s*[\d,]+J\s*x\s*(\d+)/i, (m) => `Jantes alliage ${m[1]}"`],
  [/roues en alliage/i, 'Jantes alliage'],
];

function equipmentHighlights(text: string): string[] {
  const found: string[] = [];
  for (const [pattern, label] of HIGHLIGHTS) {
    // Reports also list what the car does NOT have ("Sans siège chauffant").
    const re = new RegExp(`(?<!sans\\s)(?<!sans\\s\\S+\\s)${pattern.source}`, 'i');
    const m = text.match(re);
    if (m) found.push(typeof label === 'string' ? label : label(m));
  }
  return found;
}

function buildDescription(
  car: Partial<CarInput>,
  specs: { fuel?: string; gearbox?: string | null; keys?: number | null },
  highlights: string[]
): string | null {
  if (!car.make) return null;
  const reg = car.first_registration?.split('-');
  const head = [
    [car.make, car.model, car.version].filter(Boolean).join(' '),
    reg ? `mise en circulation ${reg[1]}/${reg[0]}` : null,
    car.mileage_km ? `${car.mileage_km.toLocaleString('fr-FR')} km` : null,
  ]
    .filter(Boolean)
    .join(' — ');

  const line = [
    specs.fuel,
    car.engine_cc ? `${car.engine_cc.toLocaleString('fr-FR')} cm³` : null,
    car.power_hp ? `${car.power_hp} ch` : null,
    specs.gearbox,
    car.doors ? `${car.doors} portes` : null,
    car.seats ? `${car.seats} places` : null,
    specs.keys ? `${specs.keys} clés` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const parts = [`${head}.`, line];
  if (highlights.length) {
    parts.push(`Équipements :\n${highlights.map((h) => `• ${h}`).join('\n')}`);
  }
  return parts.filter(Boolean).join('\n\n');
}

function withDescription(
  car: Partial<CarInput>,
  specs: Parameters<typeof buildDescription>[1],
  equipmentText: string
): Partial<CarInput> {
  return { ...car, description_fr: buildDescription(car, specs, equipmentHighlights(equipmentText)) };
}

const yearOf = (iso: string | null) => (iso ? Number(iso.slice(0, 4)) : undefined);

/** Caption of the nearest heading at or above the photo's bottom edge. */
function headingFor(image: Placement, headings: { y: number; text: string }[]) {
  const candidates = headings.filter((h) => h.y >= image.y);
  return candidates.length
    ? candidates.reduce((a, b) => (b.y < a.y ? b : a)).text
    : null;
}

// ── Macadam "Rapport d'inspection du véhicule" ───────────────────────

// Page body limits (PDF points, origin bottom-left) — skips header & footer.
const INSPECTION_BODY_TOP = 780;
const INSPECTION_BODY_BOTTOM = 30;
const SUGGESTED_CAPTION = /3\/4|int[ée]rieur|console|moteur|cam[ée]ra|gps|kilom[ée]trage/i;
const DAMAGE_HEADING = /^\d+\s+-\s+/;

function macadamInspection(): LayoutParser {
  const fields = new Map<string, string>();
  const damages: ReportDamage[] = [];
  let equipmentText = '';
  // Carried across pages: sections and damage blocks flow onto the next page.
  let section = '';
  let damageGroup = '';
  let damageCaption = '';

  return {
    page({ items: all, images }) {
      const items = all.filter(
        (it) => it.y > INSPECTION_BODY_BOTTOM && it.y < INSPECTION_BODY_TOP
      );

      // "» Section" banners, and the section in effect at a given height.
      const banners = items
        .filter((it) => it.str.startsWith('»'))
        .map((it) => ({ y: it.y, name: norm(it.str.replace(/^»\s*/, '')) }));
      const pageStartSection = section;
      const sectionAt = (y: number) => {
        const above = banners.filter((b) => b.y > y);
        return above.length
          ? above.reduce((a, b) => (b.y < a.y ? b : a)).name
          : pageStartSection;
      };
      const isCommercial = (s: string) => s.includes('photos commerciales');
      const isDamage = (s: string) => s.includes('photos des dommages');

      // Text: label/value rows, equipment list, damage headings.
      const pageStartDamageCaption = damageCaption;
      const damageHeadings: Item[] = [];
      for (const row of toRows(items)) {
        const rowSection = sectionAt(row[0].y + 1);
        const text = rowText(row);

        if (isDamage(rowSection)) {
          if (DAMAGE_HEADING.test(text)) {
            damages.push({ group: damageGroup, label: text.replace(DAMAGE_HEADING, '') });
            damageHeadings.push(row[0]);
            damageCaption = text;
          } else if (norm(row[0].str) === 'commentaire' && row.length > 1 && damages.length) {
            const last = damages[damages.length - 1];
            last.label += ` (${rowText(row.slice(1))})`;
          } else if (text === text.toUpperCase() && /[A-Z]{4}/.test(text)) {
            damageGroup = text;
          }
        } else if (rowSection.includes('equipement')) {
          equipmentText += ` ${text}`;
        } else if (!isCommercial(rowSection) && !row[0].str.startsWith('»') && row.length > 1) {
          const label = norm(row[0].str);
          if (!fields.has(label)) fields.set(label, rowText(row.slice(1)));
        }
      }

      const photos: PhotoSpec[] = [];
      for (const image of images) {
        const { x, y, w, h } = image;
        // Skip the page-header logo.
        if (y + h / 2 > INSPECTION_BODY_TOP) continue;
        const photoSection = sectionAt(y + h);
        const commercial = isCommercial(photoSection);
        if (!commercial && !isDamage(photoSection)) continue; // e.g. cover duplicates

        let caption: string;
        if (commercial) {
          // Caption sits just below the photo, possibly on two lines.
          caption = items
            .filter((it) => it.y < y && it.y > y - 30 && it.x + it.w / 2 > x && it.x + it.w / 2 < x + w)
            .sort((a, b) => b.y - a.y || a.x - b.x)
            .map((it) => it.str)
            .join(' ');
        } else {
          // Damage photos belong to the nearest numbered heading above them.
          const above = damageHeadings.filter((it) => it.y > y + h);
          caption = above.length ? rowText(toRows(above).at(-1)!) : pageStartDamageCaption;
        }
        photos.push({
          image,
          section: commercial ? 'commercial' : 'damage',
          caption: caption || 'Photo',
          suggested: commercial && SUGGESTED_CAPTION.test(caption),
        });
      }

      if (banners.length) section = banners.reduce((a, b) => (b.y < a.y ? b : a)).name;
      return photos;
    },

    finish() {
      if (!fields.has('marque')) {
        throw new Error("Ce PDF ne ressemble pas à un rapport d'inspection (marque introuvable).");
      }
      const firstRegistration = isoDate(fields.get('date de 1ere immatriculation'));
      const gearbox = fields.get('boite de vitesse');
      const color = fields
        .get('couleur exterieure')
        ?.split('/')[0]
        .replace(/["“”]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const car: Partial<CarInput> = {
        make: fields.get('marque'),
        model: fields.get('modele'),
        year: yearOf(firstRegistration),
        first_registration: firstRegistration,
        mileage_km: integer(fields.get('kilometrage')) ?? undefined,
        fuel: toFuel(fields.get('carburant')),
        gearbox: toGearbox(gearbox),
        engine_cc: integer(fields.get('cylindree')),
        power_hp: toPowerHp(fields.get('puissance')),
        doors: integer(fields.get('nombre de portes')),
        seats: integer(fields.get('nombre de sieges')),
        color: color || null,
      };
      return {
        reportNumber: fields.get('n° de rapport') ?? null,
        inspectedAt: fields.get('inspecte le') ?? null,
        vin: fields.get('n° de chassis') ?? null,
        car: withDescription(
          car,
          {
            fuel: fields.get('carburant'),
            gearbox: gearbox?.replace(/(\d+)-Vitesses?/i, '$1 vitesses'),
            keys: integer(fields.get('nombre de cles')),
          },
          equipmentText
        ),
        damages,
      };
    },
  };
}

// ── Macadam appraisal ("AppraisalPdf") ───────────────────────────────
// Page 1: photos above the "<Make Model>: <plate>" bar, then two columns of
// "label  value". Damages are "Part, Damage, Repair" bars followed by photos.

const APPRAISAL_COLUMNS = [0, 310];
const APPRAISAL_DAMAGE = /^[^,]+,\s*[^,]+,\s*\S/;

function macadamAppraisal(): LayoutParser {
  const fields = new Map<string, string>();
  const damages: ReportDamage[] = [];
  let title = '';
  let equipmentText = '';
  let damageCaption = '';

  return {
    page({ num, items, images }) {
      const pageStartCaption = damageCaption;
      const headings: { y: number; text: string }[] = [];
      let section = '';
      let titleY = Infinity;

      for (const row of toRows(items, 3)) {
        const text = rowText(row);
        if (row[0].x > 150 && APPRAISAL_DAMAGE.test(text)) {
          damages.push({ group: '', label: text });
          headings.push({ y: row[0].y, text });
          damageCaption = text;
        } else if (num === 1 && !title && /:\s*\S+$/.test(text) && row[0].x < 92) {
          title = text; // "Opel Grandland-X-2017: GS221WT"
          titleY = row[0].y;
        } else if (num === 1 && row.length === 1 && row[0].x < 92) {
          section = norm(text); // "Options", "Pneu", "Matériel de secours"
        } else if (num === 1) {
          if (section === 'options') equipmentText += ` ${text}`;
          collectFields(row, APPRAISAL_COLUMNS, fields);
        }
      }

      const photos: PhotoSpec[] = [];
      for (const image of images) {
        if (image.y > titleY) {
          photos.push({ image, section: 'commercial', caption: 'Photo', suggested: true });
          continue;
        }
        // Damage photos sit below their bar, possibly on the next page.
        const above = headings.filter((h) => h.y > image.y + image.h);
        const caption = above.length
          ? above.reduce((a, b) => (b.y < a.y ? b : a)).text
          : pageStartCaption;
        if (caption) photos.push({ image, section: 'damage', caption, suggested: false });
      }
      return photos;
    },

    finish(fileName) {
      const version = fields.get('version') ?? '';
      if (!title && !version) {
        throw new Error("Ce PDF ne ressemble pas à un rapport Macadam (véhicule introuvable).");
      }
      // Version: "OPEL Grandland / 2021 / 5P / SUV 1.2 TURBO 130ch"
      const segments = version.split('/').map((s) => s.trim());
      const [titleName, plate] = title.split(/:\s*/);
      const name = splitName(segments[0] || titleName.replace(/-\d{4}$/, ''));
      const make = titleName ? splitName(titleName).make : name.make;
      const firstRegistration = isoDate(fields.get('1iere mec'));
      const gearbox = fields.get('boite');

      const car: Partial<CarInput> = {
        make,
        model: [name.model, name.version].filter(Boolean).join(' ') || undefined,
        version: segments.at(-1) && segments.length > 1 ? segments.at(-1) : null,
        year: yearOf(firstRegistration),
        first_registration: firstRegistration,
        immatriculation: plate?.trim() || null,
        mileage_km: integer(fields.get('kilometrage inspection')) ?? undefined,
        fuel: toFuel(fields.get('carburant')),
        gearbox: toGearbox(gearbox),
        power_hp: toPowerHp(version) ?? toPowerHp(`${fields.get('puissance kw') ?? ''} kW`),
        doors: integer(fields.get('nbre portes')),
        seats: integer(fields.get('nbre sieges')),
        color: fields.get('couleur carrosserie') || null,
      };
      return {
        reportNumber: fileName.match(/AppraisalPdf_\w*?_?(\d+)/i)?.[1] ?? null,
        inspectedAt: null,
        vin: cleanVin(fields.get('n° chassis')),
        car: withDescription(
          car,
          {
            fuel: fields.get('carburant'),
            gearbox: gearboxLabel(gearbox),
            keys: integer(fields.get('nbre cles total')),
          },
          equipmentText
        ),
        damages,
      };
    },
  };
}

// ── Macadam "Rapport d'évaluation" (Leasys…) ─────────────────────────
// Two columns of "label  value" under CAPS headings; damages are numbered
// "N | Part" blocks to the right of their photos; commercial photos last.

const EVALUATION_COLUMNS = [0, 298];
const EVALUATION_HEADER = 790;
const EVALUATION_FOOTER = 20;
const EVALUATION_DAMAGE = /^\d+\s*\|\s*/;

function macadamEvaluation(): LayoutParser {
  const fields = new Map<string, string>();
  const damages: ReportDamage[] = [];
  let section = '';
  let damageGroup = '';
  let damageCaption = '';
  let equipmentText = '';
  let commercialCount = 0;

  return {
    page({ items: all, images }) {
      const items = all.filter((it) => it.y > EVALUATION_FOOTER && it.y < EVALUATION_HEADER);
      const pageStartSection = section;
      const pageStartCaption = damageCaption;
      const headings: { y: number; text: string }[] = [];
      const sectionStarts: { y: number; name: string }[] = [];

      for (const row of toRows(items)) {
        const text = rowText(row);
        const key = norm(text);
        if (row.length === 1 && row[0].x < 40 && (text === text.toUpperCase() || key === 'photos commerciales')) {
          section = key;
          sectionStarts.push({ y: row[0].y, name: key });
        } else if (section === 'dommages') {
          if (row.length === 1 && row[0].x < 40) {
            damageGroup = text; // "Intérieur", "Extérieur"…
          } else if (EVALUATION_DAMAGE.test(text)) {
            damageCaption = text.replace(EVALUATION_DAMAGE, '');
            damages.push({ group: damageGroup, label: damageCaption });
            headings.push({ y: row[0].y, text: damageCaption });
          } else if (damages.length && row.length > 1) {
            const last = damages[damages.length - 1];
            const value = rowText(row.slice(1));
            if (norm(row[0].str) === 'type de dommage') last.label += ` : ${value}`;
            else if (norm(row[0].str) === 'mode de reparation') last.label += ` (${value})`;
          }
        } else if (section !== 'photos commerciales') {
          if (section === 'options') equipmentText += ` ${text}`;
          collectFields(row, EVALUATION_COLUMNS, fields);
        }
      }

      const sectionAt = (y: number) => {
        const above = sectionStarts.filter((s) => s.y > y);
        return above.length ? above.reduce((a, b) => (b.y < a.y ? b : a)).name : pageStartSection;
      };

      const photos: PhotoSpec[] = [];
      for (const image of images) {
        if (image.y + image.h / 2 > EVALUATION_HEADER) continue; // header logo
        const imageSection = sectionAt(image.y + image.h);
        if (imageSection === 'photos commerciales') {
          commercialCount++;
          photos.push({
            image,
            section: 'commercial',
            caption: `Photo ${commercialCount}`,
            suggested: commercialCount <= UNCAPTIONED_SUGGESTED,
          });
        } else if (imageSection === 'dommages') {
          const caption = headingFor(image, headings) ?? pageStartCaption;
          if (caption) photos.push({ image, section: 'damage', caption, suggested: false });
        }
        // Cover photo (page 1) duplicates the first commercial one.
      }
      return photos;
    },

    finish() {
      if (!fields.has('marque')) {
        throw new Error("Ce PDF ne ressemble pas à un rapport d'évaluation (marque introuvable).");
      }
      const firstRegistration = isoDate(fields.get('premiere immatriculation'));
      const gearbox = fields.get('boite de vitesses');
      const car: Partial<CarInput> = {
        make: brandCase(fields.get('marque')!),
        model: fields.get('modele'),
        year: yearOf(firstRegistration),
        first_registration: firstRegistration,
        mileage_km: integer(fields.get('kilometrage')) ?? undefined,
        fuel: toFuel(fields.get('type de carburant')),
        gearbox: toGearbox(gearbox),
        engine_cc: integer(fields.get('cylindree')),
        power_hp: toPowerHp(fields.get('puissance')),
        doors: integer(fields.get('nbre portes')),
        seats: integer(fields.get('nbre sieges')),
        color: fields.get('couleur carrosserie') || null,
      };
      return {
        reportNumber: null,
        inspectedAt: fields.get("date de l'inspection")?.split(' ')[0] ?? null,
        vin: cleanVin(fields.get('vin')),
        car: withDescription(
          car,
          {
            fuel: fields.get('type de carburant'),
            gearbox: gearboxLabel(gearbox),
            keys: integer(fields.get('nbre cles total')),
          },
          equipmentText
        ),
        damages,
      };
    },
  };
}

// ── Openlane "CarReport" ─────────────────────────────────────────────
// Title "Make Model Version - Fuel - Gearbox - hp - km", "label  value" rows,
// an options list, a numbered damage list and an uncaptioned photo gallery.

// Labels on the left, values from here on; the damage list also starts here.
const OPENLANE_VALUES_X = 300;
const OPENLANE_DAMAGE = /^\d+\.\s*(.+?)\s*:?$/;

function openlane(): LayoutParser {
  const fields = new Map<string, string>();
  const damages: ReportDamage[] = [];
  let title = '';
  let plate: string | null = null;
  let section = '';
  let damageGroup = '';
  let equipmentText = '';
  let galleryCount = 0;

  return {
    page({ num, items, images }) {
      let galleryY = Infinity;
      for (const row of toRows(items)) {
        const text = rowText(row);
        const key = norm(text);
        if (key === 'toutes les options' || key === 'vos notes' || key === 'dommages a la voiture') {
          section = key;
        } else if (key === 'galerie photo') {
          section = key;
          galleryY = row[0].y;
        } else if (num === 1 && !title) {
          title = text;
        } else if (section === 'toutes les options') {
          equipmentText += ` ${text}`;
        } else if (section === 'dommages a la voiture') {
          // The car diagram's numbers sit on the left; the list on the right.
          const list = row.filter((it) => it.x >= OPENLANE_VALUES_X);
          const m = list[0]?.str.match(OPENLANE_DAMAGE);
          if (m) damages.push({ group: damageGroup, label: `${m[1]} : ${rowText(list.slice(1))}` });
          else if (list.length === 1) damageGroup = list[0].str; // "Dégâts courants"
        } else if (num === 1) {
          const immat = text.match(/^Immatriculation\s*:\s*(\S+)/i);
          if (immat) plate = immat[1];
          else collectFields(row, [0], fields);
        }
      }

      if (section !== 'galerie photo') return [];
      return images
        .filter((image) => image.y < galleryY)
        .map((image) => {
          galleryCount++;
          return {
            image,
            section: 'commercial' as const,
            caption: `Photo ${galleryCount}`,
            suggested: galleryCount <= UNCAPTIONED_SUGGESTED,
          };
        });
    },

    finish(fileName) {
      // "Volkswagen Polo 1.0 TSI Life - Essence - Automatique - 95 hp - 62.605 km"
      const name = title.split(' - ')[0];
      if (!name || !fields.has('kilometrage')) {
        throw new Error("Ce PDF ne ressemble pas à un rapport Openlane (véhicule introuvable).");
      }
      const { make, model, version } = splitName(name);
      const firstRegistration = isoDate(fields.get('premiere immatriculation'));
      const gearbox = fields.get('type de transmission');
      const car: Partial<CarInput> = {
        make,
        model,
        version: version ?? null,
        year: yearOf(firstRegistration),
        first_registration: firstRegistration,
        immatriculation: plate,
        mileage_km: integer(fields.get('kilometrage')) ?? undefined,
        fuel: toFuel(fields.get('type de carburant')),
        gearbox: toGearbox(gearbox),
        engine_cc: integer(fields.get('cylindree')),
        power_hp: toPowerHp(fields.get('puissance')),
        doors: integer(fields.get('portes')),
        seats: integer(fields.get('nombre de places')),
        color: fields.get('couleur exterieure') || null,
      };
      return {
        reportNumber: fileName.match(/CarReport-(\d+)/i)?.[1] ?? null,
        inspectedAt: null,
        vin: cleanVin(fields.get('numero de chassis')),
        car: withDescription(
          car,
          {
            fuel: fields.get('type de carburant'),
            gearbox: gearboxLabel(gearbox),
            keys: integer(fields.get('nombre de cles')),
          },
          equipmentText
        ),
        damages,
      };
    },
  };
}

function detectLayout(firstPage: Item[]): LayoutParser {
  const text = norm(firstPage.map((it) => it.str).join(' | '));
  if (firstPage.some((it) => it.str.startsWith('»'))) return macadamInspection();
  if (text.includes('kilometrage inspection')) return macadamAppraisal();
  if (text.includes("rapport d'evaluation")) return macadamEvaluation();
  if (text.includes('specifications') && text.includes('type de transmission')) return openlane();
  throw new Error(
    'Format de rapport non reconnu. Formats acceptés : Macadam (inspection, évaluation, appraisal) et Openlane.'
  );
}

// ── Original photos ──────────────────────────────────────────────────

// www4.macadam.eu/picture/<id>.jpg only 302-redirects to this Azure container,
// and that redirect has no CORS header — so browsers must hit the blob directly.
const MACADAM_PICTURE = /^https:\/\/www\d*\.macadam\.eu\/picture\/([\w-]+\.jpe?g)/i;
const MACADAM_BLOB = 'https://macadam.blob.core.windows.net/picturesnext/';

/**
 * Download the original JPEG behind a photo's link, or fall back to the copy
 * embedded in the PDF. `original` tells which one was returned.
 */
export async function fetchOriginalPhoto(
  photo: ReportPhoto
): Promise<{ blob: Blob; original: boolean }> {
  const file = photo.sourceUrl?.match(MACADAM_PICTURE)?.[1];
  if (file) {
    try {
      const res = await fetch(`${MACADAM_BLOB}${file}`);
      const blob = res.ok ? await res.blob() : null;
      if (blob?.type.startsWith('image/')) return { blob, original: true };
    } catch {
      // network / CORS failure — use the embedded copy
    }
  }
  return { blob: photo.blob, original: false };
}

// ── Main entry ───────────────────────────────────────────────────────

// Legacy build: the modern one needs very recent browsers (Uint8Array#toHex…).
// Loaded on demand, so its size never touches the public bundle.
async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  return pdfjs;
}

export async function parseInspectionReport(
  file: File,
  onProgress?: (page: number, total: number) => void
): Promise<InspectionReport> {
  const pdfjs = await loadPdfJs();
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const doc = await task.promise;
  const { OPS } = pdfjs;

  const photos: ReportPhoto[] = [];
  const seenUrls = new Set<string>();
  let parser: LayoutParser | null = null;

  try {
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      const items: Item[] = content.items
        .filter((it) => 'str' in it && it.str.trim() !== '')
        .map((it) => {
          const t = it as { str: string; transform: number[]; width: number };
          return { str: t.str.trim(), x: t.transform[4], y: t.transform[5], w: t.width };
        });
      parser ??= detectLayout(items);

      // Images: walk the operator list tracking the transform matrix.
      const ops = await page.getOperatorList();
      const images: Placement[] = [];
      let ctm: Matrix = [1, 0, 0, 1, 0, 0];
      const stack: Matrix[] = [];
      for (let i = 0; i < ops.fnArray.length; i++) {
        const fn = ops.fnArray[i];
        const args = ops.argsArray[i];
        if (fn === OPS.save) stack.push(ctm);
        else if (fn === OPS.restore) ctm = stack.pop() ?? ctm;
        else if (fn === OPS.transform) ctm = multiply(ctm, args);
        else if (fn === OPS.paintImageXObject) {
          const [w, , , h, x, y] = ctm;
          if (w < MIN_PHOTO_WIDTH || h < MIN_PHOTO_HEIGHT) continue; // logos, icons
          images.push({ id: `${p}-${i}`, name: args[0], x, y, w, h });
        }
      }

      const specs = parser.page({ num: p, items, images });

      // Macadam wraps each photo in a link to its original file.
      const links = specs.length
        ? (await page.getAnnotations())
            .filter((a) => a.subtype === 'Link' && typeof a.url === 'string')
            .map((a) => ({ rect: a.rect as number[], url: a.url as string }))
        : [];
      const linkAt = (cx: number, cy: number) =>
        links.find(({ rect: [x1, y1, x2, y2] }) => cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2)
          ?.url ?? null;

      for (const { image, ...spec } of specs) {
        const sourceUrl = linkAt(image.x + image.w / 2, image.y + image.h / 2);
        // The large cover photo and its thumbnail link to the same original.
        if (sourceUrl && seenUrls.has(sourceUrl)) continue;

        const img = await getImageObject(page, image.name);
        const canvas = img && imageToCanvas(img);
        const blob = canvas && (await encodeCanvas(canvas));
        if (!blob) continue;

        if (sourceUrl) seenUrls.add(sourceUrl);
        photos.push({ id: image.id, ...spec, blob, sourceUrl });
      }

      page.cleanup();
      onProgress?.(p, doc.numPages);
    }
  } finally {
    await task.destroy();
  }

  if (!parser) throw new Error('Ce PDF est vide.');
  return { ...parser.finish(file.name), photos };
}
