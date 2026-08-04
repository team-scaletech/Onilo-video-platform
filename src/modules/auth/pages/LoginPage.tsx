import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Zap, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth, DEMO_CREDENTIALS } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const fromPath = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, navigate, fromPath]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(fromPath, { replace: true });
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans selection:bg-brand-500 selection:text-white">
      {/* Ambient Glowing Orbs Background */}
      <div className="fixed top-[-15%] left-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-brand-600/30 via-purple-600/20 to-transparent blur-[160px] pointer-events-none z-0 animate-pulse" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-cyanGlow/25 via-indigo-600/15 to-transparent blur-[180px] pointer-events-none z-0" />
      <div className="fixed top-[35%] right-[25%] w-[450px] h-[450px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none z-0" />

      {/* Main Glass Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Left Hero Teaser (Visible on Large Screens) */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-900/90 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-cyanGlow text-xs font-extrabold tracking-wide">
              <Sparkles className="w-4 h-4 text-cyanGlow animate-spin-slow" />
              <span>ONILO BOARDSTORIES DIGITAL LEARNING</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.15]">
              Boost Reading Motivation with{' '}
              <span className="bg-gradient-to-r from-brand-400 via-cyanGlow to-purple-400 bg-clip-text text-transparent">
                Animated Boardstories & Quizzes.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Digitized children's picture books, interactive reading quizzes, language acquisition tools (DaZ/DaF), and pedagogical teaching guides for elementary schools, kindergartens, and libraries.
            </p>
          </div>

          {/* Interactive Feature Cards */}
          <div className="relative z-10 space-y-3 my-8">
            {[
              { title: '200+ Animated Boardstories', sub: "Popular children's literature digitally enhanced", icon: <Zap className="w-4 h-4 text-cyanGlow" /> },
              { title: 'Interactive Reading Quizzes', sub: 'Comprehension checks & learner telemetry', icon: <Activity className="w-4 h-4 text-purple-400" /> },
              { title: 'Multilingual Language Support', sub: 'German, English, French, & DaZ/DaF learning', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500/40 backdrop-blur-md flex items-center gap-3.5 transition-colors group"
              >
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{feat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Live System Indicator */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>School & Library Portal Active</span>
            </span>
            <span className="font-mono text-[11px] text-brand-300">Onilo.de Platform</span>
          </div>
        </div>

        {/* Right Interactive Form Box */}
        <div className="lg:col-span-6 p-5 sm:p-8 lg:p-12 flex flex-col justify-center space-y-5 sm:space-y-6 relative z-10">
          {/* Header */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1 sm:mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-500 via-purple-600 to-cyan-400 p-0.5 shadow-glow flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-cyanGlow fill-cyanGlow ml-0.5" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                Onilo Platform
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">Sign In to Onilo Learning Portal</h2>
            <p className="text-xs text-slate-400">Access digital picture books, interactive quizzes, and teaching guides.</p>
          </div>

          {/* Auto-Fill Demo Credentials Bar */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-brand-600/20 via-purple-600/15 to-cyanGlow/10 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5 min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-brand-300 uppercase tracking-wider">Demo Account Ready</p>
              <p className="text-xs text-slate-300 font-mono truncate">vivek.gondaliya@scaletech.xyz</p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold shadow-md shadow-brand-500/30 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyanGlow" />
              <span>Fill Demo</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Work Email Address</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/90 border border-white/15 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] font-semibold text-cyanGlow hover:underline"
                >
                  Use Default (`Scaletech@123`)
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-950/90 border border-white/15 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="glow"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full justify-center text-sm py-3.5"
                rightIcon={!isLoading ? <ArrowRight className="w-4 h-4 ml-1" /> : undefined}
              >
                {isLoading ? 'Authenticating Workspace...' : 'Sign In to Dashboard'}
              </Button>
            </div>
          </form>

          {/* Footer note */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              Protected by Enterprise Encrypted Sessions • Onilo POC Engine
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
