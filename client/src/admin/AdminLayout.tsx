import React, { useState } from 'react';
import { X, BookOpen, LogOut, Menu, Newspaper } from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({
  activeTab,
  setActiveTab,
  handleLogout,
  children,
}: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const adminUser = localStorage.getItem('admin_user') || 'Admin';

  return (
    <div className="relative min-h-screen flex bg-slate-50 text-slate-800 font-sans">

      {/* 1. SIDEBAR PANEL (Desktop fixed, Mobile toggleable) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0b1a2e] text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Brand/Logo header */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-[#081322]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">O</div>
              <span className="text-base font-bold text-white tracking-wide">OriVance Admin</span>
            </div>

            {/* Mobile Sidebar Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => {
                setActiveTab('blogs');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'blogs'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-slate-800/60 hover:text-white'
                }`}
            >
              <BookOpen className="w-5 h-5" />
              Blogs
            </button>

            <button
              onClick={() => {
                setActiveTab('news');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'news'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-slate-800/60 hover:text-white'
                }`}
            >
              <Newspaper className="w-5 h-5" />
              News & Updates
            </button>
          </nav>
        </div>

        {/* Sidebar Footer info & logout */}
        <div className="p-4 border-t border-slate-800/80 bg-[#081322]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-sm uppercase">
              {adminUser.substring(0, 2)}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{adminUser}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Super Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-700/80 text-slate-300 hover:bg-red-950/30 hover:border-red-900/50 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Backdrop overlay on mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs md:hidden animate-fade-in"
        />
      )}

      {/* 2. MAIN WORKING PANEL */}
      <div className="flex-1 min-h-screen md:pl-64 flex flex-col">

        {/* Top Header bar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-20 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Hamburger button on Mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Secure Session
            </span>
          </div>

          <div className="text-xs text-slate-500 font-semibold hidden sm:block">
            Connected: <span className="text-slate-800">{adminUser}</span>
          </div>
        </header>

        {/* Content body space */}
        <main className="flex-grow p-6 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
