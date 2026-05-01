import React, { useState } from 'react';
import { X, Clock, Heart, Star, Settings, LogOut, ChevronRight, Flame } from 'lucide-react';
import { Movie } from '../types';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: Movie[];
  onMovieClick: (movie: Movie) => void;
  onClearHistory: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
  isOpen, 
  onClose, 
  watchlist, 
  onMovieClick,
  onClearHistory
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history' | 'rated'>('watchlist');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#030303] border-l border-white/[0.06] animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-900/30">
                JD
              </div>
              <div>
                <h3 className="font-black text-lg uppercase italic">Guest User</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Member since 2024</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/[0.06]">
            <div className="text-center p-4 bg-white/[0.03] rounded-2xl">
              <p className="text-2xl font-black text-blue-500">{watchlist.length}</p>
              <p className="text-[8px] text-gray-500 uppercase tracking-wider">Watchlist</p>
            </div>
            <div className="text-center p-4 bg-white/[0.03] rounded-2xl">
              <p className="text-2xl font-black text-pink-500">0</p>
              <p className="text-[8px] text-gray-500 uppercase tracking-wider">Watched</p>
            </div>
            <div className="text-center p-4 bg-white/[0.03] rounded-2xl">
              <p className="text-2xl font-black text-yellow-500">0</p>
              <p className="text-[8px] text-gray-500 uppercase tracking-wider">Rated</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            {[
              { key: 'watchlist', label: 'Watchlist', icon: Heart },
              { key: 'history', label: 'History', icon: Clock },
              { key: 'rated', label: 'Rated', icon: Star }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-wider transition-colors ${
                  activeTab === tab.key 
                    ? 'text-blue-500 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'watchlist' && (
              <div className="space-y-3">
                {watchlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Your watchlist is empty</p>
                    <p className="text-gray-600 text-[10px] mt-2">Add movies to keep track of what you want to watch</p>
                  </div>
                ) : (
                  watchlist.map((movie) => (
                    <div 
                      key={movie.id}
                      onClick={() => { onMovieClick(movie); onClose(); }}
                      className="flex items-center gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl cursor-pointer transition-colors group"
                    >
                      <img 
                        src={movie.thumbnail} 
                        alt={movie.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-sm truncate uppercase italic">{movie.title}</h4>
                        <p className="text-[10px] text-gray-500">{movie.year} • {movie.rating}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No watch history yet</p>
                <p className="text-gray-600 text-[10px] mt-2">Movies you watch will appear here</p>
              </div>
            )}

            {activeTab === 'rated' && (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No ratings yet</p>
                <p className="text-gray-600 text-[10px] mt-2">Rate movies to see your ratings here</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-white/[0.06] space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={onClearHistory}
              className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Clear Watchlist</span>
              </div>
            </button>
          </div>

          {/* Footer Logo */}
          <div className="p-6 border-t border-white/[0.06] flex items-center justify-center gap-2">
            <div className="p-1 bg-blue-600 rounded">
              <Flame className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-gray-600">CINEBLAZE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;