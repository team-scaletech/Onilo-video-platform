import { TimelineEvent } from '../engine/TimelineEngine';

/**
 * Stand-in for a `/videos/:id/timeline-events` API response — keyed per video so different
 * videos can carry different interactive event configurations. Swapping this for a real
 * backend call is a one-line change in getTimelineEventsForVideo below.
 */
const MOCK_TIMELINE_EVENTS_BY_VIDEO: Record<string, TimelineEvent[]> = {
  'vid-001': [
    {
      id: 'evt-quiz-15',
      timestamp: 15,
      type: 'quiz',
      title: 'Knowledge Check Quiz',
      pauseOnTrigger: true,
      data: {
        id: 'quiz-15',
        question: 'What is the primary benefit of HLS Adaptive Bitrate Streaming?',
        points: 50,
        options: [
          { id: 'opt-1', text: 'Dynamically adjusts video quality based on network speed', isCorrect: true },
          { id: 'opt-2', text: 'Increases file size on server', isCorrect: false },
          { id: 'opt-3', text: 'Disables video controls', isCorrect: false },
          { id: 'opt-4', text: 'Only works on mobile phones', isCorrect: false },
        ],
        explanation:
          'HLS dynamically switches video quality levels based on bandwidth to prevent buffering stall.',
      },
    },
    {
      id: 'evt-hotspot-45',
      timestamp: 45,
      type: 'hotspot',
      title: '3D VFX Render Toolkit',
      pauseOnTrigger: false,
      data: {
        title: '3D VFX Render Toolkit',
        description: 'Explore the open source assets used in this Blender open movie.',
        buttonText: 'View VFX Spec',
        linkUrl: '#',
        xPercent: 65,
        yPercent: 35,
      },
    },
    {
      id: 'evt-prod-70',
      timestamp: 70,
      type: 'product_card',
      title: 'Shoppable Gear Spotlight',
      pauseOnTrigger: true,
      data: {
        title: 'Pro Interactive Video Suite v2.0',
        price: '$149.00',
        originalPrice: '$299.00',
        image:
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
        description: 'Enterprise React + Vidstack interactive video platform design system and engine.',
      },
    },
    {
      id: 'evt-cta-100',
      timestamp: 100,
      type: 'cta',
      title: 'Special Platform Discount',
      pauseOnTrigger: true,
      data: {
        title: 'Claim 50% Off Onilo Platform',
        description: 'Upgrade your video experience today with our billion-dollar design system.',
        buttonText: 'Claim 50% Discount',
        promoCode: 'ONILO50OFF',
        linkUrl: 'https://onilo.io',
      },
    },
    {
      id: 'evt-survey-130',
      timestamp: 130,
      type: 'survey',
      title: 'Stream Quality Feedback',
      pauseOnTrigger: true,
      data: {
        question: 'How would you rate the video playback experience so far?',
        options: ['Ultra Smooth HD', 'Good Quality', 'Minor Buffering', 'Needs Optimization'],
      },
    },
    {
      id: 'evt-game-160',
      timestamp: 160,
      type: 'mini_game',
      title: 'Tap the Target Mini-Game',
      pauseOnTrigger: true,
      data: {
        title: 'Interactive Target Blast',
        description: 'Tap 3 glowing targets to unlock an instant reward coupon!',
        couponCode: 'GAMER2026',
      },
    },
    {
      id: 'evt-form-190',
      timestamp: 190,
      type: 'form',
      title: 'Lead Access Form',
      pauseOnTrigger: true,
      data: {
        title: 'Unlock Platform Source Code',
        subtitle: 'Enter your name and work email to download the full interactive project repo.',
        buttonText: 'Download Repository',
      },
    },
  ],
  'vid-002': [
    {
      id: 'evt-quiz-25',
      timestamp: 25,
      type: 'quiz',
      title: 'Compliance Checkpoint',
      pauseOnTrigger: true,
      data: {
        id: 'q-02',
        question: 'How often should video analytics be synchronized?',
        points: 50,
        options: [
          { id: 'opt-2a', text: 'Real-time telemetry event streaming', isCorrect: true },
          { id: 'opt-2b', text: 'Once per month', isCorrect: false },
        ],
        explanation: 'Real-time sync keeps engagement and completion metrics accurate for reporting.',
      },
    },
    {
      id: 'evt-hotspot-60',
      timestamp: 60,
      type: 'hotspot',
      title: 'Onboarding Checklist',
      pauseOnTrigger: false,
      data: {
        title: 'Onboarding Checklist',
        description: 'Download the printable new-hire checklist referenced in this module.',
        buttonText: 'Get Checklist',
        linkUrl: '#',
        xPercent: 30,
        yPercent: 60,
      },
    },
    {
      id: 'evt-cta-100',
      timestamp: 100,
      type: 'cta',
      title: 'Enroll in Advanced Track',
      pauseOnTrigger: true,
      data: {
        title: 'Continue to Advanced Onboarding',
        description: 'Unlock the next module in the enterprise onboarding curriculum.',
        buttonText: 'Enroll Now',
        promoCode: '',
        linkUrl: '#',
      },
    },
  ],
};

export function getTimelineEventsForVideo(videoId: string): TimelineEvent[] {
  return MOCK_TIMELINE_EVENTS_BY_VIDEO[videoId] || [];
}
