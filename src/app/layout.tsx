import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Meme Archive - Free Online Tool',
  description: 'Free Meme Archive tool. No signup required.',
  keywords: 'meme archive, free calculator, online tool',
  metadataBase: new URL('https://meme-archive-self.vercel.app'),
  openGraph: {
    title: 'Meme Archive - Free Online Tool',
    description: 'Free Meme Archive tool. No signup required.',
    url: 'https://meme-archive-self.vercel.app',
    siteName: 'Meme Archive',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meme Archive',
    description: 'Free Meme Archive tool. No signup required.',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  icons: { icon: '/favicon.svg' },
  alternates: {
    canonical: 'https://meme-archive-self.vercel.app',
    languages: {
      'en': 'https://meme-archive-self.vercel.app',
      'x-default': 'https://meme-archive-self.vercel.app',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-4361110443201092" />
        {/* Google AdSense - must be in head for auto ads */}
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4361110443201092" crossOrigin="anonymous" strategy="afterInteractive" />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-P04TH8XJJ9" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-P04TH8XJJ9');
        `}</Script>
              {/* BreadcrumbList Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://meme-archive-self.vercel.app"}, {"@type": "ListItem", "position": 2, "name": "Meme Archive", "item": "https://meme-archive-self.vercel.app"}]})
        }} />
        {/* Organization & WebSite Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({"@context": "https://schema.org", "@type": "WebSite", "name": "Meme Archive", "url": "https://meme-archive-self.vercel.app", "publisher": {"@type": "Organization", "name": "UtiliCalc Tools", "url": "https://utilicalc.vercel.app", "logo": {"@type": "ImageObject", "url": "https://meme-archive-self.vercel.app/favicon.svg"}}, "potentialAction": {"@type": "SearchAction", "target": "https://meme-archive-self.vercel.app/?q={search_term_string}", "query-input": "required name=search_term_string"}})
        }} />
        {/* Preconnect & DNS-Prefetch Hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        {/* Speakable Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({"@context": "https://schema.org", "@type": "WebPage", "speakable": {"@type": "SpeakableSpecification", "cssSelector": ["h1", ".keyword-seo-section p"]}})
        }} />
</head>
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <span className="font-bold text-lg text-white">Meme Archive</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
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
          
            <div className="flex flex-wrap justify-center gap-4 mb-3">
              <span className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">Related Free Tools:</span>
                <a href="https://emoji-copy-app.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors text-xs">Emoji Copy & Paste Tool</a>
                <a href="https://meettime-tawny.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors text-xs">Meeting Time Zone Scheduler</a>
                <a href="https://timezone-converter-ashy.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors text-xs">World Timezone Converter</a>
                <a href="https://bmi-calculator-free.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors text-xs">Free BMI Calculator</a>
                <a href="https://utilicalc.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors text-xs">UtiliCalc All-in-One Tools</a>
            </div>
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
            <p>&copy; {new Date().getFullYear()} Meme Archive. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-[var(--text-muted)] transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[var(--text-muted)] transition">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
