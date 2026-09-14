/**
 * Reads a Macadam "Rapport d'inspection" PDF in the browser: vehicle data,
 * equipment highlights, damage list and the embedded photos (with captions).
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

// Page body limits (PDF points, origin bottom-left) — skips header & footer.
const BODY_TOP = 780;
const BODY_BOTTOM = 30;
// Smaller drawings are logos/icons, not photos.
const MIN_PHOTO_WIDTH = 60;

const SUGGESTED_CAPTION = /3\/4|int[ée]rieur|console|moteur|cam[ée]ra|gps|kilom[ée]trage/i;
const DAMAGE_HEADING = /^\d+\s+-\s+/;

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
function toRows(items: Item[]): Item[][] {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows: Item[][] = [];
  for (const item of sorted) {
    const row = rows[rows.length - 1];
    if (row && Math.abs(row[0].y - item.y) <= 2) row.push(item);
    else rows.push([item]);
  }
  return rows.map((row) => row.sort((a, b) => a.x - b.x));
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

function isoDate(value?: string): string | null {
  const m = value?.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
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

function toPowerHp(value?: string): number | null {
  if (!value) return null;
  const cv = value.match(/(\d+)\s*(?:CV|ch)/i);
  if (cv) return Number(cv[1]);
  const kw = value.match(/(\d+)\s*kW/i);
  return kw ? Math.round(Number(kw[1]) * 1.36) : null;
}

/** Equipment worth advertising, matched against the report's equipment list. */
const HIGHLIGHTS: [RegExp, string | ((m: RegExpMatchArray) => string)][] = [
  [/phares principaux à (?:del|led)/i, 'Phares LED'],
  [/cam[ée]ra de recul/i, 'Caméra de recul'],
  [/aide au stationnement à l'avant et à l'arrière/i, 'Radars de stationnement avant et arrière'],
  [/appareil de navigation|syst[èe]me de navigation/i, 'GPS / navigation'],
  [/full link|mirror ?link|carplay|android auto/i, 'Apple CarPlay / Android Auto'],
  [/climatronic|climatisation automatique/i, 'Climatisation automatique'],
  [/r[ée]gulateur de vitesse/i, 'Régulateur de vitesse'],
  [/recharge par induction/i, 'Recharge smartphone sans fil'],
  [/commande vocale/i, 'Commande vocale'],
  [/d[ée]tecteur de lumi[èe]re\/pluie/i, 'Allumage automatique des feux et essuie-glaces'],
  [/r[ée]tro(?:viseur)?\.? ext[^,]*rabattable [ée]lectr/i, 'Rétroviseurs électriques rabattables'],
  [/volant cuir multifonction/i, 'Volant cuir multifonction'],
  [/si[èe]ges? chauffants?/i, 'Sièges chauffants'],
  [/jantes en alliage l[ée]ger\s*[\d,]+J\s*x\s*(\d+)/i, (m) => `Jantes alliage ${m[1]}"`],
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
  fields: Map<string, string>,
  highlights: string[]
): string | null {
  if (!car.make) return null;
  const reg = car.first_registration?.split('-');
  const head = [
    [car.make, car.model].filter(Boolean).join(' '),
    reg ? `mise en circulation ${reg[1]}/${reg[0]}` : null,
    car.mileage_km ? `${car.mileage_km.toLocaleString('fr-FR')} km` : null,
  ]
    .filter(Boolean)
    .join(' — ');

  const gearbox = fields.get('boite de vitesse');
  const keys = integer(fields.get('nombre de cles'));
  const specs = [
    fields.get('carburant'),
    car.engine_cc ? `${car.engine_cc.toLocaleString('fr-FR')} cm³` : null,
    car.power_hp ? `${car.power_hp} ch` : null,
    gearbox?.replace(/(\d+)-Vitesses?/i, '$1 vitesses'),
    car.doors ? `${car.doors} portes` : null,
    car.seats ? `${car.seats} places` : null,
    keys ? `${keys} clés` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const parts = [`${head}.`, specs];
  if (highlights.length) {
    parts.push(`Équipements :\n${highlights.map((h) => `• ${h}`).join('\n')}`);
  }
  return parts.filter(Boolean).join('\n\n');
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

  const fields = new Map<string, string>();
  const photos: ReportPhoto[] = [];
  const damages: ReportDamage[] = [];
  let equipmentText = '';
  // Carried across pages: sections and damage blocks flow onto the next page.
  let section = '';
  let damageGroup = '';
  let damageCaption = '';

  try {
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      const items: Item[] = content.items
        .filter((it) => 'str' in it && it.str.trim() !== '')
        .map((it) => {
          const t = it as { str: string; transform: number[]; width: number };
          return { str: t.str.trim(), x: t.transform[4], y: t.transform[5], w: t.width };
        })
        .filter((it) => it.y > BODY_BOTTOM && it.y < BODY_TOP);

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
        const text = row.map((it) => it.str).join(' ');

        if (isDamage(rowSection)) {
          if (DAMAGE_HEADING.test(text)) {
            damages.push({ group: damageGroup, label: text.replace(DAMAGE_HEADING, '') });
            damageHeadings.push(row[0]);
            damageCaption = text;
          } else if (norm(row[0].str) === 'commentaire' && row.length > 1 && damages.length) {
            const last = damages[damages.length - 1];
            last.label += ` (${row.slice(1).map((it) => it.str).join(' ')})`;
          } else if (text === text.toUpperCase() && /[A-Z]{4}/.test(text)) {
            damageGroup = text;
          }
        } else if (rowSection.includes('equipement')) {
          equipmentText += ` ${text}`;
        } else if (!isCommercial(rowSection) && !row[0].str.startsWith('»') && row.length > 1) {
          const label = norm(row[0].str);
          if (!fields.has(label)) fields.set(label, row.slice(1).map((it) => it.str).join(' '));
        }
      }

      // Each photo is wrapped in a link to its original file.
      const links = (await page.getAnnotations())
        .filter((a) => a.subtype === 'Link' && typeof a.url === 'string')
        .map((a) => ({ rect: a.rect as number[], url: a.url as string }));
      const linkAt = (cx: number, cy: number) =>
        links.find(({ rect: [x1, y1, x2, y2] }) => cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2)
          ?.url ?? null;

      // Images: walk the operator list tracking the transform matrix.
      const ops = await page.getOperatorList();
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
          // Skip icons and the page-header logo.
          if (w < MIN_PHOTO_WIDTH || y + h / 2 > BODY_TOP) continue;
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
            caption = above.length
              ? toRows(above).at(-1)!.map((it) => it.str).join(' ')
              : pageStartDamageCaption;
          }

          const img = await getImageObject(page, args[0]);
          const canvas = img && imageToCanvas(img);
          const blob = canvas && (await encodeCanvas(canvas));
          if (!blob) continue;

          photos.push({
            id: `${p}-${i}`,
            section: commercial ? 'commercial' : 'damage',
            caption: caption || 'Photo',
            suggested: commercial && SUGGESTED_CAPTION.test(caption),
            blob,
            sourceUrl: linkAt(x + w / 2, y + h / 2),
          });
        }
      }

      if (banners.length) section = banners.reduce((a, b) => (b.y < a.y ? b : a)).name;
      page.cleanup();
      onProgress?.(p, doc.numPages);
    }
  } finally {
    await task.destroy();
  }

  if (!fields.has('marque')) {
    throw new Error(
      "Ce PDF ne ressemble pas à un rapport d'inspection (marque introuvable)."
    );
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
    year: firstRegistration ? Number(firstRegistration.slice(0, 4)) : undefined,
    first_registration: firstRegistration,
    mileage_km: integer(fields.get('kilometrage')) ?? undefined,
    fuel: toFuel(fields.get('carburant')),
    gearbox: gearbox ? (/auto/i.test(gearbox) ? 'automatique' : 'manuelle') : undefined,
    engine_cc: integer(fields.get('cylindree')),
    power_hp: toPowerHp(fields.get('puissance')),
    doors: integer(fields.get('nombre de portes')),
    seats: integer(fields.get('nombre de sieges')),
    color: color || null,
  };
  car.description_fr = buildDescription(car, fields, equipmentHighlights(equipmentText));

  return {
    reportNumber: fields.get('n° de rapport') ?? null,
    inspectedAt: fields.get('inspecte le') ?? null,
    vin: fields.get('n° de chassis') ?? null,
    car,
    photos,
    damages,
  };
}
