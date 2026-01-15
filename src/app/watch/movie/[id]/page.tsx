import { tmdb, Movie } from '@/lib/tmdb';
import { MoviePlayer } from './MoviePlayer';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WatchMoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await tmdb.getDetails<Movie>('movie', parseInt(id));
  
  return (
    <MoviePlayer 
      movieId={parseInt(id)}
      title={movie.title}
      posterPath={movie.poster_path}
    />
  );
}
