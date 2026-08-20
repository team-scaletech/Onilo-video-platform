import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlaySquare, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard Showcase',
    path: '/',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: 'Interactive Player',
    path: '/player/vid-001',
    icon: <PlaySquare className="w-5 h-5" />,
    badge: 'LIVE',
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="shrink-0 hidden md:flex flex-col justify-between min-h-[calc(100vh-4rem)] bg-slate-950/70 backdrop-blur-2xl border-r border-white/10 p-3 relative z-20 select-none"
    >
      <div className="space-y-6">
        {/* Sidebar Header & Toggle */}
        <div className={cn('flex items-center justify-between px-2 pt-2', isCollapsed && 'justify-center')}>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Main Navigation
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-2 rounded-xl bg-white/5 hover:bg-brand-500/20 text-slate-400 hover:text-white border border-white/10 hover:border-brand-500/40 transition-all duration-200 group flex items-center justify-center"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 group',
                  isCollapsed ? 'justify-center' : 'justify-between',
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25 border border-white/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'transition-transform duration-200 group-hover:scale-110',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyanGlow'
                      )}
                    >
                      {item.icon}
                    </span>

                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {!isCollapsed && item.badge && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={cn(
                        'px-2 py-0.5 text-[10px] font-extrabold rounded-full shrink-0',
                        item.badge === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {item.badge}
                    </motion.span>
                  )}

                  {/* Tooltip on Collapsed Hover */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-xs font-medium whitespace-nowrap shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-[-10px] group-hover:translate-x-0 z-50 flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer indicator if collapsed */}
      {isCollapsed && (
        <div className="pt-4 border-t border-white/10 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" title="Sidebar Collapsed" />
        </div>
      )}
    </motion.aside>
  );
};
