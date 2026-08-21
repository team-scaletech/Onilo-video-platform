import React from 'react';
import { VideoMetadata } from '../types';
import { PlayerProvider } from '../context/PlayerContext';
import { PlayerProgressProvider } from '../context/PlayerProgressContext';
import { VideoPlayerContainer } from '../modules/player/components/VideoPlayerContainer';

export interface OniloVideoPlayerProps {
  video: VideoMetadata;
}

export const OniloVideoPlayer: React.FC<OniloVideoPlayerProps> = ({ video }) => (
  <PlayerProvider>
    <PlayerProgressProvider>
      <VideoPlayerContainer video={video} />
    </PlayerProgressProvider>
  </PlayerProvider>
);
