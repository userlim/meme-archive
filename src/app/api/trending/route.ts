import { NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes - fresh enough for memes

interface TrendingMeme {
  keyword: string
  title: string
  emoji: string
  topVideoId: string
  topVideoTitle: string
  topVideoThumb: string
  topVideoViews: number
  videoCount: number
  avgViews: number
  maxViews: number
  freshness: number // avg days since publish
}

interface CacheEntry {
  data: any
  timestamp: number
}

let trendingCache: CacheEntry | null = null

// Seed queries: broad meme discovery terms
// These are NOT fixed memes - they're search strategies to DISCOVER what's hot right now
const DISCOVERY_QUERIES = [
  // Global meme discovery
  { q: 'meme compilation today', emoji: '🔥', region: 'global' },
  { q: 'viral meme this week', emoji: '📈', region: 'global' },
  { q: 'trending meme tiktok', emoji: '🎵', region: 'global' },
  { q: 'new meme 2026', emoji: '✨', region: 'global' },
  { q: 'brainrot meme new', emoji: '🧠', region: 'global' },
  { q: 'funny meme trending now', emoji: '😂', region: 'global' },
  // Korean meme discovery
  { q: '밈 모음 오늘', emoji: '🇰🇷', region: 'kr' },
  { q: '요즘 유행하는 밈', emoji: '🔥', region: 'kr' },
  { q: '최신 밈 챌린지', emoji: '💃', region: 'kr' },
  { q: '밈 틱톡 유행', emoji: '📱', region: 'kr' },
  // Japanese meme discovery
  { q: 'ミーム 流行 今週', emoji: '🇯🇵', region: 'jp' },
]

async function searchYouTube(query: string, maxResults: number = 10): Promise<any[]> {
  if (!YOUTUBE_API_KEY) return []

  try {
    // Search for recent videos only (last 7 days)
    const publishedAfter = new Date(Date.now() - 7 * 86400000).toISOString()

    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('q', query)
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('order', 'viewCount')
    searchUrl.searchParams.set('maxResults', maxResults.toString())
    searchUrl.searchParams.set('publishedAfter', publishedAfter)
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY)
    searchUrl.searchParams.set('videoEmbeddable', 'true')

    const searchRes = await fetch(searchUrl.toString())
    if (!searchRes.ok) return []

    const searchData = await searchRes.json()
    const videoIds = searchData.items?.map((item: any) => item.id.videoId).filter(Boolean) || []
    if (videoIds.length === 0) return []

    // Get stats
    const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
    statsUrl.searchParams.set('part', 'snippet,statistics,contentDetails')
    statsUrl.searchParams.set('id', videoIds.join(','))
    statsUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const statsRes = await fetch(statsUrl.toString())
    if (!statsRes.ok) return []

    const statsData = await statsRes.json()
    return statsData.items || []
  } catch {
    return []
  }
}

// Extract common meme keywords from video titles
function extractMemeKeywords(videos: any[]): Map<string, any[]> {
  const keywordMap = new Map<string, any[]>()

  for (const video of videos) {
    const title = (video.snippet?.title || '').toLowerCase()
    // Extract potential meme names (2-4 word phrases that repeat across videos)
    const words = title.split(/[\s\-_|:,.()\[\]]+/).filter((w: string) => w.length > 2)

    // Check for common meme patterns
    for (let len = 2; len <= 4; len++) {
      for (let i = 0; i <= words.length - len; i++) {
        const phrase = words.slice(i, i + len).join(' ')
        // Skip generic words
        if (['meme compilation', 'funny video', 'viral video', 'try not', 'to laugh',
             'best of', 'new meme', '밈 모음', 'trending now'].includes(phrase)) continue

        if (!keywordMap.has(phrase)) keywordMap.set(phrase, [])
        keywordMap.get(phrase)!.push(video)
      }
    }
  }

  return keywordMap
}

export async function GET() {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API key not configured', memes: [] }, { status: 200 })
  }

  // Return cache if fresh
  if (trendingCache && Date.now() - trendingCache.timestamp < CACHE_DURATION) {
    return NextResponse.json(trendingCache.data)
  }

  try {
    // Step 1: Fetch videos from all discovery queries (limit to 5 queries to save API quota)
    const selectedQueries = DISCOVERY_QUERIES
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)

    const allResults = await Promise.all(
      selectedQueries.map(dq => searchYouTube(dq.q, 8))
    )

    const allVideos = allResults.flat()

    if (allVideos.length === 0) {
      return NextResponse.json({ memes: [] })
    }

    // Step 2: Score each video for "meme potential"
    const scoredVideos = allVideos.map(video => {
      const viewCount = parseInt(video.statistics?.viewCount || '0')
      const likeCount = parseInt(video.statistics?.likeCount || '0')
      const commentCount = parseInt(video.statistics?.commentCount || '0')
      const publishedAt = new Date(video.snippet.publishedAt).getTime()
      const ageHours = Math.max(1, (Date.now() - publishedAt) / 3600000)

      // Velocity: views per hour
      const velocity = viewCount / ageHours

      // Engagement
      const engagement = viewCount > 0 ? (likeCount + commentCount * 3) / viewCount : 0

      // Freshness bonus (exponential - very recent gets huge boost)
      const freshnessBoost = Math.exp(-ageHours / (24 * 3)) // 3-day half-life

      const score = velocity * (1 + engagement * 10) * (1 + freshnessBoost * 10)

      return {
        id: video.id,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || '',
        viewCount,
        likeCount,
        commentCount,
        duration: video.contentDetails?.duration || '',
        score,
        ageHours,
      }
    })

    // Sort by score and deduplicate
    scoredVideos.sort((a, b) => b.score - a.score)

    const seen = new Set<string>()
    const uniqueVideos = scoredVideos.filter(v => {
      if (seen.has(v.id)) return false
      seen.add(v.id)
      return true
    })

    // Take top 30
    const topVideos = uniqueVideos.slice(0, 30)

    const result = {
      memes: topVideos,
      updatedAt: Date.now(),
      queryCount: selectedQueries.length,
    }

    trendingCache = { data: result, timestamp: Date.now() }
    return NextResponse.json(result)
  } catch (err) {
    console.error('Trending fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch trending', memes: [] }, { status: 200 })
  }
}
