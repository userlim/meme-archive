export interface HistoryItem {
  videoId: string
  title: string
  channelTitle: string
  thumbnail: string
  viewCount: number
  memeSlug: string
  memeName: string
  watchedAt: number // timestamp
}

const STORAGE_KEY = 'meme_archive_history'
const MAX_HISTORY = 200

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryItem[]
  } catch {
    return []
  }
}

export function addToHistory(item: Omit<HistoryItem, 'watchedAt'>): void {
  if (typeof window === 'undefined') return
  try {
    const history = getHistory()
    // Remove duplicate if exists
    const filtered = history.filter(h => h.videoId !== item.videoId)
    // Add to front
    filtered.unshift({ ...item, watchedAt: Date.now() })
    // Trim to max
    if (filtered.length > MAX_HISTORY) filtered.length = MAX_HISTORY
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {}
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

export function isWatched(videoId: string): boolean {
  return getHistory().some(h => h.videoId === videoId)
}
