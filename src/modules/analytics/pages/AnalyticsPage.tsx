import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Eye,
  Gauge,
  HelpCircle,
  MapPin,
  Mail,
  Megaphone,
  MousePointerClick,
  Pause,
  Play,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { analyticsService, AnalyticsSummary } from '../../../services/analyticsService';
import { MOCK_VIDEOS } from '../../../constants';

const INTERACTION_TYPE_DISPLAY: Record<string, { label: string; icon: typeof HelpCircle }> = {
  quiz: { label: 'Quiz', icon: HelpCircle },
  hotspot: { label: 'Hotspot', icon: MapPin },
  product_card: { label: 'Product Card', icon: ShoppingBag },
  cta: { label: 'CTA', icon: Megaphone },
  survey: { label: 'Survey', icon: BarChart3 },
  mini_game: { label: 'Mini-Game', icon: Sparkles },
  form: { label: 'Form', icon: Mail },
  other: { label: 'Other', icon: MousePointerClick },
};

const videoTitleById = (videoId: string) => MOCK_VIDEOS.find((v) => v.id === videoId)?.title ?? videoId;

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<AnalyticsSummary>(() => analyticsService.getAnalyticsSummary());

  // Buffered events accumulate in localStorage as the user watches videos elsewhere in the
  // app, so re-read the summary whenever this page regains focus rather than only on mount.
  useEffect(() => {
    const refresh = () => setSummary(analyticsService.getAnalyticsSummary());
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const maxInteractionCount = useMemo(
    () => Math.max(1, ...summary.interactionsByType.map((i) => i.count)),
    [summary.interactionsByType],
  );

  const hasData = summary.totalPlays > 0 || summary.totalInteractions > 0;

  const handleClear = () => {
    analyticsService.clearBufferedEvents();
    setSummary(analyticsService.getAnalyticsSummary());
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" pulse>
              Playback & Interaction Telemetry
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Analytics</h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Aggregated from real playback events tracked in this browser — play, pause, seek, completion, and
            interaction telemetry captured by <code className="text-cyanGlow">analyticsService</code>.
          </p>
        </div>

        {hasData && (
          <Button variant="outline" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />} onClick={handleClear}>
            Clear Local Data
          </Button>
        )}
      </div>

      {!hasData ? (
        <Card className="p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/15 text-brand-400 flex items-center justify-center mx-auto">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">No analytics data yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Watch a video to start generating play, pause, seek, completion, and interaction events.
            </p>
          </div>
          <Button variant="glow" size="md" leftIcon={<Play className="w-4 h-4" />} onClick={() => navigate('/player/vid-001')}>
            Launch Boardstory Player Demo
          </Button>
        </Card>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <StatCard
              title="Completion Rate"
              value={`${summary.completionRate}%`}
              icon={<CheckCircle2 className="w-5 h-5" />}
              description={`${summary.totalCompletions} of ${summary.totalPlays} plays finished`}
            />
            <StatCard
              title="Avg Engagement"
              value={`${summary.avgEngagement}%`}
              icon={<Gauge className="w-5 h-5" />}
              description="Mean furthest watch point reached"
            />
            <StatCard
              title="Total Interactions"
              value={summary.totalInteractions}
              icon={<MousePointerClick className="w-5 h-5" />}
              description="Quiz, hotspot, CTA & more triggered"
            />
            <StatCard
              title="Total Plays"
              value={summary.totalPlays}
              icon={<Eye className="w-5 h-5" />}
              description={`${summary.totalPauses} pauses · ${summary.totalSeeks} seeks`}
            />
          </div>

          {/* Event Totals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 shrink-0">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">{summary.totalPlays}</div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Play Events</div>
              </div>
            </Card>
            <Card className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 shrink-0">
                <Pause className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">{summary.totalPauses}</div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Pause Events</div>
              </div>
            </Card>
            <Card className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyanGlow shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">{summary.totalSeeks}</div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Seek Events</div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactions by Type */}
            <Card className="p-6 space-y-5 lg:col-span-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-brand-400" />
                Interactions by Type
              </h3>

              {summary.interactionsByType.length === 0 ? (
                <p className="text-xs text-slate-400">No interactive overlays triggered yet.</p>
              ) : (
                <div className="space-y-3.5">
                  {summary.interactionsByType.map(({ type, count }) => {
                    const display = INTERACTION_TYPE_DISPLAY[type] ?? INTERACTION_TYPE_DISPLAY.other;
                    const Icon = display.icon;
                    const widthPercent = Math.round((count / maxInteractionCount) * 100);
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                            <Icon className="w-3.5 h-3.5 text-slate-400" />
                            {display.label}
                          </span>
                          <span className="text-xs font-mono font-bold text-cyanGlow">{count}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${widthPercent}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyanGlow"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Per-Video Breakdown */}
            <Card className="p-6 space-y-5 lg:col-span-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-400" />
                Per-Video Breakdown
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 pr-4">Video</th>
                      <th className="py-2.5 px-4 text-right">Plays</th>
                      <th className="py-2.5 px-4 text-right">Completion</th>
                      <th className="py-2.5 px-4 text-right">Engagement</th>
                      <th className="py-2.5 pl-4 text-right">Interactions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {summary.perVideo.map((video) => (
                      <tr key={video.videoId} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="font-bold text-white line-clamp-1 max-w-[220px]">
                            {videoTitleById(video.videoId)}
                          </div>
                          <div className="text-[10px] text-slate-500">{video.videoId}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">{video.plays}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                          {video.completionRate}%
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-cyanGlow">{video.avgEngagement}%</td>
                        <td className="py-3 pl-4 text-right font-semibold">{video.interactions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
