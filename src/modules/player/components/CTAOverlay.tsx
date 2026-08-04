import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, ExternalLink, X, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface CTAOverlayProps {
  data: {
    title: string;
    description: string;
    buttonText?: string;
    linkUrl?: string;
    promoCode?: string;
  };
  onClose: () => void;
  onResumeVideo?: () => void;
}

export const CTAOverlay: React.FC<CTAOverlayProps> = ({
  data,
  onClose,
  onResumeVideo,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md pointer-events-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="relative w-full max-w-md max-h-[92%] p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-brand-950 via-slate-900 to-purple-950 border border-cyanGlow/50 backdrop-blur-2xl shadow-2xl text-white space-y-4 overflow-y-auto scrollbar-thin"
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
          <div className="p-2.5 rounded-xl bg-cyanGlow/20 text-cyanGlow border border-cyanGlow/40 shadow-glow shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono text-cyanGlow uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Special Offer
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">{data.title}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{data.description}</p>

        {data.promoCode && (
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-dashed border-cyanGlow/40 flex items-center justify-between font-mono">
            <span className="text-xs text-slate-400">Use Promo Code:</span>
            <span className="text-xs sm:text-sm font-bold text-cyanGlow tracking-wider">{data.promoCode}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <a
            href={data.linkUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-[140px]"
          >
            <Button size="sm" variant="glow" className="w-full" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              {data.buttonText || 'Claim Offer'}
            </Button>
          </a>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onClose();
              onResumeVideo?.();
            }}
          >
            Continue Video
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
