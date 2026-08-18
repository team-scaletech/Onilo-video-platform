import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TimelineEvent, TimelineEngine } from '../engine/TimelineEngine';
import { QuizOverlay } from './QuizOverlay';
import { SurveyOverlay } from './SurveyOverlay';
import { CTAOverlay } from './CTAOverlay';
import { ProductCardOverlay } from './ProductCardOverlay';
import { FormOverlay } from './FormOverlay';
import { MiniGameOverlay } from './MiniGameOverlay';
import { HotspotOverlay } from './HotspotOverlay';
import { analyticsService } from '../../../services/analyticsService';

export interface InteractiveOverlayEngineProps {
  events: TimelineEvent[];
  currentTime: number;
  videoId: string;
  onPauseVideo?: () => void;
  onResumeVideo?: () => void;
}

export const InteractiveOverlayEngine: React.FC<InteractiveOverlayEngineProps> = ({
  events,
  currentTime,
  videoId,
  onPauseVideo,
  onResumeVideo,
}) => {
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);
  const engineRef = useRef<TimelineEngine>(new TimelineEngine(events));

  useEffect(() => {
    engineRef.current.setEvents(events);
  }, [events]);

  useEffect(() => {
    engineRef.current.processTime(currentTime, (triggeredEvent) => {
      setActiveEvent(triggeredEvent);
      if (triggeredEvent.pauseOnTrigger !== false) {
        onPauseVideo?.();
      }
      analyticsService.track('interactive_event_triggered', videoId, triggeredEvent.timestamp, {
        eventId: triggeredEvent.id,
        eventType: triggeredEvent.type,
      });
    });
  }, [currentTime, onPauseVideo, videoId]);

  const handleClose = () => {
    if (activeEvent) {
      analyticsService.track('interactive_event_dismissed', videoId, currentTime, {
        eventId: activeEvent.id,
        eventType: activeEvent.type,
      });
    }
    setActiveEvent(null);
    onResumeVideo?.();
  };

  if (!activeEvent) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      <AnimatePresence mode="wait">
        {activeEvent.type === 'quiz' && (
          <QuizOverlay
            key={activeEvent.id}
            marker={{
              id: activeEvent.id,
              title: activeEvent.title || 'Knowledge Check Quiz',
              timestamp: activeEvent.timestamp,
              type: 'quiz',
              quiz: activeEvent.data,
            }}
            onClose={handleClose}
            onResumeVideo={onResumeVideo}
          />
        )}

        {activeEvent.type === 'survey' && (
          <SurveyOverlay
            key={activeEvent.id}
            data={activeEvent.data}
            onClose={handleClose}
            onResumeVideo={onResumeVideo}
          />
        )}

        {activeEvent.type === 'cta' && (
          <CTAOverlay
            key={activeEvent.id}
            data={activeEvent.data}
            onClose={handleClose}
            onResumeVideo={onResumeVideo}
          />
        )}

        {activeEvent.type === 'product_card' && (
          <ProductCardOverlay
            key={activeEvent.id}
            data={activeEvent.data}
            onClose={handleClose}
            onResumeVideo={onResumeVideo}
          />
        )}

        {activeEvent.type === 'form' && (
          <FormOverlay
            key={activeEvent.id}
            data={activeEvent.data}
            onClose={handleClose}
            onResumeVideo={onResumeVideo}
          />
        )}

        {activeEvent.type === 'mini_game' && (
          <MiniGameOverlay
            key={activeEvent.id}
            data={activeEvent.data}
            onClose={handleClose}
            onResumeVideo={onResumeVideo}
          />
        )}

        {activeEvent.type === 'hotspot' && (
          <HotspotOverlay
            key={activeEvent.id}
            data={activeEvent.data}
            onClose={handleClose}
            onResumeVideo={onResumeVideo}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
