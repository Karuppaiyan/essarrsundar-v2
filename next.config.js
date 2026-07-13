/** @type {import('next').NextConfig} */

// 1. Initialize the plugin with the correct configuration path
const withNextIntl = require('next-intl/plugin')(
  './i18n.request.ts'
);

// 2. Combine all your configurations into a single object
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

// 3. Export the single wrapped configuration
module.exports = withNextIntl(nextConfig);