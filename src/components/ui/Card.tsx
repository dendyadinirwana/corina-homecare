import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'surface' | 'outline';
  radius?: 'xl' | '2xl' | '3xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'card',
      radius = '2xl',
      padding = 'md',
      interactive,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = interactive || Boolean(onClick);

    const variantStyles = {
      card: 'bg-card border border-border-subtle',
      surface: 'bg-surface border border-border-subtle',
      outline: 'bg-transparent border border-border-hairline',
    };

    const radiusStyles = {
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
    };

    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4 sm:p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'transition-all duration-quick shadow-ios-card overflow-hidden',
          variantStyles[variant],
          radiusStyles[radius],
          paddingStyles[padding],
          isInteractive && 'cursor-pointer btn-tactile hover:bg-card-hover active:scale-[0.98]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
