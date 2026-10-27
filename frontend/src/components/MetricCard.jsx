import React from 'react';
import { HelpCircle, Check, AlertCircle, Plus, Minus } from 'lucide-react';

export default function MetricCard({ metric, value, onChange }) {
  const numVal = parseFloat(value) || 0;
  const isSafe = metric.isSafeRange(numVal);

  const handleStep = (increment) => {
    const nextVal = Math.round((numVal + (increment ? metric.step : -metric.step)) * 100) / 100;
    const clamped = Math.max(metric.min, Math.min(metric.max, nextVal));
    onChange(metric.id, clamped);
  };

  const handleSlider = (e) => {
    onChange(metric.id, parseFloat(e.target.value));
  };

  const handleInput = (e) => {
    onChange(metric.id, e.target.value);
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200">
      {/* Top row: Label, Unit & Status indicator */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-tight">
              {metric.label}
            </h3>
            <span 
              className="text-slate-400 hover:text-sky-600 transition-colors cursor-help"
              title={`${metric.description} (WHO Standard: ${metric.whoSafe})`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            WHO Safe: <span className="text-sky-700 font-semibold">{metric.whoSafe}</span>
          </p>
        </div>

        {/* Micro Safe/Warning Tag */}
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border shrink-0 ${
          isSafe
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {isSafe ? (
            <>
              <Check className="w-2.5 h-2.5" />
              <span>Normal</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-2.5 h-2.5" />
              <span>Caution</span>
            </>
          )}
        </div>
      </div>

      {/* Numerical Input + Stepper */}
      <div className="mt-3 flex items-center justify-between gap-2 bg-sky-50/70 p-1.5 rounded-xl border border-sky-100">
        <button
          type="button"
          onClick={() => handleStep(false)}
          className="w-8 h-8 rounded-lg bg-white shadow-xs border border-sky-100 flex items-center justify-center text-slate-600 hover:text-sky-600 hover:bg-sky-50 active:scale-95 transition-all"
          aria-label="Decrease"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-baseline justify-center gap-1 flex-1">
          <input
            type="number"
            step="any"
            min={metric.min}
            max={metric.max}
            value={value}
            onChange={handleInput}
            className="w-24 text-center font-bold text-slate-900 text-base sm:text-lg bg-transparent focus:outline-hidden focus:ring-0"
          />
          <span className="text-xs text-slate-500 font-medium shrink-0">
            {metric.unit}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleStep(true)}
          className="w-8 h-8 rounded-lg bg-white shadow-xs border border-sky-100 flex items-center justify-center text-slate-600 hover:text-sky-600 hover:bg-sky-50 active:scale-95 transition-all"
          aria-label="Increase"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Smooth slider for tactile mobile scrubbing */}
      <div className="mt-3 pt-1">
        <input
          type="range"
          min={metric.min}
          max={metric.max}
          step="any"
          value={numVal}
          onChange={handleSlider}
          className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-600 focus:outline-hidden"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>{metric.min}</span>
          <span>{metric.max}</span>
        </div>
      </div>
    </div>
  );
}
