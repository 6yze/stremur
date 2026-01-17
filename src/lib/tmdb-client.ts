/**
 * Client-side TMDB API wrapper
 * Uses NEXT_PUBLIC_TMDB_API_KEY for client-side fetching
 */

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Re-export types from the main tmdb file
export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: "movie" | "tv" | "person";
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export interface Movie extends MediaItem {
  media_type: "movie";
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
  adult: boolean;
  genre_ids: number[];
  vote_count: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface TVShow extends MediaItem {
  media_type: "tv";
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
  genre_ids: number[];
  vote_count: number;
  seasons?: Season[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  runtime?: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  air_date: string;
  episodes?: Episode[];
  episode_count?: number;
  vote_average?: number;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_TMDB_API_KEY is not defined");
  }
  return key;
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: getApiKey(),
    ...params,
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Image URL helpers
export function getPosterUrl(path: string | null, size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"): string {
  if (!path) return "/placeholder-poster.png";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: "w300" | "w780" | "w1280" | "original" = "w1280"): string {
  if (!path) return "/placeholder-backdrop.png";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getStillUrl(path: string | null, size: "w92" | "w185" | "w300" | "original" = "w300"): string {
  if (!path) return "/placeholder-still.png";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// API methods
export const tmdbClient = {
  // Trending
  async getTrending(mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week"): Promise<TMDBResponse<MediaItem>> {
    return fetchTMDB(`/trending/${mediaType}/${timeWindow}`);
  },

  // Movies
  async getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
    return fetchTMDB("/movie/popular", { page: page.toString() });
  },

  async getTopRatedMovies(page = 1): Promise<TMDBResponse<Movie>> {
    return fetchTMDB("/movie/top_rated", { page: page.toString() });
  },

  async getNowPlayingMovies(page = 1): Promise<TMDBResponse<Movie>> {
    return fetchTMDB("/movie/now_playing", { page: page.toString() });
  },

  async getUpcomingMovies(page = 1): Promise<TMDBResponse<Movie>> {
    return fetchTMDB("/movie/upcoming", { page: page.toString() });
  },

  async getMovieDetails(id: number): Promise<Movie> {
    return fetchTMDB(`/movie/${id}`, { append_to_response: "credits,videos,recommendations,similar" });
  },

  // TV Shows
  async getPopularTVShows(page = 1): Promise<TMDBResponse<TVShow>> {
    return fetchTMDB("/tv/popular", { page: page.toString() });
  },

  async getTopRatedTVShows(page = 1): Promise<TMDBResponse<TVShow>> {
    return fetchTMDB("/tv/top_rated", { page: page.toString() });
  },

  async getOnTheAirTVShows(page = 1): Promise<TMDBResponse<TVShow>> {
    return fetchTMDB("/tv/on_the_air", { page: page.toString() });
  },

  async getTVShowDetails(id: number): Promise<TVShow> {
    return fetchTMDB(`/tv/${id}`, { append_to_response: "credits,videos,recommendations,similar" });
  },

  async getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<Season> {
    return fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
  },

  // Search
  async searchMulti(query: string, page = 1): Promise<TMDBResponse<MediaItem>> {
    return fetchTMDB("/search/multi", { query, page: page.toString() });
  },

  async searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
    return fetchTMDB("/search/movie", { query, page: page.toString() });
  },

  async searchTVShows(query: string, page = 1): Promise<TMDBResponse<TVShow>> {
    return fetchTMDB("/search/tv", { query, page: page.toString() });
  },

  // Genres
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    return fetchTMDB("/genre/movie/list");
  },

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    return fetchTMDB("/genre/tv/list");
  },

  // Discover
  async discoverMovies(params: Record<string, string> = {}): Promise<TMDBResponse<Movie>> {
    return fetchTMDB("/discover/movie", params);
  },

  async discoverTVShows(params: Record<string, string> = {}): Promise<TMDBResponse<TVShow>> {
    return fetchTMDB("/discover/tv", params);
  },
};
