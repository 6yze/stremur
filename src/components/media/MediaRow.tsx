import { MediaItem } from '@/lib/tmdb';
import { MediaCard } from './MediaCard';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
}

export function MediaRow({ title, items }: MediaRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2 py-4">
      <h2 className="text-xl font-semibold text-white px-4 md:px-8">{title}</h2>
      
      <div className="relative">
        <div className="flex overflow-x-auto gap-4 px-4 md:px-8 pb-4 scrollbar-hide snap-x snap-mandatory">
          {items.map((item) => (
            <div key={item.id} className="snap-start">
              <MediaCard
                id={item.id}
                title={item.title || item.name || 'Untitled'}
                posterPath={item.poster_path}
                mediaType={item.media_type as 'movie' | 'tv'}
                voteAverage={item.vote_average}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
