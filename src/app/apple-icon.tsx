import { ImageResponse } from 'next/og';
import { MARK_SRC } from '@/lib/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon: gold SKH hexagon on the site's night background. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: '#07080b',
        }}
      >
        <img src={MARK_SRC} width={136} height={136} style={{ position: 'absolute', top: 22, left: 22 }} alt="" />
        <span style={{ fontSize: 40, fontWeight: 800, color: '#e0b25c' }}>SKH</span>
      </div>
    ),
    size
  );
}
