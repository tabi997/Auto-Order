/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now default in Next.js 14, no need to specify
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        port: '',
        pathname: '/f/**',
      },
    ],
  },
}

module.exports = nextConfig
