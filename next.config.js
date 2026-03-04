/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'asukacouture.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: '**.cdn.shopify.com' },
    ],
    unoptimized: true,
  },
  // Required for Netlify deployment
  output: 'standalone',
}

module.exports = nextConfig
