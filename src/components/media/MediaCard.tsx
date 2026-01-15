import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: 'movie' | 'tv';
  voteAverage?: number;
}

export function MediaCard({ id, title, posterPath, mediaType, voteAverage }: MediaCardProps) {
  return (
    <Link 
      href={`/${mediaType}/${id}`}
      className="group relative flex-none w-[160px] md:w-[200px] aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      {posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 160px, 200px"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 text-sm p-4 text-center">
          No Poster
        </div>
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-medium text-sm line-clamp-2">{title}</h3>
        {voteAverage !== undefined && (
          <div className="flex items-center gap-1 text-yellow-500 mt-1">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-semibold">{voteAverage.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
