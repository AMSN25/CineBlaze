import React, { useState, useEffect, useRef } from 'react';
import { X, Loader, Volume2, VolumeX, Maximize, Minimize, Settings, Monitor, RotateCcw, RotateCw } from 'lucide-react';
import { Movie } from '../types';
import { TMDB_BASE_URL, TMDB_API_KEY } from '../constants';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('720p');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchAndLoadVideo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const type = movie.duration === 'Series' ? 'tv' : 'movie';
        let imdbId = movie.imdbId;
        
        if (!imdbId) {
          const extRes = await fetch(`${TMDB_BASE_URL}/${type}/${movie.id}/external_ids?api_key=${TMDB_API_KEY}`);
          if (extRes.ok) {
            const extData = await extRes.json();
            imdbId = extData.imdb_id;
          }
        }
        
        if (imdbId) {
          const url = type === 'tv' 
            ? `https://vidapi.xyz/embed/tv/${imdbId}&s=1&e=1`
            : `https://vidapi.xyz/embed/movie/${imdbId}`;
          setEmbedUrl(url);
        } else {
          setError('Movie not available');
        }
      } catch (err) {
        setError('Failed to load');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndLoadVideo();
  }, [movie]);

  const handleClose = () => {
    onClose();
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg">
            <span className="text-sm font-bold text-white">CINEBLAZE</span>
          </div>
          <h1 className="text-white font-bold text-sm truncate max-w-xs md:max-w-md">{movie.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-all ${showSettings ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
            title="Settings"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all hidden md:flex"
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
          </button>
          <button 
            onClick={handleClose} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:rotate-90"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="absolute top-16 right-4 md:right-20 z-30 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/20 p-4 w-72">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Video Quality
          </h3>
          <div className="space-y-1">
            {['360p', '480p', '720p', '1080p'].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                  quality === q 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span>{q}</span>
                {quality === q && <span className="text-xs opacity-70">✓</span>}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-3 text-center">
            Quality auto-adjusted based on network speed
          </p>
        </div>
      )}

      <div className="flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading movie...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm"
            >
              Close
            </button>
          </div>
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            title="Video Player"
          />
        ) : null}
      </div>
    </div>
  );
};

export default VideoPlayer;