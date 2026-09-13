import { renderOgImage } from '@/lib/og';

export const alt = 'SKH Global Motors — véhicules d’exception, de la France à l’Algérie';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return renderOgImage();
}
