/* eslint-disable @next/next/no-img-element -- next/og renders plain <img> */
import { ImageResponse } from 'next/og';
import { GOLF } from '@/components/home/golfPaths';

/** SVG string → data URI usable by next/og. */
const svgData = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

const GOLD =
  '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e1b0"/><stop offset=".5" stop-color="#d9a94e"/><stop offset="1" stop-color="#a8772a"/></linearGradient>';

/** Hexagon brand mark (the "SKH" letters are drawn as text on top). */
export const MARK_SRC = svgData(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs>${GOLD}</defs><path d="M24 2 43 13v22L24 46 5 35V13z" fill="none" stroke="url(#g)" stroke-width="2.4"/></svg>`
);

/** Static gold line-art Golf VIII, built from the hero animation paths. */
function carSrc() {
  const w = GOLF.wheels
    .map(
      (c) =>
        `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r + 6}" fill="#07080b"/><circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="#0a0b0f" stroke="#2c313c" stroke-width="2"/><circle cx="${c.cx}" cy="${c.cy}" r="${c.rim}" fill="#1b1f27" stroke="url(#g)" stroke-width="3"/><circle cx="${c.cx}" cy="${c.cy}" r="10" fill="#d9a94e"/>`
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -6 1000 404"><defs>${GOLD}<clipPath id="c"><rect x="-60" y="-60" width="1120" height="${GOLF.sillY + 60}"/></clipPath></defs>
<ellipse cx="500" cy="376" rx="470" ry="13" fill="#000" opacity=".7"/>
<g clip-path="url(#c)"><path d="${GOLF.body}" fill="#151820" stroke="url(#g)" stroke-width="3.2" stroke-linejoin="round"/></g>
<path d="${GOLF.bottom}" stroke="url(#g)" stroke-width="3.2"/>
${GOLF.windows.map((d) => `<path d="${d}" fill="#101826" stroke="url(#g)" stroke-width="2"/>`).join('')}
<path d="${GOLF.pillar}" fill="#0a0c11"/>
${[...GOLF.lines, ...GOLF.creases].map((d) => `<path d="${d}" fill="none" stroke="#d9a94e" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>`).join('')}
${GOLF.handles.map((d) => `<path d="${d}" fill="#1d212b" stroke="#d9a94e" stroke-width="1.2"/>`).join('')}
<path d="${GOLF.mirror}" fill="#141821" stroke="#d9a94e" stroke-width="1.5"/>
<path d="${GOLF.headlight}" fill="#f6e1b0"/><path d="${GOLF.taillight}" fill="#c0392b"/>${w}</svg>`;
  return svgData(svg);
}

/** 1200×630 share card used for Open Graph and Twitter on every page. */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          color: '#ffffff',
          backgroundColor: '#07080b',
          backgroundImage:
            'radial-gradient(circle at 78% 72%, rgba(217,169,78,0.24), rgba(7,8,11,0) 48%), linear-gradient(135deg, #12141b 0%, #07080b 65%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', position: 'relative', width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}>
            <img src={MARK_SRC} width={72} height={72} style={{ position: 'absolute', top: 0, left: 0 }} alt="" />
            <span style={{ fontSize: 20, fontWeight: 800, color: '#e0b25c' }}>SKH</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: 7 }}>GLOBAL</span>
            <span style={{ fontSize: 20, letterSpacing: 12, color: '#d9a94e' }}>MOTORS</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: 620 }}>
          <span style={{ fontSize: 22, letterSpacing: 5, color: '#d9a94e' }}>PARIS · MARSEILLE · ALGER</span>
          <span style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, marginTop: 18 }}>Véhicules d’exception,</span>
          <span style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, color: '#e8c27a' }}>de la France à l’Algérie.</span>
        </div>

        <span style={{ fontSize: 22, color: '#aab1be', width: 600 }}>
          Stock vérifié · Export clé en main · Simulateur de dédouanement
        </span>

        <img src={carSrc()} width={500} height={202} style={{ position: 'absolute', right: 26, bottom: 44 }} alt="" />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
