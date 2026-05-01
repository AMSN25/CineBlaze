import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, Flame, Sun, Moon, Command, LogIn, Shuffle } from 'lucide-react';
import { Section, Movie } from '../types';
import SearchBox from './SearchBox';
import LoadingBar from './LoadingBar';

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSection: Section;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  searchResults?: Movie[];
  isSearching?: boolean;
  onMovieClick?: (movie: Movie) => void;
  currentUser?: { id: string; name: string; avatar?: string } | null;
  onOpenAuth?: () => void;
  onShuffleClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  searchQuery, 
  setSearchQuery, 
  activeSection, 
  darkMode, 
  onToggleDarkMode,
  searchResults = [],
  isSearching = false,
  onMovieClick,
  currentUser,
  onOpenAuth,
  onShuffleClick
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchActive(true);
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsSearchActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLinkClick = (_section: Section) => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 w-full z-[80] transition-all duration-500 px-3 sm:px-4 md:px-6 lg:px-12 py-2 sm:py-3 md:py-4 flex items-center justify-between ${
      isScrolled 
        ? 'bg-[#030303]/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/20' 
        : isSearchActive
          ? 'bg-[#030303]/60 backdrop-blur-xl'
          : 'bg-transparent'
    }`}>
      <LoadingBar />
      <div className="flex items-center gap-3 sm:gap-6 md:gap-10">
        <Link to="/" onClick={() => handleLinkClick('home')} className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer active:scale-95 transition-transform">
          <div className="p-1 sm:p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 group-hover:shadow-blue-500/50">
            <Flame className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white fill-current" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic hidden xs:block">CINE<span className="text-blue-500">BLAZE</span></h1>
        </Link>
        
        <ul className="hidden lg:flex items-center gap-5 lg:gap-6 text-[11px] font-bold uppercase tracking-wider">
          {[
            { key: '/', label: 'Home' },
            { key: '/movies', label: 'Movies' },
            { key: '/tv', label: 'TV' },
            { key: '/people', label: 'People' },
            { key: '/awards', label: 'Awards' },
            { key: '/watchlist', label: 'Watchlist' }
          ].map((item) => (
            <li 
              key={item.key}
              className={`cursor-pointer transition-all duration-300 relative group`}
            >
              <Link to={item.key} onClick={() => handleLinkClick(item.key.slice(1) as Section)}>
                {item.label}
              </Link>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                location.pathname === item.key ? 'w-full' : 'w-0 group-hover:w-1/2'
              }`} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        <button onClick={onShuffleClick} className="p-2 sm:p-2.5 hover:bg-white/[0.05] rounded-full transition-colors touch-manipulation" title="Random">
          <Shuffle className="w-5 h-5 text-gray-400 hover:text-blue-400" />
        </button>
        
        <button onClick={onOpenAuth} className="p-2 sm:p-2.5 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors touch-manipulation" title="Login">
          <LogIn className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
        </button>

        <div className="relative">
          <form onSubmit={handleSearchSubmit} className={`relative transition-all duration-500 ${isSearchActive ? 'w-32 sm:w-40 md:w-72 lg:w-96' : 'w-20 sm:w-28 md:w-44'}`}>
            <div className={`flex items-center rounded-full px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-300 ${
              isSearchActive 
                ? 'bg-white/[0.08] shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                : 'bg-white/[0.03] hover:bg-white/[0.08]'
            }`}>
              <Search className={`w-4 h-4 transition-colors ${isSearchActive ? 'text-blue-500' : 'text-gray-500'}`} />
              <input 
                ref={searchInputRef}
                type="text"
                placeholder={isSearchActive ? "Search..." : "..."}
                value={searchQuery}
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => !searchQuery && setIsSearchActive(false)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 2) {
                    onSearch(e.target.value);
                    navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
                  }
                  if (e.target.value.length === 0) {
                    onSearch('');
                    navigate('/');
                  }
                }}
                className="bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-gray-500 ml-1 sm:ml-2 md:ml-3 w-full font-medium tracking-tight"
              />
              {searchQuery && (
                <button 
                  onClick={(e) => { e.preventDefault(); setSearchQuery(''); onSearch(''); setIsSearchActive(false); }}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </div>
          </form>
          
          {isSearchActive && searchQuery.length >= 2 && (
            <SearchBox 
              isOpen={isSearchActive}
              onClose={() => setIsSearchActive(false)}
              results={searchResults}
              isLoading={isSearching}
              query={searchQuery}
              onMovieClick={onMovieClick || (() => {})}
            />
          )}
        </div>

        <div className="hidden sm:flex items-center gap-4 md:gap-6">
          <button className="relative p-2 hover:bg-white/[0.05] rounded-full transition-all group">
            <Bell className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </button>
        </div>

        <button 
          className="lg:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {currentUser ? (
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name}
            className="w-9 h-9 rounded-full shadow-lg shadow-blue-900/30 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 hover:ring-offset-[#030303] transition-all"
            title={currentUser.name}
          />
        ) : (
          <button 
            onClick={onOpenAuth}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-blue-900/30 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 hover:ring-offset-[#030303] transition-all"
          >
            <LogIn className="w-4 h-4" />
          </button>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#030303]/98 border-b border-white/[0.06] p-6 md:p-8 flex flex-col gap-4 md:hidden shadow-2xl backdrop-blur-3xl animate-slide-down">
          {[
            { key: 'home', label: 'Home' },
            { key: 'movies', label: 'Movies' },
            { key: 'tv', label: 'TV' },
            { key: 'people', label: 'People' },
            { key: 'awards', label: 'Awards' },
            { key: 'watchlist', label: 'Watchlist' }
          ].map((item) => (
            <button 
              key={item.key}
              onClick={() => handleLinkClick(item.key as Section)} 
              className={`text-lg font-black uppercase italic text-left py-2 ${
                activeSection === item.key ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button onClick={onToggleDarkMode} className="flex items-center gap-2 text-lg font-black uppercase italic text-left text-gray-400 mt-2 pt-4 border-t border-white/[0.06]">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;