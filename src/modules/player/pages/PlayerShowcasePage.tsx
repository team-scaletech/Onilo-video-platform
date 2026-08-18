import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  History, Layers,
  HelpCircle, ShoppingBag, Megaphone, BarChart3, Gamepad2, Mail, MapPin, Play
} from 'lucide-react';
import { VideoPlayerContainer } from '../components/VideoPlayerContainer';
import { TimelineControls } from '../components/TimelineControls';
import { getTimelineEventsForVideo } from '../data/mockTimelineEvents';
import { TimelineEventType } from '../engine/TimelineEngine';
import { usePlayer } from '../../../hooks';
import { usePlayerProgress } from '../../../context/PlayerProgressContext';
import { MOCK_VIDEOS } from '../../../constants';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const TIMELINE_EVENT_DISPLAY: Record<TimelineEventType, { icon: typeof HelpCircle; color: string }> = {
  quiz: { icon: HelpCircle, color: 'text-amber-400' },
  product_card: { icon: ShoppingBag, color: 'text-cyanGlow' },
  cta: { icon: Megaphone, color: 'text-purple-400' },
  survey: { icon: BarChart3, color: 'text-blue-400' },
  mini_game: { icon: Gamepad2, color: 'text-emerald-400' },
  form: { icon: Mail, color: 'text-pink-400' },
  hotspot: { icon: MapPin, color: 'text-cyanGlow' },
};

export const PlayerShowcasePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentVideo, setCurrentVideo, currentTime, duration, playerControls } = usePlayer();
  const { getProgress } = usePlayerProgress();

  useEffect(() => {
    const video = MOCK_VIDEOS.find((v) => v.id === id) || MOCK_VIDEOS[0];
    setCurrentVideo(video);
  }, [id, setCurrentVideo]);

  if (!currentVideo) return null;

  const currentProgress = getProgress(currentVideo.id);

  const timelineEvents = getTimelineEventsForVideo(currentVideo.id);
  const timelineItems = timelineEvents.map((event) => ({
    time: event.timestamp,
    label: event.title,
    ...TIMELINE_EVENT_DISPLAY[event.type],
  }));

  const handleSeekTo = (seekTime: number) => {
    playerControls?.seek(seekTime);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="cyan" pulse>
              Vidstack HLS & Interactive Engine
            </Badge>
            <span className="text-xs text-slate-400 font-mono">ID: {currentVideo.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentVideo.title}
          </h1>
        </div>
      </div>

      {/* Main Video Viewport & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Player & Seeker Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vidstack Video Player Container */}
          <VideoPlayerContainer video={currentVideo} />

          {/* Interactive Seeker Controls */}
          <TimelineControls
            duration={duration || currentVideo.duration}
            currentTime={currentTime}
            events={timelineEvents}
            onSeek={handleSeekTo}
          />

          {/* Watch Progress Indicator Bar */}
          {currentProgress && (
            <Card className="p-4 border-cyan-500/30 bg-slate-900/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-cyanGlow" />
                <div>
                  <div className="text-xs font-bold text-white">
                    Watch Progress Tracker: <span className="text-cyanGlow">{currentProgress.completedPercent}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Last Saved: {new Date(currentProgress.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="w-36 h-2 rounded-full bg-slate-950 border border-white/10 overflow-hidden">
                <div
                  style={{ width: `${currentProgress.completedPercent}%` }}
                  className="h-full bg-gradient-to-r from-brand-500 to-cyanGlow shadow-glow"
                />
              </div>
            </Card>
          )}

        </div>

        {/* Right 1 Column: Interactive Timeline & Telemetry Sidebar */}
        <div className="space-y-6">
          {/* Interactive Timeline Event Log */}
          <Card className="p-5 space-y-4 bg-slate-900/90 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Configured Timeline Overlays
              </span>
              <Badge variant="purple" className="text-[10px] px-2 py-0.5">
                {timelineItems.length} Events
              </Badge>
            </div>

            <div className="space-y-2.5">
              {timelineItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentTime >= item.time && currentTime < item.time + 15;
                return (
                  <div
                    key={item.time}
                    onClick={() => handleSeekTo(item.time)}
                    className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 text-xs group relative overflow-hidden ${isActive
                        ? 'bg-gradient-to-r from-cyan-950/90 via-slate-950 to-purple-950/90 border-cyan-400 shadow-glow ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/80 border-white/10 hover:border-cyan-500/40 hover:bg-slate-900'
                      }`}
                  >
                    {/* Active glowing indicator bar on left */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyanGlow shadow-glow" />
                    )}

                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`p-2 rounded-lg bg-slate-900 border border-white/10 shrink-0 ${item.color} group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`block font-semibold text-xs transition-colors truncate ${isActive ? 'text-white font-bold' : 'text-slate-200 group-hover:text-white'}`}>
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans block truncate">
                          Triggers interactive overlay
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isActive && (
                        <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-cyan-400 text-slate-950 shadow-glow animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                          LIVE NOW
                        </span>
                      )}
                      <span className="font-mono text-[11px] text-cyanGlow bg-slate-900 px-2 py-1 rounded-lg border border-white/10 font-bold group-hover:border-cyan-500/40 whitespace-nowrap">
                        @{item.time}s
                      </span>
                      <div className="p-1 rounded-lg text-slate-400 group-hover:text-cyanGlow group-hover:bg-cyan-500/20 transition-all">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
