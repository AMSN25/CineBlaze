import React, { useState } from 'react';
import { X, Plus, FolderHeart, Film, Check } from 'lucide-react';
import { Movie } from '../types';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: { name: string; movies: Movie[] }[];
  onCreateCollection: (name: string) => void;
  onDeleteCollection: (name: string) => void;
  onAddToCollection: (collectionName: string, movie: Movie) => void;
  onMovieClick: (movie: Movie) => void;
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  collections,
  onCreateCollection,
  onMovieClick
}) => {
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateCollection(newName.trim());
      setNewName('');
      setShowCreate(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#030303] rounded-3xl border border-white/[0.06] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Film className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-black uppercase italic">My Collections</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {showCreate ? (
            <div className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-xl">
              <input 
                type="text"
                placeholder="Collection name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-600"
                autoFocus
              />
              <button 
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowCreate(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center gap-3 p-4 border-2 border-dashed border-white/[0.1] hover:border-blue-500/50 rounded-xl transition-colors group"
            >
              <div className="p-2 bg-white/[0.03] group-hover:bg-blue-600/20 rounded-lg transition-colors">
                <Plus className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-white">Create New Collection</span>
            </button>
          )}

          <div className="mt-6 space-y-3">
            {collections.length === 0 ? (
              <div className="text-center py-12">
                <FolderHeart className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                <p className="text-gray-500">No collections yet</p>
                <p className="text-gray-600 text-[10px] mt-2">Create a collection to organize your movies</p>
              </div>
            ) : (
              collections.map((collection) => (
                <div 
                  key={collection.name}
                  className="p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl transition-colors group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-black uppercase italic">{collection.name}</h4>
                    <span className="text-[10px] text-gray-500">{collection.movies.length} movies</span>
                  </div>
                  
                  {collection.movies.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {collection.movies.slice(0, 6).map((movie) => (
                        <div 
                          key={movie.id}
                          onClick={() => { onMovieClick(movie); onClose(); }}
                          className="flex-shrink-0 cursor-pointer"
                        >
                          <img 
                            src={movie.thumbnail} 
                            alt={movie.title}
                            className="w-16 h-20 object-cover rounded-lg hover:ring-2 hover:ring-blue-500 transition-all"
                          />
                        </div>
                      ))}
                      {collection.movies.length > 6 && (
                        <div className="w-16 h-20 bg-white/[0.05] rounded-lg flex items-center justify-center text-[10px] text-gray-500">
                          +{collection.movies.length - 6}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-600">No movies in this collection</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;