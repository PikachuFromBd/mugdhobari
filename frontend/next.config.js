/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'filehosting.shahadathassan.workers.dev',
      'filetolinkbot.shahadathassan.workers.dev',
    ],
  },
}

module.exports = nextConfig

