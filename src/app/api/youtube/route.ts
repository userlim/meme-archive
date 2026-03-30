import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

interface CacheEntry {
  data: any
  timestamp: number
}

const cache = new Map<string, CacheEntry>()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const order = searchParams.get('order') || 'viewCount' // viewCount | date | relevance
  const maxResults = Math.min(parseInt(searchParams.get('max') || '20'), 50)

  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API key not configured', items: [] }, { status: 200 })
  }

  const cacheKey = `${q}|${order}|${maxResults}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data)
  }

  try {
    // Step 1: Search for videos
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('q', q)
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('order', order)
    searchUrl.searchParams.set('maxResults', maxResults.toString())
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY)
    searchUrl.searchParams.set('videoEmbeddable', 'true')

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

    // Step 2: Get video statistics
    const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
    statsUrl.searchParams.set('part', 'snippet,statistics,contentDetails')
    statsUrl.searchParams.set('id', videoIds.join(','))
    statsUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const statsRes = await fetch(statsUrl.toString())
    const statsData = await statsRes.json()

    const items = (statsData.items || []).map((video: any) => ({
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || '',
      viewCount: parseInt(video.statistics?.viewCount || '0'),
      likeCount: parseInt(video.statistics?.likeCount || '0'),
      duration: video.contentDetails?.duration || '',
    }))

    // Sort by viewCount if requested (API already handles this but re-sort with stats)
    if (order === 'viewCount') {
      items.sort((a: any, b: any) => b.viewCount - a.viewCount)
    }

    const result = { items }
    cache.set(cacheKey, { data: result, timestamp: Date.now() })

    return NextResponse.json(result)
  } catch (err) {
    console.error('YouTube fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch videos', items: [] }, { status: 200 })
  }
}
