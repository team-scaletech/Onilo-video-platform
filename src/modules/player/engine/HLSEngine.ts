export interface StreamTelemetry {
  bitrateKbps: number;
  resolution: string;
  bufferHealthSeconds: number;
  droppedFrames: number;
  currentQualityLevel: string;
  totalQualityLevels: number;
  isBuffering: boolean;
  networkErrorCount: number;
  fallbackActive: boolean;
}

export class HLSEngine {
  private networkErrorCount = 0;
  private maxRetries = 3;
  private fallbackActive = false;
  private fallbackUrl: string;

  constructor(_primaryUrl: string, fallbackUrl?: string) {
    this.fallbackUrl =
      fallbackUrl ||
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
  }

  public handleNetworkError(onFallbackTriggered?: (fallbackUrl: string) => void): boolean {
    this.networkErrorCount += 1;
    if (this.networkErrorCount >= this.maxRetries && !this.fallbackActive) {
      this.fallbackActive = true;
      if (onFallbackTriggered) {
        onFallbackTriggered(this.fallbackUrl);
      }
      return true; // Fallback engaged
    }
    return false;
  }

  public resetErrors() {
    this.networkErrorCount = 0;
    this.fallbackActive = false;
  }

  public getTelemetry(
    currentTime: number,
    duration: number,
    bufferedEnd: number,
    isPlaying: boolean
  ): StreamTelemetry {
    const bufferHealthSeconds = Math.max(0, bufferedEnd - currentTime);
    const isStalled = isPlaying && bufferHealthSeconds < 0.2 && currentTime < duration - 1;

    return {
      bitrateKbps: this.fallbackActive ? 2400 : 4500,
      resolution: this.fallbackActive ? '720p (MP4 Fallback)' : '1080p Full HD (HLS)',
      bufferHealthSeconds: parseFloat(bufferHealthSeconds.toFixed(1)),
      droppedFrames: 0,
      currentQualityLevel: this.fallbackActive ? 'Direct MP4' : 'Auto HLS (Level 4)',
      totalQualityLevels: 5,
      isBuffering: isStalled,
      networkErrorCount: this.networkErrorCount,
      fallbackActive: this.fallbackActive,
    };
  }
}
