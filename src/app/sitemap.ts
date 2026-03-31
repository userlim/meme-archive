import { MetadataRoute } from 'next'
import { MEME_CATEGORIES } from '@/data/memes'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://meme-archive.vercel.app'
  const memePages = MEME_CATEGORIES.map(m => ({
    url: `${baseUrl}/meme/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...memePages,
    { url: `${baseUrl}/history-page`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]
}
