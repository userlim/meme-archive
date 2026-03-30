'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MEME_CATEGORIES } from '@/data/memes'
import { detectLocale, t, LOCALE_NAMES, Locale } from './i18n'

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { setLocale(detectLocale()) }, [])

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return MEME_CATEGORIES
    const q = searchQuery.toLowerCase()
    return MEME_CATEGORIES.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.nameKo.includes(q) ||
      m.keywords.some(k => k.toLowerCase().includes(q))
    )
  }, [searchQuery])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Meme Archive',
    url: 'https://meme-archive.vercel.app',
    description: 'Browse and watch the hottest viral meme videos from YouTube.',
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <select value={locale} onChange={e => setLocale(e.target.value as Locale)}
              className="text-sm bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-gray-300 outline-none">
              {(Object.keys(LOCALE_NAMES) as Locale[]).map(l => (
                <option key={l} value={l} className="bg-[#1a1a1a]">{LOCALE_NAMES[l]}</option>
              ))}
            </select>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight">
            {t(locale, 'heroTitle')}
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            {t(locale, 'heroDesc')}
          </p>

          <div className="max-w-lg mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t(locale, 'search')}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Meme Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">{t(locale, 'allMemes')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(meme => (
            <Link key={meme.slug} href={`/meme/${meme.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5 video-card">
              <div className={`aspect-video bg-gradient-to-br ${meme.color} flex items-center justify-center`}>
                <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">{meme.emoji}</span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-white text-sm sm:text-base truncate">
                  {locale === 'ko' ? meme.nameKo : meme.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {locale === 'ko' ? meme.descriptionKo : meme.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-4">🤷</p>
            <p>{t(locale, 'noVideos')}</p>
          </div>
        )}
      </section>
    </>
  )
}
