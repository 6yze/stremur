import { tmdb } from '@/lib/tmdb';
import { HeroBanner } from '@/components/media/HeroBanner';
import { MediaRow } from '@/components/media/MediaRow';
import ContinueWatchingRow from '@/components/media/ContinueWatchingRow';

export default async function Home() {
  const [
    trendingMovies,
    trendingTV,
    popularMovies,
    popularTV,
    topRatedMovies,
    topRatedTV
  ] = await Promise.all([
    tmdb.getTrending('movie'),
    tmdb.getTrending('tv'),
    tmdb.getPopular('movie'),
    tmdb.getPopular('tv'),
    tmdb.getTopRated('movie'),
    tmdb.getTopRated('tv')
  ]);

  const heroItem = trendingMovies?.results?.[0];

  return (
    <main className="min-h-screen bg-black pb-20">
      {heroItem && <HeroBanner item={heroItem} />}
      <ContinueWatchingRow />
      
      <div className="space-y-8 mt-4 md:mt-8">
        <MediaRow title="Trending Movies" items={trendingMovies.results} />
        <MediaRow title="Trending TV Shows" items={trendingTV.results} />
        <MediaRow title="Popular Movies" items={popularMovies.results} />
        <MediaRow title="Popular TV Shows" items={popularTV.results} />
        <MediaRow title="Top Rated Movies" items={topRatedMovies.results} />
        <MediaRow title="Top Rated TV Shows" items={topRatedTV.results} />
      </div>
    </main>
  );
}
