import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../types';

const STORAGE_KEY = 'cineblaze-collections';

export interface Collection {
  name: string;
  movies: Movie[];
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }, [collections]);

  const createCollection = useCallback((name: string) => {
    setCollections(prev => [...prev, { name, movies: [] }]);
  }, []);

  const deleteCollection = useCallback((name: string) => {
    setCollections(prev => prev.filter(c => c.name !== name));
  }, []);

  const addToCollection = useCallback((collectionName: string, movie: Movie) => {
    setCollections(prev => prev.map(c =>
      c.name === collectionName && !c.movies.find(m => m.id === movie.id)
        ? { ...c, movies: [...c.movies, movie] }
        : c
    ));
  }, []);

  return {
    collections,
    createCollection,
    deleteCollection,
    addToCollection
  };
}