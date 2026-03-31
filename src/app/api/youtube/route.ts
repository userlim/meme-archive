import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes (shorter for fresher results)

interface CacheEntry {
  data: any
  timestamp: number
}

const cache = new Map<string, CacheEntry>()

// Trending score: balance recency + views + engagement
function calcTrendingScore(video: any): number {
  const viewCount = parseInt(video.statistics?.viewCount || '0')
  const likeCount = parseInt(video.statistics?.likeCount || '0')
  const commentCount = parseInt(video.statistics?.commentCount || '0')
  const publishedAt = new Date(video.snippet.publishedAt).getTime()
  const ageHours = Math.max(1, (Date.now() - publishedAt) / 3600000)

  // Views per hour (velocity)
  const velocity = viewCount / ageHours

  // Engagement ratio (likes + comments vs views)
  const engagement = viewCount > 0 ? (likeCount + commentCount * 3) / viewCount : 0

  // Recency boost: exponential decay (newer = much higher score)
  const recencyBoost = Math.exp(-ageHours / (24 * 30)) // half-life ~30 days

  // Final score: velocity * engagement * recency
  return velocity * (1 + engagement * 10) * (1 + recencyBoost * 5)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const order = searchParams.get('order') || 'trending' // trending | viewCount | date | relevance
  const maxResults = Math.min(parseInt(searchParams.get('max') || '20'), 50)
  const period = searchParams.get('period') || '' // month | week | year | empty=all

  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API key not configured', items: [] }, { status: 200 })
  }

  const cacheKey = `${q}|${order}|${maxResults}|${period}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data)
  }

  try {
    // Build publishedAfter date filter for freshness
    let publishedAfter = ''
    if (period === 'week') {
      publishedAfter = new Date(Date.now() - 7 * 86400000).toISOString()
    } else if (period === 'month') {
      publishedAfter = new Date(Date.now() - 30 * 86400000).toISOString()
    } else if (period === 'year') {
      publishedAfter = new Date(Date.now() - 365 * 86400000).toISOString()
    }

    // For trending, we fetch by date first to get recent videos, then score them
    const ytOrder = order === 'trending' ? 'date' : order

    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('q', q)
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('order', ytOrder)
    // Fetch more for trending so we have pool to score from
    searchUrl.searchParams.set('maxResults', order === 'trending' ? '30' : maxResults.toString())
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY)
    searchUrl.searchParams.set('videoEmbeddable', 'true')
    if (publishedAfter) {
      searchUrl.searchParams.set('publishedAfter', publishedAfter)
    }

    const searchRes = await fetch(searchUrl.toString())
    if (!searchRes.ok) {
      const errorData = await searchRes.json()
      console.error('YouTube API error:', errorData)
      return NextResponse.json({ error: 'YouTube API error', items: [] }, { status: 200 })
    }

    const searchData = await searchRes.json()
    const videoIds = searchData.items?.map((item: any) => item.id.videoId).filter(Boolean) || []

    if (videoIds.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // Step 2: Get video statistics + engagement data
    const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
    statsUrl.searchParams.set('part', 'snippet,statistics,contentDetails')
    statsUrl.searchParams.set('id', videoIds.join(','))
    statsUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const statsRes = await fetch(statsUrl.toString())
    const statsData = await statsRes.json()

    let items = (statsData.items || []).map((video: any) => ({
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || '',
      viewCount: parseInt(video.statistics?.viewCount || '0'),
      likeCount: parseInt(video.statistics?.likeCount || '0'),
      commentCount: parseInt(video.statistics?.commentCount || '0'),
      duration: video.contentDetails?.duration || '',
      trendingScore: calcTrendingScore(video),
    }))

    // Sort based on order
    if (order === 'trending') {
      items.sort((a: any, b: any) => b.trendingScore - a.trendingScore)
      items = items.slice(0, maxResults)
    } else if (order === 'viewCount') {
      items.sort((a: any, b: any) => b.viewCount - a.viewCount)
    }
    // date order is already handled by YouTube API

    const result = { items }
    cache.set(cacheKey, { data: result, timestamp: Date.now() })

    return NextResponse.json(result)
  } catch (err) {
    console.error('YouTube fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch videos', items: [] }, { status: 200 })
  }
}
