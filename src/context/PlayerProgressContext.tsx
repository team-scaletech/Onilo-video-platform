import React, { createContext, useContext, useState, useEffect } from 'react';

export interface VideoWatchProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  completedPercent: number;
  isCompleted: boolean;
  lastUpdated: string;
}

interface PlayerProgressContextType {
  watchHistory: Record<string, VideoWatchProgress>;
  saveProgress: (videoId: string, currentTime: number, duration: number) => void;
  getProgress: (videoId: string) => VideoWatchProgress | null;
  clearProgress: (videoId: string) => void;
}

const STORAGE_KEY = 'onilo_watch_progress_v1';

const PlayerProgressContext = createContext<PlayerProgressContextType | undefined>(undefined);

export const PlayerProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchHistory, setWatchHistory] = useState<Record<string, VideoWatchProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchHistory));
    } catch (e) {
      console.warn('Failed to persist watch progress to localStorage', e);
    }
  }, [watchHistory]);

  const saveProgress = (videoId: string, currentTime: number, duration: number) => {
    if (!videoId || duration <= 0) return;
    const completedPercent = Math.min(100, Math.floor((currentTime / duration) * 100));
    const isCompleted = completedPercent >= 90;

    setWatchHistory((prev) => ({
      ...prev,
      [videoId]: {
        videoId,
        currentTime: Math.floor(currentTime),
        duration: Math.floor(duration),
        completedPercent,
        isCompleted,
        lastUpdated: new Date().toISOString(),
      },
    }));
  };

  const getProgress = (videoId: string): VideoWatchProgress | null => {
    return watchHistory[videoId] || null;
  };

  const clearProgress = (videoId: string) => {
    setWatchHistory((prev) => {
      const copy = { ...prev };
      delete copy[videoId];
      return copy;
    });
  };

  return (
    <PlayerProgressContext.Provider
      value={{
        watchHistory,
        saveProgress,
        getProgress,
        clearProgress,
      }}
    >
      {children}
    </PlayerProgressContext.Provider>
  );
};

export const usePlayerProgress = () => {
  const context = useContext(PlayerProgressContext);
  if (!context) {
    throw new Error('usePlayerProgress must be used within a PlayerProgressProvider');
  }
  return context;
};
