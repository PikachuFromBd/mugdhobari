/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // This acts as your "allow all" for your specific tunnels and workers
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.workers.dev" 
  ],

  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'filehosting.shahadathassan.workers.dev' },
      { protocol: 'https', hostname: 'filetolinkbot.shahadathassan.workers.dev' },
    ],
  },
}

module.exports = nextConfig