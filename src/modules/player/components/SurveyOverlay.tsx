import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, BarChart2, CheckCircle2, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface SurveyOverlayProps {
  data: {
    question: string;
    options?: string[];
  };
  onClose: () => void;
  onResumeVideo?: () => void;
}

export const SurveyOverlay: React.FC<SurveyOverlayProps> = ({
  data,
  onClose,
  onResumeVideo,
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      onResumeVideo?.();
    }, 1800);
  };

  const options = data.options || ['Extremely Useful', 'Informative', 'Neutral', 'Needs Improvement'];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md pointer-events-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="relative w-full max-w-md max-h-[92%] p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-purple-500/40 backdrop-blur-2xl shadow-2xl text-white space-y-4 overflow-y-auto scrollbar-thin"
      >
        <button
          onClick={() => {
            onClose();
            onResumeVideo?.();
          }}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 pr-6">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
            <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono text-purple-400 uppercase tracking-widest block">
              Live Poll & Feedback
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug">{data.question}</h3>
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-3">
            {/* Star Rating Scale */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className={`p-2 rounded-xl transition-all transform hover:scale-110 ${
                    selectedRating && selectedRating >= star
                      ? 'text-amber-400 bg-amber-400/20 border border-amber-400/40'
                      : 'text-slate-600 bg-slate-800 border border-white/5'
                  }`}
                >
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                </button>
              ))}
            </div>

            {/* Options List */}
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                    selectedOption === idx
                      ? 'border-purple-500 bg-purple-500/20 text-white shadow-glow font-bold'
                      : 'border-white/10 bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedOption === idx && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </button>
              ))}
            </div>

            <Button
              variant="gradient"
              className="w-full"
              size="sm"
              disabled={selectedRating === null && selectedOption === null}
              onClick={handleSubmit}
            >
              Submit Response / Done
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-300">Your response has been saved. Resuming video...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
