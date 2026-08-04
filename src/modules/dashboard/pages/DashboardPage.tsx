import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 overflow-hidden border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl">
        {/* Glow behind hero */}
        <div className="absolute -top-10 -right-10 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-bl from-brand-600/30 via-cyanGlow/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-[11px] sm:text-xs font-semibold max-w-full">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyanGlow shrink-0" />
            <span className="truncate">ONILO DIGITAL BOARDSTORIES ENGINE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-snug sm:leading-[1.15]">
            Boost Reading Motivation with{' '}
            <span className="gradient-text">Animated Boardstories</span>.
          </h1>

          <p className="text-xs sm:text-base text-slate-300/90 leading-relaxed">
            Onilo inspires young readers in elementary schools, kindergartens, and libraries with over 200 digitally enhanced picture books, interactive comprehension quizzes, language acquisition tools (DaZ/DaF), and pedagogical teaching guides.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Button
              variant="glow"
              size="lg"
              leftIcon={<Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
              onClick={() => navigate('/player/vid-001')}
              className="w-full sm:w-auto justify-center text-xs sm:text-sm py-3 sm:py-3.5"
            >
              Launch Boardstory Player Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
