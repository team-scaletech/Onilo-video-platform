import React from 'react';
import { Plus, UploadCloud, Video, Search, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MOCK_VIDEOS } from '../../../constants';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald" pulse>
              Enterprise Admin Portal
            </Badge>
            <span className="text-xs text-slate-400">Node/NestJS Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Video Management & Interactive Quiz Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="glow" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Interactive Video
          </Button>
        </div>
      </div>

      {/* Quick Upload Ingestion Card */}
      <Card className="p-6 border-dashed border-2 border-brand-500/40 bg-slate-900/40 hover:border-brand-500 transition-colors cursor-pointer text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto shadow-glow">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-white">Upload Video or Import HLS Stream</h3>
          <p className="text-xs text-slate-400 mt-1">
            Drag & drop MP4, MOV, or enter .m3u8 URL to generate adaptive HLS manifests.
          </p>
        </div>
      </Card>

      {/* Video Assets Table */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-brand-400" />
            Active Video Repository
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Video Asset</th>
                <th className="py-3 px-4">HLS Status</th>
                <th className="py-3 px-4">Interactive Markers</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Completion</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {MOCK_VIDEOS.map((video) => (
                <tr key={video.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={video.posterUrl}
                        alt={video.title}
                        className="w-12 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white line-clamp-1">{video.title}</div>
                        <div className="text-[10px] text-slate-400">{video.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready (HLS)
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="purple">
                      {video.interactiveMarkers.length} Markers Configured
                    </Badge>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-200">
                    {video.viewsCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full"
                          style={{ width: `${video.completionRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-200">{video.completionRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="outline" size="sm">
                      Edit Markers
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
