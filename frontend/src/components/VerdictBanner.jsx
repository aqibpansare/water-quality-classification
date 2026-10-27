import React from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Droplet, 
  CheckCircle, 
  Flame, 
  Filter, 
  RotateCcw, 
  Share2,
  Sparkles,
  Info
} from 'lucide-react';

export default function VerdictBanner({ result, onReset }) {
  if (!result) return null;

  const isSafe = result.is_safe;
  const confidence = result.probability ? Math.round(result.probability * 100) : null;

  return (
    <div className={`w-full rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-xl relative overflow-hidden border ${
      isSafe 
        ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white border-emerald-400/40 shadow-emerald-500/25'
        : 'bg-gradient-to-br from-rose-500 via-red-500 to-rose-600 text-white border-rose-400/40 shadow-rose-500/25'
    }`}>
      {/* Decorative background glow rings */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Verdict Icon & Header */}
        <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner border border-white/30">
            {isSafe ? (
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-bounce" />
            ) : (
              <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/20 backdrop-blur-xs mb-2 border border-white/20">
              <Droplet className="w-3.5 h-3.5" />
              <span>Safety Verdict: {result.status.toUpperCase()}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-xs">
              {isSafe ? 'WATER IS SAFE FOR DRINKING' : 'WATER IS CONTAMINATED & UNSAFE'}
            </h2>
            <p className="text-sm sm:text-base text-white/90 mt-1 max-w-xl font-medium">
              {isSafe
                ? 'Random Forest ML Model classifies this water sample as Potable. Dissolved metrics align with acceptable domestic safety limits.'
                : 'CRITICAL HAZARD: Do NOT ingest this water directly. Metrics show high contamination risks exceeding safe biochemical limits.'
              }
            </p>
          </div>
        </div>

        {/* Right: Confidence Gauge & Action */}
        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
          {confidence && (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30 text-center flex flex-col items-center">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/80">
                AI Model Confidence
              </span>
              <div className="text-3xl sm:text-4xl font-black mt-0.5 tracking-tight flex items-baseline gap-1">
                {confidence}%
                <span className="text-xs font-semibold text-white/80">Certainty</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-800 hover:bg-white/90 active:scale-95 shadow-md transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Test New Sample</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Field Actions Checklist */}
      <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {isSafe ? (
          <>
            <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-2.5 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>Safe for direct human consumption & cooking</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-2.5 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>Safe for infants & livestock drinking</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-2.5 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>Store in sealed, sanitary containers</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs font-medium bg-black/15 p-2.5 rounded-xl">
              <Flame className="w-4 h-4 text-rose-200 shrink-0" />
              <span>Vigorously boil water for minimum 3 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium bg-black/15 p-2.5 rounded-xl">
              <Filter className="w-4 h-4 text-rose-200 shrink-0" />
              <span>Apply Reverse Osmosis (RO) or ceramic filtration</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium bg-black/15 p-2.5 rounded-xl">
              <Info className="w-4 h-4 text-rose-200 shrink-0" />
              <span>Do not use for washing raw edible produce</span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
