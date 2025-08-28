import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/temp/'],
    },
    sitemap: 'https://autoorder.ro/sitemap.xml',
  }
}
