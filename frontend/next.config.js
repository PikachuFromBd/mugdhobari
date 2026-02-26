/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // This acts as your "allow all" for your specific tunnels and workers
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.workers.dev" 
  ],

  // Proxy /api/* to the Express backend so it works from ANY domain
  // (Cloudflare tunnel, custom domain, localhost — all work)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },

  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'filehosting.shahadathassan.workers.dev' },
      { protocol: 'https', hostname: 'filetolinkbot.shahadathassan.workers.dev' },
    ],
  },
}

module.exports = nextConfig