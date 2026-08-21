import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaPlayer, useMediaState } from '@vidstack/react';
import { Crosshair, CheckCircle2, X } from 'lucide-react';

export interface ClickTargetBox {
  /** Percentage of video width, 0-100, from the left edge. */
  x: number;
  /** Percentage of video height, 0-100, from the top edge. */
  y: number;
  /** Percentage of video width. */
  width: number;
  /** Percentage of video height. */
  height: number;
}

export interface ClickTargetData {
  question: string;
  target: ClickTargetBox;
  successMessage?: string;
  failureMessage?: string;
  /** Milliseconds to wait after a correct click before auto-resuming. Set 0 to require manual confirm. */
  autoResumeDelayMs?: number;
}

export interface ClickTargetOverlayProps {
  data: ClickTargetData;
  onClose: () => void;
  onResumeVideo?: () => void;
}

interface ContentRect {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

interface LegacyVideoElement extends HTMLVideoElement {
  videoWidth: number;
  videoHeight: number;
}

const isInsideTarget = (percentX: number, percentY: number, target: ClickTargetBox) =>
  percentX >= target.x &&
  percentX <= target.x + target.width &&
  percentY >= target.y &&
  percentY <= target.y + target.height;

export const ClickTargetOverlay: React.FC<ClickTargetOverlayProps> = ({ data, onClose, onResumeVideo }) => {
  const player = useMediaPlayer();
  const isFullscreen = useMediaState('fullscreen');
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentRect, setContentRect] = useState<ContentRect | null>(null);
  const [status, setStatus] = useState<'pending' | 'correct' | 'incorrect'>('pending');
  const [missMarker, setMissMarker] = useState<{ x: number; y: number } | null>(null);
  const missTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recomputes the actual rendered video content box (excluding any letterbox/pillarbox bars)
  // relative to this overlay's own container, which fills the same box the <video> does.
  const recomputeContentRect = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const video = (player?.provider as { video?: LegacyVideoElement } | null)?.video;
    const videoW = video?.videoWidth || 0;
    const videoH = video?.videoHeight || 0;

    if (!videoW || !videoH || containerRect.width === 0 || containerRect.height === 0) {
      setContentRect({ offsetX: 0, offsetY: 0, width: containerRect.width, height: containerRect.height });
      return;
    }

    const containerRatio = containerRect.width / containerRect.height;
    const videoRatio = videoW / videoH;

    if (videoRatio > containerRatio) {
      const width = containerRect.width;
      const height = width / videoRatio;
      setContentRect({ offsetX: 0, offsetY: (containerRect.height - height) / 2, width, height });
    } else {
      const height = containerRect.height;
      const width = height * videoRatio;
      setContentRect({ offsetX: (containerRect.width - width) / 2, offsetY: 0, width, height });
    }
  }, [player]);

  useEffect(() => {
    recomputeContentRect();

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => recomputeContentRect());
    observer.observe(container);

    const video = (player?.provider as { video?: LegacyVideoElement } | null)?.video;
    video?.addEventListener('loadedmetadata', recomputeContentRect);

    return () => {
      observer.disconnect();
      video?.removeEventListener('loadedmetadata', recomputeContentRect);
    };
  }, [player, recomputeContentRect]);

  // Belt-and-suspenders: fullscreen transitions can briefly race the ResizeObserver callback.
  useEffect(() => {
    recomputeContentRect();
  }, [isFullscreen, recomputeContentRect]);

  useEffect(
    () => () => {
      if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    },
    [],
  );

  const handleFinish = useCallback(() => {
    onClose();
    onResumeVideo?.();
  }, [onClose, onResumeVideo]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (status === 'correct' || !contentRect || contentRect.width === 0 || contentRect.height === 0) return;

    const containerRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - containerRect.left - contentRect.offsetX;
    const clickY = e.clientY - containerRect.top - contentRect.offsetY;
    const percentX = (clickX / contentRect.width) * 100;
    const percentY = (clickY / contentRect.height) * 100;

    // Clicks landing in a letterbox/pillarbox bar are outside the video entirely -- treat
    // them the same as a miss rather than crashing the math on out-of-range percentages.
    const clampedX = Math.max(0, Math.min(100, percentX));
    const clampedY = Math.max(0, Math.min(100, percentY));

    if (isInsideTarget(clampedX, clampedY, data.target)) {
      setStatus('correct');
      setMissMarker(null);
      const delay = data.autoResumeDelayMs ?? 1800;
      if (delay > 0) {
        resumeTimeoutRef.current = setTimeout(handleFinish, delay);
      }
    } else {
      setStatus('incorrect');
      setMissMarker({ x: clampedX, y: clampedY });
      if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
      missTimeoutRef.current = setTimeout(() => setMissMarker(null), 900);
    }
  };

  // Converts a percentage-of-video box into pixels relative to this overlay's container,
  // accounting for the same letterbox offset used for click detection above.
  const toContainerStyle = (box: ClickTargetBox) => {
    if (!contentRect) return { display: 'none' };
    return {
      left: contentRect.offsetX + (box.x / 100) * contentRect.width,
      top: contentRect.offsetY + (box.y / 100) * contentRect.height,
      width: (box.width / 100) * contentRect.width,
      height: (box.height / 100) * contentRect.height,
    };
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="absolute inset-0 z-40 pointer-events-auto"
      style={{ cursor: status === 'correct' ? 'default' : 'crosshair' }}
    >
      {/* Question Banner -- deliberately not a full backdrop so the paused frame stays visible
          and clickable underneath it. */}
      <div className="absolute top-[calc(0.75rem+env(safe-area-inset-top))] sm:top-4 left-1/2 -translate-x-1/2 z-10 max-w-[calc(100%-1.5rem)] sm:max-w-md px-3.5 sm:px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl text-white flex items-center gap-2.5">
        <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyanGlow border border-cyan-500/30 shrink-0">
          <Crosshair className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm font-bold leading-snug flex-1 min-w-0">{data.question}</p>
      </div>

      {/* Miss Marker -- fades out on its own; clicking again is always allowed while incorrect. */}
      <AnimatePresence>
        {missMarker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${missMarker.x}%`, top: `${missMarker.y}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-red-500/25 border-2 border-red-400 flex items-center justify-center shadow-[0_0_16px_rgba(248,113,113,0.5)]">
              <X className="w-4 h-4 text-red-300" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target Highlight -- only revealed once the correct area has actually been found. */}
      <AnimatePresence>
        {status === 'correct' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-10 rounded-2xl border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.55)] pointer-events-none"
            style={toContainerStyle(data.target)}
          >
            <span className="absolute inset-0 rounded-2xl bg-emerald-400/15 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Toast -- confirms correct/incorrect and offers a manual continue on success. */}
      <AnimatePresence>
        {status !== 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom))] sm:bottom-24 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-950/95 border backdrop-blur-xl shadow-2xl text-white"
            style={{
              borderColor: status === 'correct' ? 'rgba(52,211,153,0.5)' : 'rgba(248,113,113,0.5)',
            }}
          >
            {status === 'correct' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-emerald-300">{data.successMessage || 'Correct!'}</span>
                <button
                  onClick={handleFinish}
                  className="ml-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/30 transition-colors"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-xs font-bold text-red-300">{data.failureMessage || 'Try again'}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
