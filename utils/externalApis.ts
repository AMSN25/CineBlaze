import { Movie } from '../types';
import { OMDB_API_KEY, OMDB_BASE_URL, IMDB_BASE_URL } from '../constants';

export interface OMDBMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  BoxOffice: string;
  Production: string;
}

export interface IMDBData {
  id: string;
  title: string;
  image: string;
  rating: string;
  votes: string;
  description: string;
  genres: string[];
  release_date: string;
  runtime_str: string;
  directors: string[];
  stars: string[];
}

export const fetchOMDBData = async (imdbId: string): Promise<OMDBMovie | null> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}/?i=${imdbId}&apikey=${OMDB_API_KEY}&plot=full`);
    const data = await response.json();
    if (data.Response === 'True') {
      return data;
    }
    return null;
  } catch (error) {
    console.error('OMDB API error:', error);
    return null;
  }
};

export const fetchIMDBData = async (imdbId: string): Promise<IMDBData | null> => {
  try {
    const response = await fetch(`${IMDB_BASE_URL}/title/${imdbId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('IMDB API error:', error);
    return null;
  }
};

export const searchOMDB = async (query: string): Promise<OMDBMovie[]> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}&type=movie`);
    const data = await response.json();
    if (data.Response === 'True' && data.Search) {
      const detailedResults = await Promise.all(
        data.Search.slice(0, 10).map(async (movie: any) => {
          const detail = await fetchOMDBData(movie.imdbID);
          return detail;
        })
      );
      return detailedResults.filter(Boolean) as OMDBMovie[];
    }
    return [];
  } catch (error) {
    console.error('OMDB search error:', error);
    return [];
  }
};

export const mapOMDBToMovie = (omdb: OMDBMovie, category: string = 'OMDB'): Movie => {
  return {
    id: omdb.imdbID,
    title: omdb.Title,
    description: omdb.Plot,
    thumbnail: omdb.Poster !== 'N/A' ? omdb.Poster : '',
    heroImage: omdb.Poster !== 'N/A' ? omdb.Poster : '',
    year: omdb.Year,
    rating: omdb.imdbRating !== 'N/A' ? omdb.imdbRating : '0.0',
    duration: omdb.Runtime !== 'N/A' ? omdb.Runtime : 'Feature',
    category: category,
    tags: [
      omdb.BoxOffice !== 'N/A' ? omdb.BoxOffice : '',
      omdb.imdbVotes !== 'N/A' ? omdb.imdbVotes : ''
    ].filter(Boolean)
  };
};

export const getEnhancedMovieData = async (movie: Movie): Promise<Partial<Movie> & { omdbData?: OMDBMovie; imdbData?: IMDBData }> => {
  const enhancements: Partial<Movie> & { omdbData?: any; imdbData?: any } = {};
  
  if (movie.id.startsWith('tt')) {
    const [omdbData, imdbData] = await Promise.all([
      fetchOMDBData(movie.id),
      fetchIMDBData(movie.id)
    ]);
    
    if (omdbData) {
      enhancements.omdbData = omdbData;
      if (omdbData.Plot && omdbData.Plot !== 'N/A') {
        enhancements.description = omdbData.Plot;
      }
      if (omdbData.Poster && omdbData.Poster !== 'N/A') {
        if (!enhancements.thumbnail) enhancements.thumbnail = omdbData.Poster;
      }
      if (omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
        enhancements.rating = omdbData.imdbRating;
      }
    }
    
    if (imdbData) {
      enhancements.imdbData = imdbData;
    }
  }
  
  return enhancements;
};