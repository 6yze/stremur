'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

interface WatchHistoryItem {
  id: number
  media_type: 'movie' | 'tv'
  media_id: number
  season: number | null
  episode: number | null
  progress: number
  duration: number
  last_watched: string
  title: string
  poster_path: string | null
}

interface MediaCardProps {
  item: WatchHistoryItem
}

function MediaCard({ item }: MediaCardProps) {
  const router = useRouter()
  
  const handleClick = () => {
    if (item.media_type === 'movie') {
      router.push(`/movie/${item.media_id}`)
    } else {
      router.push(`/tv/${item.media_id}`)
    }
  }

  return (
    <div 
      className="w-[160px] md:w-[200px] rounded-lg overflow-hidden bg-zinc-900 group cursor-pointer transition-transform duration-200 hover:scale-105"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={item.title}
          className="w-full aspect-[2/3] object-cover"
        />
        
        {/* TV show badge */}
        {item.media_type === 'tv' && item.season && item.episode && (
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            S{item.season} E{item.episode}
          </div>
        )}
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
          <div 
            className="h-full bg-red-600 transition-all duration-200"
            style={{ width: `${Math.min(item.progress, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-red-500 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          {Math.round(item.progress)}% watched
        </p>
      </div>
    </div>
  )
}

export default function ContinueWatchingRow() {
  const [items, setItems] = useState<WatchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchWatchHistory() {
      try {
        const response = await fetch('/api/watch-history?limit=20')
        if (!response.ok) {
          throw new Error('Failed to fetch watch history')
        }
        const data = await response.json()
        setItems(data)
        setError(false)
      } catch (err) {
        console.error('Error fetching watch history:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchWatchHistory()
  }, [])

  // Loading state with skeleton cards
  if (loading) {
    return (
      <div className="mb-8">
        <div className="px-4 md:px-8 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white">Continue Watching</h2>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 px-4 md:px-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-[160px] md:w-[200px]">
                <div className="rounded-lg overflow-hidden bg-zinc-900 animate-pulse">
                  <div className="w-full aspect-[2/3] bg-zinc-800" />
                  <div className="p-3">
                    <div className="h-4 bg-zinc-800 rounded mb-2" />
                    <div className="h-3 bg-zinc-800 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // If no items after loading, return null
  if (items.length === 0) {
    return null
  }

  // Error state - optionally show something
  if (error) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="px-4 md:px-8 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-white">Continue Watching</h2>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-4 px-4 md:px-8">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
