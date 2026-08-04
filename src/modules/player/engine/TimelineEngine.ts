export type TimelineEventType =
  | 'quiz'
  | 'survey'
  | 'cta'
  | 'product_card'
  | 'form'
  | 'mini_game'
  | 'hotspot';

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
    // Detect backward seek: reset triggered events occurring after currentTime
    if (this.lastProcessedTime > 0 && currentTime < this.lastProcessedTime - 1.5) {
      this.handleSeek(currentTime);
    }
    this.lastProcessedTime = currentTime;

    // Check for matching events in precision window (±0.6s)
    for (const event of this.events) {
      const timeDiff = Math.abs(event.timestamp - currentTime);
      const isAlreadyTriggered = this.triggeredMap.get(event.id);

      if (timeDiff <= 0.6 && !isAlreadyTriggered) {
        this.triggeredMap.set(event.id, true);
        onTriggerEvent(event);
        break; // Trigger one event per tick to avoid overlay collision
      }
    }
  }

  public handleSeek(newTime: number) {
    // Reset triggered status for events scheduled after newTime if replayOnSeek is true
    for (const event of this.events) {
      if (event.timestamp > newTime && event.replayOnSeek !== false) {
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
