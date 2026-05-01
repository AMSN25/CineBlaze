
import { Movie } from './types';

export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const TMDB_THUMB_URL = 'https://image.tmdb.org/t/p/w342';
export const TMDB_HERO_URL = 'https://image.tmdb.org/t/p/original';
export const PAGE_SIZE = 20;

// Free backup API (no key needed)
export const FMDB_BASE_URL = 'https://imdb.iamidiotareyoutoo.com';

export const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || '';
export const OMDB_BASE_URL = 'https://www.omdbapi.com/';

export const IMDB_BASE_URL = 'https://imdb.iamidiotareyoutoo.com';
export const IMDB_API_URL = 'https://api.imdbapi.dev/v1';
export const IMDB_SEARCH_URL = 'https://search.imdbapi.dev/v1';

export const getFetchUrl = (key: string, page: number = 1) => {
  const baseUrls: { [key: string]: string } = {
    trending: `${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
    originals: `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213&page=${page}`,
    topRated: `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
    actionMovies: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&page=${page}`,
    comedyMovies: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35&page=${page}`,
    horrorMovies: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&page=${page}`,
    animatedMovies: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&page=${page}`,
    upcomingMovies: `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
    documentaryMovies: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99&page=${page}`,
    popularPeople: `${TMDB_BASE_URL}/person/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
    allMovies: `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
    allTV: `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
  };
  return baseUrls[key];
};

export const FETCH_URLS = {
  trending: getFetchUrl('trending'),
  originals: getFetchUrl('originals'),
  topRated: getFetchUrl('topRated'),
  actionMovies: getFetchUrl('actionMovies'),
  comedyMovies: getFetchUrl('comedyMovies'),
  horrorMovies: getFetchUrl('horrorMovies'),
  animatedMovies: getFetchUrl('animatedMovies'),
  upcomingMovies: getFetchUrl('upcomingMovies'),
  documentaryMovies: getFetchUrl('documentaryMovies'),
  popularPeople: getFetchUrl('popularPeople'),
  allMovies: getFetchUrl('allMovies'),
  allTV: getFetchUrl('allTV'),
};

export const FALLBACK_MOVIE: Movie = {
  id: '0',
  title: 'CineBlaze',
  description: 'The ultimate movie database. Discover trending films, popular series, and hidden gems from around the world.',
  thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop',
  heroImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop',
  year: '2024',
  rating: '10.0',
  duration: 'Feature',
  category: 'Spotlight',
  tags: ['Cinema', 'Discovery']
};

export const FALLBACK_MOVIES: Movie[] = [
  FALLBACK_MOVIE,
  {
    id: '1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
    thumbnail: 'https://images.unsplash.com/photo-1534809027769-40080f475d0f?w=500',
    heroImage: 'https://images.unsplash.com/photo-1534809027769-40080f475d0f?w=1200',
    year: '2010',
    rating: '8.8',
    duration: 'Feature',
    category: 'Sci-Fi',
    tags: ['Dream', 'Mind Bender']
  },
  {
    id: '2',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker terrorizes Gotham, Batman must accept one of the greatest psychological and physical tests.',
    thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?w=500',
    heroImage: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?w=1200',
    year: '2008',
    rating: '9.0',
    duration: 'Feature',
    category: 'Action',
    tags: ['Batman', 'Classic']
  },
  {
    id: '3',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500',
    heroImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200',
    year: '2014',
    rating: '8.6',
    duration: 'Feature',
    category: 'Sci-Fi',
    tags: ['Space', 'Adventure']
  }
];
