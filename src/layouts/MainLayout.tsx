import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-darkBg text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Background Ambient Glowing Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/15 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyanGlow/10 blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none z-0" />

      {/* Main Header */}
      <Navbar />

      <div className="flex flex-1 relative z-10">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Viewport */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
