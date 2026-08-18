import { useEffect, useRef, useState } from 'react';
import { useMediaPlayer, useMediaState } from '@vidstack/react';

export interface StreamTelemetry {
  resolution: string;
  bitrateKbps: number | null;
  bufferHealthSeconds: number;
  droppedFrames: number;
  totalFrames: number;
  isAuto: boolean;
  canSwitchQuality: boolean;
  isBuffering: boolean;
  networkErrorCount: number;
  qualityLevelCount: number;
}

interface LegacyVideoElement extends HTMLVideoElement {
  webkitDroppedFrameCount?: number;
  webkitDecodedFrameCount?: number;
}

/**
 * Derives live stream stats from Vidstack's reactive media state and the underlying
 * <video> element, rather than fabricating values — dropped/total frames come from
 * getVideoPlaybackQuality() (falling back to the legacy webkit* counters on Safari).
 */
export function useStreamTelemetry(): StreamTelemetry {
  const player = useMediaPlayer();
  const quality = useMediaState('quality');
  const qualities = useMediaState('qualities');
  const autoQuality = useMediaState('autoQuality');
  const canSetQuality = useMediaState('canSetQuality');
  const buffered = useMediaState('buffered');
  const currentTime = useMediaState('currentTime');
  const isWaiting = useMediaState('waiting');
  const error = useMediaState('error');

  const [frameStats, setFrameStats] = useState({ dropped: 0, total: 0 });
  const [networkErrorCount, setNetworkErrorCount] = useState(0);
  const lastErrorRef = useRef<unknown>(null);

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      setNetworkErrorCount((count) => count + 1);
    }
    lastErrorRef.current = error;
  }, [error]);

  useEffect(() => {
    const video = (player?.provider as { video?: LegacyVideoElement } | null)?.video;
    if (!video) return;

    const poll = () => {
      if (typeof video.getVideoPlaybackQuality === 'function') {
        const stats = video.getVideoPlaybackQuality();
        setFrameStats({ dropped: stats.droppedVideoFrames, total: stats.totalVideoFrames });
      } else if (typeof video.webkitDroppedFrameCount === 'number') {
        setFrameStats({
          dropped: video.webkitDroppedFrameCount,
          total: video.webkitDecodedFrameCount ?? 0,
        });
      }
    };

    poll();
    const interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, [player]);

  const bufferedEnd = buffered.length > 0 ? buffered.end(buffered.length - 1) : 0;

  return {
    resolution: quality ? `${quality.width}x${quality.height}` : 'Unknown',
    bitrateKbps: quality?.bitrate ? Math.round(quality.bitrate / 1000) : null,
    bufferHealthSeconds: Math.max(0, parseFloat((bufferedEnd - currentTime).toFixed(1))),
    droppedFrames: frameStats.dropped,
    totalFrames: frameStats.total,
    isAuto: autoQuality,
    canSwitchQuality: canSetQuality,
    isBuffering: isWaiting,
    networkErrorCount,
    qualityLevelCount: qualities.length,
  };
}
