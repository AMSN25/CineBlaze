import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../types';

const STORAGE_KEY = 'cineblaze-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((movie: Movie) => {
    setWatchlist(prev => {
      if (prev.find(m => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromWatchlist = useCallback((movieId: string) => {
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
  }, []);

  const isInWatchlist = useCallback((movieId: string) => {
    return watchlist.some(m => m.id === movieId);
  }, [watchlist]);

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    clearWatchlist
  };
}