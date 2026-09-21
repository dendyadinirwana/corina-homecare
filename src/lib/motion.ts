import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register the official GSAP React plugin
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };

/**
 * Standard iOS Spring & Ease curve (similar to iOS UIKit / SwiftUI default transition curve)
 */
export const IOS_EASE = 'power2.out';
export const IOS_MODAL_EASE = 'power3.out';

/**
 * Durations in seconds.
 * Automated testing environments (Playwright via navigator.webdriver) run animations
 * near-instantaneously to keep tests ultra fast and completely deterministic.
 */
const isTestEnv =
  typeof window !== 'undefined' &&
  (Boolean(window.navigator?.webdriver) ||
    window.location.search.includes('disable_anim=true'));

export const IOS_DURATION = isTestEnv ? 0.05 : 0.32;
export const IOS_MODAL_DURATION = isTestEnv ? 0.05 : 0.36;
export const IOS_STAGGER_EACH = isTestEnv ? 0.005 : 0.04;

/**
 * Route hierarchy levels for detecting forward vs backward navigation
 */
const ROUTE_DEPTHS: Record<string, number> = {
  '/': 0,
  '/profil': 1,
  '/ulasan': 1,
  '/booking/langkah-1': 1,
  '/booking/langkah-2': 2,
  '/booking/langkah-3': 3,
};

const MODAL_ROUTES = new Set(['/booking/konfirmasi', '/ulasan/tulis']);

export type TransitionDirection = 'forward' | 'backward' | 'modal' | 'none';

let previousPathname = typeof window !== 'undefined' ? window.location.pathname : '/';

export function getTransitionDirection(currentPath: string): TransitionDirection {
  if (typeof window === 'undefined') return 'none';

  // Check prefers-reduced-motion
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return 'none';
  }

  if (MODAL_ROUTES.has(currentPath)) {
    previousPathname = currentPath;
    return 'modal';
  }

  const prevDepth = ROUTE_DEPTHS[previousPathname] ?? 0;
  const currDepth = ROUTE_DEPTHS[currentPath] ?? 0;

  previousPathname = currentPath;

  if (currDepth > prevDepth) return 'forward';
  if (currDepth < prevDepth) return 'backward';
  return 'forward';
}
