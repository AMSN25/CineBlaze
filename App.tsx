import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import CinemaHallOfFame from './components/CinemaHallOfFame';
import Footer from './components/Footer';
import DetailsPage from './components/DetailsPage';
import PersonDetailsPage from './components/PersonDetailsPage';
import UserMenu from './components/UserMenu';
import CollectionModal from './components/CollectionModal';
import LoadingPage from './components/LoadingPage';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import VideoPlayer from './components/VideoPlayer';
import { FETCH_URLS, TMDB_IMAGE_BASE_URL, FALLBACK_MOVIE, TMDB_BASE_URL, TMDB_API_KEY } from './constants';
import { Movie, Category, Section, Person, GENRES } from './types';
import { Flame, Search as SearchIcon } from 'lucide-react';

const App: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewingDetails, setViewingDetails] = useState<Movie | null>(null);
  const [viewingPerson, setViewingPerson] = useState<Person | null>(null);
  const [moviesData, setMoviesData] = useState<{ [key: string]: Movie[] }>({});
  const [peopleData, setPeopleData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('cineblaze-search-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSearching, setIsSearching] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [watchHistory, setWatchHistory] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [collections, setCollections] = useState<{ name: string; movies: Movie[] }[]>([]);
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(20);
  const [showAll, setShowAll] = useState(false);
  const [hallOfFameIndex, setHallOfFameIndex] = useState(0);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [darkMode, setDarkMode] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; type: any; message: string; title?: string }[]>([]);
  const [userRatings, setUserRatings] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('cineblaze-ratings');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(() => {
    const saved = localStorage.getItem('cineblaze-current-user');
    return saved ? JSON.parse(saved) : null;
  });

  const addToast = (type: any, message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message, title }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const rateMovie = (movieId: string, rating: number) => {
    setUserRatings(prev => ({ ...prev, [movieId]: rating }));
    localStorage.setItem('cineblaze-ratings', JSON.stringify({ ...userRatings, [movieId]: rating }));
    addToast('rating', `Rated ${rating} stars`, 'Rating Saved');
  };

  useEffect(() => {
    localStorage.setItem('cineblaze-darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  const getFilteredAndSorted = useCallback((items: Movie[]): Movie[] => {
    let filtered = [...items];
    if (filterGenre !== 'all') {
      const genreId = parseInt(filterGenre);
      filtered = filtered.filter(m => {
        const genres = m.category?.toLowerCase() || '';
        const genre = GENRES.find(g => g.id === genreId);
        return genre ? genres.includes(genre.name.toLowerCase()) : true;
      });
    }
    if (filterYear !== 'all') {
      filtered = filtered.filter(m => m.year.startsWith(filterYear));
    }
    if (filterRating !== 'all') {
      const minRating = parseFloat(filterRating);
      filtered = filtered.filter(m => parseFloat(m.rating) >= minRating);
    }
    if (sortBy === 'rating') {
      filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === 'year') {
      filtered.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    return filtered;
  }, [filterYear, filterRating, sortBy, filterGenre]);

  useEffect(() => {
    localStorage.setItem('cineblaze-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cineblaze-watch-history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem('cineblaze-collections', JSON.stringify(collections));
  }, [collections]);

  const addToCollection = (collectionName: string, movie: Movie) => {
    setCollections(collections.map(c => 
      c.name === collectionName && !c.movies.find(m => m.id === movie.id)
        ? { ...c, movies: [...c.movies, movie] }
        : c
    ));
    addToast('collection', `Added to ${collectionName}`, movie.title);
  };

  const addToWatchlist = (movie: Movie) => {
    if (!watchlist.find(m => m.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
      addToast('watchlist', `Added to watchlist`, movie.title);
    }
  };

  const removeFromWatchlist = (movieId: string) => {
    const movie = watchlist.find(m => m.id === movieId);
    setWatchlist(watchlist.filter(m => m.id !== movieId));
    if (movie) addToast('success', `Removed from watchlist`, movie.title);
  };

  const isInWatchlist = (movieId: string) => watchlist.some(m => m.id === movieId);

  const mapTMDBToMovie = useCallback((item: any, category: string): Movie => {
    const baseRating = item.vote_average || 0;
    const voteCount = item.vote_count || 0;
    return {
      id: item.id.toString(),
      title: item.title || item.name || item.original_name || 'Untitled',
      description: item.overview || 'No description available.',
      thumbnail: item.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${item.poster_path}` : FALLBACK_MOVIE.thumbnail,
      heroImage: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${item.backdrop_path}` : FALLBACK_MOVIE.heroImage,
      year: (item.release_date || item.first_air_date || '').split('-')[0] || '2024',
      rating: baseRating.toFixed(1),
      duration: item.media_type === 'tv' || item.first_air_date ? 'Series' : 'Feature',
      category: category,
      tags: voteCount > 0 ? [`${(voteCount / 1000).toFixed(1)}k Votes`] : []
    };
  }, []);

  const fetchSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setViewingDetails(null);
    setViewingPerson(null);
    setActiveSection('home');
    
    const history = searchHistory.filter(h => h.toLowerCase() !== query.toLowerCase());
    const newHistory = [query, ...history].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('cineblaze-search-history', JSON.stringify(newHistory));
    
    try {
      const response = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
      const data = await response.json();
      setSearchResults(data.results.map((item: any) => mapTMDBToMovie(item, 'Search')));
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  useEffect(() => {
    const fetchWithRetry = async (url: string, retries = 2): Promise<any> => {
      const fallbackUrl = url.replace('api.themoviedb.org/3', 'imdb.iamidiotareyoutoo.com');
      
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            // Try fallback API on TMDB failure
            if (i === 0 && url.includes('themoviedb.org')) {
              const fallbackResponse = await fetch(fallbackUrl);
              if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                return fallbackData;
              }
            }
            throw new Error(`HTTP ${response.status}`);
          }
          const data = await response.json();
          if (data.results) return data;
          return data;
        } catch (err) {
          if (i === retries - 1) throw err;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    };

    const fetchAllData = async () => {
      setError(null);
      setLoading(true);
      try {
        const fetchRequests = Object.entries(FETCH_URLS).map(async ([key, url]) => {
          try {
            const data = await fetchWithRetry(url);
            if (key === 'popularPeople') {
              return { key, people: data.results || [] };
            }
            return { key, movies: (data.results || []).map((item: any) => mapTMDBToMovie(item, key)) };
          } catch (err) {
            console.error(`Failed to fetch ${key}:`, err);
            return { key, movies: [], people: [] };
          }
        });

        const results = await Promise.allSettled(fetchRequests);
        const newData: { [key: string]: Movie[] } = {};
        
        results.forEach((res) => {
          if (res.status === 'fulfilled' && 'movies' in res.value) {
            newData[res.value.key] = res.value.movies;
          }
          if (res.status === 'fulfilled' && 'people' in res.value) {
            setPeopleData(res.value.people.map((p: any) => ({
              id: p.id.toString(),
              name: p.name,
              known_for_department: p.known_for_department,
              profile_path: p.profile_path,
              known_for: p.known_for?.map((m: any) => m.title || m.name).join(', ') || 'Various'
            })));
          }
        });

        if (Object.keys(newData).length === 0 || !newData.trending?.length) {
          setMoviesData({ trending: [FALLBACK_MOVIE] });
        } else {
          setMoviesData(newData);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setMoviesData({ trending: [FALLBACK_MOVIE] });
        setLoading(false);
      }
    };
    fetchAllData();
}, [mapTMDBToMovie]);

  useEffect(() => {
    if (params.id && !viewingDetails && !detailsLoading) {
      setDetailsLoading(true);
      const isTv = window.location.pathname.includes('/tv/');
      const endpoint = isTv ? 'tv' : 'movie';
      fetch(`${TMDB_BASE_URL}/${endpoint}/${params.id}?api_key=${TMDB_API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            const movie: Movie = {
              id: data.id.toString(),
              title: data.title || data.name || 'Untitled',
              description: data.overview || 'No description available.',
              thumbnail: data.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${data.poster_path}` : FALLBACK_MOVIE.thumbnail,
              heroImage: data.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${data.backdrop_path}` : FALLBACK_MOVIE.heroImage,
              year: (data.release_date || data.first_air_date || '').split('-')[0] || '2024',
              rating: (data.vote_average || 0).toFixed(1),
              duration: isTv ? 'Series' : 'Feature',
              category: isTv ? 'TV Series' : 'Movie',
              tags: data.genres?.map((g: any) => g.name) || []
            };
            setViewingDetails(movie);
          }
        })
        .catch(err => console.error('Error fetching movie details:', err))
        .finally(() => setDetailsLoading(false));
    }
  }, [params.id]);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      setIsSearching(true);
      setViewingDetails(null);
      setViewingPerson(null);
      setActiveSection('home');
      
      // Call the search API
      const doSearch = async () => {
        try {
          const response = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
          const data = await response.json();
          setSearchResults(data.results.map((item: any) => mapTMDBToMovie(item, 'Search')));
        } catch (err) {
          console.error('Search error:', err);
        }
      };
      if (query !== searchQuery) {
        doSearch();
      }
    }
  }, [query]);

  useEffect(() => {
    if (!moviesData.topRated?.length || moviesData.topRated.length < 2) return;
    const interval = setInterval(() => {
      setHallOfFameIndex(prev => (prev + 1) % moviesData.topRated.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [moviesData.topRated]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewingDetails || viewingPerson) {
        if (e.key === 'Escape') {
          navigate(-1);
        }
      }
      if (e.key === '/' && !viewingDetails && !viewingPerson) {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('#search-input')?.focus();
      }
      if (e.key === 'w' && !viewingDetails && !viewingPerson && e.shiftKey) {
        e.preventDefault();
        setShowUserMenu(true);
      }
      if (e.key === 'f' && e.shiftKey && !viewingDetails && !viewingPerson) {
        e.preventDefault();
        setShowUserMenu(true);
      }
      if (e.key === 'h' && !viewingDetails && !viewingPerson) {
        e.preventDefault();
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingDetails, viewingPerson, navigate]);

const handleOpenDetails = (movie: Movie) => {
    setViewingDetails(movie);
    setViewingPerson(null);
    setIsSearching(false);
    navigate(`/movie/${movie.id}/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`);
    setWatchHistory(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      return [movie, ...filtered].slice(0, 20);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchNow = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsPlaying(true);
  };

  const handleOpenPerson = (person: Person) => {
    setViewingPerson(person);
    setViewingDetails(null);
    setIsSearching(false);
    navigate(`/person/${person.id}/${person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setViewingDetails(null);
    setViewingPerson(null);
    clearSearch();
  };

  const handleShuffleClick = () => {
    const allMovies = [
      ...(moviesData.trending || []),
      ...(moviesData.topRated || []),
      ...(moviesData.allMovies || []),
      ...(moviesData.originals || []),
      ...(moviesData.actionMovies || []),
      ...(moviesData.comedyMovies || []),
    ];
    if (allMovies.length > 0) {
      const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];
      handleOpenDetails(randomMovie);
      addToast('shuffle', `Discovering: ${randomMovie.title}`, 'Random Pick');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewingDetails || viewingPerson || isSearching) return;
      const sections: Section[] = ['home', 'movies', 'tv', 'people', 'awards', 'watchlist'];
      const currentIndex = sections.indexOf(activeSection);
      if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
        handleSectionChange(sections[currentIndex + 1]);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handleSectionChange(sections[currentIndex - 1]);
      } else if (e.key === 'Escape') {
        handleSectionChange('home');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingDetails, viewingPerson, isSearching, activeSection]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar 
          onSearch={fetchSearch} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          activeSection={activeSection} 
          darkMode={darkMode} 
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onShuffleClick={handleShuffleClick}
        />
        <LoadingPage />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#030303] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center px-8">
          <div className="p-4 bg-red-600/20 rounded-full">
            <Flame className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase italic">Oops!</h1>
          <p className="text-gray-400 max-w-md">{error}</p>
          <button onClick={() => { setLoading(true); setError(null); }} className="mt-4 px-8 py-3 bg-blue-600 rounded-full font-black uppercase text-xs">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderSectionGrid = (title: string, items: any[], type: 'movie' | 'person' = 'movie') => {
    const displayItems = type === 'movie' ? getFilteredAndSorted(items) : items;
    const visibleItems = showAll ? displayItems : displayItems.slice(0, visibleCount);
    
    const handleScroll = () => {
      if (visibleCount < displayItems.length) {
        setVisibleCount(prev => Math.min(prev + 20, displayItems.length));
      }
    };
    
    return (
      <div className="pt-32 px-4 xs:px-6 lg:px-12 min-h-screen">
        <div className="mb-8 lg:mb-12 border-b border-white/5 pb-8">
          <h2 className="text-3xl xs:text-4xl md:text-6xl font-black uppercase tracking-tighter italic">{title}</h2>
          <p className="text-gray-500 text-[10px] font-black mt-4">Records: <span className="text-blue-500">{displayItems.length}</span></p>
        </div>
        {type === 'movie' && (
          <div className="flex flex-wrap gap-3 mb-8">
            <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
              <option value="all">All Genres</option>
              {GENRES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
              <option value="all">All Ratings</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
              <option value="popularity">Popular</option>
              <option value="rating">Top Rated</option>
              <option value="year">Newest</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        )}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 xs:gap-8">
          {visibleItems.map((item) => (
            <div key={item.id} onClick={() => type === 'movie' ? handleOpenDetails(item) : handleOpenPerson(item)} className="relative group cursor-pointer transition-transform hover:scale-105">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-blue-500/50 transition-all shadow-xl">
                <img src={type === 'movie' ? item.thumbnail : (item.profile_path ? `${TMDB_IMAGE_BASE_URL}/w500${item.profile_path}` : 'https://via.placeholder.com/500x750')} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="p-4 bg-blue-600 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform">
                    <SearchIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-black truncate uppercase italic">{type === 'movie' ? item.title : item.name}</h3>
              <p className="text-[10px] text-gray-500 mt-1">{type === 'movie' ? `${item.year} • ${item.rating}` : item.known_for_department}</p>
            </div>
          ))}
        </div>
        {displayItems.length > visibleCount && (
          <div className="flex justify-center mt-12">
            <button onClick={handleScroll} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase tracking-widest text-xs transition-all">
              Load More ({displayItems.length - visibleCount} remaining)
            </button>
          </div>
        )}
        {showAll && displayItems.length > 20 && (
          <div className="flex justify-center mt-12">
            <button onClick={() => { setVisibleCount(20); setShowAll(false); }} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-black uppercase tracking-widest text-xs transition-all">
              Show Less
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen overflow-hidden transition-colors ${darkMode ? 'dark bg-[#030303] text-white' : 'bg-gray-100 text-gray-900'}`} style={{ minHeight: '100vh', display: 'block' }}>
      <Navbar 
        onSearch={fetchSearch} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        activeSection={activeSection} 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        searchResults={searchResults}
        isSearching={isSearching}
        onMovieClick={handleOpenDetails}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onShuffleClick={handleShuffleClick}
      />
      <main className="relative pb-24">
        <Routes>
          <Route path="/movie/:id/:slug" element={
            viewingDetails ? (
              <DetailsPage 
                movie={viewingDetails} 
                onBack={() => navigate(-1)} 
                onGoBack={handleGoBack} 
                onPlay={handleWatchNow} 
                isInWatchlist={isInWatchlist} 
                userRating={userRatings[viewingDetails.id]} 
                onRate={(rating) => rateMovie(viewingDetails.id, rating)} 
                currentUser={currentUser} 
                onAddToWatchlist={addToWatchlist} 
                onRemoveFromWatchlist={removeFromWatchlist} 
                onMovieClick={handleOpenDetails} 
                watchedMovies={watchHistory} 
              />
            ) : detailsLoading ? (
              <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 border-4 border-blue-600/30 rounded-full relative">
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-blue-500 font-black uppercase tracking-widest text-sm">Loading...</p>
                </div>
              </div>
            ) : null
          } />
          <Route path="/person/:id/:slug" element={
            viewingPerson ? (
              <PersonDetailsPage person={viewingPerson} onBack={() => setViewingPerson(null)} onMovieClick={handleOpenDetails} />
            ) : null
          } />
          <Route path="/search" element={isSearching ? renderSectionGrid(`Search: ${searchQuery}`, searchResults) : null} />
          <Route path="/movies" element={renderSectionGrid('All Movies', moviesData.allMovies || [])} />
          <Route path="/tv" element={renderSectionGrid('TV Series', moviesData.allTV || [])} />
          <Route path="/people" element={renderSectionGrid('Popular Talent', peopleData, 'person')} />
          <Route path="/awards" element={renderSectionGrid('Hall of Fame', moviesData.topRated || [])} />
          <Route path="/watchlist" element={renderSectionGrid('My Watchlist', watchlist)} />
          <Route path="/" element={
            <>
              <Hero movie={moviesData.trending?.[Math.floor(Math.random() * moviesData.trending?.length)] || moviesData.trending?.[0] || FALLBACK_MOVIE} onPlay={handleOpenDetails} />
              <div className="h-8 md:h-12" />
              <div className="relative z-10 space-y-16 md:space-y-20">
                {watchHistory.length > 0 && (
                  <MovieRow title="Continue Watching" movies={watchHistory.slice(0, 10)} onPlay={handleOpenDetails} />
                )}
                {moviesData.trending && <MovieRow title={Category.TRENDING} movies={moviesData.trending} onPlay={handleOpenDetails} />}
                {moviesData.originals && <MovieRow title={Category.ORIGINALS} movies={moviesData.originals} onPlay={handleOpenDetails} />}
                <div className="px-6 lg:px-12 py-16 md:py-24">
                  <CinemaHallOfFame movie={moviesData.topRated?.[Math.floor(Math.random() * moviesData.topRated?.length)] || moviesData.topRated?.[0] || FALLBACK_MOVIE} />
                </div>
                {moviesData.upcomingMovies && <MovieRow title={Category.UPCOMING} movies={moviesData.upcomingMovies} onPlay={handleOpenDetails} />}
                {moviesData.actionMovies && <MovieRow title={Category.ACTION} movies={moviesData.actionMovies} onPlay={handleOpenDetails} />}
                {moviesData.comedyMovies && <MovieRow title={Category.COMEDY} movies={moviesData.comedyMovies} onPlay={handleOpenDetails} />}
                {moviesData.horrorMovies && <MovieRow title={Category.HORROR} movies={moviesData.horrorMovies} onPlay={handleOpenDetails} />}
                {moviesData.animatedMovies && <MovieRow title={Category.ANIMATED} movies={moviesData.animatedMovies} onPlay={handleOpenDetails} />}
                {moviesData.documentaryMovies && <MovieRow title={Category.DOCUMENTARY} movies={moviesData.documentaryMovies} onPlay={handleOpenDetails} />}
              </div>
            </>
          } />
        </Routes>
      </main>
      <Footer darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      {isPlaying && selectedMovie && (
        <VideoPlayer movie={selectedMovie} onClose={() => setIsPlaying(false)} />
      )}
      <UserMenu 
        isOpen={showUserMenu} 
        onClose={() => setShowUserMenu(false)} 
        watchlist={watchlist}
        onMovieClick={handleOpenDetails}
        onClearHistory={() => { setWatchlist([]); addToast('success', 'Watchlist cleared'); }}
      />
      <CollectionModal 
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        collections={collections}
        onCreateCollection={(name) => { setCollections([...collections, { name, movies: [] }]); addToast('collection', 'Collection created', name); }}
        onDeleteCollection={(name) => { setCollections(collections.filter(c => c.name !== name)); addToast('success', 'Collection deleted'); }}
        onAddToCollection={addToCollection}
        onMovieClick={handleOpenDetails}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={(user) => {
          setCurrentUser(user);
          addToast('success', `Welcome, ${user.name}!`);
        }} 
      />
    </div>
  );
};

const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;