import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onChange,
  interactive = false,
  size = 'md',
  showValue = false,
  className,
  'data-testid': testId = 'star-rating',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const isInteractive = interactive || Boolean(onChange);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleStarClick = (value: number) => {
    if (isInteractive && onChange) {
      onChange(value);
    }
  };

  return (
    <div
      data-testid={testId}
      className={cn('inline-flex items-center gap-1 select-none', className)}
      role={isInteractive ? 'radiogroup' : 'img'}
      aria-label={`Rating: ${rating} dari ${maxRating}`}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = displayRating >= starValue;
        const isPartiallyFilled = !isFilled && displayRating > index && displayRating < starValue;
        const fillPercentage = isPartiallyFilled ? Math.round((displayRating - index) * 100) : 0;

        if (isInteractive) {
          return (
            <button
              key={starValue}
              type="button"
              data-testid={`star-${starValue}`}
              role="radio"
              aria-checked={rating === starValue}
              aria-label={`${starValue} dari ${maxRating} bintang`}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(null)}
              className={cn(
                'min-w-[44px] min-h-[44px] flex items-center justify-center p-0 rounded-full transition-transform duration-quick ease-bounce cursor-pointer btn-tactile',
                'hover:scale-125 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/20'
              )}
            >
              <Star
                className={cn(
                  starSizes[size],
                  'transition-colors duration-quick',
                  isFilled
                    ? 'fill-[#FFB800] text-[#FFB800]'
                    : 'fill-transparent text-[#D1D1D6]'
                )}
                strokeWidth={1.75}
              />
            </button>
          );
        }

        return (
          <div
            key={starValue}
            data-testid={`star-${starValue}`}
            className="relative inline-flex items-center justify-center"
            aria-hidden="true"
          >
            {isPartiallyFilled ? (
              <div className="relative">
                {/* Background empty star */}
                <Star
                  className={cn(starSizes[size], 'fill-transparent text-[#D1D1D6]')}
                  strokeWidth={1.75}
                />
                {/* Clipped filled star overlay */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star
                    className={cn(starSizes[size], 'fill-[#FFB800] text-[#FFB800]')}
                    strokeWidth={1.75}
                  />
                </div>
              </div>
            ) : (
              <Star
                className={cn(
                  starSizes[size],
                  isFilled
                    ? 'fill-[#FFB800] text-[#FFB800]'
                    : 'fill-transparent text-[#D1D1D6]'
                )}
                strokeWidth={1.75}
              />
            )}
          </div>
        );
      })}

      {showValue && (
        <span
          data-testid="star-rating-value"
          className="ml-1.5 text-sm font-semibold text-ink-primary"
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
