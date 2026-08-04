import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, PictureInPicture, Zap, Smartphone, Tablet, Laptop, Monitor, Maximize2, Touchpad, SlidersHorizontal } from 'lucide-react';
import { VideoPlayer, VideoPlayerRef } from '../../../components/ui/VideoPlayer';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Switch } from '../../../components/ui/Switch';
import { cn } from '../../../utils';

const SAMPLE_SOURCES = [
  {
    id: 'hls-sprite-fight',
    name: 'Sprite Fight (HLS .m3u8)',
    type: 'HLS Stream',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    poster: 'https://files.vidstack.io/sprite-fight/poster.webp',
  },
  {
    id: 'mp4-tears-of-steel',
    name: 'Tears of Steel (MP4 Direct)',
    type: 'MP4 Video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'hls-sintel',
    name: 'Sintel (HLS Multi-Bitrate)',
    type: 'HLS Stream',
    url: 'https://files.vidstack.io/sintel/hls/stream.m3u8',
    poster: 'https://files.vidstack.io/sintel/poster.webp',
  },
];

const DEVICE_VIEWPORTS = [
  { id: 'mobile', name: 'Phone 375px', width: '375px', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'tablet', name: 'Tablet 768px', width: '768px', icon: <Tablet className="w-4 h-4" /> },
  { id: 'laptop', name: 'Laptop 1024px', width: '1024px', icon: <Laptop className="w-4 h-4" /> },
  { id: 'desktop', name: 'Desktop 1440px', width: '1440px', icon: <Monitor className="w-4 h-4" /> },
  { id: 'full', name: 'Full Width 100%', width: '100%', icon: <Maximize2 className="w-4 h-4" /> },
];

export const VidstackPlaygroundPage: React.FC = () => {
  const playerRef = useRef<VideoPlayerRef>(null);

  // Player Configurator Props State
  const [selectedSource, setSelectedSource] = useState(SAMPLE_SOURCES[0]);
  const [selectedDevice, setSelectedDevice] = useState(DEVICE_VIEWPORTS[4]); // default full width
  const [useCustomUI, setUseCustomUI] = useState(true);
  const [showPoster, setShowPoster] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [enableSubtitles, setEnableSubtitles] = useState(true);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="cyan" pulse>
              Vidstack Player Engine
            </Badge>
            <span className="text-xs text-slate-400 font-mono">Interactive Tester & Configurator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Responsive Video Player <span className="gradient-text">Studio & Controls</span>
          </h1>
        </div>
      </div>

      {/* Device Viewport Frame Switcher Toolbar */}
      <Card className="p-4 flex flex-wrap items-center justify-between gap-3 border-brand-500/30 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Touchpad className="w-4 h-4 text-cyanGlow" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Simulate Device Viewport Frame
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DEVICE_VIEWPORTS.map((dev) => (
            <button
              key={dev.id}
              onClick={() => setSelectedDevice(dev)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border',
                selectedDevice.id === dev.id
                  ? 'bg-brand-600 text-white border-brand-500 shadow-glow'
                  : 'bg-slate-950/60 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800'
              )}
            >
              {dev.icon}
              <span>{dev.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Video Player Viewport Frame */}
      <div className="w-full flex justify-center bg-slate-950/60 p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl overflow-x-auto">
        <div
          style={{ width: selectedDevice.width, maxWidth: '100%' }}
          className="transition-all duration-300 mx-auto shadow-2xl rounded-2xl overflow-hidden"
        >
          <VideoPlayer
            ref={playerRef}
            src={selectedSource.url}
            poster={showPoster ? selectedSource.poster : undefined}
            title={selectedSource.name}
            aspectRatio="16/9"
            autoplay={autoplay}
            muted={muted}
            loop={loop}
            controls={showControls}
            useCustomUI={useCustomUI}
            textTracks={
              enableSubtitles
                ? [
                    {
                      src: 'https://files.vidstack.io/sprite-fight/subs/english.vtt',
                      label: 'English CC',
                      language: 'en-US',
                      kind: 'subtitles',
                      default: true,
                    },
                  ]
                : []
            }
          />
        </div>
      </div>

      {/* Programmatic External Controls Toolbar */}
      <Card className="p-6 space-y-4 border-brand-500/30">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyanGlow" />
          Programmatic External Player Controls
        </h3>

        <div className="flex flex-wrap gap-2.5">
          <Button
            size="sm"
            variant="glow"
            leftIcon={<Play className="w-4 h-4 fill-current" />}
            onClick={() => playerRef.current?.play()}
          >
            Play
          </Button>

          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Pause className="w-4 h-4 fill-current" />}
            onClick={() => playerRef.current?.pause()}
          >
            Pause
          </Button>

          <Button
            size="sm"
            variant="glass"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={() => playerRef.current?.seek((playerRef.current.getMediaPlayer()?.currentTime || 0) - 10)}
          >
            -10s
          </Button>

          <Button
            size="sm"
            variant="glass"
            leftIcon={<RotateCw className="w-4 h-4" />}
            onClick={() => playerRef.current?.seek((playerRef.current.getMediaPlayer()?.currentTime || 0) + 10)}
          >
            +10s
          </Button>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<Volume2 className="w-4 h-4" />}
            onClick={() => playerRef.current?.setVolume(1.0)}
          >
            Volume 100%
          </Button>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<VolumeX className="w-4 h-4" />}
            onClick={() => playerRef.current?.setVolume(0.0)}
          >
            Mute 0%
          </Button>

          <Button
            size="sm"
            variant="secondary"
            leftIcon={<PictureInPicture className="w-4 h-4" />}
            onClick={() => playerRef.current?.togglePiP()}
          >
            Toggle PiP
          </Button>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Maximize className="w-4 h-4" />}
            onClick={() => playerRef.current?.toggleFullscreen()}
          >
            Fullscreen
          </Button>
        </div>
      </Card>

      {/* Configurator Controls Matrix */}
      <Card className="p-6 space-y-6">
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          Vidstack Player & UI Configurator
        </h3>

        {/* Video Source Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Select Media Stream Source</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_SOURCES.map((srcItem) => (
              <button
                key={srcItem.id}
                onClick={() => setSelectedSource(srcItem)}
                className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                  selectedSource.id === srcItem.id
                    ? 'border-brand-500 bg-brand-500/20 text-white font-bold shadow-glow'
                    : 'border-white/10 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="truncate font-semibold">{srcItem.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyanGlow">
                    {srcItem.type}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{srcItem.url}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Props Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <Switch label="Custom Netflix/YouTube UI" checked={useCustomUI} onChange={setUseCustomUI} />
          <Switch label="Show Poster" checked={showPoster} onChange={setShowPoster} />
          <Switch label="Show UI Controls" checked={showControls} onChange={setShowControls} />
          <Switch label="Enable Subtitles" checked={enableSubtitles} onChange={setEnableSubtitles} />
          <Switch label="Autoplay" checked={autoplay} onChange={setAutoplay} />
          <Switch label="Muted Default" checked={muted} onChange={setMuted} />
          <Switch label="Loop Playback" checked={loop} onChange={setLoop} />
        </div>
      </Card>
    </div>
  );
};
