import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ExternalLink, Sparkles } from 'lucide-react';
import { InteractiveMarker } from '../../../types';
import { QuizOverlay } from './QuizOverlay';
import { usePlayer } from '../../../hooks';

export interface InteractiveOverlayProps {
  markers: InteractiveMarker[];
  currentTime: number;
  onResumeVideo?: () => void;
  onPauseVideo?: () => void;
}

export const InteractiveOverlay: React.FC<InteractiveOverlayProps> = ({
  markers,
  currentTime,
  onResumeVideo,
  onPauseVideo,
}) => {
  const { activeQuizMarker, setActiveQuizMarker, activeHotspotMarker, setActiveHotspotMarker } =
    usePlayer();

  useEffect(() => {
    // Check if any marker matches current time window
    const quizMatch = markers.find(
      (m) => m.type === 'quiz' && Math.abs(m.timestamp - currentTime) < 0.8
    );

    if (quizMatch && activeQuizMarker?.id !== quizMatch.id) {
      setActiveQuizMarker(quizMatch);
      onPauseVideo?.();
    }

    const hotspotMatch = markers.find(
      (m) => m.type === 'hotspot' && Math.abs(m.timestamp - currentTime) < 3.0
    );

    if (hotspotMatch && activeHotspotMarker?.id !== hotspotMatch.id) {
      setActiveHotspotMarker(hotspotMatch);
    } else if (!hotspotMatch && activeHotspotMarker) {
      setActiveHotspotMarker(null);
    }
  }, [currentTime, markers, activeQuizMarker, activeHotspotMarker, setActiveQuizMarker, setActiveHotspotMarker, onPauseVideo]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Active Quiz Popup Modal */}
      <AnimatePresence>
        {activeQuizMarker && (
          <QuizOverlay
            marker={activeQuizMarker}
            onClose={() => setActiveQuizMarker(null)}
            onResumeVideo={onResumeVideo}
          />
        )}
      </AnimatePresence>

      {/* Active Interactive Hotspot Overlay */}
      <AnimatePresence>
        {activeHotspotMarker && activeHotspotMarker.hotspot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              top: `${activeHotspotMarker.hotspot.yPercent}%`,
              left: `${activeHotspotMarker.hotspot.xPercent}%`,
            }}
            className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 z-40"
          >
            <div className="relative group">
              {/* Pulsing Hotspot Icon Button */}
              <button className="w-10 h-10 rounded-full bg-cyanGlow/20 border-2 border-cyanGlow flex items-center justify-center text-cyanGlow shadow-cyanGlow backdrop-blur-md animate-bounce">
                <Sparkles className="w-5 h-5 fill-current" />
              </button>

              {/* Hotspot Info Popup Card */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 p-4 rounded-2xl bg-slate-950/90 border border-cyanGlow/40 backdrop-blur-xl text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                <h4 className="font-bold text-sm text-cyanGlow mb-1">
                  {activeHotspotMarker.hotspot.title}
                </h4>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {activeHotspotMarker.hotspot.description}
                </p>
                {activeHotspotMarker.hotspot.linkUrl && (
                  <a
                    href={activeHotspotMarker.hotspot.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyanGlow/20 text-cyanGlow text-xs font-semibold hover:bg-cyanGlow/30 transition-colors"
                  >
                    <span>{activeHotspotMarker.hotspot.buttonText || 'Explore'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Trigger Button Prompt overlay on bottom right */}
      <div className="absolute bottom-16 right-6 pointer-events-auto hidden sm:flex items-center gap-2">
        {markers.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              if (m.type === 'quiz') {
                setActiveQuizMarker(m);
                onPauseVideo?.();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/20 backdrop-blur-md text-xs font-medium text-slate-200 hover:border-brand-500 hover:text-brand-300 transition-all shadow-lg"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
            <span>
              {m.type === 'quiz' ? 'Quiz @' : 'Marker @'} {m.timestamp}s
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
