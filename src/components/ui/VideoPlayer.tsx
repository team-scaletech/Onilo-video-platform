import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MediaPlayer, MediaProvider, Track, Captions, MediaPlayerInstance } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { CustomPlayerControls } from '../../modules/player/components/CustomPlayerControls';
import { cn, isIOS } from '../../utils';

export interface TextTrackItem {
  src: string;
  label: string;
  language: string;
  kind?: 'subtitles' | 'captions' | 'chapters';
  default?: boolean;
}

export interface VideoPlayerProps {
  src: any;
  poster?: string;
  title?: string;
  aspectRatio?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsinline?: boolean;
  controls?: boolean;
  useCustomUI?: boolean;
  textTracks?: TextTrackItem[];
  thumbnails?: string;
  playbackRates?: number[];
  className?: string;
  children?: React.ReactNode;

  // Event Callbacks
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (detail: { currentTime: number; duration: number }) => void;
  onDurationChange?: (duration: number) => void;
  onSeeked?: (time: number) => void;
  onVolumeChange?: (detail: { volume: number; muted: boolean }) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onPiPChange?: (isPiP: boolean) => void;
  onRateChange?: (rate: number) => void;
  onError?: (error: any) => void;
}

export interface VideoPlayerRef {
  play: () => Promise<void> | undefined;
  pause: () => Promise<void> | undefined;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleFullscreen: () => Promise<void> | undefined;
  togglePiP: () => Promise<any> | undefined;
  getMediaPlayer: () => MediaPlayerInstance | null;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    {
      src,
      poster,
      title = 'Interactive Video',
      aspectRatio = '16/9',
      autoplay = false,
      muted = false,
      loop = false,
      playsinline = true,
      controls = true,
      useCustomUI = true,
      textTracks = [],
      thumbnails,
      className,
      children,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onDurationChange,
      onSeeked,
      onVolumeChange,
      onFullscreenChange,
      onPiPChange,
      onRateChange,
      onError,
    },
    ref,
  ) => {
    const playerRef = useRef<MediaPlayerInstance>(null);

    // iOS Safari can only fullscreen the bare <video> element, which hides all custom
    // controls and overlays. On iOS we skip the native Fullscreen API entirely and instead
    // expand this wrapper to fill the viewport via CSS, keeping the video inline so every
    // sibling (controls, quiz/hotspot overlays) keeps rendering on top of it.
    const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
    const [pseudoFullscreenHeight, setPseudoFullscreenHeight] = useState<number>();

    useEffect(() => {
      if (!isPseudoFullscreen) return;

      const vv = window.visualViewport;
      const updateHeight = () => setPseudoFullscreenHeight(vv?.height ?? window.innerHeight);
      updateHeight();
      vv?.addEventListener('resize', updateHeight);
      window.addEventListener('resize', updateHeight);

      const scrollY = window.scrollY;
      const previousOverflow = document.body.style.overflow;
      const previousPosition = document.body.style.position;
      const previousTop = document.body.style.top;
      const previousWidth = document.body.style.width;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        vv?.removeEventListener('resize', updateHeight);
        window.removeEventListener('resize', updateHeight);
        document.body.style.overflow = previousOverflow;
        document.body.style.position = previousPosition;
        document.body.style.top = previousTop;
        document.body.style.width = previousWidth;
        window.scrollTo(0, scrollY);
      };
    }, [isPseudoFullscreen]);

    const togglePseudoFullscreen = () => setIsPseudoFullscreen((prev) => !prev);

    const handleMediaTimeUpdate = useCallback(
      (detail: { currentTime: number }) => {
        if (onTimeUpdate) {
          onTimeUpdate({
            currentTime: detail.currentTime,
            duration: playerRef.current?.duration || 0,
          });
        }
      },
      [onTimeUpdate],
    );

    const handleMediaVolumeChange = useCallback(
      (detail: { volume: number; muted: boolean }) => {
        if (onVolumeChange) {
          onVolumeChange({ volume: detail.volume, muted: detail.muted });
        }
      },
      [onVolumeChange],
    );

    const handleHlsInstance = useCallback((hls: any) => {
      if (!hls?.config) return;
      hls.config.maxBufferHole = 0.5; // default 0.1s
      hls.config.highBufferWatchdogPeriod = 1; // default 2s
      hls.config.nudgeOffset = 0.2; // default 0.1s
    }, []);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.play(),
      pause: () => playerRef.current?.pause(),
      seek: (time: number) => {
        if (playerRef.current) {
          playerRef.current.currentTime = time;
        }
      },
      setVolume: (vol: number) => {
        if (playerRef.current) {
          playerRef.current.volume = vol;
        }
      },
      toggleFullscreen: () => {
        if (isIOS()) {
          togglePseudoFullscreen();
          return;
        }
        if (playerRef.current) {
          return playerRef.current.enterFullscreen();
        }
      },
      togglePiP: () => {
        if (playerRef.current) {
          return playerRef.current.enterPictureInPicture();
        }
      },
      getMediaPlayer: () => playerRef.current,
    }));

    const playerElement = (
      <div
        className={cn(
          'relative w-full rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl shadow-brand-500/10 group',
          isPseudoFullscreen && 'fixed inset-0 z-[9999] !w-screen !max-w-none rounded-none border-none',
          className,
        )}
        style={isPseudoFullscreen ? { height: pseudoFullscreenHeight ?? '100dvh' } : undefined}
      >
        <MediaPlayer
          ref={playerRef}
          title={title}
          src={src}
          poster={poster}
          aspectRatio={aspectRatio}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          playsInline={playsinline}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
          onTimeUpdate={handleMediaTimeUpdate}
          onDurationChange={onDurationChange}
          onSeeked={onSeeked}
          onVolumeChange={handleMediaVolumeChange}
          onFullscreenChange={onFullscreenChange}
          onPictureInPictureChange={onPiPChange}
          onRateChange={onRateChange}
          onError={onError}
          onHlsInstance={handleHlsInstance}
          className="w-full h-full"
        >
          <MediaProvider>
            {/* Subtitles & Captions Text Tracks */}
            {textTracks.map((track, idx) => (
              <Track
                key={`track-${idx}`}
                src={track.src}
                label={track.label}
                language={track.language}
                kind={track.kind || 'subtitles'}
                default={track.default}
              />
            ))}
          </MediaProvider>

          {/* Subtitles Overlay */}
          <Captions className="vds-captions absolute bottom-20 left-0 right-0 z-30 pointer-events-none text-center px-4 text-sm sm:text-base font-semibold text-white drop-shadow-lg" />

          {/* Render Either Custom Netflix/YouTube UI or Vidstack Default Layout */}
          {controls &&
            (useCustomUI ? (
              <CustomPlayerControls
                title={title}
                isPseudoFullscreen={isPseudoFullscreen}
                onTogglePseudoFullscreen={togglePseudoFullscreen}
              />
            ) : (
              <DefaultVideoLayout icons={defaultLayoutIcons} thumbnails={thumbnails} />
            ))}

          {/* Children overlays (e.g. Interactive Hotspots, Quiz Prompts) */}
          {children}
        </MediaPlayer>
      </div>
    );

    return isPseudoFullscreen ? createPortal(playerElement, document.body) : playerElement;
  },
);

VideoPlayer.displayName = 'VideoPlayer';
