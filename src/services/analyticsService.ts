import { apiClient } from './apiClient';

export type AnalyticsEventName =
  | 'video_play'
  | 'video_pause'
  | 'video_seek'
  | 'video_progress'
  | 'video_completed'
  | 'interactive_event_triggered'
  | 'interactive_event_dismissed';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  videoId: string;
  currentTime: number;
  occurredAt: string;
  meta?: Record<string, unknown>;
}

const STORAGE_KEY = 'onilo_analytics_events_v1';
const MAX_BUFFERED_EVENTS = 300;
const isMock = import.meta.env.VITE_ENABLE_MOCK_API !== 'false';

function readBuffer(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function bufferLocally(event: AnalyticsEvent) {
  try {
    const events = readBuffer();
    events.push(event);
    if (events.length > MAX_BUFFERED_EVENTS) {
      events.splice(0, events.length - MAX_BUFFERED_EVENTS);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to buffer analytics event to localStorage', e);
  }
}

export interface VideoAnalyticsSummary {
  videoId: string;
  plays: number;
  pauses: number;
  seeks: number;
  completions: number;
  completionRate: number; // 0-100, completions / plays
  avgEngagement: number; // 0-100, mean of each play's furthest percentWatched
  interactions: number;
}

export interface AnalyticsSummary {
  totalPlays: number;
  totalPauses: number;
  totalSeeks: number;
  totalCompletions: number;
  completionRate: number; // 0-100
  avgEngagement: number; // 0-100
  totalInteractions: number;
  interactionsByType: { type: string; count: number }[];
  perVideo: VideoAnalyticsSummary[];
}

function emptySummary(): AnalyticsSummary {
  return {
    totalPlays: 0,
    totalPauses: 0,
    totalSeeks: 0,
    totalCompletions: 0,
    completionRate: 0,
    avgEngagement: 0,
    totalInteractions: 0,
    interactionsByType: [],
    perVideo: [],
  };
}

export const analyticsService = {
  track(
    name: AnalyticsEventName,
    videoId: string,
    currentTime: number,
    meta?: Record<string, unknown>
  ) {
    const event: AnalyticsEvent = {
      name,
      videoId,
      currentTime: Math.floor(currentTime),
      occurredAt: new Date().toISOString(),
      meta,
    };

    if (isMock) {
      console.log(`[Analytics] ${name}`, event);
      bufferLocally(event);
      return;
    }

    apiClient.post('/analytics/events', event).catch((error) => {
      console.warn('[Analytics] Failed to send event', error);
    });
  },

  getBufferedEvents(): AnalyticsEvent[] {
    return readBuffer();
  },

  clearBufferedEvents() {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Aggregates the buffered event log into the metrics the Analytics page renders.
  // `video_progress` events carry the furthest `percentWatched` reached so far for a play;
  // engagement per video is the mean of each video's single highest percentWatched reading
  // (a completed play counts as 100%, since `video_completed` doesn't repeat the percent).
  getAnalyticsSummary(): AnalyticsSummary {
    const events = readBuffer();
    if (events.length === 0) return emptySummary();

    const byVideo = new Map<string, VideoAnalyticsSummary>();
    const maxPercentByVideo = new Map<string, number>();
    const interactionTypeCounts = new Map<string, number>();

    const getVideo = (videoId: string): VideoAnalyticsSummary => {
      let entry = byVideo.get(videoId);
      if (!entry) {
        entry = {
          videoId,
          plays: 0,
          pauses: 0,
          seeks: 0,
          completions: 0,
          completionRate: 0,
          avgEngagement: 0,
          interactions: 0,
        };
        byVideo.set(videoId, entry);
      }
      return entry;
    };

    for (const event of events) {
      const video = getVideo(event.videoId);

      switch (event.name) {
        case 'video_play':
          video.plays += 1;
          break;
        case 'video_pause':
          video.pauses += 1;
          break;
        case 'video_seek':
          video.seeks += 1;
          break;
        case 'video_progress': {
          const percent = Number(event.meta?.percentWatched ?? 0);
          const prevMax = maxPercentByVideo.get(event.videoId) ?? 0;
          if (percent > prevMax) maxPercentByVideo.set(event.videoId, percent);
          break;
        }
        case 'video_completed':
          video.completions += 1;
          maxPercentByVideo.set(event.videoId, 100);
          break;
        case 'interactive_event_triggered': {
          video.interactions += 1;
          const type = String(event.meta?.eventType ?? 'other');
          interactionTypeCounts.set(type, (interactionTypeCounts.get(type) ?? 0) + 1);
          break;
        }
      }
    }

    for (const video of byVideo.values()) {
      video.completionRate = video.plays > 0 ? Math.round((video.completions / video.plays) * 100) : 0;
      video.avgEngagement = Math.round(maxPercentByVideo.get(video.videoId) ?? 0);
    }

    const perVideo = [...byVideo.values()].sort((a, b) => b.plays - a.plays);
    const totalPlays = perVideo.reduce((sum, v) => sum + v.plays, 0);
    const totalCompletions = perVideo.reduce((sum, v) => sum + v.completions, 0);
    const engagementSamples = [...maxPercentByVideo.values()];

    return {
      totalPlays,
      totalPauses: perVideo.reduce((sum, v) => sum + v.pauses, 0),
      totalSeeks: perVideo.reduce((sum, v) => sum + v.seeks, 0),
      totalCompletions,
      completionRate: totalPlays > 0 ? Math.round((totalCompletions / totalPlays) * 100) : 0,
      avgEngagement:
        engagementSamples.length > 0
          ? Math.round(engagementSamples.reduce((sum, p) => sum + p, 0) / engagementSamples.length)
          : 0,
      totalInteractions: perVideo.reduce((sum, v) => sum + v.interactions, 0),
      interactionsByType: [...interactionTypeCounts.entries()]
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      perVideo,
    };
  },
};
