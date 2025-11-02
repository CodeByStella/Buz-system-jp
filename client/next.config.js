/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
  },

  // ✅ Improve Safari compatibility with large CSS bundles
  experimental: {
    optimizeCss: false, // Prevents Safari from failing to parse large combined CSS
  },

  // ✅ Add proper cache and MIME headers for static assets
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
