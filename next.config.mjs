/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure static files are properly served with correct headers
  async headers() {
    return [
      {
        source: '/sounds/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS',
          },
          {
            key: 'Content-Type',
            value: 'audio/mpeg',
          },
        ],
      },
      // Also handle other audio formats
      {
        source: '/sounds/:path*.wav',
        headers: [
          {
            key: 'Content-Type',
            value: 'audio/wav',
          },
        ],
      },
      {
        source: '/sounds/:path*.ogg',
        headers: [
          {
            key: 'Content-Type',
            value: 'audio/ogg',
          },
        ],
      },
    ]
  },
  // Ensure public directory is properly served
  async rewrites() {
    return [
      {
        source: '/sounds/:path*',
        destination: '/sounds/:path*',
      },
    ]
  },
}

export default nextConfig
