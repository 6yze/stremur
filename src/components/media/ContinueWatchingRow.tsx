"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@/contexts/UserContext";
import { getPosterUrl } from "@/lib/tmdb-client";

interface WatchHistoryItem {
  _id: string;
  mediaType: "movie" | "tv";
  mediaId: number;
  season?: number;
  episode?: number;
  progress: number;
  duration: number;
  title: string;
  posterPath?: string;
  updatedAt: number;
}

interface MediaCardProps {
  item: WatchHistoryItem;
}

function MediaCard({ item }: MediaCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    if (item.mediaType === "movie") {
      router.push(`/movie/${item.mediaId}`);
    } else {
      router.push(`/tv/${item.mediaId}`);
    }
  };

  const progressPercent = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;

  return (
    <div 
      className="w-[160px] md:w-[200px] rounded-lg overflow-hidden bg-zinc-900 group cursor-pointer transition-transform duration-200 hover:scale-105 flex-shrink-0"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={item.posterPath ? getPosterUrl(item.posterPath) : "/placeholder-poster.png"}
          alt={item.title}
          className="w-full aspect-[2/3] object-cover"
        />
        
        {/* TV show badge */}
        {item.mediaType === "tv" && item.season && item.episode && (
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            S{item.season} E{item.episode}
          </div>
        )}
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
          <div 
            className="h-full bg-red-600 transition-all duration-200"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-red-500 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          {Math.round(progressPercent)}% watched
        </p>
      </div>
    </div>
  );
}

export default function ContinueWatchingRow() {
  const { currentUser } = useUser();
  
  const items = useQuery(
    api.watchHistory.getWatchHistory,
    currentUser ? { userId: currentUser._id, limit: 20 } : "skip"
  );

  const loading = items === undefined;

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
              <div key={i} className="w-[160px] md:w-[200px] flex-shrink-0">
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
    );
  }

  // If no items after loading, return null
  if (!items || items.length === 0) {
    return null;
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
            <MediaCard key={item._id} item={item as WatchHistoryItem} />
          ))}
        </div>
      </div>
    </div>
  );
}
