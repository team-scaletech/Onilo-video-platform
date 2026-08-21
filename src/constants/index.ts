import { VideoMetadata } from '../types';

export const APP_CONFIG = {
  name: 'Onilo',
  tagline: 'Digital Learning & Reading Promotion with Boardstories',
  version: '1.0.0',
};

export const MOCK_VIDEOS: VideoMetadata[] = [
  {
    id: 'vid-001',
    title: 'Onilo Boardstory Showcase — Digital Reading & Interaction',
    description:
      'Experience digitized picture books with animated illustrations, interactive comprehension quizzes, vocabulary aids, and teaching materials.',
    posterUrl: 'https://image.mux.com/VZ39vi0200adypIeePhn00VAdGGyvd8qnRe/thumbnail.jpg?time=15',
    // srcUrl: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    // hlsUrl: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    srcUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 610,
    viewsCount: 14280,
    completionRate: 88.5,
    author: {
      name: 'Onilo Creative Labs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Head of Reading Promotion',
    },
    tags: ['Boardstories', 'Reading Promotion', 'Schools & Kitas', 'Interactive Quiz'],
    createdAt: '2026-07-28',
    interactiveMarkers: [
      {
        id: 'mark-101',
        timestamp: 15,
        type: 'quiz',
        title: 'Interactive Quiz Challenge',
        description: 'Test viewer comprehension mid-stream',
        quiz: {
          id: 'q-01',
          question: 'What core feature powers this dynamic video stream?',
          points: 100,
          options: [
            { id: 'opt-a', text: 'HLS adaptive bitrate streaming with Vidstack player', isCorrect: true },
            { id: 'opt-b', text: 'Legacy Flash video embeds', isCorrect: false },
            { id: 'opt-c', text: 'Static GIF animation sequence', isCorrect: false },
            { id: 'opt-d', text: 'Uncompressed AVI download', isCorrect: false },
          ],
          explanation: 'Vidstack paired with HLS provides instant resolution switching and event overlay triggers!',
        },
      },
      {
        id: 'mark-102',
        timestamp: 45,
        type: 'hotspot',
        title: 'Interactive Hotspot Callout',
        description: 'Clickable product highlight overlay',
        hotspot: {
          id: 'hs-01',
          title: '3D VFX Render Toolkit',
          description: 'Explore the open source assets used in Blender open movie.',
          buttonText: 'View VFX Spec',
          linkUrl: '#',
          xPercent: 65,
          yPercent: 35,
        },
      },
      {
        id: 'mark-103',
        timestamp: 120,
        type: 'chapter',
        title: 'Chapter 2: Dynamic Timeline Events',
        description: 'Automatic scene transition and checkpoint logging',
      },
    ],
  },
  {
    id: 'vid-002',
    title: 'Enterprise Product Onboarding & Interactive Assessment',
    description: 'Train your workforce using branch-based interactive video modules and score analytics.',
    posterUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    // srcUrl: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    srcUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 340,
    viewsCount: 9430,
    completionRate: 94.2,
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Head of Learning & Ops',
    },
    tags: ['Onboarding', 'Interactive Quiz', 'Enterprise'],
    createdAt: '2026-07-25',
    interactiveMarkers: [
      {
        id: 'mark-201',
        timestamp: 25,
        type: 'quiz',
        title: 'Compliance Checkpoint',
        quiz: {
          id: 'q-02',
          question: 'How often should video analytics be synchronized?',
          points: 50,
          options: [
            { id: 'opt-2a', text: 'Real-time telemetry event streaming', isCorrect: true },
            { id: 'opt-2b', text: 'Once per month', isCorrect: false },
          ],
        },
      },
    ],
  },
  {
    id: 'vid-003',
    title: 'MP4 Source Test — Progressive Download (non-HLS)',
    description:
      'Sanity-check entry for the dynamic MIME-type detection: srcUrl is a plain .mp4 file, so the player should fall back to native playback instead of hls.js.',
    posterUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    srcUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: 596,
    viewsCount: 0,
    completionRate: 0,
    author: {
      name: 'Onilo Creative Labs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Head of Reading Promotion',
    },
    tags: ['Testing', 'MP4'],
    createdAt: '2026-08-21',
    interactiveMarkers: [
      {
        id: 'mark-301',
        timestamp: 10,
        type: 'quiz',
        title: 'MP4 Playback Check',
        quiz: {
          id: 'q-03',
          question: 'Is this source file streaming via HLS or plain MP4?',
          points: 50,
          options: [
            { id: 'opt-3a', text: 'Plain MP4 (progressive download)', isCorrect: true },
            { id: 'opt-3b', text: 'HLS adaptive stream', isCorrect: false },
          ],
        },
      },
    ],
  },
];
