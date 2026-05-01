
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, User, Film, BrainCircuit, TrendingUp, Award, Share2 } from 'lucide-react';
import { Person, Movie } from '../types';
import { TMDB_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_BASE_URL } from '../constants';


interface PersonDetailsPageProps {
  person: Person;
  onBack: () => void;
  onMovieClick: (movie: Movie) => void;
}

interface PersonExtended {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  profile_path: string | null;
  popularity: number;
  also_known_as: string[];
  credits: Movie[];
}

const PersonDetailsPage: React.FC<PersonDetailsPageProps> = ({ person, onBack, onMovieClick }) => {
  const [details, setDetails] = useState<PersonExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchPersonData = async () => {
      setLoading(true);
      try {
        const [bioRes, creditsRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/person/${person.id}?api_key=${TMDB_API_KEY}&language=en-US`),
          fetch(`${TMDB_BASE_URL}/person/${person.id}/combined_credits?api_key=${TMDB_API_KEY}&language=en-US`)
        ]);

        const bioData = await bioRes.json();
        const creditsData = await creditsRes.json();

        const topCredits = creditsData.cast
          .sort((a: any, b: any) => b.popularity - a.popularity)
          .slice(0, 12)
          .map((item: any) => ({
            id: item.id.toString(),
            title: item.title || item.name || 'Untitled',
            description: item.overview || '',
            thumbnail: item.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${item.poster_path}` : '',
            heroImage: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${item.backdrop_path}` : '',
            year: (item.release_date || item.first_air_date || '').split('-')[0] || '----',
            rating: (item.vote_average || 0).toFixed(1),
            duration: item.media_type === 'tv' ? 'Series' : 'Feature',
            category: 'Credit',
            tags: [item.character || 'Cast']
          }));

        setDetails({
          biography: bioData.biography || 'No biographical data available in the CineBlaze master records.',
          birthday: bioData.birthday,
          deathday: bioData.deathday,
          place_of_birth: bioData.place_of_birth,
          known_for_department: bioData.known_for_department,
          profile_path: bioData.profile_path,
          popularity: bioData.popularity,
          also_known_as: bioData.also_known_as || [],
          credits: topCredits
        });

        // Trigger AI analysis
        getAiTalentInsight(person.name, bioData.biography || '');
      } catch (error) {
        console.error("Error fetching person details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [person]);

  const getAiTalentInsight = async (name: string, _bio: string) => {
    setLoadingAi(true);
    setTimeout(() => {
      setAiInsight(`${name} is a talented performer who has made significant contributions to the entertainment industry.`);
      setLoadingAi(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 animate-pulse">Synchronizing Talent Records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] animate-in fade-in duration-700">
      {/* Dynamic Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-blue-900/10 blur-[180px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24 relative z-10">
        <button 
          onClick={onBack}
          className="mb-16 flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all group shadow-2xl"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          Exit Talent Database
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          {/* Left Column: Fixed Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="relative group">
              <div className="rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/10 transition-all duration-700 group-hover:border-blue-500/30">
                <img 
                  src={details?.profile_path ? `${TMDB_IMAGE_BASE_URL}/h632${details.profile_path}` : 'https://via.placeholder.com/632x948?text=No+Photo'} 
                  alt={person.name} 
                  className="w-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-600 p-6 rounded-[2rem] shadow-2xl border border-white/20 transform rotate-6 group-hover:rotate-0 transition-transform">
                 <TrendingUp className="w-8 h-8 text-white" />
                 <p className="text-[9px] font-black uppercase tracking-widest text-white/70 mt-2">Database Rank</p>
                 <p className="text-xl font-black text-white italic">#{Math.floor(details?.popularity || 0)}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Award className="w-4 h-4 text-blue-500" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Personal Dossier</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Field of Expertise</p>
                  <p className="text-sm font-black text-blue-400 uppercase italic">{details?.known_for_department}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Date of Birth</p>
                  <p className="text-sm font-bold">{details?.birthday ? new Date(details.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Global HQ (Birthplace)</p>
                  <p className="text-sm font-bold leading-tight">{details?.place_of_birth || 'Global Database'}</p>
                </div>

                {details?.also_known_as && details.also_known_as.length > 0 && (
                  <div className="space-y-1.5 pt-4 border-t border-white/5">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Alias / Records</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {details.also_known_as.slice(0, 3).map((name, i) => (
                        <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 font-medium">{name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Main Analysis Content */}
          <div className="lg:col-span-8 space-y-20">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-blue-600"></div>
                <span className="text-blue-500 font-black tracking-[0.6em] text-[11px] uppercase">Talent ID: {person.id}</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.85]">{person.name}</h1>
            </div>

            {/* AI Career Analysis Segment */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[3rem] p-10 md:p-14 space-y-6 group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BrainCircuit className="w-32 h-32 text-blue-500" />
               </div>
               <div className="flex items-center gap-3">
                  <BrainCircuit className="w-6 h-6 text-blue-500" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">CineBlaze AI Talent Insight</span>
               </div>
               {loadingAi ? (
                 <div className="space-y-3">
                    <div className="h-6 w-full bg-blue-500/10 animate-pulse rounded-lg" />
                    <div className="h-6 w-4/5 bg-blue-500/10 animate-pulse rounded-lg" />
                 </div>
               ) : (
                 <p className="text-2xl md:text-4xl font-black italic tracking-tight text-white/95 leading-[1.1] relative z-10">
                    "{aiInsight}"
                 </p>
               )}
            </div>

            <div className="space-y-10">
              <div className="flex items-center gap-4">
                 <User className="w-6 h-6 text-blue-500" />
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter">Biography</h3>
              </div>
              <div className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium space-y-8 border-l-2 border-white/5 pl-8 italic">
                {details?.biography.split('\n\n').map((para, i) => (
                  <p key={i} className="last:text-gray-500">{para}</p>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-white/10 pb-8">
                <div className="flex items-center gap-4">
                  <Film className="w-6 h-6 text-blue-500" />
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">Known For</h3>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Top Rated Credits</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {details?.credits.map((movie) => (
                  <div 
                    key={movie.id} 
                    onClick={() => onMovieClick(movie)}
                    className="group cursor-pointer space-y-5"
                  >
                    <div className="aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-blue-500/50 transition-all duration-500 shadow-xl group-hover:shadow-blue-600/20 relative">
                      <img 
                        src={movie.thumbnail || 'https://via.placeholder.com/500x750?text=No+Poster'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0" 
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                         <div className="flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                            <span className="text-[10px] font-black">{movie.rating}</span>
                         </div>
                      </div>
                    </div>
                    <div className="px-1">
                      <h4 className="text-sm font-black uppercase truncate italic leading-tight group-hover:text-blue-500 transition-colors">{movie.title}</h4>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1.5">{movie.year} • {movie.tags[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-20 flex flex-wrap gap-10 border-t border-white/10">
               <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-500 transition-all group">
                  <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Export Record
               </button>
               <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-500 transition-all group">
                  <Award className="w-5 h-5 group-hover:scale-110 transition-transform" /> Full Award History
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailsPage;
