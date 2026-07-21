import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // RTL / multi-locale support (fa, ar, en)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Standalone output for Docker deployment
  output: 'standalone',
};

export default withNextIntl(nextConfig);
