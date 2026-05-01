import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Star, Plus, Share2, Award, Calendar, Clock, Globe, BrainCircuit, Users, Wallet, TrendingUp, Check, Film, Clapperboard, X, ChevronRight, Loader, Trophy } from 'lucide-react';
import { Movie } from '../types';
import { TMDB_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_BASE_URL } from '../constants';

import { fetchOMDBData, OMDBMovie } from '../utils/externalApis';
import StarRating from './StarRating';
import ReviewsSection from './ReviewsSection';
import RecommendationEngine from './RecommendationEngine';

interface DetailsPageProps {
  movie: Movie;
  onBack: () => void;
  onGoBack?: () => void;
  onPlay: (movie: Movie) => void;
  isInWatchlist?: (movieId: string) => boolean;
  userRating?: number;
  onRate?: (rating: number) => void;
  currentUser?: { id: string; name: string; avatar?: string } | null;
  onAddToWatchlist?: (movie: Movie) => void;
  onRemoveFromWatchlist?: (movieId: string) => void;
  onMovieClick?: (movie: Movie) => void;
  watchedMovies?: Movie[];
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieDetailsExtended {
  director?: string;
  producers?: string[];
  budget: number;
  revenue: number;
  runtime: number;
  cast: CastMember[];
  status: string;
  genres: { id: number; name: string }[];
}

interface CastFilmographyProps {
  person: CastMember;
  onClose: () => void;
  onMovieClick: (movie: Movie) => void;
}

const CastFilmography: React.FC<CastFilmographyProps> = ({ person, onClose, onMovieClick }) => {
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilmography = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${TMDB_BASE_URL}/person/${person.id}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await res.json();
        setFilms(data.cast?.slice(0, 12) || []);
} catch (err) {
        console.error('Error fetching filmography:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilmography();
  }, [person]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#030303] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {person.profile_path ? (
              <img 
                src={`${TMDB_IMAGE_BASE_URL}/w185${person.profile_path}`} 
                alt={person.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-black">?</div>
            )}
            <div>
              <h3 className="text-2xl font-black uppercase italic">{person.name}</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{films.length} Movies</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : films.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {films.map((film) => (
              <div 
                key={film.id}
                onClick={() => onMovieClick({
                  id: film.id.toString(),
                  title: film.title || film.original_title,
                  description: film.overview || '',
                  thumbnail: film.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${film.poster_path}` : '',
                  heroImage: film.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/w780${film.backdrop_path}` : '',
                  year: (film.release_date || '').split('-')[0],
                  rating: (film.vote_average || 0).toFixed(1),
                  duration: 'Feature',
                  category: 'Film',
                  tags: []
                })}
                className="group cursor-pointer"
              >
                <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-white/5 group-hover:border-blue-500/50 transition-all shadow-lg">
                  <img 
                    src={film.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${film.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all group-hover:scale-110" 
                  />
                </div>
                <p className="text-[10px] font-bold truncate uppercase text-white">{film.title || film.original_title}</p>
                <p className="text-[8px] text-gray-500">{(film.release_date || '').split('-')[0]}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <Film className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No filmography available</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailsPage: React.FC<DetailsPageProps> = ({ movie, onBack, onGoBack, onPlay, isInWatchlist, userRating, onRate, currentUser, onAddToWatchlist, onRemoveFromWatchlist, onMovieClick, watchedMovies = [] }) => {
  const isWatched = isInWatchlist?.(movie.id) || false;
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [showCopied, setShowCopied] = useState(false);
  const [selectedCast, setSelectedCast] = useState<CastMember | null>(null);

useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const type = movie.duration === 'Series' ? 'tv' : 'movie';
        const res = await fetch(`${TMDB_BASE_URL}/${type}/${movie.id}/similar?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await res.json();
        setSimilarMovies(data.results?.slice(0, 6) || []);
      } catch (err) {
        console.error('Error fetching similar:', err);
      }
    };

    const fetchFullDetails = async () => {
      try {
        const type = movie.duration === 'Series' ? 'tv' : 'movie';
        const [detailRes, creditRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/${type}/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`),
          fetch(`${TMDB_BASE_URL}/${type}/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`)
        ]);

        const detailData = await detailRes.json();
        const creditData = await creditRes.json();

        setDetails({
          budget: detailData.budget || 0,
          revenue: detailData.revenue || 0,
          runtime: detailData.runtime || (detailData.episode_run_time ? detailData.episode_run_time[0] : 0),
          cast: creditData.cast?.slice(0, 10) || [],
          status: detailData.status || 'Released',
          genres: detailData.genres || []
        });

        getAiVerdict(movie.title, movie.description);
      } catch (err) {
        console.error("Error fetching extended details:", err);
      }
    };

    fetchSimilar();
    fetchFullDetails();
  }, [movie]);

