import React, { useEffect, useState, useRef } from 'react';
import { Play, Info, Plus, Star, ChevronLeft, ChevronRight, Volume2, VolumeX, Clapperboard } from 'lucide-react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onPlay }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };
    const hero = heroRef.current;
    hero?.addEventListener('mousemove', handleMouseMove);
    return () => hero?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isPlaying && videoRef.current && !isMuted) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isPlaying, isMuted]);

  const bgTransform = `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px) scale(1.1)`;
  const contentTransform = `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)`;

  return (
    <div 
      ref={heroRef}
      className="relative h-[85vh] w-full overflow-hidden bg-[#050505]"
      role="banner"
      aria-label={`Featured: ${movie.title}`}
      onMouseEnter={() => { setIsPlaying(true); setIsHovered(true); }}
      onMouseLeave={() => { setIsPlaying(false); setIsHovered(false); }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ 
          backgroundImage: `url(${movie.heroImage || movie.thumbnail})`,
          transform: isLoaded ? bgTransform : 'scale(1.1)',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      />
      
      <video
        ref={videoRef}
        src="https://storage.googleapis.com/gtv-videos-cloud/sample/ForBiggerJoyrides.mp4"
        muted={isMuted}
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isPlaying && !isMuted ? 'opacity-60 mix-blend-overlay' : 'opacity-0'}`}
        onError={(e) => (e.target as HTMLVideoElement).style.display = 'none'}
      />

      <div className="absolute inset-0 pointer-events-none opacity-[0.025] animate-grain" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-[#030303]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-black/20 to-transparent" />

      <div 
        className={`absolute inset-0 flex flex-col justify-end px-6 xs:px-8 lg:px-16 pb-16 xs:pb-20 max-w-6xl transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transform: contentTransform }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 xs:gap-4 flex-wrap" role="list" aria-label="Movie information">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/15" role="listitem">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-white">{movie.rating}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/20 backdrop-blur-xl rounded-full border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
              <span className="text-xs font-bold text-red-400 uppercase">Now Streaming</span>
            </div>
            
            <span className="text-gray-500">•</span>
            
            <span className="px-3 py-1 text-xs font-bold text-blue-400 tracking-widest uppercase bg-blue-500/15 rounded-full border border-blue-500/30">Featured</span>

            <span className="text-gray-500">•</span>
            
            <span className="text-sm font-medium text-gray-300">{movie.year}</span>
          </div>
          
          <h2 
            className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] glitch-text cursor-default"
          >
            {movie.title}
          </h2>
          
          <p className="text-sm xs:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl line-clamp-2">
            {movie.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1" role="group" aria-label="Movie actions">
            <button 
              onClick={() => onPlay(movie)}
              aria-label={`Play ${movie.title}`}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
            >
              <Play fill="white" className="w-5 h-5" />
              <span>Watch Now</span>
            </button>
            
            <button 
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 bg-white/[0.1] text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/[0.2] transition-all active:scale-95 border border-white/15"
            >
              <Info className="w-5 h-5" />
              <span>Details</span>
            </button>

            <button 
              aria-label="Add to watchlist"
              className="p-3 bg-white/[0.08] text-white rounded-full hover:bg-white/15 transition-all active:scale-95 border border-white/10"
            >
              <Plus className="w-5 h-5" />
            </button>

            <button 
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-white/[0.08] text-white rounded-full hover:bg-white/15 transition-all active:scale-95 border border-white/10"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button 
          onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
          className="p-2 hover:bg-white/10 rounded-full transition-all" 
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex items-center gap-2" role="list">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              role="listitem"
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide 
                  ? 'w-8 bg-blue-500' 
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              }`} 
            />
          ))}
        </div>
        <button 
          onClick={() => setActiveSlide((activeSlide + 1) % 5)}
          className="p-2 hover:bg-white/10 rounded-full transition-all" 
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Hero;