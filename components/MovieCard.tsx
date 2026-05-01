import React, { useState, useRef } from 'react';
import { Play, Star, Bookmark, Heart, Plus, Volume2, VolumeX, Clock, Film, Flame, TrendingUp } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  sectionColor?: 'blue' | 'purple' | 'red' | 'green' | 'yellow' | 'orange' | 'pink';
}

const sectionColors: Record<string, { bg: string; border: string; shadow: string; text: string }> = {
  blue: { bg: 'bg-blue-600', border: 'border-blue-500/60', shadow: 'shadow-blue-600/35', text: 'text-blue-500' },
  purple: { bg: 'bg-purple-600', border: 'border-purple-500/60', shadow: 'shadow-purple-600/35', text: 'text-purple-500' },
  red: { bg: 'bg-red-600', border: 'border-red-500/60', shadow: 'shadow-red-600/35', text: 'text-red-500' },
  green: { bg: 'bg-green-600', border: 'border-green-500/60', shadow: 'shadow-green-600/35', text: 'text-green-500' },
  yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500/60', shadow: 'shadow-yellow-500/35', text: 'text-yellow-500' },
  orange: { bg: 'bg-orange-600', border: 'border-orange-500/60', shadow: 'shadow-orange-600/35', text: 'text-orange-500' },
  pink: { bg: 'bg-pink-600', border: 'border-pink-500/60', shadow: 'shadow-pink-600/35', text: 'text-pink-500' }
};

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlay, sectionColor = 'blue' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'favorite' | 'watchlist' | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const colors = sectionColors[sectionColor];
  const rank = Math.floor(Math.random() * 10) + 1;
  const isTop3 = rank <= 3;

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    setShowFeedback('favorite');
    setTimeout(() => setShowFeedback(null), 1500);
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInWatchlist(!isInWatchlist);
    setShowFeedback('watchlist');
    setTimeout(() => setShowFeedback(null), 1500);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 10, y: -x * 10 });
  };

  return (
    <div 
      ref={cardRef}
      className="relative flex-shrink-0 w-40 xs:w-44 sm:w-50 md:w-56 group cursor-pointer perspective-1000"
      onMouseEnter={(e) => { handleMouseEnter(); handleMouseMove(e); }}
      onMouseLeave={() => { handleMouseLeave(); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      role="article"
      aria-label={`${movie.title} (${movie.year})`}
    >
      <div 
        className={`
          relative aspect-[2/3] rounded-2xl overflow-hidden 
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform origin-center
          ${isHovered 
            ? 'scale-110 -translate-y-3 z-30 shadow-[0_40px_80px_rgba(0,0,0,0.7)] border-blue-500/70' 
            : 'shadow-xl shadow-black/60 border-white/[0.08] hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl'
          }
          bg-gradient-to-b from-white/[0.03] to-transparent border-2
        `}
        style={{ 
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? 'transform 0.2s ease-out' : 'transform 0.3s ease-out'
        }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/30 animate-shimmer" />
        )}
        
        <img 
          src={movie.thumbnail} 
          alt={movie.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`
            w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${imageLoaded ? 'grayscale-[0.3] group-hover:grayscale-0 brightness-[0.85] group-hover:brightness-100' : 'opacity-0'}
            ${isHovered ? 'scale-[1.25]' : 'scale-100'}
          `}
        />

        <video
          ref={videoRef}
          src="https://storage.googleapis.com/gtv-videos-cloud/sample/ForBiggerFun.mp4"
          muted={isMuted}
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isHovered && imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          onError={(e) => (e.target as HTMLVideoElement).style.display = 'none'}
        />

        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent
          transition-opacity duration-500 ease-out
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} />

        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
           {isTop3 && isHovered && (
             <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg heat-rank">
               <Flame className="w-3 h-3 text-white" />
               <span className="text-[10px] font-bold text-white">🔥 #{rank}</span>
             </div>
           )}
           <div className={`
             bg-black/80 backdrop-blur-2xl px-3 py-1.5 rounded-xl flex items-center gap-1.5 
             border border-white/20 shadow-xl
             ${isHovered ? 'scale-115 shadow-blue-500/30' : 'scale-100'}
             transition-all duration-300
           `}>
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
              <span className="text-xs font-bold italic tracking-tight text-white drop-shadow-md">{movie.rating}</span>
           </div>
           {isHovered && (
             <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10">
               <Clock className="w-3 h-3 text-gray-400" />
               <span className="text-[10px] font-medium text-gray-300">{movie.year}</span>
             </div>
           )}
        </div>

        <div className={`
           absolute top-3 right-3 
           flex flex-col gap-2 transition-all duration-400
           ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
        `}>
            <button 
              onClick={handleWatchlist}
              aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              className={`
                p-2.5 backdrop-blur-2xl rounded-xl border border-white/25 transition-all duration-300
                hover:scale-125 hover:-rotate-12 hover:shadow-lg
                ${isInWatchlist ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/50' : 'bg-black/50 hover:bg-blue-600'}
              `}
            >
              {isInWatchlist ? <Plus className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4 text-white" />}
            </button>
            <button 
              onClick={handleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`
                p-2.5 backdrop-blur-2xl rounded-xl border border-white/25 transition-all duration-300
                hover:scale-125 hover:rotate-12 hover:shadow-lg
                ${isFavorite ? 'bg-red-500 hover:bg-red-400 shadow-red-500/50' : 'bg-black/50 hover:bg-red-500'}
              `}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white text-white animate-pulse' : 'text-white'}`} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="p-2.5 backdrop-blur-2xl rounded-xl border border-white/25 bg-black/50 hover:bg-white/20 transition-all duration-300 hover:scale-125"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
        </div>

        <div className={`
           absolute inset-0 flex items-center justify-center transition-all duration-500
           ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        `}>
            <button 
              onClick={(e) => { e.stopPropagation(); onPlay(movie); }}
              aria-label={`Play ${movie.title}`}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-115 active:scale-95 shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:shadow-[0_0_70px_rgba(37,99,235,0.8)]"
            >
              <Play fill="white" className="w-9 h-9 text-white ml-1" />
            </button>
        </div>

        <div className={`
           absolute inset-x-0 bottom-0 p-4 xs:p-5
           transition-all duration-500 ease-out
           ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
            <div className="space-y-2">
              <h4 className="font-black text-base xs:text-lg md:text-xl truncate uppercase tracking-tighter italic leading-none text-white drop-shadow-2xl">{movie.title}</h4>
              <div className="flex items-center gap-3 text-xs text-gray-300 font-semibold uppercase tracking-wider">
                <span className={`${colors.text} drop-shadow-md`}>{movie.year}</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span className="text-gray-400">{movie.duration}</span>
                {isHovered && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Film className="w-3 h-3" />
                      {movie.category}
                    </span>
                  </>
                )}
              </div>
            </div>
        </div>

        {showFeedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-2xl animate-fade-in z-50">
            <div className="px-6 py-4 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl border border-white/30 backdrop-blur-2xl shadow-2xl">
              <span className="text-base font-bold text-white tracking-wide">
                {showFeedback === 'favorite' 
                  ? (isFavorite ? '♥ Added to Favorites!' : 'Removed from Favorites')
                  : (isInWatchlist ? '✓ Saved to Watchlist' : 'Removed from Watchlist')
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;