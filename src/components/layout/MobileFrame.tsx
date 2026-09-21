import React from 'react';
import { cn } from '../../lib/utils';
import { StatusBar } from './StatusBar';
import { TopNavBar } from './TopNavBar';

export interface MobileFrameProps {
  children: React.ReactNode;
  hideNav?: boolean;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  hideNav = false,
  title,
  showBack = false,
  onBack,
  rightAction,
  className,
  contentClassName,
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-canvas sm:py-6 sm:px-4 overflow-x-hidden">
      <div
        data-testid="mobile-frame"
        className={cn(
          'w-full min-h-screen sm:min-h-[852px] sm:max-w-[420px] bg-surface flex flex-col relative overflow-hidden sm:rounded-[44px] sm:shadow-2xl sm:border sm:border-border-hairline',
          className
        )}
      >
        {/* iOS Status Bar with Time, Dynamic Island, and System Icons */}
        <StatusBar />

        {/* Optional Top Navigation Bar */}
        {!hideNav && (
          <TopNavBar
            title={title}
            showBack={showBack}
            onBack={onBack}
            rightAction={rightAction}
          />
        )}

        {/* Scrollable Main Content */}
        <main
          className={cn(
            'flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col',
            contentClassName
          )}
        >
          {children}
        </main>

        {/* iOS Bottom Home Indicator */}
        <div className="w-full pt-1.5 pb-2 flex justify-center items-center pointer-events-none shrink-0">
          <div
            data-testid="home-indicator"
            className="w-[134px] h-[5px] bg-black/30 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
