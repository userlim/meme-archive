'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MEME_CATEGORIES } from '@/data/memes'
import { detectLocale, t, formatViewCount, Locale } from '../i18n'
import { addToHistory } from '../history'

interface Video {
  id: string
  title: string
  channelTitle: string
  publishedAt: string
  thumbnail: string
  viewCount: number
}

function SwipePlayer() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = searchParams.get('slug') || ''
  const sort = searchParams.get('sort') || 'trending'
  const meme = MEME_CATEGORIES.find(m => m.slug === slug)

  const [locale, setLocale] = useState<Locale>('en')
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  useEffect(() => { setLocale(detectLocale()) }, [])

  useEffect(() => {
    if (!meme) return
    const fetchVideos = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/youtube?q=${encodeURIComponent(meme.keywords[0])}&order=${sort}&max=20`)
        const data = await res.json()
        setVideos(data.items || [])
      } catch { setVideos([]) }
      setLoading(false)
    }
    fetchVideos()
  }, [meme, sort])

  // Save history when video changes
  useEffect(() => {
    if (videos.length === 0 || !meme) return
    const video = videos[currentIndex]
    if (video) {
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
  }, [currentIndex, videos, meme, locale])

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < videos.length) {
      setCurrentIndex(index)
    }
  }, [videos.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY
  }
  const handleTouchEnd = () => {
    const diff = touchStartY.current - touchEndY.current
    if (Math.abs(diff) > 60) {
      if (diff > 0) goTo(currentIndex + 1)
      else goTo(currentIndex - 1)
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') goTo(currentIndex + 1)
      if (e.key === 'ArrowUp' || e.key === 'k') goTo(currentIndex - 1)
      if (e.key === 'Escape') router.back()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentIndex, goTo, router])

  const wheelTimeout = useRef<NodeJS.Timeout>()
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelTimeout.current) return
    wheelTimeout.current = setTimeout(() => { wheelTimeout.current = undefined }, 600)
    if (e.deltaY > 0) goTo(currentIndex + 1)
    else if (e.deltaY < 0) goTo(currentIndex - 1)
  }

  if (!meme) {
    return (
      <div className="h-dvh flex items-center justify-center text-gray-400">
        <p>Meme not found</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t(locale, 'loading')}</p>
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="h-dvh flex items-center justify-center bg-black text-gray-400">
        <div className="text-center">
          <p className="text-4xl mb-4">📭</p>
          <p>{t(locale, 'noVideos')}</p>
          <button onClick={() => router.back()} className="mt-4 text-red-400 hover:text-red-300">
            {t(locale, 'backToHome')}
          </button>
        </div>
      </div>
    )
  }

  const video = videos[currentIndex]

  return (
    <div ref={containerRef} className="h-dvh bg-black flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => router.back()} className="text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <div className="text-white text-sm font-medium">
          {locale === 'ko' ? meme.nameKo : meme.name}
        </div>
        <div className="text-gray-400 text-sm">
          {currentIndex + 1}/{videos.length}
        </div>
      </div>

      {/* Video */}
      <div className="flex-1 flex items-center justify-center relative">
        <iframe
          key={video.id}
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          className="w-full h-full max-h-[70vh] sm:max-w-3xl sm:rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-12 bg-gradient-to-t from-black/90 to-transparent">
        <h3 className="text-white font-semibold text-base sm:text-lg line-clamp-2 mb-1">{video.title}</h3>
        <p className="text-gray-400 text-sm">{video.channelTitle}</p>
        <p className="text-gray-500 text-xs mt-1">
          {formatViewCount(video.viewCount, locale)} {t(locale, 'viewCount')}
        </p>
      </div>

      {/* Side nav */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        <button onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white disabled:opacity-30 transition hover:bg-white/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
          </svg>
        </button>
        <button onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === videos.length - 1}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white disabled:opacity-30 transition hover:bg-white/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>

      {/* Swipe hint */}
      {currentIndex === 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-gray-500 text-xs animate-bounce">
          {t(locale, 'swipeHint')}
        </div>
      )}
    </div>
  )
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="h-dvh flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SwipePlayer />
    </Suspense>
  )
}
