import React, { useState, useRef, useEffect } from 'react';
import { Play, User, ChevronDown, LogOut, Menu, X, LayoutDashboard, PlaySquare } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { APP_CONFIG } from '../constants';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/75 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-colors">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-purple-600 to-cyan-400 p-0.5 shadow-glow flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Play className="w-5 h-5 text-cyanGlow fill-cyanGlow ml-0.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                {APP_CONFIG.name}
              </span>
              <Badge variant="cyan" pulse>
                v1.0 Ready
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Interactive Video Platform
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {/* User Profile Dropdown Trigger (Desktop Only) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200 group focus:outline-none"
              title="Profile Menu"
            >
              <div className="relative group-hover:scale-105 transition-transform">
                <Avatar
                  name="Vivek Gondaliya"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  online
                  size="sm"
                />
              </div>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                Vivek Gondaliya
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-900/95 border border-white/15 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Profile Brief Header */}
              <div
                onClick={() => {
                  navigate('/profile');
                  setIsDropdownOpen(false);
                }}
                className="p-3 rounded-xl bg-white/5 hover:bg-brand-500/15 border border-white/5 cursor-pointer transition-colors mb-1.5"
              >
                <p className="text-xs font-extrabold text-white">Vivek Gondaliya</p>
                <p className="text-[11px] text-brand-300 font-medium">vivek.gondaliya@scaletech.xyz</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-semibold">Lead Video Architect</span>
                </div>
              </div>

              {/* Menu Options */}
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                  <User className="w-4 h-4 text-cyanGlow" />
                  <span>View Profile & Telemetry</span>
                </button>

                <div className="pt-1 border-t border-white/10 mt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out of Workspace</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button (Top Right Corner on Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-xl bg-white/5 hover:bg-brand-500/20 border border-white/10 text-slate-300 hover:text-white md:hidden transition-colors flex items-center justify-center"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>

    {/* Mobile Responsive Sidebar Drawer */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Glassmorphism Drawer Panel (Right to Left Slide) */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-72 max-w-[85vw] h-full bg-slate-950/95 border-l border-white/15 backdrop-blur-2xl p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-purple-600 to-cyan-400 p-0.5 shadow-glow flex items-center justify-center">
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Play className="w-4 h-4 text-cyanGlow fill-cyanGlow ml-0.5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-white leading-tight">
                      {APP_CONFIG.name}
                    </h3>
                    <p className="text-[10px] text-brand-300 font-medium">Onilo Platform</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
                  Main Navigation
                </p>
                {[
                  { name: 'Dashboard Showcase', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
                  { name: 'Interactive Player', path: '/player/vid-001', icon: <PlaySquare className="w-5 h-5" />, badge: 'LIVE' },
                ].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25 border border-white/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-cyanGlow">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* User Profile Footer Card */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div
                onClick={() => {
                  navigate('/profile');
                  setIsMobileMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-brand-500/15 border border-white/10 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <Avatar name="Vivek Gondaliya" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" online size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-white truncate">Vivek Gondaliya</p>
                  <p className="text-[10px] text-brand-300 font-medium truncate">vivek.gondaliya@scaletech.xyz</p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold hover:bg-rose-500/25 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  </>
);
};
