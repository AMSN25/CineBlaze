import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cineblaze-ratings';

export function useUserRatings() {
  const [userRatings, setUserRatings] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userRatings));
  }, [userRatings]);

  const rateMovie = useCallback((movieId: string, rating: number) => {
    setUserRatings(prev => ({ ...prev, [movieId]: rating }));
  }, []);

  const getRating = useCallback((movieId: string) => {
    return userRatings[movieId];
  }, [userRatings]);

  return {
    userRatings,
    rateMovie,
    getRating
  };
}