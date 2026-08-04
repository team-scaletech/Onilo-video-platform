import React, { useState } from 'react';
import { Palette, Sparkles, CheckCircle2, AlertTriangle, Info, Bell, Layers, Eye, Zap, ChevronRight, Settings, HelpCircle, Trash2, Edit3, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, StatCard } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Alert } from '../../../components/ui/Alert';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/Dialog';
import { Drawer } from '../../../components/ui/Drawer';
import { DropdownMenu } from '../../../components/ui/DropdownMenu';
import { Tooltip } from '../../../components/ui/Tooltip';
import { Switch } from '../../../components/ui/Switch';
import { Skeleton, SkeletonText, SkeletonCard } from '../../../components/ui/Skeleton';
import { Accordion } from '../../../components/ui/Accordion';
import { Tabs } from '../../../components/ui/Tabs';
import { useToast } from '../../../context/ToastContext';

export const DesignSystemPage: React.FC = () => {
  const { toast } = useToast();

  // State for interactive demos
  const [activeTab, setActiveTab] = useState('buttons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 lg:p-10 overflow-hidden border border-brand-500/30 bg-slate-900/80 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/20 via-cyanGlow/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" pulse>
              Milestone 2 Complete
            </Badge>
            <span className="text-xs text-slate-400 font-mono">Design System v2.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Billion-Dollar Enterprise <span className="gradient-text">Design System</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Inspired by <strong>Linear</strong>, <strong>Stripe Dashboard</strong>, <strong>Notion</strong>, <strong>Vimeo</strong>, and <strong>Netflix</strong>. Designed for high performance, glassmorphism, responsive viewports, accessibility, and modern dark/light aesthetics.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        tabs={[
          { id: 'buttons', label: 'Buttons & Controls', icon: <Zap className="w-4 h-4" /> },
          { id: 'cards', label: 'Cards & Stats', icon: <Layers className="w-4 h-4" /> },
          { id: 'feedback', label: 'Toasts & Alerts', icon: <Bell className="w-4 h-4" /> },
          { id: 'overlays', label: 'Modals & Drawers', icon: <Eye className="w-4 h-4" /> },
          { id: 'components', label: 'Dropdowns, Skeletons & Accordion', icon: <Palette className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: BUTTONS & CONTROLS */}
      {activeTab === 'buttons' && (
        <div className="space-y-8">
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Button Variants</h3>
                <p className="text-xs text-slate-400">8 distinct button variants for all action hierarchy levels</p>
              </div>
              <Switch
                label="Toggle Loading State"
                checked={isLoadingDemo}
                onChange={setIsLoadingDemo}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" isLoading={isLoadingDemo}>Primary Button</Button>
              <Button variant="glow" isLoading={isLoadingDemo} leftIcon={<Sparkles className="w-4 h-4" />}>Glow Button</Button>
              <Button variant="gradient" isLoading={isLoadingDemo}>Gradient Accent</Button>
              <Button variant="secondary" isLoading={isLoadingDemo}>Secondary Slate</Button>
              <Button variant="glass" isLoading={isLoadingDemo}>Glassmorphic</Button>
              <Button variant="outline" isLoading={isLoadingDemo}>Outline</Button>
              <Button variant="ghost" isLoading={isLoadingDemo}>Ghost Action</Button>
              <Button variant="danger" isLoading={isLoadingDemo}>Danger Action</Button>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="xs" variant="primary">Extra Small (xs)</Button>
              <Button size="sm" variant="glow">Small (sm)</Button>
              <Button size="md" variant="secondary">Medium (md)</Button>
              <Button size="lg" variant="gradient">Large (lg)</Button>
              <Button size="xl" variant="glow">Extra Large (xl)</Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Interactive Switch Toggle</h3>
            <div className="flex items-center gap-8">
              <Switch checked={switchChecked} onChange={setSwitchChecked} label="HLS Bitrate Auto-Adapt" />
              <Switch checked={!switchChecked} onChange={() => {}} label="Disabled Toggle" disabled />
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: CARDS & STATS */}
      {activeTab === 'cards' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Active HLS Viewers" value="48,290" change="+18.4%" isPositive icon={<Eye className="w-5 h-5 text-brand-400" />} description="Across all active streams" />
            <StatCard title="Quiz Completion Rate" value="94.2%" change="+5.1%" isPositive icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} description="Avg user comprehension" />
            <StatCard title="Average Latency" value="0.8s" change="-12.3%" isPositive icon={<Zap className="w-5 h-5 text-cyanGlow" />} description="Low-Latency HLS" />
            <StatCard title="Stream Errors" value="0.02%" change="+0.01%" isPositive={false} icon={<AlertTriangle className="w-5 h-5 text-amber-400" />} description="Fatal player drops" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass" className="p-6 space-y-3">
              <Badge variant="cyan">Glass Card</Badge>
              <h4 className="font-bold text-base text-white">Linear Obsidian Surface</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clean translucent glass surface with backdrop blur, fine borders, and smooth dark background reflection.
              </p>
            </Card>

            <Card variant="gradient" className="p-6 space-y-3">
              <Badge variant="purple">Gradient Border</Badge>
              <h4 className="font-bold text-base text-white">Stripe Neon Gradient</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gradient border frame with subtle glow highlights for high priority content and callouts.
              </p>
            </Card>

            <Card variant="elevated" className="p-6 space-y-3">
              <Badge variant="emerald">Elevated Card</Badge>
              <h4 className="font-bold text-base text-white">Netflix Surface Depth</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deep obsidian elevated card with strong shadow depth for floating controls and dialogs.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: TOASTS & ALERTS */}
      {activeTab === 'feedback' && (
        <div className="space-y-8">
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">
              Toast Notification Triggers
            </h3>
            <p className="text-xs text-slate-300">
              Click any button below to fire interactive stackable toast notifications:
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                onClick={() => toast.success('Stream Ingested Successfully!', 'Video assets are ready for HLS playback.')}
              >
                Trigger Success Toast
              </Button>
              <Button
                variant="danger"
                leftIcon={<AlertTriangle className="w-4 h-4 text-red-400" />}
                onClick={() => toast.error('Connection Failed', 'Unable to connect to NestJS backend stream server.')}
              >
                Trigger Error Toast
              </Button>
              <Button
                variant="glow"
                leftIcon={<Info className="w-4 h-4 text-cyanGlow" />}
                onClick={() => toast.info('New Quiz Created', 'Quiz prompt marker saved at timestamp 01:45.')}
              >
                Trigger Info Toast
              </Button>
              <Button
                variant="secondary"
                leftIcon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
                onClick={() => toast.warning('High Bandwidth Notice', 'Bitrate auto-switched to 720p.')}
              >
                Trigger Warning Toast
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">
              Inline Alert Banners
            </h3>
            {showAlert && (
              <Alert variant="info" title="HLS Stream Telemetry Active" onClose={() => setShowAlert(false)}>
                Real-time video analytics and interactive quiz response scoring are enabled for all viewers.
              </Alert>
            )}
            <Alert variant="success" title="System Status Normal">
              All HLS edge nodes, transcoding engines, and socket gateways are operational.
            </Alert>
            <Alert variant="warning" title="Bitrate Throttling Detected">
              Client network latency exceeded 300ms. Player adaptive streaming is adjusting buffers.
            </Alert>
            <Alert variant="error" title="Ingest Webhook Error">
              Failed to verify video digital signature. Please inspect your security headers.
            </Alert>
          </Card>
        </div>
      )}

      {/* TAB 4: MODALS & DRAWERS */}
      {activeTab === 'overlays' && (
        <div className="space-y-8">
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">
              Dialogs, Modals & Slide-Over Drawers
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="glow" onClick={() => setIsModalOpen(true)}>
                Open Standard Modal
              </Button>
              <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                Open Confirm Dialog
              </Button>
              <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                Open Slide-Over Drawer
              </Button>
            </div>
          </Card>

          {/* Demos */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Interactive Quiz Configuration">
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Configure mid-stream interactive questions, multiple-choice options, and timestamp triggers.
              </p>
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="glow" size="sm" onClick={() => setIsModalOpen(false)}>Save Settings</Button>
              </div>
            </div>
          </Modal>

          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => {
              toast.error('Video Deleted', 'Video asset was permanently removed.');
              setIsConfirmOpen(false);
            }}
            title="Delete Video Stream?"
            description="Are you sure you want to delete this HLS video asset? This action cannot be undone."
            confirmText="Delete Stream"
          />

          <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Stream Properties & Settings">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Stream Title</label>
                <input type="text" defaultValue="Sprite Fight HLS Showcase" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Manifest URL</label>
                <input type="text" defaultValue="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyanGlow font-mono" />
              </div>
              <Button variant="glow" fullWidth onClick={() => setIsDrawerOpen(false)}>Apply Changes</Button>
            </div>
          </Drawer>
        </div>
      )}

      {/* TAB 5: DROPDOWNS, SKELETONS & ACCORDION */}
      {activeTab === 'components' && (
        <div className="space-y-8">
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">
              Popover Dropdown Menu & Tooltips
            </h3>
            <div className="flex items-center gap-6">
              <DropdownMenu
                trigger={<Button variant="glow" rightIcon={<ChevronRight className="w-4 h-4 rotate-90" />}>Actions Dropdown</Button>}
                items={[
                  { id: '1', label: 'Edit Stream Markers', icon: <Edit3 className="w-4 h-4" />, shortcut: '⌘E' },
                  { id: '2', label: 'Security & Access', icon: <Lock className="w-4 h-4" /> },
                  { id: '3', label: 'Documentation', icon: <HelpCircle className="w-4 h-4" /> },
                  { id: 'div', label: '', divider: true },
                  { id: '4', label: 'Delete Video', icon: <Trash2 className="w-4 h-4" />, danger: true },
                ]}
              />

              <Tooltip content="Live HLS streaming active" position="top">
                <Badge variant="cyan" pulse>Hover Tooltip Demo</Badge>
              </Tooltip>

              <Tooltip content="Security certified by Onilo" position="right">
                <Button variant="outline" size="sm" leftIcon={<Settings className="w-4 h-4" />}>Right Tooltip</Button>
              </Tooltip>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">
              Shimmer Skeleton Loaders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard />
              <div className="space-y-4">
                <Skeleton variant="circular" width={48} height={48} />
                <SkeletonText lines={4} />
              </div>
              <div className="space-y-3">
                <Skeleton variant="rectangular" height={40} />
                <Skeleton variant="rectangular" height={40} />
                <Skeleton variant="rectangular" height={40} />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">
              Accordion Collapsible Panel
            </h3>
            <Accordion
              items={[
                {
                  id: 'acc-1',
                  title: 'How does the interactive quiz engine sync with Vidstack?',
                  content: 'Onilo monitors the player playback timestamp using requestAnimationFrame listeners. When a registered marker timestamp is reached within 0.8s, the player is automatically paused and the animated QuizOverlay context is displayed.',
                  icon: <HelpCircle className="w-4 h-4" />,
                },
                {
                  id: 'acc-2',
                  title: 'Is this UI responsive across mobile, tablet, and ultrawide monitors?',
                  content: 'Yes! Every component uses fluid flex/grid layouts with responsive breakpoints (sm, md, lg, xl, 2xl) ensuring crisp rendering on 320px mobile screens up to 4K ultrawide displays.',
                  icon: <Sparkles className="w-4 h-4 text-cyanGlow" />,
                },
              ]}
            />
          </Card>
        </div>
      )}
    </div>
  );
};
