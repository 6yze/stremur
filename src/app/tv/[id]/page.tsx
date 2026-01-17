"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play, Star, Calendar } from "lucide-react";
import { tmdbClient, TVShow, Season, getPosterUrl, getBackdropUrl } from "@/lib/tmdb-client";
import { WatchlistButton } from "@/components/media/WatchlistButton";
import SeasonSelector from "./SeasonSelector";

export default function TVPage() {
  const params = useParams();
  const router = useRouter();
  const [tvShow, setTvShow] = useState<TVShow | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTVShow() {
      if (!params.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await tmdbClient.getTVShowDetails(Number(params.id));
        setTvShow(data);
        
        // Filter out special seasons (like season 0 - specials)
        const regularSeasons = data.seasons?.filter(s => s.season_number > 0) || [];
        
        // Fetch episode data for each season
        const seasonsWithEpisodes = await Promise.all(
          regularSeasons.map(async (season) => {
            try {
              const seasonData = await tmdbClient.getTVSeasonDetails(Number(params.id), season.season_number);
              return seasonData;
            } catch {
              return season;
            }
          })
        );
        
        setSeasons(seasonsWithEpisodes);
      } catch (err) {
        console.error("Failed to fetch TV show:", err);
        setError("Failed to load TV show details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTVShow();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || "TV show not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const backdropUrl = tvShow.backdrop_path ? getBackdropUrl(tvShow.backdrop_path) : null;
  const posterUrl = tvShow.poster_path ? getPosterUrl(tvShow.poster_path) : null;
  const firstAirYear = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : null;

  return (
    <div className="min-h-screen bg-black">
      {/* Back Navigation */}
      <div className="relative z-10 p-4 md:p-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
      </div>

      {/* Hero Section with Backdrop */}
      <div className="relative h-[50vh] md:h-[70vh]">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={tvShow.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
      </div>

      {/* Content Section */}
      <div className="relative -mt-32 md:-mt-48 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 hidden md:block">
              {posterUrl ? (
                <div className="relative w-[200px] md:w-[300px] aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={posterUrl}
                    alt={tvShow.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 200px, 300px"
                  />
                </div>
              ) : (
                <div className="w-[200px] md:w-[300px] aspect-[2/3] rounded-lg bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-600">No poster</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 pt-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{tvShow.name}</h1>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-zinc-300 mb-6">
                {tvShow.vote_average > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>{tvShow.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {firstAirYear && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5" />
                    <span>{firstAirYear}</span>
                  </div>
                )}
                {tvShow.number_of_seasons && (
                  <span>{tvShow.number_of_seasons} Season{tvShow.number_of_seasons > 1 ? "s" : ""}</span>
                )}
              </div>

              {/* Overview */}
              {tvShow.overview && (
                <p className="text-zinc-300 text-lg leading-relaxed mb-8 max-w-3xl">
                  {tvShow.overview}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href={`/watch/tv/${tvShow.id}/1/1`}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition-colors"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Watch Now
                </Link>
                <WatchlistButton
                  mediaId={tvShow.id}
                  mediaType="tv"
                  title={tvShow.name}
                  posterPath={tvShow.poster_path}
                />
              </div>

              {/* Season Selector */}
              {seasons.length > 0 && (
                <SeasonSelector seasons={seasons} tvId={Number(params.id)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
