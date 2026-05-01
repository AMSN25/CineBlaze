import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface ReviewsSectionProps {
  movieId: string;
  currentUser?: { id: string; name: string; avatar?: string } | null;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ movieId, currentUser }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`reviews-${movieId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitReview = () => {
    if (!newReview.trim() || !currentUser) return;

    const review: Review = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      content: newReview,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
    setNewReview('');
    setRating(0);
    setShowForm(false);
  };

  const handleLike = (reviewId: string) => {
    setReviews(reviews.map(r => {
      if (r.id === reviewId) {
        const isLiked = r.isLiked;
        return {
          ...r,
          likes: isLiked ? r.likes - 1 : r.likes + 1,
          dislikes: r.isDisliked ? r.dislikes - 1 : r.dislikes,
          isLiked: !isLiked,
          isDisliked: false
        };
      }
      return r;
    }));
  };

  const handleDislike = (reviewId: string) => {
    setReviews(reviews.map(r => {
      if (r.id === reviewId) {
        const isDisliked = r.isDisliked;
        return {
          ...r,
          dislikes: isDisliked ? r.dislikes - 1 : r.dislikes + 1,
          likes: r.isLiked ? r.likes - 1 : r.likes,
          isDisliked: !isDisliked,
          isLiked: false
        };
      }
      return r;
    }));
  };

  const deleteReview = (reviewId: string) => {
    const updated = reviews.filter(r => r.id !== reviewId);
    setReviews(updated);
    localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 pt-8 border-t border-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          User Reviews
          <span className="text-gray-500 text-sm font-medium">({reviews.length})</span>
        </h3>
        
        {currentUser && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Write Review
          </button>
        )}
      </div>

      {showForm && currentUser && (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold text-sm">{currentUser.name}</p>
              <p className="text-[10px] text-gray-500">Writing a review...</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Your Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-125"
                >
                  <Star 
                    className={`w-5 h-5 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none h-32"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmitReview}
              disabled={!newReview.trim() || rating === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Post Review
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewReview('');
                setRating(0);
              }}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!currentUser && (
        <div className="text-center py-8 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
          <p className="text-gray-500 text-sm">Sign in to write a review</p>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={review.userAvatar} 
                  alt={review.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-bold text-sm">{review.userName}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(10)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {currentUser?.id === review.userId && (
                <button 
                  onClick={() => deleteReview(review.id)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {review.content}
            </p>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleLike(review.id)}
                className={`flex items-center gap-1.5 text-xs ${review.isLiked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-400'} transition-colors`}
              >
                <ThumbsUp className="w-4 h-4" />
                {review.likes}
              </button>
              <button 
                onClick={() => handleDislike(review.id)}
                className={`flex items-center gap-1.5 text-xs ${review.isDisliked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'} transition-colors`}
              >
                <ThumbsDown className="w-4 h-4" />
                {review.dislikes}
              </button>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;