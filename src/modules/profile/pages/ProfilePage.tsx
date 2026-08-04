import React, { useState } from 'react';
import { User, Mail, Award, Clock, Eye, CheckCircle2, Bell, Save, Sparkles, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Vivek Gondaliya',
    email: 'vivek.gondaliya@scaletech.xyz',
    role: 'Lead Enterprise Video Architect',
    location: 'San Francisco, CA',
    bio: 'Pioneering next-generation interactive HLS video experiences, real-time learner telemetry, and mid-stream quiz engines for global enterprise platforms.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header Hero Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl p-6 lg:p-8">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-brand-600/30 via-purple-600/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-cyanGlow/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar with Glow Ring */}
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-brand-500 via-purple-500 to-cyanGlow blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
            <Avatar
              name={formData.name}
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
              size="xl"
              online
            />
          </div>

          {/* User Meta */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
                {formData.name}
              </h1>
              <Badge variant="brand" pulse>
                Verified Admin
              </Badge>
              <Badge variant="cyan">
                Pro Subscriber
              </Badge>
            </div>

            <p className="text-sm font-semibold text-brand-300">
              {formData.role}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {formData.email}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {formData.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Joined March 2024
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed pt-1">
              {formData.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          { label: 'Interactive Views', value: '24,850', desc: '+18% this month', icon: <Eye className="w-5 h-5 text-cyanGlow" /> },
          { label: 'Total Watch Time', value: '142 hrs', desc: 'Avg 18 min/session', icon: <Clock className="w-5 h-5 text-amber-400" /> },
          { label: 'Quizzes Created', value: '38 Active', desc: '100% completion rate', icon: <Award className="w-5 h-5 text-emerald-400" /> },
          { label: 'Telemetry Score', value: '99.4/100', desc: 'Optimal stream health', icon: <Sparkles className="w-5 h-5 text-brand-400" /> },
        ].map((stat, i) => (
          <Card key={i} className="p-4 sm:p-5 flex flex-col justify-between hover:border-brand-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-white/10">{stat.icon}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{stat.value}</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">{stat.desc}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Badges', icon: <User className="w-4 h-4" /> },
          { id: 'settings', label: 'Account Details', icon: <Bell className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications & Badges */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Achievement Badges
              </h3>

              <div className="space-y-3">
                {[
                  { title: 'Interactive Video Master', desc: 'Created 25+ dynamic branching quiz streams', date: 'Earned May 2024', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30' },
                  { title: 'HLS Optimization Expert', desc: 'Maintained sub-1.2s stream latency across global CDN', date: 'Earned Apr 2024', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30' },
                  { title: 'Telemetry Architect', desc: 'Logged 10,000+ real-time interactive quiz responses', date: 'Earned Feb 2024', color: 'from-brand-500/20 to-purple-500/10 border-brand-500/30' },
                ].map((badge, i) => (
                  <div key={i} className={`p-4 rounded-2xl bg-gradient-to-r ${badge.color} border flex items-center justify-between`}>
                    <div>
                      <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">{badge.desc}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-2">{badge.date}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity Stream */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyanGlow" />
                Recent System Activity
              </h3>

              <div className="space-y-4">
                {[
                  { action: 'Updated Interactive Quiz Timestamps', detail: 'Sprite Fight Studio Showcase', time: '10 mins ago' },
                  { action: 'Configured Subtitle Captions', detail: 'English & Spanish WebVTT Tracks', time: '1 hour ago' },
                  { action: 'Published Branching Video Stream', detail: 'Enterprise Assessment Module', time: 'Yesterday' },
                  { action: 'Generated Telemetry Export', detail: 'Analytics Report PDF', time: '3 days ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-cyanGlow mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">{item.action}</p>
                      <p className="text-[11px] text-slate-400">{item.detail}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <Card className="p-6 lg:p-8 max-w-3xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Edit Profile Details</h3>
              <p className="text-xs text-slate-400">Update your account information and preferences</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Role / Title</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Bio Summary</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Button variant="glow" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                  Save Profile Changes
                </Button>

                {isSaved && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-bounce">
                    <CheckCircle2 className="w-4 h-4" /> Profile Updated Successfully!
                  </span>
                )}
              </div>
            </form>
          </Card>
        )}
      </motion.div>
    </div>
  );
};
