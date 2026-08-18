import React from 'react';
import { Layers } from 'lucide-react';
import { TimelineEvent, TimelineEventType } from '../engine/TimelineEngine';
import { formatTime } from '../../../utils';

export interface TimelineControlsProps {
  duration: number;
  currentTime: number;
  events: TimelineEvent[];
  onSeek: (time: number) => void;
}

const EVENT_DOT_COLOR: Record<TimelineEventType, string> = {
  quiz: 'bg-amber-400',
  hotspot: 'bg-cyanGlow',
  product_card: 'bg-teal-400',
  cta: 'bg-purple-400',
  survey: 'bg-blue-400',
  mini_game: 'bg-emerald-400',
  form: 'bg-pink-400',
};

const EVENT_TYPE_LABEL: Record<TimelineEventType, string> = {
  quiz: 'Quiz',
  hotspot: 'Hotspot',
  product_card: 'Product',
  cta: 'CTA',
  survey: 'Survey',
  mini_game: 'Mini-Game',
  form: 'Form',
};

export const TimelineControls: React.FC<TimelineControlsProps> = ({ duration, currentTime, events, onSeek }) => {
  // Count of each type actually present, in the order they're configured -- the legend only
  // shows types that have at least one event instead of a fixed list, so it stays compact
  // whether a video has 2 event types or all 7.
  const typeCounts = events.reduce<Partial<Record<TimelineEventType, number>>>((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="w-full space-y-2 p-4 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Interactive Timeline Markers
        </span>
        <span className="text-slate-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Seek Track Bar */}
      <div className="relative w-full h-3 bg-slate-800 rounded-full cursor-pointer overflow-hidden group">
        {/* Progress Fill */}
        <div
          className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-brand-600 via-purple-500 to-cyanGlow rounded-full transition-all duration-150"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />

        {/* Marker Flags on Timeline -- every configured event, not just a subset */}
        {events.map((event) => {
          const percent = duration > 0 ? (event.timestamp / duration) * 100 : 0;
          return (
            <button
              key={event.id}
              onClick={() => onSeek(event.timestamp)}
              style={{ left: `${percent}%` }}
              title={`${event.title} (${formatTime(event.timestamp)})`}
              className="absolute top-0 bottom-0 -translate-x-1/2 w-3 flex items-center justify-center group/marker hover:scale-125 transition-transform z-10"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full border border-slate-900 shadow-md ${EVENT_DOT_COLOR[event.type]}`}
              />
            </button>
          );
        })}
      </div>

      {/* Markers Quick Legend -- only shows the types actually present for this video */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-400 pt-1">
        {(Object.keys(typeCounts) as TimelineEventType[]).map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${EVENT_DOT_COLOR[type]}`} />
            <span>
              {EVENT_TYPE_LABEL[type]} ({typeCounts[type]})
            </span>
          </div>
        ))}
        {events.length === 0 && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <Layers className="w-3.5 h-3.5" />
            <span>No interactive events configured</span>
          </div>
        )}
      </div>
    </div>
  );
};
