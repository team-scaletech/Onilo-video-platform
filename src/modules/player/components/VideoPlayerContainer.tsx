import React, { useRef, useEffect } from 'react';
import { VideoMetadata } from '../../../types';
import { VideoPlayer, VideoPlayerRef } from '../../../components/ui/VideoPlayer';
import { InteractiveOverlayEngine } from './InteractiveOverlayEngine';
import { usePlayer } from '../../../hooks';
import { usePlayerProgress } from '../../../context/PlayerProgressContext';
import { TimelineEvent } from '../engine/TimelineEngine';

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

const SAMPLE_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt-quiz-15',
    timestamp: 15,
    type: 'quiz',
    title: 'Knowledge Check Quiz',
    pauseOnTrigger: true,
    data: {
      id: 'quiz-15',
      question: 'What is the primary benefit of HLS Adaptive Bitrate Streaming?',
      points: 50,
      options: [
        { id: 'opt-1', text: 'Dynamically adjusts video quality based on network speed', isCorrect: true },
        { id: 'opt-2', text: 'Increases file size on server', isCorrect: false },
        { id: 'opt-3', text: 'Disables video controls', isCorrect: false },
        { id: 'opt-4', text: 'Only works on mobile phones', isCorrect: false },
      ],
      explanation:
        'HLS dynamically switches video quality levels based on bandwidth to prevent buffering stall.',
    },
  },
  {
    id: 'evt-prod-35',
    timestamp: 35,
    type: 'product_card',
    title: 'Shoppable Gear Spotlight',
    pauseOnTrigger: true,
    data: {
      title: 'Pro Interactive Video Suite v2.0',
      price: '$149.00',
      originalPrice: '$299.00',
      image:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
      description: 'Enterprise React + Vidstack interactive video platform design system and engine.',
    },
  },
  {
    id: 'evt-cta-60',
    timestamp: 60,
    type: 'cta',
    title: 'Special Platform Discount',
    pauseOnTrigger: true,
    data: {
      title: 'Claim 50% Off Onilo Platform',
      description: 'Upgrade your video experience today with our billion-dollar design system.',
      buttonText: 'Claim 50% Discount',
      promoCode: 'ONILO50OFF',
      linkUrl: 'https://onilo.io',
    },
  },
  {
    id: 'evt-survey-90',
    timestamp: 90,
    type: 'survey',
    title: 'Stream Quality Feedback',
    pauseOnTrigger: true,
    data: {
      question: 'How would you rate the video playback experience so far?',
      options: ['Ultra Smooth HD', 'Good Quality', 'Minor Buffering', 'Needs Optimization'],
    },
  },
  {
    id: 'evt-game-120',
    timestamp: 120,
    type: 'mini_game',
    title: 'Tap the Target Mini-Game',
    pauseOnTrigger: true,
    data: {
      title: 'Interactive Target Blast',
      description: 'Tap 3 glowing targets to unlock an instant reward coupon!',
      couponCode: 'GAMER2026',
    },
  },
  {
    id: 'evt-form-150',
    timestamp: 150,
    type: 'form',
    title: 'Lead Access Form',
    pauseOnTrigger: true,
    data: {
      title: 'Unlock Platform Source Code',
      subtitle: 'Enter your name and work email to download the full interactive project repo.',
      buttonText: 'Download Repository',
    },
  },
];

export const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({
  video,
}: VideoPlayerContainerProps) => {
  const playerRef = useRef<VideoPlayerRef>(null);
  const { setCurrentTime, setDuration, setIsPlaying, currentTime, duration } = usePlayer();
  const { saveProgress } = usePlayerProgress();

  // const [showResumeBanner, setShowResumeBanner] = useState(false);
  // const [savedTime, setSavedTime] = useState(0);

  // Check saved progress on load
  // useEffect(() => {
  //   const saved = getProgress(video.id);
  //   if (saved && saved.currentTime > 5 && !saved.isCompleted) {
  //     setSavedTime(saved.currentTime);
  //     setShowResumeBanner(true);
  //   }
  // }, [video.id, getProgress]);

  // Periodic watch progress auto-save (every 5 seconds)
  useEffect(() => {
    if (currentTime > 0 && duration > 0 && Math.floor(currentTime) % 5 === 0) {
      saveProgress(video.id, currentTime, duration);
    }
  }, [currentTime, duration, video.id, saveProgress]);

  const handleTimeUpdate = (detail: { currentTime: number; duration: number }) => {
    setCurrentTime(detail.currentTime);
  };

  const handleDurationChange = (detail: number) => {
    setDuration(detail);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => {
    setIsPlaying(false);
    if (currentTime > 0 && duration > 0) {
      saveProgress(video.id, currentTime, duration);
    }
  };

  const pauseVideo = () => {
    playerRef.current?.pause();
  };

  const resumeVideo = () => {
    playerRef.current?.play();
  };

  // const handleResumePlayback = () => {
  //   if (playerRef.current) {
  //     playerRef.current.seek(savedTime);
  //     playerRef.current.play();
  //   }
  //   setShowResumeBanner(false);
  // };

  // const handleStartOver = () => {
  //   if (playerRef.current) {
  //     playerRef.current.seek(0);
  //     playerRef.current.play();
  //   }
  //   setShowResumeBanner(false);
  // };

  return (
    <div className="relative">
      {/* Resume Playback Prompt Banner */}
      {/* {showResumeBanner && (
        <ResumePlaybackBanner
          savedTime={savedTime}
          onResume={handleResumePlayback}
          onStartOver={handleStartOver}
          onClose={() => setShowResumeBanner(false)}
        />
      )} */}

      <VideoPlayer
        ref={playerRef}
        title={video.title}
        src={[
          {
            src: video.hlsUrl || video.srcUrl,
            type: 'application/x-mpegURL',
          },
        ]}
        poster={video.posterUrl}
        aspectRatio="16/9"
        useCustomUI
        textTracks={DEFAULT_TEXT_TRACKS}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={(event) => {
          console.error("VIDSTACK ERROR", event);
        }}
      >
        {/* Interactive Layer Overlay Engine (Quiz, Survey, CTA, Product, Form, Mini-Game) */}
        <InteractiveOverlayEngine
          events={SAMPLE_TIMELINE_EVENTS}
          currentTime={currentTime}
          onPauseVideo={pauseVideo}
          onResumeVideo={resumeVideo}
        />
      </VideoPlayer>
    </div>
  );
};
