"use client";

import { Plus, Check } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@/contexts/UserContext";

interface WatchlistButtonProps {
  mediaType: "movie" | "tv";
  mediaId: number;
  title: string;
  posterPath: string | null;
}

export function WatchlistButton({ mediaType, mediaId, title, posterPath }: WatchlistButtonProps) {
  const { currentUser } = useUser();
  
  const inWatchlist = useQuery(
    api.watchlist.isInWatchlist,
    currentUser ? { userId: currentUser._id, mediaId, mediaType } : "skip"
  );
  
  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const removeFromWatchlist = useMutation(api.watchlist.removeFromWatchlist);

  const loading = inWatchlist === undefined;

  const toggle = async () => {
    if (!currentUser) return;
    
    try {
      if (inWatchlist) {
        await removeFromWatchlist({
          userId: currentUser._id,
          mediaId,
          mediaType,
        });
      } else {
        await addToWatchlist({
          userId: currentUser._id,
          mediaId,
          mediaType,
          title,
          posterPath: posterPath || undefined,
        });
      }
    } catch (error) {
      console.error("Failed to toggle watchlist:", error);
    }
  };

  // Don't show button if not logged in
  if (!currentUser) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
        inWatchlist 
          ? "bg-green-600 hover:bg-green-700 text-white" 
          : "bg-zinc-700 hover:bg-zinc-600 text-white"
      } disabled:opacity-50`}
    >
      {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      {inWatchlist ? "In Watchlist" : "Watchlist"}
    </button>
  );
}
