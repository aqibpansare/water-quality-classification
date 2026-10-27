import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, AlertOctagon } from 'lucide-react';
import { WATER_PRESETS } from '../constants/presets';

export default function PresetsTab({ onSelectPreset }) {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Field Benchmark Samples
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Pre-calibrated sensory profiles from real-world water testing scenarios
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {WATER_PRESETS.map((p) => {
            const isSafe = p.expected === 'Safe';
            return (
              <div 
                key={p.id}
                className="bg-white/90 rounded-2xl p-5 border border-sky-100 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {p.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                      isSafe 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {isSafe ? <CheckCircle2 className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                      Expected: {p.expected}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed font-medium">
                    {p.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-sky-50/60 p-2.5 rounded-xl border border-sky-100">
                    <div>
                      <span className="text-slate-400 block text-[9px]">pH</span>
                      <span className="font-bold text-slate-700">{p.metrics.pH}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">TDS</span>
                      <span className="font-bold text-slate-700">{p.metrics.Solids}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Turbidity</span>
                      <span className="font-bold text-slate-700">{p.metrics.Turbidity} NTU</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPreset(p.metrics)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-linear-to-r from-sky-500 to-cyan-500 text-white font-semibold text-xs shadow-xs hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Load Sample Metrics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
