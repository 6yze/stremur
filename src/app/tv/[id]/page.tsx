import Image from 'next/image';
import { notFound } from 'next/navigation';
import { tmdb, TVShow } from '@/lib/tmdb';
import { ArrowLeft, Play, Star, Calendar } from 'lucide-react';
import Link from 'next/link';
import SeasonSelector from './SeasonSelector';
import { WatchlistButton } from '@/components/media/WatchlistButton';

interface TVPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TVPage({ params }: TVPageProps) {
  const { id } = await params;
  let tvShow: TVShow | null = null;
  
  try {
    tvShow = await tmdb.getDetails<TVShow>('tv', parseInt(id));
  } catch (error) {
    console.error('Failed to fetch TV show details:', error);
  }

  if (!tvShow) {
    notFound();
  }

  const backdropUrl = tvShow.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}` 
    : null;
  
  const posterUrl = tvShow.poster_path 
    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` 
    : null;

  // Filter out special seasons (like season 0 - specials)
  const regularSeasons = tvShow.seasons?.filter(s => s.season_number > 0) || [];

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
      <div className="relative -mt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
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
                <div className="w-[200px] md:w-[300px] aspect-[2/3] bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
                  No Poster
                </div>
              )}
            </div>

            {/* TV Show Info */}
            <div className="flex-1 space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {tvShow.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{tvShow.vote_average.toFixed(1)}</span>
                    <span className="text-sm">/10</span>
                  </div>
                  
                  {tvShow.first_air_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(tvShow.first_air_date).toLocaleDateString('en-US', { 
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
                  {tvShow.overview || 'No overview available.'}
                </p>
              </div>

              {/* Seasons */}
              {regularSeasons.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">Seasons</h2>
                  <SeasonSelector seasons={regularSeasons} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-4">
                <Link 
                  href={`/watch/tv/${tvShow.id}/1/1`}
                  className="flex items-center gap-3 bg-[#E50914] hover:bg-[#b2070f] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Watch Now
                </Link>
                <WatchlistButton
                  mediaType="tv"
                  mediaId={tvShow.id}
                  title={tvShow.name}
                  posterPath={tvShow.poster_path}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