  const shareMovie = async () => {
    const url = `${window.location.origin}?movie=${movie.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: movie.title, text: `Check out ${movie.title} on CineBlaze!`, url });
      } catch {
        navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  useEffect(() => {
    const fetchOmdbData = async () => {
      if (!movie.id.startsWith('tt')) return;
      try {
        const data = await fetchOMDBData(movie.id);
        setOmdbData(data);
      } catch (err) {
        console.error('OMDB fetch error:', err);
      }
    };
    fetchOmdbData();
  }, [movie.id]);

  const [details, setDetails] = useState<MovieDetailsExtended | null>(null);
  const [omdbData, setOmdbData] = useState<OMDBMovie | null>(null);
  const [aiVerdict, setAiVerdict] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        const type = movie.duration === 'Series' ? 'tv' : 'movie';
        const [detailRes, creditRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/${type}/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`),
          fetch(`${TMDB_BASE_URL}/${type}/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`)
        ]);

        const detailData = await detailRes.json();
        const creditData = await creditRes.json();

        const director = creditData.crew?.find((c: any) => c.job === 'Director' || c.job === 'Executive Producer')?.name || 'Unknown';
        const producers = creditData.crew?.filter((c: any) => c.job === 'Producer').slice(0, 2).map((p: any) => p.name) || [];
        
        setDetails({
          director,
          producers,
          budget: detailData.budget || 0,
          revenue: detailData.revenue || 0,
          runtime: detailData.runtime || (detailData.episode_run_time ? detailData.episode_run_time[0] : 0),
          cast: creditData.cast?.slice(0, 10) || [],
          status: detailData.status || 'Released',
          genres: detailData.genres || []
        });

        getAiVerdict(movie.title, movie.description);
      } catch (error) {
        console.error("Error fetching extended details:", error);
      }
    };

    fetchFullDetails();
  }, [movie]);

  useEffect(() => {
    const fetchOmdbData = async () => {
      if (!movie.id.startsWith('tt')) return;
      try {
        const data = await fetchOMDBData(movie.id);
        setOmdbData(data);
      } catch (err) {
        console.error('OMDB fetch error:', err);
      }
    };
    fetchOmdbData();
  }, [movie.id]);

  const getAiVerdict = async (_title: string, _overview: string) => {
    setLoadingAi(true);
    setTimeout(() => {
      setAiVerdict("A thrilling cinematic experience that keeps you on the edge of your seat!");
      setLoadingAi(false);
    }, 500);
  };

  const formatCurrency = (val: number) => {
    if (val === 0) return 'Undisclosed';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#030303] animate-in fade-in duration-700">
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${movie.heroImage || movie.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/90 via-transparent to-transparent" />
        
        <div className="absolute top-20 left-4 md:left-8 flex items-center gap-2 z-20">
          <button 
            onClick={onBack}
            className="p-2.5 md:p-3 bg-white/10 hover:bg-blue-600 backdrop-blur-xl rounded-full border border-white/10 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-x-1 transition-transform" />
          </button>
          {onGoBack && (
            <button 
              onClick={onGoBack}
              className="p-2.5 md:p-3 bg-white/5 hover:bg-white/15 backdrop-blur-xl rounded-full border border-white/[0.06] hover:border-white/20 transition-all group"
              title="Go back to previous"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-40 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="relative max-w-xs mx-auto lg:max-w-full">
                <div className="rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-white/10 group">
                  <img src={movie.thumbnail} alt={movie.title} className="w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={() => onPlay(movie)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl shadow-blue-600/50"
                  >
                    <Play fill="white" className="w-6 h-6 text-white ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => onPlay(movie)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Play fill="white" className="w-4 h-4" />
                  Watch Now
                </button>
                <button 
                  onClick={() => isWatched ? onRemoveFromWatchlist?.(movie.id) : onAddToWatchlist?.(movie)}
                  className={`p-4 border rounded-2xl transition-all active:scale-90 ${isWatched ? 'bg-blue-600 border-blue-600' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}
                >
                  {isWatched ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
                <button 
                  onClick={shareMovie}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-90"
                >
                  {showCopied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8 lg:space-y-10">
            <div className="space-y-4 lg:space-y-5">
              <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                <span className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {movie.duration}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-black text-[10px] font-black uppercase rounded-full shadow-lg">
                  <Star className="w-3 h-3 fill-current" />
                  {movie.rating}
                </div>
                <span className="px-3 py-1.5 bg-white/5 text-gray-400 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {details?.status || 'Analyzing...'}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Your Rating:</span>
                  <StarRating rating={userRating || 0} onRate={onRate || (() => {})} size="md" />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter italic leading-[0.85]">
                {movie.title}
              </h1>

              {details?.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {details.genres.slice(0, 4).map((genre) => (
                    <span key={genre.id} className="px-3 py-1.5 bg-white/[0.05] text-gray-300 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {movie.year}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  {details?.runtime ? `${details.runtime} MINS` : '---'}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  EN
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/10 via-blue-600/5 to-transparent border border-blue-500/10 rounded-3xl p-6 lg:p-8">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <BrainCircuit className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">CineBlaze AI Verdict</span>
               </div>
               {loadingAi ? (
                 <div className="h-10 w-full bg-white/5 animate-pulse rounded-lg" />
               ) : (
                 <p className="text-lg md:text-xl font-bold italic tracking-tight text-white/90 leading-relaxed">
                    "{aiVerdict}"
                 </p>
               )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-blue-500" />
                Overview
              </h3>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed font-medium">
                {movie.description}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-white/5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                  <Users className="w-3 h-3" /> Director
                </div>
                <p className="font-bold text-white truncate">{details?.director || 'Loading...'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                   Producer
                </div>
                <p className="font-bold truncate text-white">{details?.producers?.join(', ') || '---'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                  <Wallet className="w-3 h-3" /> Budget
                </div>
                <p className="font-bold uppercase tracking-tighter text-gray-300">
                  {details ? formatCurrency(details.budget) : '---'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                  <TrendingUp className="w-3 h-3" /> Box Office
                </div>
                <p className="font-bold uppercase tracking-tighter text-green-400">
                   {details ? formatCurrency(details.revenue) : (omdbData?.BoxOffice && omdbData.BoxOffice !== 'N/A' ? omdbData.BoxOffice : '---')}
                </p>
              </div>
            </div>

            {omdbData && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-white/5">
                {omdbData.Awards !== 'N/A' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                      <Trophy className="w-3 h-3" /> Awards
                    </div>
                    <p className="font-bold text-amber-400 truncate">{omdbData.Awards}</p>
                  </div>
                )}
                {omdbData.imdbVotes !== 'N/A' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                      <Star className="w-3 h-3" /> IMDb Votes
                    </div>
                    <p className="font-bold text-white">{omdbData.imdbVotes}</p>
                  </div>
                )}
                {omdbData.Rated !== 'N/A' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                      Rated
                    </div>
                    <p className="font-bold text-blue-400">{omdbData.Rated}</p>
                  </div>
                )}
                {omdbData.Language !== 'N/A' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                      <Globe className="w-3 h-3" /> Language
                    </div>
                    <p className="font-bold text-white truncate">{omdbData.Language}</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                <Film className="w-5 h-5 text-blue-500" />
                Top Cast
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {details?.cast.slice(0, 5).map((actor) => (
                  <div 
                    key={actor.id} 
                    onClick={() => setSelectedCast(actor)}
                    className="space-y-3 group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-xl group-hover:border-blue-500/50 transition-all">
                       {actor.profile_path ? (
                         <img 
                          src={`${TMDB_IMAGE_BASE_URL}/w300${actor.profile_path}`} 
                          className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-600 font-black text-2xl">?</div>
                       )}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <ChevronRight className="w-8 h-8 text-white" />
                       </div>
                    </div>
                    <div className="px-1">
                      <p className="text-[11px] font-bold truncate uppercase text-white group-hover:text-blue-400 transition-colors">{actor.name}</p>
                      <p className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mt-0.5 truncate">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedCast && (
              <CastFilmography 
                person={selectedCast} 
                onClose={() => setSelectedCast(null)} 
                onMovieClick={(m) => {
                  setSelectedCast(null);
                  onMovieClick?.(m);
                }} 
              />
            )}

            {similarMovies.length > 0 && (
              <div className="space-y-6 pt-4">
                <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  More Like This
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {similarMovies.map((m: any) => (
                    <div 
                      key={m.id} 
                      onClick={() => onMovieClick?.({ id: m.id.toString(), title: m.title || m.name, description: m.overview || '', thumbnail: m.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${m.poster_path}` : '', heroImage: m.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/w780${m.backdrop_path}` : '', year: (m.release_date || m.first_air_date || '').split('-')[0], rating: (m.vote_average || 0).toFixed(1), duration: m.media_type === 'tv' ? 'Series' : 'Feature', category: 'Similar', tags: [] })}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-white/5 group-hover:border-blue-500/50 transition-all shadow-lg">
                        <img 
                          src={m.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${m.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                          loading="lazy"
                          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all group-hover:scale-110" 
                        />
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[8px] font-bold">
                          {m.vote_average?.toFixed(1)}
                        </div>
                      </div>
                      <p className="text-[9px] font-bold truncate uppercase text-white">{m.title || m.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-8 flex flex-wrap gap-6 border-t border-white/5">
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-500 transition-colors">
                  <Share2 className="w-4 h-4" /> Share
               </button>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-500 transition-colors">
                  <Award className="w-4 h-4" /> Awards
               </button>
            </div>

            <ReviewsSection movieId={movie.id} currentUser={currentUser} />

            {watchedMovies.length > 0 && (
              <div className="pt-8 border-t border-white/5">
                <RecommendationEngine 
                  watchedMovies={watchedMovies} 
                  onMovieClick={(m) => onMovieClick?.(m)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;