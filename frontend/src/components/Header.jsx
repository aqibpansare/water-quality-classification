import React from 'react';
import { Droplets, Activity, Users, Settings, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Header({ 
  backendStatus, 
  backendUrl, 
  onOpenSettings, 
  onOpenTeam, 
  activeTab, 
  setActiveTab 
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setActiveTab('classify')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* 3D Glossy Water Drop Logo */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-400 to-cyan-300 p-0.5 shadow-md shadow-sky-400/30 group-hover:shadow-sky-400/50 transition-all duration-300 transform group-hover:scale-105">
              <div className="w-full h-full bg-linear-to-b from-sky-400 to-sky-600 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1 left-2 w-4 h-2 bg-white/40 rounded-full blur-[0.5px]"></div>
                <Droplets className="w-6 h-6 text-white drop-shadow-md animate-droplet" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
                  AquaPure
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-700 border border-sky-200">
                  ML Powered
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Water Safety & Potability Classifier
              </p>
            </div>
          </div>

          {/* Desktop Navigation Pills */}
          <nav className="hidden md:flex items-center p-1 bg-sky-50 rounded-full border border-sky-100">
            <button
              onClick={() => setActiveTab('classify')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'classify'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              Field Analyzer
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'presets'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              Sample Presets
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'guidelines'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              WHO Benchmarks
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'team'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Team Skill G
            </button>
          </nav>

          {/* Right Status & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend Connection Indicator */}
            <div 
              onClick={onOpenSettings}
              title={`Backend: ${backendUrl} (${backendStatus})`}
              className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium border transition-colors ${
                backendStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : backendStatus === 'checking'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                backendStatus === 'online'
                  ? 'bg-emerald-500'
                  : backendStatus === 'checking'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`} />
              <span className="hidden xs:inline">
                {backendStatus === 'online' ? 'API Online' : backendStatus === 'checking' ? 'Waking API...' : 'API Standby'}
              </span>
            </div>

            {/* Team Skill G Chip (Clickable) */}
            <button
              onClick={onOpenTeam}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-sky-500 to-cyan-500 text-white shadow-xs shadow-sky-500/20 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skill G</span>
            </button>

            {/* Settings Icon */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors"
              title="API Endpoint Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
