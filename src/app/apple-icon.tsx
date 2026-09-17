/* eslint-disable @next/next/no-img-element -- next/og renders plain <img> */
import { ImageResponse } from 'next/og';
import { logoSrc } from '@/lib/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon: the SKH globe mark on the site's night background. */
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
          backgroundColor: '#07080b',
        }}
      >
        <img src={logoSrc('mark')} width={148} height={94} alt="" />
      </div>
    ),
    size
  );
}
