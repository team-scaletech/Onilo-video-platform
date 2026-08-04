import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Award, Play, X, ArrowRight, HelpCircle, Sparkles, Lightbulb } from 'lucide-react';
import { InteractiveMarker, QuizOption } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { usePlayer } from '../../../hooks';
import { videoService } from '../../../services/videoService';

export interface QuizOverlayProps {
  marker: InteractiveMarker;
  onClose: () => void;
  onResumeVideo?: () => void;
}

export const QuizOverlay: React.FC<QuizOverlayProps> = ({ marker, onClose, onResumeVideo }) => {
  const quiz = marker.quiz;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addScore, currentVideo } = usePlayer();

  if (!quiz) return null;

  // Normalize options array
  const options: QuizOption[] = (quiz.options || []).map((opt: any, idx: number) => {
    if (typeof opt === 'string') {
      const isCorrect = (quiz as any).correctOption !== undefined ? idx === (quiz as any).correctOption : idx === 0;
      return {
        id: `opt-${idx}`,
        text: opt,
        isCorrect,
      };
    }
    return opt;
  });

  const points = quiz.points || 50;

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);
    const selected = options.find((o) => o.id === selectedOptionId);
    if (selected?.isCorrect) {
      addScore(points);
    }
    if (currentVideo) {
      videoService.recordQuizResult(
        currentVideo.id,
        quiz.id || marker.id,
        !!selected?.isCorrect,
        selected?.isCorrect ? points : 0
      );
    }
  };

  const handleFinish = () => {
    onClose();
    onResumeVideo?.();
  };

  const selectedOption = options.find((o) => o.id === selectedOptionId);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md pointer-events-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-[calc(100%-1rem)] sm:w-full max-w-md max-h-[92%] rounded-2xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-2xl shadow-2xl shadow-cyan-500/15 text-white flex flex-col overflow-hidden my-auto"
      >
        {/* Top Decorative Ambient Glow Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-0.5 bg-gradient-to-r from-transparent via-cyanGlow to-transparent z-20 pointer-events-none" />

        {/* Modal Header */}
        <div className="shrink-0 px-3 sm:px-4 py-2 border-b border-white/10 flex items-center justify-between gap-1.5 bg-slate-950/95 z-10">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold rounded-full bg-cyan-500/20 text-cyanGlow border border-cyan-500/40 animate-pulse flex items-center gap-1 shrink-0">
              <HelpCircle className="w-3 h-3" /> QUIZ
            </span>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">
              @{marker.timestamp}s
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold shadow-sm">
              <Award className="w-3 h-3 text-amber-400" />
              <span>+{points} XP</span>
            </div>
            <button
              onClick={handleFinish}
              className="p-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close & Continue"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Question & Options Body - Zero Visible Scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 sm:px-4 py-2.5 space-y-2">
          {/* Question Text */}
          <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-snug flex items-start gap-1.5 break-words">
            <Sparkles className="w-3.5 h-3.5 text-cyanGlow shrink-0 mt-0.5" />
            <span className="flex-1 min-w-0 break-words">{quiz.question}</span>
          </h3>

          {/* Options List */}
          <div className="space-y-1.5">
            {options.map((option, index) => {
              const isSelected = selectedOptionId === option.id;
              const optionLetter = String.fromCharCode(65 + index);

              let containerClasses =
                'border-white/10 bg-slate-900/70 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-900';
              let badgeClasses =
                'bg-slate-800 text-slate-400 border-white/10 group-hover:border-cyan-500/40 group-hover:text-cyanGlow';

              if (isSubmitted) {
                if (option.isCorrect) {
                  containerClasses =
                    'border-emerald-500/80 bg-emerald-500/20 text-emerald-200 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]';
                  badgeClasses = 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50 font-bold';
                } else if (isSelected && !option.isCorrect) {
                  containerClasses = 'border-red-500/80 bg-red-500/20 text-red-200';
                  badgeClasses = 'bg-red-500/30 text-red-300 border-red-500/50';
                }
              } else if (isSelected) {
                containerClasses =
                  'border-cyan-400 bg-cyan-950/60 text-white font-bold shadow-[0_0_15px_rgba(0,242,254,0.2)] ring-1 ring-cyan-500/40';
                badgeClasses = 'bg-cyan-500 text-slate-950 font-extrabold border-cyan-300';
              }

              return (
                <motion.button
                  key={option.id}
                  disabled={isSubmitted}
                  whileHover={!isSubmitted ? { scale: 1.01, x: 2 } : {}}
                  whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border text-xs font-medium transition-all duration-200 flex items-center justify-between group relative overflow-hidden shrink-0 ${containerClasses}`}
                >
                  {/* Selected glowing edge indicator */}
                  {isSelected && !isSubmitted && (
                    <motion.div
                      layoutId="selectedIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyanGlow shadow-glow"
                    />
                  )}

                  <div className="flex items-center gap-2 pr-1.5 min-w-0 flex-1">
                    <span
                      className={`w-4.5 h-4.5 rounded border text-[10px] flex items-center justify-center font-mono font-bold shrink-0 transition-colors ${badgeClasses}`}
                    >
                      {optionLetter}
                    </span>
                    <span className="leading-tight text-slate-100 font-medium text-xs break-words flex-1 min-w-0">{option.text}</span>
                  </div>

                  {isSubmitted && option.isCorrect && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1.5" />
                  )}
                  {isSubmitted && isSelected && !option.isCorrect && (
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 ml-1.5" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          <AnimatePresence>
            {isSubmitted && quiz.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200 space-y-0.5 shrink-0"
              >
                <div className="flex items-center gap-1 font-bold text-cyanGlow text-[10px]">
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>Explanation</span>
                </div>
                <p className="leading-tight text-slate-300 text-[10px] sm:text-[11px]">{quiz.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-3.5 sm:px-4 py-2 border-t border-white/10 flex items-center justify-between gap-2 bg-slate-950/95 z-10">
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {isSubmitted
              ? selectedOption?.isCorrect
                ? '✨ Correct! +XP earned.'
                : '❌ Incorrect. Resume video.'
              : 'Select option to submit.'}
          </p>

          <div className="flex items-center gap-2 shrink-0">
            {!isSubmitted ? (
              <Button
                variant="glow"
                size="sm"
                disabled={!selectedOptionId}
                onClick={handleSubmit}
                className="text-[11px] px-3 py-1 font-bold h-7"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="glow"
                size="sm"
                leftIcon={<Play className="w-3 h-3 fill-current" />}
                rightIcon={<ArrowRight className="w-3 h-3" />}
                onClick={handleFinish}
                className="bg-gradient-to-r from-emerald-500 to-cyanGlow text-slate-950 font-extrabold hover:brightness-110 shadow-glow text-[11px] px-3 py-1 h-7"
              >
                Continue Video
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
