import React, { useState, useEffect, useRef } from 'react';
import { Search, Film, Tv, Clock, TrendingUp, ArrowRight, Flame, Gauge } from 'lucide-react';
import { Movie, Person } from '../types';
import { FALLBACK_MOVIE } from '../constants';

interface SearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
  results: Movie[];
  isLoading: boolean;
  query: string;
  onMovieClick: (movie: Movie) => void;
  onPersonClick?: (person: Person) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ 
  isOpen, 
  onClose, 
  results, 
  isLoading, 
  query,
  onMovieClick,
  onPersonClick: _onPersonClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('cineblaze-recent-searches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        onMovieClick(results[selectedIndex]);
        addToRecent(results[selectedIndex].title);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onMovieClick, onClose]);

  const addToRecent = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('cineblaze-recent-searches', JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('cineblaze-recent-searches');
  };

  if (!isOpen) return null;

  const trendingSearches = ['Marvel', 'Batman', 'Oppenheimer', 'Dune', 'Avatar', 'Star Wars'];

  return (
    <div 
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 mx-4 md:mx-0 bg-[#050505]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-[90] animate-scale-in"
    >
      {/* Search Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-blue-600/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Search className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase italic text-white">Search Results</h3>
            <p className="text-[10px] text-gray-500">{query}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 bg-white/[0.05] px-2 py-1 rounded-md">{results.length} found</span>
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      {query.length < 2 && recentSearches.length > 0 && (
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Recent</span>
            </div>
            <button onClick={clearRecent} className="text-[9px] text-gray-600 hover:text-blue-400 transition-colors">Clear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, i) => (
              <button
                key={i}
                className="px-3 py-1.5 bg-white/[0.03] hover:bg-blue-600/20 border border-white/[0.06] hover:border-blue-500/30 rounded-full text-[10px] text-gray-400 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Clock className="w-3 h-3" />
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {query.length < 2 && (
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Trending Now</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {}}
                className="px-3 py-1.5 bg-white/[0.03] hover:bg-blue-600/20 border border-white/[0.06] hover:border-blue-500/30 rounded-full text-[10px] text-gray-400 hover:text-white transition-all flex items-center gap-1.5 group"
              >
                <Flame className="w-3 h-3 text-orange-500 group-hover:text-orange-400 transition-colors" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-blue-500 animate-pulse" />
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium">Scanning database...</span>
        </div>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <div className="max-h-[50vh] overflow-y-auto scrollbar-thin">
          <div className="p-2">
            {results.slice(0, 8).map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => { onMovieClick(movie); addToRecent(movie.title); onClose(); }}
                className={`
                  flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group
                  ${selectedIndex === index 
                    ? 'bg-gradient-to-r from-blue-600/20 to-blue-600/5 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                    : 'hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]'
                  }
                `}
              >
                <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                  <img 
                    src={movie.thumbnail} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_MOVIE.thumbnail; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-blue-600/90 backdrop-blur-sm text-[8px] font-black text-white rounded-md flex items-center gap-0.5 shadow-lg">
                    {movie.duration === 'Series' ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm truncate uppercase italic text-white group-hover:text-blue-400 transition-colors">{movie.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1.5 font-medium">
                    <span className="bg-white/[0.05] px-1.5 py-0.5 rounded">{movie.year}</span>
                    <span className="text-yellow-400">★ {movie.rating}</span>
                    <span>•</span>
                    <span className="text-gray-400">{movie.duration}</span>
                  </div>
                  <p className="text-[10px] text-gray-600 truncate mt-1.5 italic">{movie.description}</p>
                </div>
                <ArrowRight className={`w-5 h-5 text-gray-600 transition-all ${selectedIndex === index ? 'text-blue-500 translate-x-2' : 'group-hover:translate-x-1 group-hover:text-blue-400'}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && query.length >= 2 && results.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/[0.02] flex items-center justify-center">
            <Search className="w-10 h-10 text-gray-700" />
          </div>
          <p className="text-gray-400 font-black uppercase italic text-lg">No matches found</p>
          <p className="text-gray-600 text-[11px] mt-2">Try different keywords or browse trending</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {trendingSearches.slice(0, 3).map((term, i) => (
              <button key={i} className="px-3 py-1.5 bg-white/[0.03] hover:bg-blue-600/20 border border-white/[0.06] rounded-full text-[10px] text-gray-500 hover:text-white transition-all">
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-[9px] text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-white/[0.08] rounded text-gray-400 font-mono">↵</kbd> Select</span>
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-white/[0.08] rounded text-gray-400 font-mono">↑↓</kbd> Navigate</span>
        </div>
        <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-white/[0.08] rounded text-gray-400 font-mono">esc</kbd> Close</span>
      </div>
    </div>
  );
};

export default SearchBox;