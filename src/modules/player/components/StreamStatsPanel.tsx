import React from 'react';
import { Activity } from 'lucide-react';
import { useStreamTelemetry } from '../engine/useStreamTelemetry';

const StatRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-slate-500">{label}</span>
    <span className="text-slate-100 font-semibold">{value}</span>
  </div>
);

export const StreamStatsPanel: React.FC = () => {
  const telemetry = useStreamTelemetry();

  return (
    <div className="absolute top-14 sm:top-16 right-3 sm:right-4 z-30 w-52 sm:w-56 rounded-xl bg-slate-950/95 border border-white/15 backdrop-blur-xl p-3 text-[11px] font-mono text-slate-300 space-y-1.5 pointer-events-none shadow-2xl">
      <div className="flex items-center gap-1.5 text-cyanGlow font-bold text-[10px] uppercase tracking-wider mb-1.5">
        <Activity className="w-3 h-3" /> Stream Stats
      </div>
      <StatRow label="Resolution" value={telemetry.resolution} />
      <StatRow label="Bitrate" value={telemetry.bitrateKbps ? `${telemetry.bitrateKbps} kbps` : 'N/A'} />
      <StatRow label="Quality Mode" value={telemetry.isAuto ? 'Auto (ABR)' : 'Manual'} />
      <StatRow
        label="Renditions"
        value={telemetry.qualityLevelCount > 0 ? String(telemetry.qualityLevelCount) : 'N/A'}
      />
      <StatRow label="Buffer Health" value={`${telemetry.bufferHealthSeconds}s`} />
      <StatRow label="Dropped Frames" value={`${telemetry.droppedFrames}/${telemetry.totalFrames}`} />
      <StatRow label="Buffering" value={telemetry.isBuffering ? 'Yes' : 'No'} />
      <StatRow label="Network Errors" value={String(telemetry.networkErrorCount)} />
    </div>
  );
};
