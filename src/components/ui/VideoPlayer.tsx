import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  Track,
  Captions,
  MediaPlayerInstance,
} from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { CustomPlayerControls } from '../../modules/player/components/CustomPlayerControls';
import { cn } from '../../utils';

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
      onVolumeChange,
      onFullscreenChange,
      onPiPChange,
      onRateChange,
      onError,
    },
    ref
  ) => {
    const playerRef = useRef<MediaPlayerInstance>(null);

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

    return (
      <div
        className={cn(
          'relative w-full rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl shadow-brand-500/10 group',
          className
        )}
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
          onTimeUpdate={(detail) => {
            if (onTimeUpdate) {
              onTimeUpdate({
                currentTime: detail.currentTime,
                duration: playerRef.current?.duration || 0,
              });
            }
          }}
          onDurationChange={onDurationChange}
          onVolumeChange={(detail) => {
            if (onVolumeChange) {
              onVolumeChange({
                volume: detail.volume,
                muted: detail.muted,
              });
            }
          }}
          onFullscreenChange={onFullscreenChange}
          onPictureInPictureChange={onPiPChange}
          onRateChange={onRateChange}
          onError={onError}
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
          {controls && (
            useCustomUI ? (
              <CustomPlayerControls title={title} />
            ) : (
              <DefaultVideoLayout
                icons={defaultLayoutIcons}
                thumbnails={thumbnails}
              />
            )
          )}

          {/* Children overlays (e.g. Interactive Hotspots, Quiz Prompts) */}
          {children}
        </MediaPlayer>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
