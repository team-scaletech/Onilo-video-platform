import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, X, Award, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface MiniGameOverlayProps {
  data: {
    title: string;
    description: string;
    couponCode?: string;
  };
  onClose: () => void;
  onResumeVideo?: () => void;
}

export const MiniGameOverlay: React.FC<MiniGameOverlayProps> = ({
  data,
  onClose,
  onResumeVideo,
}) => {
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 40, y: 40 });

  const handleTargetClick = () => {
    const nextScore = score + 1;
    setScore(nextScore);

    if (nextScore >= 3) {
      setCompleted(true);
    } else {
      setTargetPos({
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 60) + 20,
      });
    }
  };

  const handleFinish = () => {
    onClose();
    onResumeVideo?.();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md pointer-events-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="relative w-full max-w-md max-h-[92%] p-4 sm:p-6 rounded-3xl bg-slate-900/95 border border-cyanGlow/50 backdrop-blur-2xl shadow-2xl text-white space-y-4 overflow-y-auto scrollbar-thin"
      >
        <button
          onClick={handleFinish}
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 pr-6">
          <div className="p-2.5 rounded-xl bg-cyanGlow/20 text-cyanGlow border border-cyanGlow/40 shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono text-cyanGlow uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Interactive Mini-Game
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug">{data.title}</h3>
          </div>
        </div>

        {!completed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Tap 3 Targets:</span>
              <span className="text-cyanGlow font-bold">Score: {score}/3</span>
            </div>

            {/* Interactive Game Arena */}
            <div className="relative h-36 sm:h-44 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden">
              <motion.button
                key={score}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ top: `${targetPos.y}%`, left: `${targetPos.x}%` }}
                onClick={handleTargetClick}
                className="absolute p-2.5 rounded-full bg-cyanGlow/30 border-2 border-cyanGlow text-cyanGlow shadow-glow transform -translate-x-1/2 -translate-y-1/2 active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5 fill-current animate-spin" />
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 space-y-3">
            <Award className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Congratulations! You Won!</h4>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-400/40 font-mono">
              <span className="text-[10px] text-slate-400 block mb-0.5">Your Reward Coupon:</span>
              <span className="text-sm font-extrabold text-amber-400 tracking-wider">
                {data.couponCode || 'GAMER2026'}
              </span>
            </div>

            <Button
              size="sm"
              variant="glow"
              className="w-full"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={handleFinish}
            >
              Claim Reward & Continue Video
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
