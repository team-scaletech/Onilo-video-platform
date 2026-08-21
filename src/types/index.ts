export type Theme = 'dark' | 'light';

export type EventType = 'quiz' | 'hotspot' | 'game' | 'chapter' | 'banner' | 'click_target';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizPayload {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  points: number;
}

export interface HotspotPayload {
  id: string;
  title: string;
  description: string;
  linkUrl?: string;
  buttonText?: string;
  xPercent: number; // Position on player overlay
  yPercent: number;
}

export interface InteractiveMarker {
  id: string;
  timestamp: number; // in seconds
  duration?: number;
  type: EventType;
  title: string;
  description?: string;
  quiz?: QuizPayload;
  hotspot?: HotspotPayload;
  isCompleted?: boolean;
}

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  srcUrl: string;
  hlsUrl?: string;
  duration: number; // in seconds
  viewsCount: number;
  completionRate: number;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
  interactiveMarkers: InteractiveMarker[];
  createdAt: string;
}

export interface PlayerState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  activeMarker: InteractiveMarker | null;
  userScore: number;
  playbackQuality: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
