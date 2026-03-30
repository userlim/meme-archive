import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import Link from 'next/link'

const SITE_URL = 'https://meme-archive.vercel.app'
const SITE_NAME = 'Meme Archive'
const DESCRIPTION = 'Browse and watch the hottest viral meme videos from YouTube. Discover trending memes sorted by views, organized by categories. Free meme video aggregator.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - Viral Meme Videos`, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  keywords: ['meme', 'viral videos', 'youtube memes', 'trending memes', 'meme compilation', 'funny videos', 'brainrot', 'tung tung', 'skibidi', 'internet memes', '밈', '밈 모음', '유행 밈'],
  openGraph: {
    type: 'website', url: SITE_URL, title: SITE_NAME, description: DESCRIPTION, siteName: SITE_NAME,
  },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: DESCRIPTION },
  robots: { index: true, follow: true },
  verification: { google: 'hsjncRi9cl3tz3Otd6SJKurSt_V1bZ0AKO-bdWIGeHM' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="google-adsense-account" content="ca-pub-4361110443201092" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-P08T3SZDQH" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-P08T3SZDQH');
        `}</Script>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4361110443201092" crossOrigin="anonymous" strategy="afterInteractive" />
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
