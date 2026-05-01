import { useState, useEffect, useCallback } from 'react';
import { Movie, Person } from '../types';
import { FETCH_URLS, TMDB_IMAGE_BASE_URL, FALLBACK_MOVIE } from '../constants';

export function useMovies() {
  const [moviesData, setMoviesData] = useState<{ [key: string]: Movie[] }>({});
  const [peopleData, setPeopleData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapTMDBToMovie = useCallback((item: any, category: string): Movie => {
    const baseRating = item.vote_average || 0;
    const voteCount = item.vote_count || 0;
    return {
      id: item.id.toString(),
      title: item.title || item.name || item.original_name || 'Untitled',
      description: item.overview || 'No description available.',
      thumbnail: item.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${item.poster_path}` : FALLBACK_MOVIE.thumbnail,
      heroImage: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${item.backdrop_path}` : FALLBACK_MOVIE.heroImage,
      year: (item.release_date || item.first_air_date || '').split('-')[0] || '2024',
      rating: baseRating.toFixed(1),
      duration: item.media_type === 'tv' || item.first_air_date ? 'Series' : 'Feature',
      category: category,
      tags: voteCount > 0 ? [`${(voteCount / 1000).toFixed(1)}k Votes`] : []
    };
  }, []);

  useEffect(() => {
    const fetchWithRetry = async (url: string, retries = 2): Promise<any> => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (data.results) return data;
          return data;
        } catch (err) {
          if (i === retries - 1) throw err;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    };

    const fetchAllData = async () => {
      setError(null);
      setLoading(true);
      try {
        const fetchRequests = Object.entries(FETCH_URLS).map(async ([key, url]) => {
          try {
            const data = await fetchWithRetry(url);
            if (key === 'popularPeople') {
              return { key, people: data.results || [] };
            }
            return { key, movies: (data.results || []).map((item: any) => mapTMDBToMovie(item, key)) };
          } catch (err) {
            console.error(`Failed to fetch ${key}:`, err);
            return { key, movies: [], people: [] };
          }
        });

        const results = await Promise.allSettled(fetchRequests);
        const newData: { [key: string]: Movie[] } = {};
        
        results.forEach((res) => {
          if (res.status === 'fulfilled' && 'movies' in res.value) {
            newData[res.value.key] = res.value.movies;
          }
          if (res.status === 'fulfilled' && 'people' in res.value) {
            setPeopleData(res.value.people.map((p: any) => ({
              id: p.id.toString(),
              name: p.name,
              known_for_department: p.known_for_department,
              profile_path: p.profile_path,
              known_for: p.known_for?.map((m: any) => m.title || m.name).join(', ') || 'Various'
            })));
          }
        });

        if (Object.keys(newData).length === 0 || !newData.trending?.length) {
          setMoviesData({ trending: [FALLBACK_MOVIE] });
        } else {
          setMoviesData(newData);
        }
        setTimeout(() => setLoading(false), 500);
      } catch (err) {
        console.error('Error fetching data:', err);
        setMoviesData({ trending: [FALLBACK_MOVIE] });
        setLoading(false);
      }
    };
    fetchAllData();
  }, [mapTMDBToMovie]);

  return { moviesData, peopleData, loading, error };
}