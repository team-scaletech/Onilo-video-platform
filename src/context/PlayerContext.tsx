import React, { createContext, useContext, useState, useCallback } from 'react';
import { InteractiveMarker, PlayerState, VideoMetadata } from '../types';

interface PlayerContextType extends PlayerState {
  currentVideo: VideoMetadata | null;
  activeQuizMarker: InteractiveMarker | null;
  activeHotspotMarker: InteractiveMarker | null;
  
  setCurrentVideo: (video: VideoMetadata) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setActiveQuizMarker: (marker: InteractiveMarker | null) => void;
  setActiveHotspotMarker: (marker: InteractiveMarker | null) => void;
  addScore: (points: number) => void;
  resetPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVideo, setCurrentVideoState] = useState<VideoMetadata | null>(null);
  const [currentTime, setCurrentTimeState] = useState<number>(0);
  const [duration, setDurationState] = useState<number>(0);
  const [isPlaying, setIsPlayingState] = useState<boolean>(false);
  const [isMuted] = useState<boolean>(false);
  const [volume] = useState<number>(0.9);
  const [isFullscreen] = useState<boolean>(false);
  const [activeMarker] = useState<InteractiveMarker | null>(null);
  const [activeQuizMarker, setActiveQuizMarkerState] = useState<InteractiveMarker | null>(null);
  const [activeHotspotMarker, setActiveHotspotMarkerState] = useState<InteractiveMarker | null>(null);
  const [userScore, setUserScoreState] = useState<number>(0);
  const [playbackQuality] = useState<string>('1080p');

  const setCurrentVideo = useCallback((video: VideoMetadata) => {
    setCurrentVideoState(video);
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    setCurrentTimeState(time);
  }, []);

  const setDuration = useCallback((dur: number) => {
    setDurationState(dur);
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setIsPlayingState(playing);
  }, []);

  const setActiveQuizMarker = useCallback((marker: InteractiveMarker | null) => {
    setActiveQuizMarkerState(marker);
  }, []);

  const setActiveHotspotMarker = useCallback((marker: InteractiveMarker | null) => {
    setActiveHotspotMarkerState(marker);
  }, []);

  const addScore = useCallback((points: number) => {
    setUserScoreState((prev) => prev + points);
  }, []);

  const resetPlayer = useCallback(() => {
    setCurrentTimeState(0);
    setIsPlayingState(false);
    setActiveQuizMarkerState(null);
    setActiveHotspotMarkerState(null);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentVideo,
        currentTime,
        duration,
        isPlaying,
        isMuted,
        volume,
        isFullscreen,
        activeMarker,
        activeQuizMarker,
        activeHotspotMarker,
        userScore,
        playbackQuality,
        setCurrentVideo,
        setCurrentTime,
        setDuration,
        setIsPlaying,
        setActiveQuizMarker,
        setActiveHotspotMarker,
        addScore,
        resetPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
