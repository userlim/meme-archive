'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getHistory, clearHistory, HistoryItem } from '../history'
import { detectLocale, t, formatViewCount, LOCALE_NAMES, Locale } from '../i18n'

function timeAgoShort(ts: number, locale: Locale): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return locale === 'ko' ? '방금' : 'Just now'
  if (mins < 60) return locale === 'ko' ? `${mins}분 전` : `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return locale === 'ko' ? `${hours}시간 전` : `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return locale === 'ko' ? `${days}일 전` : `${days}d ago`
  return locale === 'ko' ? `${Math.floor(days / 7)}주 전` : `${Math.floor(days / 7)}w ago`
}

export default function HistoryPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setLocale(detectLocale())
    setHistory(getHistory())
  }, [])

  const filtered = useMemo(() => {
    if (!filter) return history
    const q = filter.toLowerCase()
    return history.filter(h =>
      h.title.toLowerCase().includes(q) ||
      h.memeName.toLowerCase().includes(q) ||
      h.channelTitle.toLowerCase().includes(q)
    )
  }, [history, filter])

  // Group by date
  const grouped = useMemo(() => {
    const groups: { label: string; items: HistoryItem[] }[] = []
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const yesterday = today - 86400000
    const thisWeek = today - 7 * 86400000

    const todayItems: HistoryItem[] = []
    const yesterdayItems: HistoryItem[] = []
    const thisWeekItems: HistoryItem[] = []
    const olderItems: HistoryItem[] = []

    for (const item of filtered) {
      if (item.watchedAt >= today) todayItems.push(item)
      else if (item.watchedAt >= yesterday) yesterdayItems.push(item)
      else if (item.watchedAt >= thisWeek) thisWeekItems.push(item)
      else olderItems.push(item)
    }

    if (todayItems.length) groups.push({ label: locale === 'ko' ? '오늘' : 'Today', items: todayItems })
    if (yesterdayItems.length) groups.push({ label: locale === 'ko' ? '어제' : 'Yesterday', items: yesterdayItems })
    if (thisWeekItems.length) groups.push({ label: locale === 'ko' ? '이번 주' : 'This Week', items: thisWeekItems })
    if (olderItems.length) groups.push({ label: locale === 'ko' ? '이전' : 'Older', items: olderItems })

    return groups
  }, [filtered, locale])

  const handleClear = () => {
    if (confirm(locale === 'ko' ? '시청 기록을 모두 삭제하시겠습니까?' : 'Clear all watch history?')) {
      clearHistory()
      setHistory([])
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {locale === 'ko' ? '시청 기록' : 'Watch History'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <select value={locale} onChange={e => setLocale(e.target.value as Locale)}
            className="text-sm bg-white/[0.03]/10 border border-white/20 rounded-lg px-3 py-1.5 text-gray-300 outline-none">
            {(Object.keys(LOCALE_NAMES) as Locale[]).map(l => (
              <option key={l} value={l} className="bg-[#1a1a1a]">{LOCALE_NAMES[l]}</option>
            ))}
          </select>
          {history.length > 0 && (
            <button onClick={handleClear}
              className="text-sm text-red-400 hover:text-red-300 transition px-3 py-1.5 border border-red-500/30 rounded-lg">
              {locale === 'ko' ? '기록 삭제' : 'Clear All'}
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      {history.length > 0 && (
        <div className="relative mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
            placeholder={locale === 'ko' ? '시청 기록 검색...' : 'Search history...'}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03]/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:border-white/20 transition" />
        </div>
      )}

      {/* Empty */}
      {history.length === 0 && (
        <div className="text-center py-24">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-gray-500 text-lg">{locale === 'ko' ? '아직 시청 기록이 없습니다' : 'No watch history yet'}</p>
          <p className="text-gray-400 text-sm mt-2">{locale === 'ko' ? '밈 영상을 시청하면 여기에 기록됩니다' : 'Videos you watch will appear here'}</p>
          <Link href="/" className="mt-6 inline-block px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition">
            {locale === 'ko' ? '밈 둘러보기' : 'Browse Memes'}
          </Link>
        </div>
      )}

      {/* Grouped list */}
      {grouped.map(group => (
        <div key={group.label} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{group.label}</h2>
          <div className="space-y-2">
            {group.items.map(item => (
              <Link key={`${item.videoId}-${item.watchedAt}`} href={`/meme/${item.memeSlug}`}
                className="flex gap-3 p-2 rounded-xl hover:bg-white/[0.03]/5 transition group">
                <div className="relative w-36 sm:w-44 shrink-0">
                  <img src={item.thumbnail} alt={item.title}
                    className="w-full aspect-video object-cover rounded-lg" loading="lazy" />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="text-white text-sm font-medium line-clamp-2">{item.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{item.channelTitle}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                    <span>{formatViewCount(item.viewCount, locale)} {t(locale, 'viewCount')}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{timeAgoShort(item.watchedAt, locale)}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-red-400/70">{item.memeName}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
