import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Meme Archive',
    short_name: 'Meme',
    description: 'Browse & Share Memes',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#F97316',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
