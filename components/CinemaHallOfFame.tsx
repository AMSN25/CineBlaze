import React, { useState, useEffect } from 'react';
import { Star, Play, Plus, Calendar, Clock, Award, ChevronLeft, ChevronRight, Sparkles, Zap, Verified } from 'lucide-react';
import { Movie } from '../types';

interface CinemaHallOfFameProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
}

const CinemaHallOfFame: React.FC<CinemaHallOfFameProps> = ({ movie, onPlay }) => {
  const score = parseFloat(movie.rating) || 0;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    setTimeout(() => setIsLoaded(true), 100);
  }, [movie]);

  const scorePercentage = (score / 10) * 100;
  const circumference = 2 * Math.PI * 45;
  const scoreOffset = circumference - (scorePercentage / 100) * circumference;

  return (
    <div 
      className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f0f1a] to-[#0a0a0a]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[250px] md:text-[400px] lg:text-[500px] font-black text-white/[0.025] uppercase italic tracking-tighter leading-none pointer-events-none select-none">
        {score.toFixed(1)}
      </div>

      <div className={`relative max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-6">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full shimmer-badge">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Hall of Fame</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-bold text-blue-400">Top Rated</span>
              </div>
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.95] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
              {movie.title}
            </h3>
            
            <p className="text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3 max-w-xl">
              {movie.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400 text-sm font-medium">{movie.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400 text-sm font-medium">{movie.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-500 text-sm font-black">{movie.rating}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => onPlay?.(movie)}
                className="flex items-center gap-2.5 bg-blue-600 text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:scale-105 transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
              >
                <Play fill="white" className="w-4 h-4" />
                Watch Now
              </button>
              <button className="flex items-center gap-2.5 bg-white/[0.08] text-white px-6 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/15 transition-all border border-white/10 active:scale-95">
                <Plus className="w-4 h-4" />
                Add to List
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col items-center lg:items-end gap-6">
            <div className="relative group">
              <div className="relative w-48 md:w-56 lg:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-transform duration-500 group-hover:scale-[1.02]">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => onPlay?.(movie)}
                    className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 hover:scale-110 transition-all shadow-2xl shadow-blue-600/60"
                  >
                    <Play fill="white" className="w-7 h-7 text-white ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300 bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 shadow-xl">
                <div className="relative h-full flex items-center justify-center">
                  <svg className="w-24 h-24 md:w-28 md:w-28 lg:w-32 lg:h-32 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="45"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="45"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={scoreOffset}
                      className="score-ring"
                      style={{ '--score-offset': scoreOffset } as React.CSSProperties}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white">{score.toFixed(1)}</span>
                    <span className="text-[6px] font-bold uppercase text-white/70">TMDB</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < Math.floor(score / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-white ml-1 flex items-center gap-1">
                <Verified className="w-4 h-4 text-blue-400" />
                Verified Classic
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <ChevronLeft className="w-4 h-4" />
              <span>Swipe for more</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaHallOfFame;