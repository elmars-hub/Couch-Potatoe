import axios from "axios";

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const imagePath = "https://image.tmdb.org/t/p/w500";
export const imagePathOriginal = "https://image.tmdb.org/t/p/original";

// Types
export type TimeWindow = "day" | "week";
export type MediaType = "movie" | "tv";
export type SortBy =
  | "popularity.desc"
  | "vote_average.desc"
  | "release_date.desc"
  | "primary_release_date.desc";

export interface TrendingResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: MediaType;
  vote_average: number;
}

export interface MovieResult {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export interface TVResult {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
}

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: MediaType;
}

interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Details interfaces
export interface MovieDetails extends MovieResult {
  overview: string;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  vote_count: number;
  backdrop_path: string;
  credits?: {
    cast: Array<{ id: number; name: string; character: string }>;
    crew: Array<{ id: number; name: string; job: string }>;
  };
}

export interface TVDetails extends TVResult {
  overview: string;
  episode_run_time: number[];
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  vote_count: number;
  backdrop_path: string;
  credits?: {
    cast: Array<{ id: number; name: string; character: string }>;
    crew: Array<{ id: number; name: string; job: string }>;
  };
}

type MediaDetails = MovieDetails | TVDetails;

// Credits interfaces
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

// Videos interfaces
interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

interface Videos {
  id: number;
  results: Video[];
}

// Trending
export const fetchTrending = async (
  timeWindow: TimeWindow = "day"
): Promise<TrendingResult[]> => {
  const { data } = await axios.get(
    `${baseUrl}/trending/all/${timeWindow}?api_key=${apiKey}`
  );

  return data?.results;
};

// MOVIES & SERIES - Details
export const fetchDetails = async (
  type: MediaType,
  id: number
): Promise<MediaDetails> => {
  if (!apiKey) {
    console.error("TMDB API key is not set in environment variables");
    throw new Error("TMDB API key is not set");
  }

  try {
    const res = await axios.get(`${baseUrl}/${type}/${id}?api_key=${apiKey}`);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("TMDB API Error:", {
        status: error.response?.status,
        message: error.response?.data?.status_message || error.message,
        url: error.config?.url,
      });
    } else {
      console.error("Error fetching details:", error);
    }
    throw error;
  }
};

// MOVIES & SERIES - Credits
export const fetchCredits = async (
  type: MediaType,
  id: number
): Promise<Credits> => {
  const res = await axios.get(
    `${baseUrl}/${type}/${id}/credits?api_key=${apiKey}`
  );
  return res?.data;
};

// MOVIES & SERIES - Videos
export const fetchVideos = async (
  type: MediaType,
  id: number
): Promise<Videos> => {
  const res = await axios.get(
    `${baseUrl}/${type}/${id}/videos?api_key=${apiKey}`
  );
  return res?.data;
};

// DISCOVER
export const fetchMovies = async (
  page: number,
  sortBy: SortBy
): Promise<PaginatedResponse<MovieResult>> => {
  const res = await axios.get(
    `${baseUrl}/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sortBy}`
  );
  return res?.data;
};

export const fetchTvSeries = async (
  page: number,
  sortBy: SortBy
): Promise<PaginatedResponse<TVResult>> => {
  const res = await axios.get(
    `${baseUrl}/discover/tv?api_key=${apiKey}&page=${page}&sort_by=${sortBy}`
  );
  return res?.data;
};

// SEARCH
export const searchData = async (
  query: string,
  page: number
): Promise<PaginatedResponse<SearchResult>> => {
  const res = await axios.get(
    `${baseUrl}/search/multi?api_key=${apiKey}&query=${query}&page=${page}`
  );
  return res?.data;
};

// MOVIES & SERIES - Recommendations
export const fetchRecommendations = async (
  type: MediaType,
  id: number
): Promise<PaginatedResponse<MovieResult | TVResult>> => {
  const res = await axios.get(
    `${baseUrl}/${type}/${id}/recommendations?api_key=${apiKey}`
  );
  return res?.data;
};
