import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import Link from 'next/link'

const SITE_URL = 'https://meme-archive-self.vercel.app'
const SITE_NAME = 'Meme Archive'
const DESCRIPTION = 'Browse and watch the hottest viral meme videos from YouTube. Trending memes sorted by views, engagement, and recency. Brainrot, TikTok memes, Korean memes and more. Free meme video aggregator with swipe player.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - Trending Viral Meme Videos`, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  keywords: [
    'meme', 'viral videos', 'youtube memes', 'trending memes', 'meme compilation',
    'funny videos', 'brainrot', 'tung tung tung sahur', 'skibidi toilet', 'bombardiro crocodilo',
    'tralalero tralala', 'internet memes', 'tiktok memes', 'meme songs',
    '밈', '밈 모음', '유행 밈', '트렌딩 밈', '밈 아카이브', '브레인롯',
    '간바레', '카니 챌린지', '골반통신',
    'meme archive', 'meme aggregator', 'watch memes', 'best memes 2026',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: `${SITE_NAME} - Trending Viral Meme Videos`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'ja_JP', 'zh_CN', 'es_ES', 'fr_FR', 'de_DE', 'pt_BR'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Trending Viral Meme Videos`,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: { google: ['hsjncRi9cl3tz3Otd6SJKurSt_V1bZ0AKO-bdWIGeHM', 'ETO59LUETFhBHTx7GMun0GscvJgzLq2iGWdeAmh3e10'] },
  alternates: { canonical: SITE_URL },
  category: 'entertainment',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-4361110443201092" />
        {/* Google AdSense - must be in head for auto ads */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4361110443201092" crossOrigin="anonymous"></script>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-P08T3SZDQH" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-P08T3SZDQH');
        `}</Script>
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <span className="font-bold text-lg text-white">Meme Archive</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/history-page" className="hover:text-white transition flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                History
              </Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Meme Archive. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-gray-300 transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-300 transition">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
