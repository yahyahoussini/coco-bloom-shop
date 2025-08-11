import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
}

const StarRating = ({ rating, totalStars = 5, size = 20, className }: StarRatingProps) => {
  return (
    <div className={cn('flex items-center', className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              'stroke-1',
              starValue <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            )}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
