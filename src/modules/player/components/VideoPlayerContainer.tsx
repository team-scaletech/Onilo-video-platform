import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { VideoMetadata } from '../../../types';
import { VideoPlayer, VideoPlayerRef } from '../../../components/ui/VideoPlayer';
import { InteractiveOverlayEngine } from './InteractiveOverlayEngine';
import { ResumePlaybackBanner } from './ResumePlaybackBanner';
import { usePlayer } from '../../../hooks';
import { usePlayerProgress } from '../../../context/PlayerProgressContext';
import { getTimelineEventsForVideo } from '../data/mockTimelineEvents';
import { analyticsService } from '../../../services/analyticsService';
import { getVideoMimeType } from '../../../utils';

export const DEFAULT_TEXT_TRACKS = [
  {
    src: 'https://files.vidstack.io/sprite-fight/subs/english.vtt',
    label: 'English',
    language: 'en-US',
    kind: 'subtitles' as const,
    default: true,
  },
  {
    src: 'https://files.vidstack.io/sprite-fight/subs/german.vtt',
    label: 'Deutsch (German)',
    language: 'de-DE',
    kind: 'subtitles' as const,
  },
];

export interface VideoPlayerContainerProps {
  video: VideoMetadata;
}

export const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({ video }: VideoPlayerContainerProps) => {
  const playerRef = useRef<VideoPlayerRef>(null);
  const { setCurrentTime, setDuration, setIsPlaying, setPlayerControls, currentTime, duration } = usePlayer();
  const { saveProgress, getProgress } = usePlayerProgress();
  const timelineEvents = getTimelineEventsForVideo(video.id);

  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [savedTime, setSavedTime] = useState(0);
  const hasFiredCompletionRef = useRef(false);

  // Latest currentTime/duration for the handlers below to read without needing currentTime
  // or duration in their own dependency arrays -- see the useCallback comment further down.
  const currentTimeRef = useRef(currentTime);
  const durationRef = useRef(duration);

  const videoSrc = useMemo(() => {
    const url = video.hlsUrl || video.srcUrl;
    return [{ src: url, type: getVideoMimeType(url) }];
  }, [video.hlsUrl, video.srcUrl]);

  // Publish this player instance's controls so sibling components (timeline markers,
  // the configured-overlays sidebar) can seek without reaching into the DOM.
  useEffect(() => {
    setPlayerControls(playerRef.current);
    return () => setPlayerControls(null);
  }, [setPlayerControls]);

  // Check saved progress once per video load. Deliberately excludes `getProgress` from the
  // deps: it's recreated on every PlayerProgressProvider render (including the periodic
  // auto-save below), which would otherwise re-run this check mid-playback and pop the
  // banner back up right after it's dismissed.
  useEffect(() => {
    const saved = getProgress(video.id);
    if (saved && saved.currentTime > 5 && !saved.isCompleted) {
      setSavedTime(saved.currentTime);
      setShowResumeBanner(true);
    } else {
      setShowResumeBanner(false);
    }
    hasFiredCompletionRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.id]);

  // Periodic watch progress auto-save + engagement heartbeat (every 5 seconds), plus a
  // one-time completion event once 90% of the video has been watched.
  useEffect(() => {
    if (currentTime > 0 && duration > 0 && Math.floor(currentTime) % 5 === 0) {
      saveProgress(video.id, currentTime, duration);
      analyticsService.track('video_progress', video.id, currentTime, {
        percentWatched: Math.min(100, Math.floor((currentTime / duration) * 100)),
      });
    }

    if (duration > 0 && currentTime / duration >= 0.9 && !hasFiredCompletionRef.current) {
      hasFiredCompletionRef.current = true;
      analyticsService.track('video_completed', video.id, currentTime, { reason: 'watched_90_percent' });
    }
  }, [currentTime, duration, video.id, saveProgress]);

  const handleTimeUpdate = useCallback(
    (detail: { currentTime: number; duration: number }) => {
      currentTimeRef.current = detail.currentTime;
      setCurrentTime(detail.currentTime);
    },
    [setCurrentTime],
  );

  const handleDurationChange = useCallback(
    (detail: number) => {
      durationRef.current = detail;
      setDuration(detail);
    },
    [setDuration],
  );

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    analyticsService.track('video_play', video.id, currentTimeRef.current);
  }, [setIsPlaying, video.id]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (currentTimeRef.current > 0 && durationRef.current > 0) {
      saveProgress(video.id, currentTimeRef.current, durationRef.current);
    }
    analyticsService.track('video_pause', video.id, currentTimeRef.current);
  }, [setIsPlaying, video.id, saveProgress]);

  const handleSeeked = useCallback(
    (time: number) => {
      analyticsService.track('video_seek', video.id, time);
    },
    [video.id],
  );

  const handleEnded = useCallback(() => {
    if (!hasFiredCompletionRef.current) {
      hasFiredCompletionRef.current = true;
      analyticsService.track('video_completed', video.id, durationRef.current, { reason: 'ended' });
    }
  }, [video.id]);

  const handleError = useCallback((event: any) => {
    console.error('VIDSTACK ERROR', event);
  }, []);

  const pauseVideo = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const resumeVideo = useCallback(() => {
    playerRef.current?.play();
  }, []);

  const handleInteractiveEventTriggered = useCallback(() => {
    setShowResumeBanner(false);
  }, []);

  const handleResumePlayback = () => {
    playerRef.current?.seek(savedTime);
    playerRef.current?.play();
    setShowResumeBanner(false);
  };

  const handleStartOver = () => {
    playerRef.current?.seek(0);
    playerRef.current?.play();
    setShowResumeBanner(false);
  };

  return (
    <div className="relative">
      {/* Resume Playback Prompt Banner */}
      {showResumeBanner && (
        <ResumePlaybackBanner
          savedTime={savedTime}
          onResume={handleResumePlayback}
          onStartOver={handleStartOver}
          onClose={() => setShowResumeBanner(false)}
        />
      )}

      <VideoPlayer
        ref={playerRef}
        title={video.title}
        src={videoSrc}
        poster={video.posterUrl}
        aspectRatio="16/9"
        useCustomUI
        textTracks={DEFAULT_TEXT_TRACKS}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onSeeked={handleSeeked}
        onEnded={handleEnded}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
      >
        {/* Interactive Layer Overlay Engine (Quiz, Survey, CTA, Product, Form, Mini-Game, Hotspot) */}
        <InteractiveOverlayEngine
          events={timelineEvents}
          currentTime={currentTime}
          videoId={video.id}
          onPauseVideo={pauseVideo}
          onResumeVideo={resumeVideo}
          onEventTriggered={handleInteractiveEventTriggered}
        />
      </VideoPlayer>
    </div>
  );
};
