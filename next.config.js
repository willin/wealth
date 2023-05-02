/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    runtime: 'experimental-edge',
    serverComponentsExternalPackages: ['@planetscale/database']
  }
};

module.exports = nextConfig;
