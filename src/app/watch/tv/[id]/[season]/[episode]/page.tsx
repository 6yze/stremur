import { tmdb, TVShow } from '@/lib/tmdb';
import { TVPlayer } from './TVPlayer';

interface Props {
  params: Promise<{ id: string; season: string; episode: string }>;
}

export default async function WatchTVPage({ params }: Props) {
  const { id, season, episode } = await params;
  const show = await tmdb.getDetails<TVShow>('tv', parseInt(id));
  
  return (
    <TVPlayer
      showId={parseInt(id)}
      season={parseInt(season)}
      episode={parseInt(episode)}
      title={show.name}
      posterPath={show.poster_path}
    />
  );
}
