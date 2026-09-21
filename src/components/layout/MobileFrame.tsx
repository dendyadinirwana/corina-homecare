import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { TopNavBar } from './TopNavBar';
import {
  gsap,
  useGSAP,
  IOS_EASE,
  IOS_MODAL_EASE,
  IOS_DURATION,
  IOS_MODAL_DURATION,
  IOS_STAGGER_EACH,
  getTransitionDirection,
} from '../../lib/motion';

export interface MobileFrameProps {
  children: React.ReactNode;
  hideNav?: boolean;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  footer?: React.ReactNode;
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
  footer,
  className,
  contentClassName,
}) => {
  const location = useLocation();
  const frameRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Scroll to top on page transition for clean mobile experience
      if (mainRef.current) {
        mainRef.current.scrollTop = 0;
      }
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }

      const direction = getTransitionDirection(location.pathname);

      if (direction === 'none') {
        return;
      }

      if (mainRef.current) {
        gsap.killTweensOf(mainRef.current);
      }

      if (direction === 'modal') {
        // Modal sheet presentation: smooth slide-up from bottom
        gsap.fromTo(
          mainRef.current,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: IOS_MODAL_DURATION,
            ease: IOS_MODAL_EASE,
            clearProps: 'all',
          }
        );
      } else if (direction === 'forward') {
        // iOS forward push transition: slide in from right with subtle fade
        gsap.fromTo(
          mainRef.current,
          { x: 24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: IOS_DURATION,
            ease: IOS_EASE,
            clearProps: 'all',
          }
        );
      } else {
        // iOS backward pop transition: slide in from left with subtle fade
        gsap.fromTo(
          mainRef.current,
          { x: -24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: IOS_DURATION,
            ease: IOS_EASE,
            clearProps: 'all',
          }
        );
      }

      // Staggered entrance for key content cards
      const staggerItems = mainRef.current?.querySelectorAll('.ios-stagger');
      if (staggerItems && staggerItems.length > 0) {
        gsap.killTweensOf(staggerItems);
        gsap.fromTo(
          staggerItems,
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: IOS_DURATION,
            stagger: IOS_STAGGER_EACH,
            ease: IOS_EASE,
            clearProps: 'all',
          }
        );
      }
    },
    {
      scope: frameRef,
      dependencies: [location.pathname],
    }
  );

  return (
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center bg-canvas sm:py-6 sm:px-4 overflow-x-hidden">
      <div
        ref={frameRef}
        data-testid="mobile-frame"
        className={cn(
          'w-full h-[100dvh] max-h-[100dvh] sm:h-[852px] sm:max-h-[852px] sm:max-w-[420px] bg-canvas flex flex-col relative overflow-hidden sm:rounded-[44px] sm:shadow-2xl sm:border sm:border-border-hairline',
          className
        )}
      >
        {/* Fixed Top Navigation Bar */}
        {!hideNav && (
          <TopNavBar
            title={title}
            showBack={showBack}
            onBack={onBack}
            rightAction={rightAction}
          />
        )}

        {/* Scrollable Middle Main Content */}
        <main
          ref={mainRef}
          className={cn(
            'flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar scroll-touch relative flex flex-col',
            contentClassName
          )}
        >
          {children}
        </main>

        {/* Fixed Bottom CTA / Footer */}
        {footer && (
          <footer className="shrink-0 w-full z-20 border-t border-border-hairline bg-surface/95 backdrop-blur-md">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default MobileFrame;
