export type TimelineEventType = 'quiz' | 'survey' | 'cta' | 'product_card' | 'form' | 'mini_game' | 'hotspot';

export interface TimelineEvent {
  id: string;
  timestamp: number;
  type: TimelineEventType;
  title: string;
  data: any;
  pauseOnTrigger?: boolean;
  triggerOnce?: boolean;
  replayOnSeek?: boolean;
}

export class TimelineEngine {
  private events: TimelineEvent[] = [];
  private triggeredMap: Map<string, boolean> = new Map();
  private lastProcessedTime = -1;

  constructor(events: TimelineEvent[] = []) {
    this.events = [...events].sort((a, b) => a.timestamp - b.timestamp);
  }

  public setEvents(events: TimelineEvent[]) {
    this.events = [...events].sort((a, b) => a.timestamp - b.timestamp);
    this.triggeredMap.clear();
  }

  public processTime(currentTime: number, onTriggerEvent: (event: TimelineEvent) => void) {
    const previousTime = this.lastProcessedTime;
    this.lastProcessedTime = currentTime;

    const isBackwardSeek = previousTime >= 0 && currentTime < previousTime - 1.5;
    if (isBackwardSeek) {
      this.handleSeek(currentTime);
    }

    const windowStart = !isBackwardSeek && previousTime >= 0 ? previousTime : currentTime - 0.6;
    const windowEnd = currentTime + 0.6;

    const crossed = this.events.filter(
      (event) => !this.triggeredMap.get(event.id) && event.timestamp >= windowStart && event.timestamp <= windowEnd,
    );

    if (crossed.length === 0) return;

    // Mark every crossed event as seen so none of them fire later out of context...
    crossed.forEach((event) => this.triggeredMap.set(event.id, true));

    // ...but only surface the one closest to where playback actually landed, so jumping
    // over several events doesn't stack multiple overlays on top of each other.
    const eventToShow = crossed.reduce((closest, event) =>
      Math.abs(event.timestamp - currentTime) < Math.abs(closest.timestamp - currentTime) ? event : closest,
    );
    onTriggerEvent(eventToShow);
  }

  public handleSeek(newTime: number) {
    for (const event of this.events) {
      if (event.timestamp >= newTime && event.replayOnSeek !== false) {
        this.triggeredMap.delete(event.id);
      }
    }
  }

  public resetAll() {
    this.triggeredMap.clear();
    this.lastProcessedTime = -1;
  }

  public getEvents(): TimelineEvent[] {
    return this.events;
  }
}
