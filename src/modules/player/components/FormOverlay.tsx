import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, CheckCircle2, X, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface FormOverlayProps {
  data: {
    title: string;
    subtitle: string;
    buttonText?: string;
  };
  onClose: () => void;
  onResumeVideo?: () => void;
}

export const FormOverlay: React.FC<FormOverlayProps> = ({
  data,
  onClose,
  onResumeVideo,
}: FormOverlayProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      onResumeVideo?.();
    }, 1800);
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
        className="relative w-full max-w-md max-h-[92%] p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-brand-500/40 backdrop-blur-2xl shadow-2xl text-white space-y-4 overflow-y-auto scrollbar-thin"
      >
        <button
          onClick={handleFinish}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 pr-6">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono text-brand-400 uppercase tracking-widest flex items-center gap-1">
              <Lock className="w-3 h-3" /> Exclusive Access
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug">{data.title}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{data.subtitle}</p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Your Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vivek Gondaliya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="abc@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button type="submit" size="sm" variant="glow" className="flex-1 text-xs">
                {data.buttonText || 'Unlock & Continue Video'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Registration Successful!</h4>
            <Button
              size="sm"
              variant="glow"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={handleFinish}
            >
              Continue Video / Done
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
