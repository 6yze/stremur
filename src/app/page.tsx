"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tmdbClient, MediaItem } from "@/lib/tmdb-client";
import { HeroBanner } from "@/components/media/HeroBanner";
import { MediaRow } from "@/components/media/MediaRow";
import ContinueWatchingRow from "@/components/media/ContinueWatchingRow";
import { useUser } from "@/contexts/UserContext";

export default function Home() {
  const router = useRouter();
  const { currentUser, users, isLoading: userLoading } = useUser();
  
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingTV, setTrendingTV] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTV, setPopularTV] = useState<MediaItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect logic for user/profile selection
  useEffect(() => {
    if (userLoading) return;
    
    // If no users exist, redirect to setup
    if (users && users.length === 0) {
      router.push("/setup");
      return;
    }
    
    // If users exist but none selected, redirect to profile selection
    if (users && users.length > 0 && !currentUser) {
      router.push("/profiles");
      return;
    }
  }, [userLoading, users, currentUser, router]);

  // Fetch media data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [
          trendingMoviesRes,
          trendingTVRes,
          popularMoviesRes,
          popularTVRes,
          topRatedMoviesRes,
          topRatedTVRes
        ] = await Promise.all([
          tmdbClient.getTrending("movie"),
          tmdbClient.getTrending("tv"),
          tmdbClient.getPopularMovies(),
          tmdbClient.getPopularTVShows(),
          tmdbClient.getTopRatedMovies(),
          tmdbClient.getTopRatedTVShows(),
        ]);

        setTrendingMovies(trendingMoviesRes.results);
        setTrendingTV(trendingTVRes.results);
        setPopularMovies(popularMoviesRes.results);
        setPopularTV(popularTVRes.results);
        setTopRatedMovies(topRatedMoviesRes.results);
        setTopRatedTV(topRatedTVRes.results);
      } catch (error) {
        console.error("Failed to fetch media:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch if we have a current user
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Show loading while checking user state
  if (userLoading || (!currentUser && users && users.length > 0)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Show loading while fetching media
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const heroItem = trendingMovies[0];

  return (
    <main className="min-h-screen bg-black pb-20">
      {heroItem && <HeroBanner item={heroItem} />}
      <ContinueWatchingRow />
      
      <div className="space-y-8 mt-4 md:mt-8">
        <MediaRow title="Trending Movies" items={trendingMovies} />
        <MediaRow title="Trending TV Shows" items={trendingTV} />
        <MediaRow title="Popular Movies" items={popularMovies} />
        <MediaRow title="Popular TV Shows" items={popularTV} />
        <MediaRow title="Top Rated Movies" items={topRatedMovies} />
        <MediaRow title="Top Rated TV Shows" items={topRatedTV} />
      </div>
    </main>
  );
}
