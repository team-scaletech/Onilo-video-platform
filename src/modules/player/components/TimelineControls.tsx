import React from 'react';
import { HelpCircle, Sparkles, Bookmark } from 'lucide-react';
import { InteractiveMarker } from '../../../types';
import { formatTime } from '../../../utils';

export interface TimelineControlsProps {
  duration: number;
  currentTime: number;
  markers: InteractiveMarker[];
  onSeek: (time: number) => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  duration,
  currentTime,
  markers,
  onSeek,
}) => {
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

        {/* Marker Flags on Timeline */}
        {markers.map((marker) => {
          const percent = duration > 0 ? (marker.timestamp / duration) * 100 : 0;
          return (
            <button
              key={marker.id}
              onClick={() => onSeek(marker.timestamp)}
              style={{ left: `${percent}%` }}
              title={`${marker.title} (${formatTime(marker.timestamp)})`}
              className="absolute top-0 bottom-0 -translate-x-1/2 w-3 flex items-center justify-center group/marker hover:scale-125 transition-transform z-10"
            >
              {marker.type === 'quiz' ? (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900 shadow-md animate-pulse" />
              ) : marker.type === 'hotspot' ? (
                <span className="w-2.5 h-2.5 rounded-full bg-cyanGlow border border-slate-900 shadow-md" />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Markers Quick Legend */}
      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
        <div className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Quizzes ({markers.filter((m) => m.type === 'quiz').length})</span>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyanGlow" />
          <span>Hotspots ({markers.filter((m) => m.type === 'hotspot').length})</span>
        </div>
        <div className="flex items-center gap-1">
          <Bookmark className="w-3.5 h-3.5 text-purple-400" />
          <span>Chapters ({markers.filter((m) => m.type === 'chapter').length})</span>
        </div>
      </div>
    </div>
  );
};
