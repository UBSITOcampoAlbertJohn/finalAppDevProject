export type MovieCategory = 'Trending' | 'Top Rated' | 'Now Playing' | 'Coming Soon' | 'Featured';
export type MovieStatus = 'Published' | 'Draft';

export interface Movie {
  _id?: string;
  title: string;
  description: string;
  releaseDate: string;
  genre: string[];
  rating: number;
  duration: number;
  director: string;
  cast: string[];
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  category: MovieCategory;
  status: MovieStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  message?: string;
  data: T;
  errors?: string[];
}