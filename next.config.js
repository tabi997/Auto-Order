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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Allow local images from /uploads directory
    domains: ['localhost'],
    unoptimized: true,
    // Disable image optimization for local images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig
