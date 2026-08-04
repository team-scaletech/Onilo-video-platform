import React, { useState, useEffect, useRef } from 'react';
import { useMediaState, useMediaPlayer } from '@vidstack/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  PictureInPicture,
  Settings,
  Subtitles,
  Gauge,
  Sparkles,
  Sliders,
  Check,
} from 'lucide-react';
import { formatTime, cn } from '../../../utils';

export interface CustomPlayerControlsProps {
  title?: string;
  className?: string;
}

export const CustomPlayerControls: React.FC<CustomPlayerControlsProps> = ({
  title = 'Interactive Video Stream',
  className,
}) => {
  const player = useMediaPlayer();

  // Vidstack media state hooks
  const isPlaying = useMediaState('playing');
  const isPaused = useMediaState('paused');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const volume = useMediaState('volume');
  const isMuted = useMediaState('muted');
  const isFullscreen = useMediaState('fullscreen');
  const isPiP = useMediaState('pictureInPicture');
  const playbackRate = useMediaState('playbackRate');
  const buffered = useMediaState('buffered');

  // Controls UI state
  const [showControls, setShowControls] = useState(true);
  const [doubleTapRipple, setDoubleTapRipple] = useState<'left' | 'right' | null>(null);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('Auto (1080p)');
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  const handleToggleSubtitles = () => {
    if (player && player.textTracks) {
      const tracks = Array.from(player.textTracks).filter(Boolean);
      const activeTrack = tracks.find((t) => t && t.mode === 'showing');
      if (activeTrack) {
        tracks.forEach((t) => {
          if (t) t.mode = 'disabled';
        });
        setSubtitlesEnabled(false);
      } else {
        const subTrack =
          tracks.find((t) => t && (t.kind === 'subtitles' || t.kind === 'captions')) || tracks[0];
        if (subTrack) {
          subTrack.mode = 'showing';
        }
        setSubtitlesEnabled(true);
      }
    } else {
      setSubtitlesEnabled((prev) => !prev);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });

  // Mouse idle timer for hiding controls during playback
  const resetIdleTimer = () => {
    setShowControls(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isPlaying) {
      idleTimerRef.current = setTimeout(() => {
        if (!showSpeedMenu && !showSettingsMenu && !showVolumeSlider) {
          setShowControls(false);
        }
      }, 3000);
    }
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isPlaying, showSpeedMenu, showSettingsMenu, showVolumeSlider]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (!player) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
          resetIdleTimer();
          break;
        case 'KeyF':
          e.preventDefault();
          if (isFullscreen) {
            player.exitFullscreen();
          } else {
            player.enterFullscreen();
          }
          break;
        case 'KeyM':
          e.preventDefault();
          player.muted = !isMuted;
          break;
        case 'KeyP':
          e.preventDefault();
          if (isPiP) {
            player.exitPictureInPicture();
          } else {
            player.enterPictureInPicture();
          }
          break;
        case 'ArrowLeft':
        case 'KeyJ':
          e.preventDefault();
          player.currentTime = Math.max(0, currentTime - 5);
          resetIdleTimer();
          break;
        case 'ArrowRight':
        case 'KeyL':
          e.preventDefault();
          player.currentTime = Math.min(duration, currentTime + 5);
          resetIdleTimer();
          break;
        case 'ArrowUp':
          e.preventDefault();
          player.volume = Math.min(1, volume + 0.1);
          resetIdleTimer();
          break;
        case 'ArrowDown':
          e.preventDefault();
          player.volume = Math.max(0, volume - 0.1);
          resetIdleTimer();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, isPlaying, isFullscreen, isMuted, isPiP, currentTime, duration, volume]);

  const triggerDoubleTapRipple = (side: 'left' | 'right') => {
    setDoubleTapRipple(side);
    setTimeout(() => setDoubleTapRipple(null), 650);
  };

  const togglePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  // Touch Gesture Engine (Double-tap left/right seek ±10s)
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.custom-controls-bar') || target.closest('button') || target.closest('input')) {
      return;
    }

    const touch = e.changedTouches[0];
    if (!touch || !containerRef.current || !player) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const now = Date.now();
    const timeDiff = now - lastTapRef.current.time;
    const distDiff = Math.abs(touchX - lastTapRef.current.x);

    // Check if double-tap occurred within 320ms and 50px radius
    if (timeDiff < 320 && distDiff < 50) {
      if (touchX < rect.width * 0.4) {
        // Double tap left -> Seek -10s
        player.currentTime = Math.max(0, currentTime - 10);
        triggerDoubleTapRipple('left');
      } else if (touchX > rect.width * 0.6) {
        // Double tap right -> Seek +10s
        player.currentTime = Math.min(duration, currentTime + 10);
        triggerDoubleTapRipple('right');
      } else {
        togglePlayPause();
      }
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      lastTapRef.current = { time: now, x: touchX };
      resetIdleTimer();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    const time = parseFloat(e.target.value);
    player.currentTime = time;
  };

  const handleSeekMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const calcTime = Math.max(0, Math.min(duration, pos * duration));
    setHoverTime(calcTime);
    setHoverPosition(e.clientX - rect.left);
  };

  const handleSeekMouseLeave = () => {
    setHoverTime(null);
  };

  // Calculate percentages
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent =
    duration > 0 && buffered.length > 0 ? (buffered.end(buffered.length - 1) / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={resetIdleTimer}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.custom-controls-bar')) return;
        togglePlayPause();
      }}
      className={cn(
        'absolute inset-0 z-20 flex flex-col justify-between pointer-events-auto transition-opacity duration-300 select-none',
        showControls || isPaused ? 'opacity-100' : 'opacity-0 cursor-none',
        className
      )}
    >
      {/* Top Header Ambient Gradient */}
      <div className="custom-controls-bar p-3 sm:p-4 lg:p-6 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyanGlow animate-ping" />
          <h3 className="font-heading font-extrabold text-xs sm:text-base text-white tracking-tight drop-shadow-md truncate max-w-[180px] sm:max-w-md">
            {title}
          </h3>
        </div>
      </div>

      {/* Center Play & Pause Interactive Overlay Button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto">
        <AnimatePresence>
          {(showControls || isPaused) && (
            <motion.button
              key="center-btn"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950/85 hover:bg-brand-600/90 border-2 border-cyan-400/60 hover:border-cyan-300 backdrop-blur-xl flex items-center justify-center text-white shadow-glow transition-colors duration-200 hover:scale-110 active:scale-95 group/centerbtn"
              title={isPlaying ? 'Pause (Space/K)' : 'Play (Space/K)'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 sm:w-9 sm:h-9 fill-current text-white transition-transform" />
              ) : (
                <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current text-cyanGlow group-hover/centerbtn:text-white ml-1 transition-transform" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Double Tap Gesture Ripple Splash Indicators */}
      <AnimatePresence>
        {doubleTapRipple === 'left' && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 1.2 }}
            className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none z-30 flex flex-col items-center gap-1.5 p-4 rounded-3xl bg-slate-950/80 border border-white/20 backdrop-blur-xl text-cyanGlow"
          >
            <RotateCcw className="w-8 h-8 animate-spin" />
            <span className="text-xs font-mono font-extrabold">-10s</span>
          </motion.div>
        )}

        {doubleTapRipple === 'right' && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 1.2 }}
            className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none z-30 flex flex-col items-center gap-1.5 p-4 rounded-3xl bg-slate-950/80 border border-white/20 backdrop-blur-xl text-cyanGlow"
          >
            <RotateCw className="w-8 h-8 animate-spin" />
            <span className="text-xs font-mono font-extrabold">+10s</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Custom Control Overlay (with Mobile Safe Area Padding) */}
      <div className="custom-controls-bar p-3 sm:p-4 lg:p-6 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent space-y-2.5 sm:space-y-3">
        {/* Interactive Seek Timeline Progress Bar */}
        <div className="relative group/seeker w-full flex items-center min-h-[24px]">
          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              style={{ left: `${hoverPosition}px` }}
              className="absolute -top-9 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-950 border border-white/20 text-[10px] font-mono font-bold text-cyanGlow pointer-events-none shadow-xl z-30"
            >
              {formatTime(hoverTime)}
            </div>
          )}

          <div className="relative w-full h-2 rounded-full bg-white/20 overflow-hidden cursor-pointer flex items-center group-hover/seeker:h-3 transition-all duration-200">
            {/* Buffer bar */}
            <div
              style={{ width: `${bufferPercent}%` }}
              className="absolute top-0 bottom-0 left-0 bg-white/30 transition-all"
            />
            {/* Playback progress bar */}
            <div
              style={{ width: `${progressPercent}%` }}
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-brand-500 via-purple-500 to-cyanGlow shadow-glow"
            />
          </div>

          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            onMouseMove={handleSeekMouseMove}
            onMouseLeave={handleSeekMouseLeave}
            className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          />
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between text-white">
          {/* Left Actions Group */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="p-2.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              title={isPlaying ? 'Pause (Space/K)' : 'Play (Space/K)'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip -10s */}
            <button
              onClick={() => player && (player.currentTime = Math.max(0, currentTime - 10))}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden sm:block"
              title="Skip -10s (←/J)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip +10s */}
            <button
              onClick={() => player && (player.currentTime = Math.min(duration, currentTime + 10))}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden sm:block"
              title="Skip +10s (→/L)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control with Hover Slider */}
            <div
              className="relative flex items-center gap-2 group/vol"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={() => player && (player.muted = !isMuted)}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <div
                className={cn(
                  'w-20 transition-all duration-200 overflow-hidden flex items-center hidden md:flex',
                  showVolumeSlider ? 'opacity-100 max-w-[80px]' : 'opacity-0 max-w-0'
                )}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => player && (player.volume = parseFloat(e.target.value))}
                  className="w-full h-1.5 accent-cyanGlow bg-white/20 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Time Counter */}
            <div className="text-[10px] sm:text-xs font-mono font-semibold text-slate-300">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-0.5 sm:mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Actions Group */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Subtitles / CC Toggle */}
            <button
              onClick={handleToggleSubtitles}
              className={cn(
                'p-2 rounded-xl border text-xs transition-colors flex items-center gap-1',
                subtitlesEnabled
                  ? 'bg-cyanGlow/20 border-cyanGlow/40 text-cyanGlow'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-white'
              )}
              title="Subtitles/CC"
            >
              <Subtitles className="w-4 h-4" />
              <span className="font-bold text-[10px] hidden sm:inline">CC</span>
            </button>

            {/* Playback Speed Menu Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSpeedMenu((prev) => !prev);
                  setShowSettingsMenu(false);
                }}
                className="p-2 rounded-xl hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-mono font-bold"
                title="Playback Speed"
              >
                <Gauge className="w-4 h-4 text-purple-400" />
                <span className="text-[11px] sm:text-xs">{playbackRate}x</span>
              </button>

              <AnimatePresence>
                {showSpeedMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-12 right-0 w-36 p-1.5 rounded-2xl bg-slate-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-40 space-y-1"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Playback Speed
                    </div>
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          if (player) player.playbackRate = rate;
                          setShowSpeedMenu(false);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center justify-between',
                          playbackRate === rate
                            ? 'bg-brand-600 text-white shadow-md'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        <span>{rate}x</span>
                        {playbackRate === rate && <Sparkles className="w-3 h-3 text-cyanGlow" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Gear Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSettingsMenu((prev) => !prev);
                  setShowSpeedMenu(false);
                }}
                className="p-2 rounded-xl hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                title="Stream Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showSettingsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-12 right-0 w-48 p-2 rounded-2xl bg-slate-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-40 space-y-2"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-cyanGlow" />
                      Stream Quality
                    </div>

                    {['Auto (1080p)', '1080p Full HD', '720p HD', '480p SD', '360p Low'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setSelectedQuality(q);
                          setShowSettingsMenu(false);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between',
                          selectedQuality === q
                            ? 'bg-brand-600/30 text-cyanGlow font-bold border border-brand-500/40'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        <span>{q}</span>
                        {selectedQuality === q && <Check className="w-3.5 h-3.5 text-cyanGlow" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Picture in Picture */}
            <button
              onClick={() => {
                if (!player) return;
                if (isPiP) player.exitPictureInPicture();
                else player.enterPictureInPicture();
              }}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden sm:block"
              title="Picture-in-Picture (P)"
            >
              <PictureInPicture className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => {
                if (!player) return;
                if (isFullscreen) player.exitFullscreen();
                else player.enterFullscreen();
              }}
              className="p-2.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
