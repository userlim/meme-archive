'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MEME_CATEGORIES } from '@/data/memes'
import { detectLocale, t, formatViewCount, LOCALE_NAMES, Locale } from '../../i18n'
import { addToHistory, isWatched } from '../../history'

interface Video {
  id: string
  title: string
  channelTitle: string
  publishedAt: string
  thumbnail: string
  viewCount: number
  likeCount: number
  commentCount: number
  duration: string
  trendingScore: number
}

type SortOrder = 'trending' | 'viewCount' | 'date' | 'relevance'

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
  const days = Math.floor(diff / 86400000)
  if (days < 1) return locale === 'ko' ? '오늘' : 'Today'
  if (days < 7) return locale === 'ko' ? `${days}일 전` : `${days}d ago`
  if (days < 30) return locale === 'ko' ? `${Math.floor(days/7)}주 전` : `${Math.floor(days/7)}w ago`
  if (days < 365) return locale === 'ko' ? `${Math.floor(days/30)}개월 전` : `${Math.floor(days/30)}mo ago`
  return locale === 'ko' ? `${Math.floor(days/365)}년 전` : `${Math.floor(days/365)}y ago`
}

function VideoSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="w-40 sm:w-48 aspect-video skeleton shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
  )
}

export default function MemeDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const meme = MEME_CATEGORIES.find(m => m.slug === slug)

  const [locale, setLocale] = useState<Locale>('en')
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortOrder>('trending')
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => { setLocale(detectLocale()) }, [])

  const fetchVideos = useCallback(async (order: SortOrder) => {
    if (!meme) return
    setLoading(true)
    try {
      const keyword = meme.keywords[0]
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(keyword)}&order=${order}&max=20`)
      const data = await res.json()
      setVideos(data.items || [])
    } catch {
      setVideos([])
    }
    setLoading(false)
  }, [meme])

  useEffect(() => { fetchVideos(sort) }, [sort, fetchVideos])

  // Save to history when playing
  const handlePlay = (video: Video) => {
    setPlayingId(video.id)
    if (meme) {
      addToHistory({
        videoId: video.id,
        title: video.title,
        channelTitle: video.channelTitle,
        thumbnail: video.thumbnail,
        viewCount: video.viewCount,
        memeSlug: meme.slug,
        memeName: locale === 'ko' ? meme.nameKo : meme.name,
      })
    }
  }

  if (!meme) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">😵</p>
        <p className="text-[#8B95A1]">Meme not found</p>
        <Link href="/" className="mt-4 inline-block text-red-400 hover:text-red-300">{t(locale, 'backToHome')}</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Language */}
      <div className="flex justify-end mb-4">
        <select value={locale} onChange={e => setLocale(e.target.value as Locale)}
          className="text-sm bg-white/[0.03]/10 border border-white/20 rounded-lg px-3 py-1.5 text-[#8B95A1] outline-none">
          {(Object.keys(LOCALE_NAMES) as Locale[]).map(l => (
            <option key={l} value={l} className="bg-[#1a1a1a]">{LOCALE_NAMES[l]}</option>
          ))}
        </select>
      </div>

      {/* Back + Title */}
      <Link href="/" className="inline-flex items-center gap-1 text-[#8B95A1] hover:text-[#191F28] text-sm mb-6 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        {t(locale, 'backToHome')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meme.color} flex items-center justify-center text-3xl shrink-0`}>
          {meme.emoji}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#191F28]">
            {locale === 'ko' ? meme.nameKo : meme.name}
          </h1>
          <p className="text-[#8B95A1] text-sm mt-1">
            {locale === 'ko' ? meme.descriptionKo : meme.description}
          </p>
        </div>
      </div>

      {/* Sort Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['trending', 'viewCount', 'date', 'relevance'] as SortOrder[]).map(s => (
          <button key={s} onClick={() => setSort(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              sort === s ? 'bg-white/[0.03] text-black' : 'bg-white/[0.03]/10 text-[#8B95A1] hover:bg-white/[0.03]/20'
            }`}>
            {s === 'trending' ? (locale === 'ko' ? '🔥 트렌딩' : '🔥 Trending') :
             t(locale, s === 'viewCount' ? 'sortByViews' : s === 'date' ? 'sortByDate' : 'sortByRelevance')}
          </button>
        ))}
      </div>

      {/* Watch All in Swipe Mode */}
      {videos.length > 0 && (
        <Link href={`/watch?slug=${slug}&sort=${sort}`}
          className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-[#191F28] rounded-xl font-semibold text-sm transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          {t(locale, 'watchAll')}
        </Link>
      )}

      {/* Video Player */}
      {playingId && (
        <div className="mb-6">
          <div className="yt-embed-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${playingId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <button onClick={() => setPlayingId(null)}
            className="mt-2 text-sm text-[#8B95A1] hover:text-[#191F28] transition">
            {locale === 'ko' ? '닫기' : 'Close player'}
          </button>
        </div>
      )}

      {/* Video List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <VideoSkeleton key={i} />)
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-[#4E5968]">
            <p className="text-4xl mb-4">📭</p>
            <p>{t(locale, 'noVideos')}</p>
            <p className="text-xs mt-2 text-[#8B95A1]">{t(locale, 'apiKeyMissing')}</p>
          </div>
        ) : (
          videos.map((video, index) => {
            const watched = isWatched(video.id)
            return (
              <button key={video.id} onClick={() => handlePlay(video)}
                className={`w-full flex gap-3 sm:gap-4 p-2 rounded-xl text-left transition hover:bg-white/[0.03]/5 ${
                  playingId === video.id ? 'bg-white/[0.03]/10 ring-1 ring-red-500/30' : ''
                }`}>
                <div className="relative w-40 sm:w-48 shrink-0">
                  <img src={video.thumbnail} alt={video.title}
                    className={`w-full aspect-video object-cover rounded-lg ${watched ? 'opacity-60' : ''}`} loading="lazy" />
                  {video.duration && (
                    <span className="absolute bottom-1 right-1 bg-white/80 text-[#191F28] text-xs px-1.5 py-0.5 rounded">
                      {parseDuration(video.duration)}
                    </span>
                  )}
                  <span className="absolute top-1 left-1 bg-white/60 text-[#191F28] text-xs px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </span>
                  {watched && (
                    <span className="absolute top-1 right-1 bg-red-500/80 text-[#191F28] text-[10px] px-1.5 py-0.5 rounded">
                      {locale === 'ko' ? '시청함' : 'Watched'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <h3 className={`text-sm sm:text-base font-medium line-clamp-2 ${watched ? 'text-[#8B95A1]' : 'text-[#191F28]'}`}>{video.title}</h3>
                  <p className="text-[#8B95A1] text-xs mt-1">{video.channelTitle}</p>
                  <div className="flex items-center gap-2 text-[#4E5968] text-xs mt-1">
                    <span>{formatViewCount(video.viewCount, locale)} {t(locale, 'viewCount')}</span>
                    <span>·</span>
                    <span>{timeAgo(video.publishedAt, locale)}</span>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
