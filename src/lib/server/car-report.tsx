import path from 'node:path';

import { Document, Font, Image, Link, Page, Path, StyleSheet, Svg, Text, View, renderToBuffer } from '@react-pdf/renderer';
import sharp from 'sharp';

import { BRAND_RED, LOGO } from '@/components/logoPaths';
import type { Locale } from '@/i18n/routing';
import { deliveredEstimates } from '@/lib/car-estimates';
import { carDescription, carTitle } from '@/lib/car-i18n';
import type { CustomsSettings } from '@/lib/customs';
import { dzRoutes } from '@/lib/eligibility';
import { formatDate, formatDzd, formatLongDate, formatNumber, formatPrice } from '@/lib/format';
import { loadCarImages } from '@/lib/server/car-image-store';
import { SITE } from '@/lib/site';
import type { Car } from '@/lib/types';

/**
 * Branded, printable PDF "fiche véhicule" generated on the server.
 * Light paper (prints well) with the site's dark header band and brand red.
 */

// ---------------------------------------------------------------- fonts ----

const FONT_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), 'node_modules', '@fontsource');
const font = (pkg: string, file: string) => path.join(/*turbopackIgnore: true*/ FONT_DIR, pkg, 'files', file);

let fontsReady = false;
function registerFonts() {
  if (fontsReady) return;
  Font.register({
    family: 'Inter',
    fonts: [
      { src: font('inter', 'inter-latin-400-normal.woff'), fontWeight: 400 },
      { src: font('inter', 'inter-latin-600-normal.woff'), fontWeight: 600 },
      { src: font('inter', 'inter-latin-700-normal.woff'), fontWeight: 700 },
    ],
  });
  Font.register({
    family: 'Sora',
    fonts: [
      { src: font('sora', 'sora-latin-600-normal.woff'), fontWeight: 600 },
      { src: font('sora', 'sora-latin-700-normal.woff'), fontWeight: 700 },
    ],
  });
  Font.register({
    family: 'Cairo',
    fonts: [
      { src: font('cairo', 'cairo-arabic-400-normal.woff'), fontWeight: 400 },
      { src: font('cairo', 'cairo-arabic-600-normal.woff'), fontWeight: 600 },
      { src: font('cairo', 'cairo-arabic-700-normal.woff'), fontWeight: 700 },
    ],
  });
  // Never split words with hyphens (car names, VINs, e-mail addresses).
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

// --------------------------------------------------------------- colours ---

const C = {
  ink: '#0b0c10',
  text: '#1f2430',
  muted: '#6b7280',
  line: '#e5e7eb',
  soft: '#f5f6f8',
  red: BRAND_RED,
  redSoft: '#fdecee',
  green: '#047857',
  header: '#07080b',
};

// ---------------------------------------------------------------- helpers --

/**
 * PDF text runs are laid out without a browser's bidi engine: strip the
 * invisible direction marks Intl inserts for Arabic and the narrow
 * no-break spaces missing from the web-font subsets.
 */
const clean = (s: string) => s.replace(/[‎‏؜]/g, '').replace(/[  ]/g, ' ');

interface Photo {
  src: Buffer;
}

/** Re-encode stored WebP photos as JPEG (react-pdf only embeds JPEG/PNG). */
async function preparePhotos(images: string[], max: number): Promise<Photo[]> {
  const stored = await loadCarImages(images.slice(0, max));
  const out = await Promise.all(
    stored.map(async (img, i): Promise<Photo | null> => {
      try {
        const data = await sharp(img.body)
          .rotate()
          .resize({ width: i === 0 ? 1600 : 1000, withoutEnlargement: true })
          .flatten({ background: '#ffffff' })
          .jpeg({ quality: i === 0 ? 82 : 74, mozjpeg: true })
          .toBuffer();
        return { src: data };
      } catch {
        return null;
      }
    })
  );
  return out.filter((p): p is Photo => p !== null);
}

function Logo({ width }: { width: number }) {
  const { viewBox, red, dark } = LOGO.horizontal;
  const [, , vw, vh] = viewBox.split(' ').map(Number);
  return (
    <Svg viewBox={viewBox} style={{ width, height: (width * vh) / vw }}>
      <Path d={red} fill={C.red} />
      <Path d={dark} fill="#ffffff" />
    </Svg>
  );
}

// --------------------------------------------------------------- document --

export interface ReportLabels {
  t: (key: string, values?: Record<string, string | number>) => string;
  fuel: (key: string) => string;
  gearbox: (key: string) => string;
  status: (key: string) => string;
  dz: (key: string) => string;
}

interface Props {
  car: Car;
  locale: Locale;
  customs: CustomsSettings;
  photos: Photo[];
  L: ReportLabels;
}

function CarReport({ car, locale, customs, photos, L }: Props) {
  const rtl = locale === 'ar';
  const row = rtl ? 'row-reverse' : 'row';
  const align = rtl ? 'right' : 'left';
  const body = rtl ? ['Cairo', 'Inter'] : ['Inter', 'Cairo'];
  const display = rtl ? ['Cairo', 'Sora'] : ['Sora', 'Cairo'];
  const t = (key: string, values?: Record<string, string | number>) => clean(L.t(key, values));
  // Paragraph direction for localized prose; numbers/URLs stay in their own LTR runs.
  const R = { direction: rtl ? ('rtl' as const) : ('ltr' as const) };

  const s = StyleSheet.create({
    page: { fontFamily: body, fontSize: 9.5, color: C.text, paddingTop: 34, paddingBottom: 54, backgroundColor: '#ffffff' },
    pad: { paddingHorizontal: 36 },
    header: { marginTop: -34, backgroundColor: C.header, paddingHorizontal: 36, paddingVertical: 18, flexDirection: row, alignItems: 'center', justifyContent: 'space-between' },
    headerRule: { height: 3, backgroundColor: C.red },
    eyebrow: { fontSize: 8, fontWeight: 700, color: C.red, letterSpacing: rtl ? 0 : 1.6, textTransform: rtl ? 'none' : 'uppercase', textAlign: align, ...R },
    h1: { fontFamily: display, fontSize: 22, fontWeight: 700, color: C.ink, marginTop: 4, textAlign: align, lineHeight: 1.2, ...R },
    h2: { fontFamily: display, fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 8, textAlign: align, ...R },
    muted: { color: C.muted, textAlign: align, ...R },
    card: { borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 14 },
    footer: { position: 'absolute', bottom: 18, left: 36, right: 36, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 8, flexDirection: row, justifyContent: 'space-between', fontSize: 7, color: C.muted },
  });

  const title = clean(carTitle(car, locale, `${car.make} ${car.model}`));
  const description = carDescription(car, locale);
  const sold = car.status === 'vendu';
  const routes = sold ? [] : dzRoutes(car, customs.ccr_max_cc, customs.ccr_max_age_years);
  const estimates = deliveredEstimates(car, customs);
  const today = new Date().toISOString().slice(0, 10);
  const url = `${SITE.url}${locale === 'fr' ? '' : `/${locale}`}/voitures/${car.slug}`;
  const ref = car.id.slice(0, 8).toUpperCase();
  const showHT = car.vat_recoverable && car.price_ht != null;

  const specs = [
    [t('car.year'), String(car.year)],
    car.first_registration && [t('car.firstRegistration'), formatDate(car.first_registration)],
    [t('car.mileage'), `${formatNumber(car.mileage_km, locale)} ${t('car.km')}`],
    [t('car.fuel'), L.fuel(car.fuel)],
    [t('car.gearbox'), L.gearbox(car.gearbox)],
    car.engine_cc && [t('car.engine'), `${formatNumber(car.engine_cc, locale)} ${t('car.cc')}`],
    car.power_hp && [t('car.power'), `${car.power_hp} ${t('car.ch')}`],
    car.doors && [t('car.doors'), String(car.doors)],
    car.seats && [t('car.seats'), String(car.seats)],
    car.color && [t('car.color'), car.color],
    car.location && [t('car.location'), car.location],
  ].filter(Boolean) as [string, string][];

  const [hero, ...rest] = photos;
  const strip = rest.slice(0, 4);
  const gallery = rest.slice(4);

  /** One "label ……… value" line; value in its own run so numbers never reorder. */
  const Line = ({ label, value, strong, color }: { label: string; value: string; strong?: boolean; color?: string }) => (
    <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'baseline', paddingVertical: 2.5 }}>
      <Text style={{ color: C.muted, fontSize: 8.5, flexShrink: 1, textAlign: align }}>{label}</Text>
      <Text style={{ fontFamily: display, fontWeight: strong ? 700 : 600, fontSize: strong ? 17 : 10.5, color: color ?? C.ink, marginLeft: rtl ? 0 : 10, marginRight: rtl ? 10 : 0 }}>
        {clean(value)}
      </Text>
    </View>
  );

  const Footer = () => (
    <View style={s.footer} fixed>
      <Text style={{ textAlign: align, maxWidth: '80%' }}>
        {clean(`${SITE.legal.name} · ${SITE.legal.legalForm} · SIREN ${SITE.legal.siren} · ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city} · ${SITE.url.replace(/^https?:\/\//, '')}`)}
      </Text>
      <Text render={({ pageNumber, totalPages }) => t('report.page', { page: pageNumber, total: totalPages })} />
    </View>
  );

  return (
    <Document
      title={`${title} — ${SITE.name}`}
      author={SITE.name}
      subject={t('report.title')}
      creator={SITE.name}
      producer={SITE.name}
      language={locale}
    >
      <Page size="A4" style={s.page}>
        {/* Brand header */}
        <View style={s.header}>
          <Logo width={150} />
          <View style={{ alignItems: rtl ? 'flex-start' : 'flex-end' }}>
            <Text style={{ fontFamily: display, fontSize: 11, fontWeight: 700, color: '#ffffff' }}>{t('report.title')}</Text>
            <View style={{ flexDirection: row, marginTop: 3 }}>
              <Text style={{ fontSize: 7.5, color: '#969eac' }}>{t('report.reference')}</Text>
              <Text style={{ fontSize: 7.5, color: '#969eac', marginHorizontal: 3 }}>{`${ref}  ·`}</Text>
              <Text style={{ fontSize: 7.5, color: '#969eac' }}>{t('report.issued', { date: clean(formatLongDate(today, locale)) })}</Text>
            </View>
          </View>
        </View>
        <View style={s.headerRule} />

        <View style={[s.pad, { marginTop: 20 }]}>
          {/* Title */}
          <Text style={s.eyebrow}>{clean(`${car.make} · ${car.year}`)}</Text>
          <Text style={s.h1}>{title}</Text>
          {car.version && <Text style={[s.muted, { fontSize: 10, marginTop: 2 }]}>{clean(car.version)}</Text>}

          {/* Photos */}
          {hero && (
            <View style={{ marginTop: 14 }}>
              <Image src={hero.src} style={{ width: '100%', height: 228, objectFit: 'cover', borderRadius: 8 }} />
              {strip.length > 0 && (
                <View style={{ flexDirection: row, marginTop: 6, marginHorizontal: -3 }}>
                  {strip.map((p, i) => (
                    <View key={i} style={{ width: '25%', paddingHorizontal: 3 }}>
                      <Image src={p.src} style={{ width: '100%', height: 62, objectFit: 'cover', borderRadius: 6 }} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Price + key facts */}
          <View style={{ flexDirection: row, marginTop: 16 }} wrap={false}>
            <View style={{ flex: 1.25 }}>
              <Text style={s.h2}>{t('report.keyFacts')}</Text>
              <View style={{ flexDirection: row, flexWrap: 'wrap', marginHorizontal: -3 }}>
                {specs.map(([label, value]) => (
                  <View key={label} style={{ width: '33.33%', padding: 3 }}>
                    <View style={{ backgroundColor: C.soft, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 8 }}>
                      <Text style={{ fontSize: 7, color: C.muted, textAlign: align, ...R }}>{label}</Text>
                      <Text style={{ fontSize: 9.5, fontWeight: 600, color: C.ink, marginTop: 2, textAlign: align, ...R }}>{clean(value)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ width: 16 }} />

            <View style={{ flex: 1 }}>
              <Text style={s.h2}>{t('report.price')}</Text>
              <View style={[s.card, { borderColor: C.ink, borderWidth: 1.2 }]}>
                {car.status !== 'disponible' && (
                  <Text style={{ alignSelf: rtl ? 'flex-end' : 'flex-start', backgroundColor: C.ink, color: '#ffffff', fontSize: 7.5, fontWeight: 700, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 8, marginBottom: 6 }}>
                    {L.status(car.status)}
                  </Text>
                )}
                {showHT && <Line label={t('car.priceHT')} value={formatPrice(car.price_ht!, locale)} strong color={C.green} />}
                <Line label={t('car.priceTTC')} value={formatPrice(car.price_eur, locale)} strong={!showHT} />
                <Text style={{ fontSize: 7, color: C.muted, textAlign: align, ...R }}>
                  {car.vat_recoverable ? t('car.vatRecoverable') : t('car.vatNotRecoverable')}
                </Text>

                {(car.export_dz || routes.length > 0) && (
                  <View style={{ marginTop: 8, flexDirection: row, flexWrap: 'wrap' }}>
                    {car.export_dz && <Badge text={t('car.exportEligible')} rtl={rtl} />}
                    {routes.map((r) => (
                      <Badge key={r} text={clean(L.dz(r))} rtl={rtl} tone={r === 'diesel' ? 'warn' : 'ok'} />
                    ))}
                  </View>
                )}

                {estimates.length > 0 && (
                  <View style={{ marginTop: 8, backgroundColor: C.redSoft, borderRadius: 6, padding: 8 }}>
                    <Text style={{ fontSize: 8.5, fontWeight: 700, color: C.ink, textAlign: align, marginBottom: 2, ...R }}>{t('car.deliveredTitle')}</Text>
                    {estimates.map((e) => (
                      <View key={e.route} style={{ flexDirection: row, justifyContent: 'space-between', paddingVertical: 2 }}>
                        <Text style={{ fontSize: 7.5, color: C.muted }}>{t(`car.delivered.${e.route}`)}</Text>
                        <View style={{ alignItems: rtl ? 'flex-start' : 'flex-end' }}>
                          <View style={{ flexDirection: row, alignItems: 'baseline' }}>
                            <Text style={{ fontSize: 7, color: C.muted, marginHorizontal: 3 }}>{rtl ? '~' : t('report.approx')}</Text>
                            <Text style={{ fontFamily: display, fontWeight: 700, fontSize: 10, color: C.ink }}>{clean(formatPrice(e.totalEur, locale))}</Text>
                          </View>
                          <Text style={{ fontSize: 7, color: C.muted }}>{clean(formatDzd(e.totalDzd, locale))}</Text>
                        </View>
                      </View>
                    ))}
                    <Text style={{ fontSize: 6.5, color: C.muted, marginTop: 3, textAlign: align, lineHeight: 1.35, ...R }}>
                      {t('car.deliveredNote', { freight: clean(formatPrice(customs.default_freight_eur + customs.default_insurance_eur, locale)) })}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Description */}
          {description && (
            <View style={{ marginTop: 18 }}>
              <Text style={s.h2} minPresenceAhead={40}>{t('car.description')}</Text>
              {clean(description)
                .replace(/\r\n?/g, '\n')
                .split(/\n\s*\n+/)
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <Text key={i} style={{ lineHeight: 1.5, textAlign: align, marginBottom: 5, ...R }}>
                    {para}
                  </Text>
                ))}
            </View>
          )}

          {/* Contact */}
          <View style={[s.card, { marginTop: 18, backgroundColor: C.header, borderColor: C.header, padding: 16 }]} wrap={false}>
            <View>
              <View>
                <Text style={{ fontFamily: display, fontWeight: 700, fontSize: 12, color: '#ffffff', textAlign: align, ...R }}>{t('report.contactTitle')}</Text>
                <Text style={{ color: '#b6bcc8', fontSize: 8.5, marginTop: 4, textAlign: align, lineHeight: 1.45, ...R }}>{t('report.contactText')}</Text>
              </View>
            </View>
            <View style={{ flexDirection: row, flexWrap: 'wrap', marginTop: 10 }}>
              {SITE.phone && <Contact label={t('report.phone')} value={SITE.phone} href={SITE.phoneHref} rtl={rtl} />}
              {SITE.whatsapp && <Contact label="WhatsApp" value={SITE.phone || `+${SITE.whatsapp}`} href={`https://wa.me/${SITE.whatsapp}`} rtl={rtl} />}
              {SITE.email && <Contact label={t('report.email')} value={SITE.email} href={`mailto:${SITE.email}`} rtl={rtl} />}
              <Contact label={t('report.address')} value={`${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}`} rtl={rtl} />
              <Contact label={t('report.online')} value={url.replace(/^https?:\/\//, '')} href={url} rtl={rtl} wide />
            </View>
          </View>

          <Text style={{ fontSize: 6.8, color: C.muted, marginTop: 10, lineHeight: 1.4, textAlign: align, ...R }}>{t('report.disclaimer')}</Text>
        </View>

        <Footer />
      </Page>

      {/* Remaining photos, two per row */}
      {gallery.length > 0 && (
        <Page size="A4" style={[s.page, { paddingTop: 30 }]}>
          <View style={s.pad}>
            <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }} fixed>
              <Text style={[s.h2, { marginBottom: 0 }]}>{`${t('report.photos')} · ${title}`}</Text>
              <Text style={{ fontSize: 8, color: C.muted }}>{t('report.photoCount', { count: photos.length })}</Text>
            </View>
            <View style={{ flexDirection: row, flexWrap: 'wrap', marginHorizontal: -4 }}>
              {gallery.map((p, i) => (
                <View key={i} style={{ width: '50%', padding: 4 }} wrap={false}>
                  <Image src={p.src} style={{ width: '100%', height: 168, objectFit: 'cover', borderRadius: 6 }} />
                </View>
              ))}
            </View>
          </View>
          <Footer />
        </Page>
      )}
    </Document>
  );
}

function Badge({ text, rtl, tone = 'ok' }: { text: string; rtl: boolean; tone?: 'ok' | 'warn' }) {
  return (
    <Text
      style={{
        fontSize: 7,
        fontWeight: 600,
        color: tone === 'ok' ? C.green : '#b45309',
        backgroundColor: tone === 'ok' ? '#ecfdf5' : '#fffbeb',
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 8,
        marginBottom: 3,
        marginRight: rtl ? 0 : 4,
        marginLeft: rtl ? 4 : 0,
      }}
    >
      {text}
    </Text>
  );
}

function Contact({ label, value, href, rtl, wide }: { label: string; value: string; href?: string; rtl: boolean; wide?: boolean }) {
  const v = <Text style={{ fontSize: 9, fontWeight: 600, color: '#ffffff', marginTop: 1.5 }}>{clean(value)}</Text>;
  return (
    <View style={{ width: wide ? '100%' : '50%', paddingVertical: 4, alignItems: rtl ? 'flex-end' : 'flex-start' }}>
      <Text style={{ fontSize: 6.8, color: '#969eac', textTransform: rtl ? 'none' : 'uppercase', letterSpacing: rtl ? 0 : 0.8 }}>{label}</Text>
      {href ? (
        <Link src={href} style={{ textDecoration: 'none' }}>
          {v}
        </Link>
      ) : (
        v
      )}
    </View>
  );
}

/** Max photos embedded in one report (keeps the file small enough for WhatsApp). */
const MAX_PHOTOS = 17; // hero + 4 strip + 12 gallery (two pages)

export async function renderCarReport(args: { car: Car; locale: Locale; customs: CustomsSettings; L: ReportLabels }): Promise<Buffer> {
  registerFonts();
  const photos = await preparePhotos(args.car.images, MAX_PHOTOS);
  return renderToBuffer(<CarReport {...args} photos={photos} />);
}
