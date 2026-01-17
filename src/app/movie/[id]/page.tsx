"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play, Star, Calendar, Clock } from "lucide-react";
import { tmdbClient, Movie, getPosterUrl, getBackdropUrl } from "@/lib/tmdb-client";
import { WatchlistButton } from "@/components/media/WatchlistButton";

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovie() {
      if (!params.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await tmdbClient.getMovieDetails(Number(params.id));
        setMovie(data);
      } catch (err) {
        console.error("Failed to fetch movie:", err);
        setError("Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovie();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || "Movie not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path ? getBackdropUrl(movie.backdrop_path) : null;
  const posterUrl = movie.poster_path ? getPosterUrl(movie.poster_path) : null;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

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
            alt={movie.title}
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
                    alt={movie.title}
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
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-zinc-300 mb-6">
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {releaseYear && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5" />
                    <span>{releaseYear}</span>
                  </div>
                )}
                {runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{runtime}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <p className="text-zinc-300 text-lg leading-relaxed mb-8 max-w-3xl">
                  {movie.overview}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/watch/movie/${movie.id}`}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition-colors"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Watch Now
                </Link>
                <WatchlistButton
                  mediaId={movie.id}
                  mediaType="movie"
                  title={movie.title}
                  posterPath={movie.poster_path}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
