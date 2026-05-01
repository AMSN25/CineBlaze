import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { star: 'w-3 h-3', container: 'gap-1' },
  md: { star: 'w-4 h-4', container: 'gap-1.5' },
  lg: { star: 'w-6 h-6', container: 'gap-2' }
};

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, size = 'sm' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={`flex items-center ${sizes[size].container}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-125 active:scale-90"
        >
          <Star
            className={`${sizes[size].star} transition-all ${
              star <= (hoverRating || rating)
                ? 'fill-yellow-500 text-yellow-500'
                : 'fill-transparent text-gray-600 hover:text-yellow-400'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;