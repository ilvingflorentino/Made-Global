import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['https://9003-firebase-studio-1747933429942.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev'],
  },
  // The i18n object below is removed as it's not supported with App Router
  // and can cause conflicts. i18n is handled via middleware and src/config/i18n.config.ts
  // i18n: {
  //   locales: ['en', 'es'],
  //   defaultLocale: 'es',
  //   localeDetection: false,
  // },
};

export default nextConfig;
