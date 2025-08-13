/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
      {
        source: '/sounds/:path*.mp3',
        headers: [
          {
            key: 'Content-Type',
            value: 'audio/mpeg',
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

  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    })
    return config
  },
}

export default nextConfig
