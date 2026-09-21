import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'lime' | 'forest' | 'primary' | 'outline' | 'subtle' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'lime',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
      lime: 'bg-lime text-black font-semibold hover:bg-lime-hover active:bg-[#B8D829]',
      forest: 'bg-forest text-white font-medium hover:bg-[#16271A]',
      primary: 'bg-forest text-white font-medium hover:bg-[#16271A]',
      outline: 'border border-border-hairline bg-transparent text-ink-primary hover:bg-black/5',
      subtle: 'bg-card text-ink-primary hover:bg-card-hover',
      ghost: 'bg-transparent text-ink-primary hover:bg-black/5',
    };

    const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'min-h-[44px] px-3.5 py-2 text-xs rounded-full',
      md: 'min-h-[44px] px-5 py-2.5 text-sm rounded-full',
      lg: 'min-h-[52px] px-6 py-3.5 text-base rounded-full',
      icon: 'w-[44px] h-[44px] min-w-[44px] min-h-[44px] p-0 rounded-full flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'btn-tactile inline-flex items-center justify-center font-sans tracking-tight transition-all duration-quick select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/20',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center space-x-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
