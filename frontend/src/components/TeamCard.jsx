import React from 'react';
import { Sparkles } from 'lucide-react';

export default function TeamCard() {
  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-sky-200/80 shadow-xl relative overflow-hidden">
      
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-linear-to-bl from-sky-400/20 via-cyan-300/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        
        {/* Team Skill G Brand Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-linear-to-r from-sky-500 via-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/25 uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Made by Team Skill G</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Project Owners
        </h2>

        {/* The Two Owners - Clean & Elegant without work/tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          
          {/* Owner 1: Aqib Pansare */}
          <div className="bg-white/90 rounded-2xl p-6 border border-sky-100 shadow-xs hover:shadow-md hover:border-sky-300 transition-all text-center sm:text-left flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-sky-600 via-sky-500 to-cyan-400 p-0.5 shadow-md shadow-sky-500/20 shrink-0">
              <div className="w-full h-full bg-linear-to-b from-sky-50 to-white rounded-[14px] flex items-center justify-center text-sky-700 font-black text-lg">
                AP
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                Owner
              </span>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-1">
                Aqib Pansare
              </h3>
            </div>
          </div>

          {/* Owner 2: Shamita Marathe */}
          <div className="bg-white/90 rounded-2xl p-6 border border-sky-100 shadow-xs hover:shadow-md hover:border-sky-300 transition-all text-center sm:text-left flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-cyan-600 via-sky-500 to-sky-400 p-0.5 shadow-md shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-linear-to-b from-cyan-50 to-white rounded-[14px] flex items-center justify-center text-cyan-700 font-black text-lg">
                SM
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                Owner
              </span>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-1">
                Shamita Marathe
              </h3>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
