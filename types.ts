
export interface Movie {
  id: string;
  imdbId?: string;
  title: string;
  description: string;
  thumbnail: string;
  heroImage?: string;
  year: string;
  rating: string;
  duration: string;
  category: string;
  tags: string[];
  userRating?: number;
  watched?: boolean;
}

export interface Person {
  id: string;
  name: string;
  known_for_department: string;
  profile_path: string | null;
  known_for: string; // Summarized titles
}

export enum Category {
  POPULAR = 'Popular Picks',
  TRENDING = 'Trending This Week',
  ORIGINALS = 'CineBlaze Exclusives',
  TOP_RATED = 'All-Time Top Rated',
  ACTION = 'High-Octane Action',
  COMEDY = 'Top Comedies',
  HORROR = 'Thrilling Horror',
  ANIMATED = 'Animated Adventures',
  UPCOMING = 'Coming Soon',
  DOCUMENTARY = 'Real Stories'
}

export type Section = 'home' | 'movies' | 'tv' | 'people' | 'awards' | 'watchlist';

export interface Genre {
  id: number;
  name: string;
}

export const GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
  { id: 16, name: 'Animation' }
];
