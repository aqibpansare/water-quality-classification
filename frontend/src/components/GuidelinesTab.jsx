import React from 'react';
import { BookOpen, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { WATER_METRICS } from '../constants/metrics';

export default function GuidelinesTab() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              WHO & EPA Water Quality Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Reference guide for field workers analyzing laboratory water samples
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The Random Forest classifier analyzes complex non-linear interactions across these 9 critical biochemical markers. Even if an individual metric is slightly elevated, the ensemble model determines whether the composite biochemical profile remains potable or poses significant public health hazards.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WATER_METRICS.map((m) => (
            <div key={m.id} className="bg-white/80 rounded-2xl p-4 border border-sky-100 shadow-xs hover:border-sky-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 text-sm">{m.label}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-semibold border border-sky-100">
                  {m.unit}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-snug">{m.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">WHO Limit:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {m.whoSafe}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
