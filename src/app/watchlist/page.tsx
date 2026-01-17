"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { MediaCard } from "@/components/media/MediaCard";
import { useUser } from "@/contexts/UserContext";

export default function WatchlistPage() {
  const router = useRouter();
  const { currentUser, isLoading: userLoading } = useUser();
  
  const watchlist = useQuery(
    api.watchlist.getWatchlist,
    currentUser ? { userId: currentUser._id } : "skip"
  );

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !currentUser) {
      router.push("/profiles");
    }
  }, [userLoading, currentUser, router]);

  const loading = userLoading || watchlist === undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="w-8 h-8 text-red-600" fill="currentColor" />
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        </div>

        {watchlist && watchlist.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-400 mb-2">Your watchlist is empty</h2>
            <p className="text-zinc-500 mb-6">
              Start adding movies and TV shows to your watchlist!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse Movies & TV Shows
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist?.map((item) => (
              <MediaCard
                key={`${item.mediaType}-${item.mediaId}`}
                mediaType={item.mediaType}
                id={item.mediaId}
                title={item.title}
                posterPath={item.posterPath || null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
