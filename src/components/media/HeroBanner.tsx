import Image from 'next/image';
import { MediaItem } from '@/lib/tmdb';
import { Play, Info } from 'lucide-react';
import Link from 'next/link';

interface HeroBannerProps {
  item: MediaItem;
}

export function HeroBanner({ item }: HeroBannerProps) {
  const title = item.title || item.name || 'Untitled';
  const backdropPath = item.backdrop_path;

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh]">
      {/* Background Image */}
      {backdropPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/original${backdropPath}`}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="w-full h-full bg-zinc-900" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 space-y-4 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md">
          {title}
        </h1>

        <div className="flex items-center gap-2">
           <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-bold">
            {Math.round(item.vote_average * 10)}% Match
           </span>
           <span className="text-zinc-300 text-sm">
             {item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date || '').getFullYear() : ''}
           </span>
        </div>

        <p className="text-zinc-200 text-sm md:text-base line-clamp-3 md:line-clamp-4 max-w-xl drop-shadow-sm">
          {item.overview}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Link
            href={`/${item.media_type}/${item.id}`}
            className="flex items-center gap-2 bg-[#E50914] hover:bg-[#b2070f] text-white px-6 py-2 rounded-md font-semibold transition-colors"
          >
            <Play className="w-5 h-5 fill-current" />
            Play
          </Link>
          <Link
             href={`/${item.media_type}/${item.id}`}
             className="flex items-center gap-2 bg-zinc-500/70 hover:bg-zinc-500/50 text-white px-6 py-2 rounded-md font-semibold transition-colors backdrop-blur-sm"
          >
            <Info className="w-5 h-5" />
            More Info
          </Link>
        </div>
      </div>
    </div>
  );
}
