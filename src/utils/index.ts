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

const EXTENSION_MIME_MAP: Record<string, string> = {
  m3u8: 'application/x-mpegURL',
  mpd: 'application/dash+xml',
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  ogv: 'video/ogg',
};

/**
 * Picks the MIME type Vidstack needs from the file extension so the player knows whether
 * to hand the source to hls.js (HLS), dash.js (DASH), or play it natively (MP4/WebM/etc.) --
 * rather than assuming every source is an HLS manifest.
 */
export function getVideoMimeType(url: string): string {
  const path = url.split(/[?#]/)[0];
  const extension = path.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_MIME_MAP[extension] || 'video/mp4';
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
