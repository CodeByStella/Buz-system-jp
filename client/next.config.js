/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: process.env.API_URL || "http://localhost:3001",
  },
};

module.exports = nextConfig;
