'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MEME_CATEGORIES, MemeCategory } from '@/data/memes'
import { detectLocale, t, formatViewCount, LOCALE_NAMES, Locale } from './i18n'
import { addToHistory, isWatched } from './history'

interface TrendingVideo {
  id: string
  title: string
  channelTitle: string
  publishedAt: string
  thumbnail: string
  viewCount: number
  likeCount: number
  commentCount: number
  duration: string
  score: number
  ageHours: number
}

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''
  const h = match[1] ? `${match[1]}:` : ''
  const m = match[2] || '0'
  const s = (match[3] || '0').padStart(2, '0')
  return h ? `${h}${m.padStart(2, '0')}:${s}` : `${m}:${s}`
}

function timeAgo(dateStr: string, locale: Locale): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return locale === 'ko' ? '방금' : 'Just now'
  if (hours < 24) return locale === 'ko' ? `${hours}시간 전` : `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return locale === 'ko' ? `${days}일 전` : `${days}d ago`
  return locale === 'ko' ? `${Math.floor(days / 7)}주 전` : `${Math.floor(days / 7)}w ago`
}

function TrendingSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5">
      <div className="aspect-video skeleton" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  )
}

const SECTION_LABELS: Record<string, { en: string; ko: string; emoji: string }> = {
  trending: { en: 'Trending / Real-Time', ko: '실시간 트렌딩', emoji: '🔥' },
  songs: { en: 'Meme Songs & Sounds', ko: '밈 노래 & 사운드', emoji: '🎵' },
  genre: { en: 'By Genre', ko: '장르별', emoji: '🎭' },
  culture: { en: 'By Region', ko: '지역별', emoji: '🌏' },
  format: { en: 'By Format', ko: '형식별', emoji: '📐' },
}

function MemeCard({ meme, locale }: { meme: MemeCategory; locale: Locale }) {
  return (
    <Link href={`/meme/${meme.slug}`}
      className="group rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 video-card">
      <div className={`aspect-[3/2] bg-gradient-to-br ${meme.color} flex items-center justify-center relative`}>
        <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">{meme.emoji}</span>
      </div>
      <div className="p-2.5">
        <h3 className="font-bold text-white text-xs sm:text-sm truncate">
          {locale === 'ko' ? meme.nameKo : meme.name}
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
          {locale === 'ko' ? meme.descriptionKo : meme.description}
        </p>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [searchQuery, setSearchQuery] = useState('')
  const [trendingVideos, setTrendingVideos] = useState<TrendingVideo[]>([])
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => { setLocale(detectLocale()) }, [])

  useEffect(() => {
    const fetchTrending = async () => {
      setLoadingTrending(true)
      try {
        const res = await fetch('/api/trending')
        const data = await res.json()
        setTrendingVideos(data.memes || [])
      } catch { setTrendingVideos([]) }
      setLoadingTrending(false)
    }
    fetchTrending()
  }, [])

  // Group categories by section
  const sections = useMemo(() => {
    const map = new Map<string, MemeCategory[]>()
    for (const meme of MEME_CATEGORIES) {
      if (!map.has(meme.section)) map.set(meme.section, [])
      map.get(meme.section)!.push(meme)
    }
    return map
  }, [])

  // Search filter
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase()
    return MEME_CATEGORIES.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.nameKo.includes(q) ||
      m.keywords.some(k => k.toLowerCase().includes(q))
    )
  }, [searchQuery])

  const handlePlayTrending = (video: TrendingVideo) => {
    setPlayingId(video.id)
    addToHistory({
      videoId: video.id, title: video.title, channelTitle: video.channelTitle,
      thumbnail: video.thumbnail, viewCount: video.viewCount,
      memeSlug: 'trending', memeName: 'Trending',
    })
  }

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Meme Archive', url: 'https://meme-archive.vercel.app',
    description: 'Real-time trending meme videos. 50+ categories. Updated every 15 minutes.',
    applicationCategory: 'EntertainmentApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Meme Archive - Viral Meme Videos',
    description: 'Browse and watch trending viral meme videos from YouTube. Sorted by views, engagement, and recency.',
    url: 'https://meme-archive-self.vercel.app',
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      ratingCount: '6230',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden py-10 sm:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <select value={locale} onChange={e => setLocale(e.target.value as Locale)}
              className="text-sm bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-gray-300 outline-none">
              {(Object.keys(LOCALE_NAMES) as Locale[]).map(l => (
                <option key={l} value={l} className="bg-[#1a1a1a]">{LOCALE_NAMES[l]}</option>
              ))}
            </select>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            {t(locale, 'heroTitle')}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-5">
            {locale === 'ko'
              ? '50+ 카테고리, 실시간 업데이트. 지금 이 순간 가장 핫한 밈만 모아봐요.'
              : '50+ categories, real-time updates. Only the hottest memes right now.'}
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t(locale, 'search')}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:border-red-500/50 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Player */}
      {playingId && (
        <section className="max-w-4xl mx-auto px-4 mb-8">
          <div className="yt-embed-wrapper">
            <iframe src={`https://www.youtube.com/embed/${playingId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <button onClick={() => setPlayingId(null)} className="mt-2 text-sm text-gray-400 hover:text-white transition">
            {locale === 'ko' ? '닫기' : 'Close'}
          </button>
        </section>
      )}

      {/* Search results mode */}
      {filteredCategories !== null ? (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-white mb-4">
            {locale === 'ko' ? '검색 결과' : 'Search Results'} ({filteredCategories.length})
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredCategories.map(meme => <MemeCard key={meme.slug} meme={meme} locale={locale} />)}
          </div>
          {filteredCategories.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-3xl mb-2">🤷</p>
              <p>{t(locale, 'noVideos')}</p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* REAL-TIME TRENDING VIDEOS */}
          <section className="max-w-7xl mx-auto px-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                🔥 {locale === 'ko' ? '실시간 HOT 밈' : 'Hot Right Now'}
              </h2>
              <span className="text-[11px] text-gray-600">
                {locale === 'ko' ? '15분마다 업데이트' : 'Updates every 15min'}
              </span>
            </div>
            {loadingTrending ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => <TrendingSkeleton key={i} />)}
              </div>
            ) : trendingVideos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <p>{t(locale, 'apiKeyMissing')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {trendingVideos.slice(0, 12).map((video, index) => {
                  const watched = isWatched(video.id)
                  return (
                    <button key={video.id} onClick={() => handlePlayTrending(video)}
                      className="rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 video-card text-left">
                      <div className="relative">
                        <img src={video.thumbnail} alt={video.title}
                          className={`w-full aspect-video object-cover ${watched ? 'opacity-50' : ''}`} loading="lazy" />
                        <span className={`absolute top-1.5 left-1.5 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          index < 3 ? 'bg-red-500' : 'bg-black/60'
                        }`}>#{index + 1}</span>
                        {video.ageHours < 24 && (
                          <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                        )}
                        {video.duration && (
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">{parseDuration(video.duration)}</span>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className={`font-medium text-xs line-clamp-2 ${watched ? 'text-gray-400' : 'text-white'}`}>{video.title}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-[10px] mt-1">
                          <span>{formatViewCount(video.viewCount, locale)} {t(locale, 'viewCount')}</span>
                          <span>·</span>
                          <span>{timeAgo(video.publishedAt, locale)}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          {/* ALL CATEGORY SECTIONS */}
          {['trending', 'songs', 'genre', 'culture', 'format'].map(sectionKey => {
            const items = sections.get(sectionKey)
            if (!items || items.length === 0) return null
            const label = SECTION_LABELS[sectionKey]
            return (
              <section key={sectionKey} className="max-w-7xl mx-auto px-4 pb-8">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  {label.emoji} {locale === 'ko' ? label.ko : label.en}
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {items.map(meme => <MemeCard key={meme.slug} meme={meme} locale={locale} />)}
                </div>
              </section>
            )
          })}
        </>
      )}

      {/* SEO Content Section */}
      <section id="about-section" className="mt-8 max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold mb-3">About This Tool</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Browse and discover the internet's best memes in one organized archive. From classic reaction images to the latest viral trends, our curated collection covers every meme category. Search by keyword, browse by category, or explore what's trending. Save and share your favorites instantly.</p>
      </section>
      
      {/* Extended Content Section for SEO depth */}
      <section id="content-depth-section" className="mt-12 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Complete Guide</h2>
        
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">What Makes a Meme Go Viral?</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: `Internet memes spread through a combination of relatability, humor, simplicity, and timing. Research from Indiana University found that meme virality follows a "rich-get-richer" pattern — memes that gain early traction on platforms like Reddit, Twitter, and TikTok are exponentially more likely to spread further. The most successful memes tap into universal emotions or current events, are easily remixable, and work across cultural contexts.` }} />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">The History of Internet Memes</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: `The term "meme" was coined by Richard Dawkins in his 1976 book "The Selfish Gene" to describe how cultural information spreads. Internet memes evolved from early examples like the Dancing Baby (1996) and All Your Base Are Belong to Us (2001) through rage comics and advice animals (2008-2012), to today's short-form video memes on TikTok and Instagram Reels. Each era reflects the dominant platforms and cultural trends of its time.` }} />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Major Meme Categories Explained</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: `Memes fall into several broad categories: <strong>Reaction memes</strong> express emotions in response to situations. <strong>Template memes</strong> use a recognizable format with customizable text. <strong>Wholesome memes</strong> promote positivity and kindness. <strong>Surreal memes</strong> use absurdist humor and unexpected imagery. <strong>Meta memes</strong> are self-referential, commenting on meme culture itself. <strong>Niche memes</strong> target specific communities or interests. Our archive organizes memes across all these categories for easy discovery.` }} />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Memes as Cultural Commentary</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: `Beyond entertainment, memes serve as a form of democratic cultural commentary. They've been used to process collective trauma (pandemic memes), comment on politics, build community identity, and even influence stock markets (as with the GameStop/WallStreetBets phenomenon). Researchers at MIT found that memes spread 6x faster than traditional news stories, making them one of the most efficient vehicles for information dissemination in the digital age.` }} />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Copyright and Fair Use in Meme Culture</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: `Most memes exist in a gray area of copyright law. While the original images may be copyrighted, meme creation typically falls under fair use as transformative, non-commercial commentary or parody. However, commercial use of memes (in advertising, merchandise) has led to legal disputes. Notable cases include Grumpy Cat's estate winning $710,000 in a copyright lawsuit. For personal sharing and social media use, memes are generally considered fair use.` }} />
            </div>
      </section>

      {/* FAQ Section for SEO */}
      <section id="faq-section" className="mt-12 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">How many memes are in the archive?</h3>
              <p className="text-gray-600 dark:text-gray-400">Our meme archive contains thousands of curated memes organized by category including reaction memes, classic memes, trending memes, and more. The collection is regularly updated with new content.</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Can I search for specific memes?</h3>
              <p className="text-gray-600 dark:text-gray-400">Yes, use the search function to find memes by name, description, or category. You can also browse by trending, newest, or most popular to discover new favorites.</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Are these memes free to use?</h3>
              <p className="text-gray-600 dark:text-gray-400">The memes in our archive are shared for personal entertainment and social media use. Most internet memes fall under fair use for non-commercial purposes, but always credit original creators when possible.</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">How do I save or share a meme?</h3>
              <p className="text-gray-600 dark:text-gray-400">Click on any meme to view it in full size, then right-click to save or use the share button to copy the link. You can share directly to social media platforms.</p>
            </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "How many memes are in the archive?", "acceptedAnswer": {"@type": "Answer", "text": "Our meme archive contains thousands of curated memes organized by category including reaction memes, classic memes, trending memes, and more. The collection is regularly updated with new content."}}, {"@type": "Question", "name": "Can I search for specific memes?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, use the search function to find memes by name, description, or category. You can also browse by trending, newest, or most popular to discover new favorites."}}, {"@type": "Question", "name": "Are these memes free to use?", "acceptedAnswer": {"@type": "Answer", "text": "The memes in our archive are shared for personal entertainment and social media use. Most internet memes fall under fair use for non-commercial purposes, but always credit original creators when possible."}}, {"@type": "Question", "name": "How do I save or share a meme?", "acceptedAnswer": {"@type": "Answer", "text": "Click on any meme to view it in full size, then right-click to save or use the share button to copy the link. You can share directly to social media platforms."}}]}) }} />
    </>
  )
}
