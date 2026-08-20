import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { formatTime } from '../../../utils';

export interface ResumePlaybackBannerProps {
  savedTime: number;
  onResume: () => void;
  onStartOver: () => void;
  onClose: () => void;
}

export const ResumePlaybackBanner: React.FC<ResumePlaybackBannerProps> = ({
  savedTime,
  onResume,
  onStartOver,
  onClose,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.96 }}
        className="flex absolute top-[calc(1rem+env(safe-area-inset-top))] sm:top-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] sm:w-full max-w-sm p-3.5 rounded-2xl bg-slate-950/95 border border-brand-500/50 backdrop-blur-2xl shadow-2xl text-white items-center justify-between gap-3 pointer-events-auto overflow-hidden"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="p-2 rounded-xl bg-brand-500/20 text-cyanGlow border border-brand-500/30 shrink-0">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-extrabold text-white truncate leading-tight">Resume Playback?</h4>
            <p className="text-[11px] text-slate-300 truncate leading-tight">
              You left off at <span className="font-mono font-bold text-cyanGlow">{formatTime(savedTime)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <Button
            size="sm"
            variant="glow"
            onClick={onResume}
            className="text-[11px] font-bold py-1 px-2.5 h-7"
          >
            Resume
          </Button>

          <button
            onClick={onStartOver}
            title="Start Over"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            title="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors ml-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
