import Image from 'next/image';
import { notFound } from 'next/navigation';
import { tmdb, Movie } from '@/lib/tmdb';
import { ArrowLeft, Play, Star, Calendar } from 'lucide-react';
import Link from 'next/link';
import { WatchlistButton } from '@/components/media/WatchlistButton';

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  let movie: Movie | null = null;
  
  try {
    movie = await tmdb.getDetails<Movie>('movie', parseInt(id));
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
  }

  if (!movie) {
    notFound();
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` 
    : null;
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : null;

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
      <div className="relative -mt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
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
                <div className="w-[200px] md:w-[300px] aspect-[2/3] bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
                  No Poster
                </div>
              )}
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-sm">/10</span>
                  </div>
                  
                  {movie.release_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(movie.release_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
                <p className="text-zinc-300 leading-relaxed">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-4">
                <Link 
                  href={`/watch/movie/${movie.id}`}
                  className="flex items-center gap-3 bg-[#E50914] hover:bg-[#b2070f] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Watch Now
                </Link>
                <WatchlistButton
                  mediaType="movie"
                  mediaId={movie.id}
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
