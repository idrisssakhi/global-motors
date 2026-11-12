import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Every quality × width pair is a separate optimized file; keep the grid
    // small. Car photos come from /img (same-origin Supabase proxy).
    qualities: [68, 75],
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 1080, 1920],
    imageSizes: [96, 256, 384],
    maximumResponseBody: 25_000_000,
    localPatterns: [{ pathname: '/img/**', search: '' }],
    // Legacy absolute URLs stored as full links still work.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_HOSTNAME ?? '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    // Background videos are immutable, long-cache them.
    return [
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
