import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { TMDB_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_BASE_URL } from '../constants';

interface RecommendationEngineProps {
  watchedMovies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  heroImage?: string;
  year: string;
  rating: string;
  duration: string;
  category: string;
  tags: string[];
  reason: string;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ watchedMovies, onMovieClick }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (watchedMovies.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const genres = new Set<string>();
      watchedMovies.forEach(movie => {
        if (movie.tags[0]?.includes('k')) {
          genres.add('28');
        }
        if (movie.tags[0]?.includes('votes')) {
          genres.add('35');
        }
      });

      const recommendations: Recommendation[] = [];
      const processed = new Set<string>();

      try {
        for (let i = 0; i < Math.min(3, watchedMovies.length); i++) {
          const movie = watchedMovies[i];
          if (processed.has(movie.id)) continue;
          
          try {
            const res = await fetch(
              `${TMDB_BASE_URL}/movie/${movie.id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US`
            );
            const data = await res.json();
            
            data.results?.slice(0, 2).forEach((rec: any) => {
              if (!processed.has(rec.id.toString()) && recommendations.length < 6) {
                processed.add(rec.id.toString());
                recommendations.push({
                  id: rec.id.toString(),
                  title: rec.title || rec.name,
                  description: rec.overview || '',
                  thumbnail: rec.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${rec.poster_path}` : '',
                  heroImage: rec.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/w780${rec.backdrop_path}` : '',
                  year: (rec.release_date || rec.first_air_date || '').split('-')[0],
                  rating: (rec.vote_average || 0).toFixed(1),
                  duration: rec.media_type === 'tv' ? 'Series' : 'Feature',
                  category: 'Recommended',
                  tags: [],
                  reason: `Because you watched ${movie.title}`
                });
              }
            });
          } catch (e) {
            console.error('Error fetching recommendations:', e);
          }
        }

        if (recommendations.length === 0) {
          const res = await fetch(
            `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`
          );
          const data = await res.json();
          
          data.results?.slice(0, 6).forEach((rec: any) => {
            recommendations.push({
              id: rec.id.toString(),
              title: rec.title || rec.name,
              description: rec.overview || '',
              thumbnail: rec.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${rec.poster_path}` : '',
              heroImage: rec.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/w780${rec.backdrop_path}` : '',
              year: (rec.release_date || '').split('-')[0],
              rating: (rec.vote_average || 0).toFixed(1),
              duration: 'Feature',
              category: 'Recommended',
              tags: [],
              reason: 'Popular on CineBlaze'
            });
          });
        }
      } catch (e) {
        console.error('Error:', e);
      }

      setRecommendations(recommendations);
      setLoading(false);
    };

    fetchRecommendations();
  }, [watchedMovies]);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (watchedMovies.length === 0) {
    return (
      <div className="py-12 text-center">
        <Sparkles className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-500">Watch more movies to get personalized recommendations</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          Recommended For You
        </h3>
        <button onClick={() => navigate('/search?q=recommended')} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-blue-400 flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recommendations.slice(0, 6).map((rec) => (
          <div key={rec.id} className="group cursor-pointer" onClick={() => onMovieClick(rec)}>
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-white/5 group-hover:border-blue-500/50 transition-all shadow-lg">
              <img 
                src={rec.thumbnail} 
                alt={rec.title}
                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-bold truncate uppercase text-white">{rec.title}</p>
            <p className="text-[8px] text-gray-500 truncate">{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationEngine;