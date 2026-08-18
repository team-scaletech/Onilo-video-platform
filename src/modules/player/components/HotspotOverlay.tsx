import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface HotspotOverlayProps {
  data: {
    title: string;
    description: string;
    buttonText?: string;
    linkUrl?: string;
    xPercent: number;
    yPercent: number;
  };
  onClose: () => void;
  onResumeVideo?: () => void;
}

const AUTO_DISMISS_MS = 8000;

/**
 * Unlike the other overlays, a hotspot doesn't pause playback or cover the screen —
 * it's a small positioned marker the viewer can expand, and it dismisses itself
 * automatically so it doesn't linger over the video.
 */
export const HotspotOverlay: React.FC<HotspotOverlayProps> = ({ data, onClose, onResumeVideo }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      onResumeVideo?.();
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onClose, onResumeVideo]);

  const handleDismiss = () => {
    onClose();
    onResumeVideo?.();
  };

  return (
    <div
      className="absolute z-40 pointer-events-auto"
      style={{ left: `${data.xPercent}%`, top: `${data.yPercent}%` }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setExpanded((prev) => !prev)}
          className="relative w-9 h-9 rounded-full bg-cyanGlow/25 border-2 border-cyanGlow text-cyanGlow shadow-glow flex items-center justify-center"
        >
          <span className="absolute inset-0 rounded-full bg-cyanGlow/40 animate-ping" />
          <MapPin className="w-4 h-4 relative z-10" />
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 6 }}
              className="absolute top-11 left-1/2 -translate-x-1/2 w-56 sm:w-64 rounded-2xl bg-slate-950/95 border border-cyanGlow/40 backdrop-blur-2xl shadow-2xl p-3 space-y-2 text-white"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-extrabold leading-snug">{data.title}</h4>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">{data.description}</p>
              {data.buttonText && (
                <Button
                  size="sm"
                  variant="glow"
                  className="w-full text-[11px] py-1 h-7"
                  rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                  onClick={handleDismiss}
                >
                  {data.buttonText}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
