import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * iOS Safari only supports the Fullscreen API on the bare <video> element, not arbitrary
 * containers — so calling the standard fullscreen API there hides all custom UI (controls,
 * overlays) instead of scaling them up with the video. Callers use this to fall back to a
 * CSS-driven "fake fullscreen" (fixed, viewport-covering container) on iOS instead.
 */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isAppleMobileDevice = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports its platform as "MacIntel" like a real Mac, but unlike a Mac it has touch support.
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isAppleMobileDevice || isIPadOS;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
