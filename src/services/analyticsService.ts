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
};
