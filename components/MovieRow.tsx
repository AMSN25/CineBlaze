import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Zap, Flame } from 'lucide-react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onViewAll?: () => void;
  sectionColor?: 'blue' | 'purple' | 'red';
}

const sectionColors: Record<string, 'blue' | 'purple' | 'red' | 'green' | 'yellow' | 'orange' | 'pink'> = {
  'Trending This Week': 'blue',
  'CineBlaze Exclusives': 'purple',
  'High-Octane Action': 'red',
  'Top Comedies': 'yellow',
  'Thrilling Horror': 'orange',
  'Animated Adventures': 'pink',
  'Coming Soon': 'green',
  'Real Stories': 'blue'
};

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onPlay, onViewAll, sectionColor }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const color = sectionColor || sectionColors[title] || 'blue';
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFirstVisible, setIsFirstVisible] = useState(true);
  const [isLastVisible, setIsLastVisible] = useState(false);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const colorClasses = {
    blue: { bg: 'bg-blue-600', gradient: 'from-blue-600/10 via-blue-600/5 to-transparent', border: 'border-blue-500/20', text: 'text-blue-500', shadow: 'shadow-blue-600/50', glow: 'shadow-blue-500/30' },
    purple: { bg: 'bg-purple-600', gradient: 'from-purple-600/10 via-purple-600/5 to-transparent', border: 'border-purple-500/20', text: 'text-purple-500', shadow: 'shadow-purple-600/50', glow: 'shadow-purple-500/30' },
    red: { bg: 'bg-red-600', gradient: 'from-red-600/10 via-red-600/5 to-transparent', border: 'border-red-500/20', text: 'text-red-500', shadow: 'shadow-red-600/50', glow: 'shadow-red-500/30' },
    green: { bg: 'bg-green-600', gradient: 'from-green-600/10 via-green-600/5 to-transparent', border: 'border-green-500/20', text: 'text-green-500', shadow: 'shadow-green-600/50', glow: 'shadow-green-500/30' },
    yellow: { bg: 'bg-yellow-500', gradient: 'from-yellow-500/10 via-yellow-500/5 to-transparent', border: 'border-yellow-500/20', text: 'text-yellow-500', shadow: 'shadow-yellow-500/50', glow: 'shadow-yellow-500/30' },
    orange: { bg: 'bg-orange-600', gradient: 'from-orange-600/10 via-orange-600/5 to-transparent', border: 'border-orange-500/20', text: 'text-orange-500', shadow: 'shadow-orange-600/50', glow: 'shadow-orange-500/30' },
    pink: { bg: 'bg-pink-600', gradient: 'from-pink-600/10 via-pink-600/5 to-transparent', border: 'border-pink-500/20', text: 'text-pink-500', shadow: 'shadow-pink-600/50', glow: 'shadow-pink-500/30' }
  };

  const colors = colorClasses[color];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress((el.scrollLeft / maxScroll) * 100);
      }
      setIsFirstVisible(el.scrollLeft <= 10);
      setIsLastVisible(el.scrollLeft >= maxScroll - 10);
    };
    el.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const isTrending = title === 'Trending This Week';

  return (
    <div className="relative mb-16 md:mb-20 group/row pt-4">
      <div className="flex items-center justify-between mb-6 px-6 lg:px-12">
        <div className="flex items-center gap-4">
          {isTrending && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Hot</span>
            </div>
          )}
          <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter group-hover:${colors.text} transition-colors italic flex items-center gap-3`}>
            <span className={`w-1.5 h-6 xs:h-8 ${colors.bg} rounded-full shadow-lg ${colors.shadow}`}></span>
            {title}
          </h3>
          <span className="text-xs font-medium text-gray-500">{movies.length} titles</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onPlay(movies[0])}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50"
          >
            <Play className="w-3.5 h-3.5" fill="white" />
            <span className="hidden sm:inline">Watch Now</span>
            <span className="inline sm:hidden">Play</span>
          </button>
          <button 
            onClick={() => navigate(`/search?q=${encodeURIComponent(title)}`)}
            className={`text-[10px] font-bold uppercase tracking-[0.15em] ${colors.text} hover:text-white transition-colors flex items-center gap-2 group/cta px-3 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10`}
          >
            View All <span className="group-hover/cta:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-0 z-40 bg-gradient-to-r from-[#030303] to-transparent px-8 flex items-center transition-all duration-300 ${isFirstVisible ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover/row:opacity-100'}`}
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-5 md:gap-6 overflow-x-auto no-scrollbar px-6 lg:px-12 pb-8 scroll-fade-left"
        >
          {movies.slice(0, 12).map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} onPlay={onPlay} sectionColor={color} />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className={`absolute right-0 top-0 bottom-0 z-40 bg-gradient-to-l from-[#030303] to-transparent px-8 flex items-center transition-all duration-300 ${isLastVisible ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover/row:opacity-100'}`}
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </button>

        <div className="absolute bottom-0 left-6 right-6 h-1 bg-white/[0.1] rounded-full overflow-hidden">
          <div 
            className={`h-full ${colors.bg} transition-all duration-300`} 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieRow;