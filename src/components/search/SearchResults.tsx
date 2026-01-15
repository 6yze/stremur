import { MediaItem } from "@/lib/tmdb";
import { MediaCard } from "@/components/media/MediaCard";

interface SearchResultsProps {
  results: MediaItem[];
  query: string;
}

function getMediaTitle(item: MediaItem): string {
  return item.title || item.name || "Unknown";
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Start typing to search for movies and TV shows</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">No results found for "{query}"</p>
        <p className="text-gray-500 mt-2">Try searching for something else</p>
      </div>
    );
  }

  // Filter out people results, only show movies and TV
  const mediaResults = results.filter(item => item.media_type === "movie" || item.media_type === "tv");

  if (mediaResults.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">No movies or TV shows found for "{query}"</p>
        <p className="text-gray-500 mt-2">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 mb-6">
        Found {mediaResults.length} results for "{query}"
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {mediaResults.map((item) => (
          <MediaCard 
            key={item.media_type + "-" + item.id} 
            id={item.id}
            title={getMediaTitle(item)}
            posterPath={item.poster_path}
            mediaType={item.media_type as "movie" | "tv"}
            voteAverage={item.vote_average || 0}
          />
        ))}
      </div>
    </div>
  );
}
