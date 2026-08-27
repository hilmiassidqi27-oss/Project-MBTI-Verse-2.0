import React from 'react';
import { Activity, ShieldCheck, Sun, Moon, HelpCircle, User, Sliders, LayoutDashboard, Lock, LogOut } from 'lucide-react';
import { LikertUIStyle } from '../types';

interface TopNavBarProps {
  currentView: 'register' | 'assessment' | 'result' | 'admin-login' | 'admin';
  onNavigate: (view: 'register' | 'assessment' | 'result' | 'admin') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  likertStyle: LikertUIStyle;
  onChangeLikertStyle: (style: LikertUIStyle) => void;
  onOpenHelp: () => void;
  activeUserFullName?: string;
  hasActiveAssessment: boolean;
  isAdminLoggedIn?: boolean;
  adminEmail?: string;
  onAdminLogout?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentView,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  likertStyle,
  onChangeLikertStyle,
  onOpenHelp,
  activeUserFullName,
  hasActiveAssessment,
  isAdminLoggedIn,
  adminEmail,
  onAdminLogout
}) => {
  return (
    <nav
      id="top-nav-bar"
      className={`fixed top-0 left-0 w-full z-50 h-16 border-b transition-colors duration-300 backdrop-blur-xl ${
        isDarkMode
          ? 'bg-[#0b1326]/90 border-slate-800 text-slate-100'
          : 'bg-white/90 border-slate-200 text-slate-800'
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('register')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            id="brand-logo-button"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                isDarkMode
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-400 group-hover:border-indigo-400'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-600 group-hover:border-indigo-400'
              }`}
            >
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-bold tracking-tight text-base sm:text-lg leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                MBTI <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>PT. Dian Pandu Pratama</span>
              </div>
              <div className="text-[10px] tracking-wider uppercase font-data-mono text-slate-400 leading-none">
                Asesmen Kepribadian
              </div>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center ml-6 pl-6 border-l border-slate-300/30 gap-2">
            <button
              onClick={() => onNavigate(hasActiveAssessment ? 'assessment' : 'register')}
              id="nav-tab-assessment"
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-label-caps transition-all ${
                currentView === 'register' || currentView === 'assessment' || currentView === 'result'
                  ? isDarkMode
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Asesmen
            </button>

            <button
              onClick={() => onNavigate('admin')}
              id="nav-tab-admin"
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-label-caps flex items-center gap-1.5 transition-all ${
                currentView === 'admin' || currentView === 'admin-login'
                  ? isDarkMode
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isAdminLoggedIn ? <LayoutDashboard className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {isAdminLoggedIn ? 'Dashboard Admin' : 'Admin Login'}
            </button>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Likert Scale Switcher (shown when on assessment screen) */}
          {currentView === 'assessment' && (
            <div
              className={`hidden sm:flex items-center p-1 rounded-lg border text-xs ${
                isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
              title="Pilih Model Skala Jawaban"
            >
              <span className="text-[11px] font-label-caps px-2 text-slate-400 flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                Skala:
              </span>
              <button
                onClick={() => onChangeLikertStyle('numbers')}
                id="scale-style-numbers"
                className={`px-2 py-0.5 rounded text-xs transition-colors font-data-mono ${
                  likertStyle === 'numbers'
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1-5
              </button>
              <button
                onClick={() => onChangeLikertStyle('nodes')}
                id="scale-style-nodes"
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  likertStyle === 'nodes'
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Slider
              </button>
              <button
                onClick={() => onChangeLikertStyle('emoji')}
                id="scale-style-emoji"
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  likertStyle === 'emoji'
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Emoji
              </button>
            </div>
          )}

          {/* User badge if registered candidate */}
          {activeUserFullName && currentView !== 'admin' && currentView !== 'admin-login' && (
            <div
              className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md text-xs border ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium truncate max-w-[120px]">{activeUserFullName}</span>
            </div>
          )}

          {/* Admin badge if logged in */}
          {isAdminLoggedIn && adminEmail && (
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${
                isDarkMode ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium truncate max-w-[130px]">{adminEmail}</span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            id="theme-toggle-button"
            className={`p-2 rounded-lg border transition-all ${
              isDarkMode
                ? 'border-slate-800 bg-slate-900/80 text-amber-400 hover:bg-slate-800 hover:border-slate-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title={isDarkMode ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Methodology / Help Modal Trigger */}
          <button
            onClick={onOpenHelp}
            id="methodology-help-button"
            className={`p-2 rounded-lg border transition-all ${
              isDarkMode
                ? 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-indigo-400 hover:border-slate-700'
                : 'border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
            }`}
            title="Panduan Metodologi & Spesifikasi Teknis"
            aria-label="Open methodology help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
