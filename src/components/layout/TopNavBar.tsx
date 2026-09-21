import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TopNavBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  className,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <nav
      data-testid="top-nav-bar"
      className={cn(
        'w-full pt-[env(safe-area-inset-top,0px)] select-none bg-surface/90 backdrop-blur-md border-b border-border-subtle/50 shrink-0 z-20 sticky top-0',
        className
      )}
    >
      <div className="w-full h-[44px] px-4 flex items-center justify-between relative">
        {/* Left Back Button or Spacer */}
        <div className="flex items-center min-w-[44px] h-[44px]">
          {showBack ? (
            <button
              type="button"
              data-testid="nav-back-button"
              aria-label="Kembali"
              onClick={handleBack}
              className="w-[44px] h-[44px] -ml-2 inline-flex items-center justify-center text-ink-primary hover:text-ink-secondary active:scale-95 btn-tactile rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          ) : (
            <div className="w-[44px]" />
          )}
        </div>

        {/* Centered Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-[200px] pointer-events-none">
          {title && (
            <h1
              data-testid="nav-title"
              className="text-[16px] font-semibold tracking-tight text-ink-primary truncate"
            >
              {title}
            </h1>
          )}
        </div>

        {/* Right Action or Spacer */}
        <div
          data-testid="nav-right-action"
          className="flex items-center justify-end min-w-[44px] h-[44px]"
        >
          {rightAction || <div className="w-[44px]" />}
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
