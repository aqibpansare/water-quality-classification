import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import VerdictBanner from './components/VerdictBanner';
import TeamCard from './components/TeamCard';
import PresetsTab from './components/PresetsTab';
import GuidelinesTab from './components/GuidelinesTab';
import MobileNav from './components/MobileNav';
import ApiSettingsModal from './components/ApiSettingsModal';
import { WATER_METRICS } from './constants/metrics';
import { 
  Sparkles, 
  RotateCcw, 
  Send, 
  Loader2, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Layers, 
  CheckCircle2, 
  Users
} from 'lucide-react';

export default function App() {
  // Navigation tabs: 'classify' | 'presets' | 'guidelines' | 'team'
  const [activeTab, setActiveTab] = useState('classify');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [backendUrl, setBackendUrl] = useState(() => {
    return (
      localStorage.getItem('aquapure_backend_url') ||
      import.meta.env.VITE_API_URL ||
      'http://localhost:8000'
    );
  });
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'checking' | 'offline'

  // Metric input values state
  const [metrics, setMetrics] = useState(() => {
    const initial = {};
    WATER_METRICS.forEach((m) => {
      initial[m.id] = m.default;
    });
    return initial;
  });

  // Inference state
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // Smooth mobile back button handling (glitch-free SPA history management)
  useEffect(() => {
    // Set initial history state
    window.history.replaceState({ tab: 'classify' }, '', '#classify');

    const handlePopState = (event) => {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        setActiveTab('classify');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSettingsOpen]);

  const changeTabWithHistory = useCallback((newTab) => {
    if (newTab === activeTab) return;
    window.history.pushState({ tab: newTab }, '', `#${newTab}`);
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Save backend URL
  const handleSaveBackendUrl = (url) => {
    setBackendUrl(url);
    localStorage.setItem('aquapure_backend_url', url);
    checkBackendHealth(url);
  };

  // Check backend health
  const checkBackendHealth = useCallback(async (targetUrl) => {
    setBackendStatus('checking');
    try {
      const cleanUrl = targetUrl.replace(/\/+$/, '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${cleanUrl}/`, { 
        method: 'GET',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  }, []);

  useEffect(() => {
    checkBackendHealth(backendUrl);
  }, [backendUrl, checkBackendHealth]);

  // Handle metric value updates
  const handleMetricChange = (metricId, value) => {
    setMetrics((prev) => ({
      ...prev,
      [metricId]: value
    }));
  };

  // Reset metrics to defaults
  const handleResetMetrics = () => {
    const initial = {};
    WATER_METRICS.forEach((m) => {
      initial[m.id] = m.default;
    });
    setMetrics(initial);
    setResult(null);
    setErrorNotice(null);
    setIsFallbackMode(false);
  };

  // Load a preset and jump straight to analyzer
  const handleSelectPreset = (presetValues) => {
    setMetrics({ ...presetValues });
    setResult(null);
    setErrorNotice(null);
    changeTabWithHistory('classify');
  };

  // Resilient Client-side heuristic fallback (ensures the field app NEVER crashes in offline rural zones)
  const computeOfflineFallback = (payload) => {
    // Standard WHO parameter bounds evaluation
    let penalty = 0;
    if (payload.pH < 6.5 || payload.pH > 8.5) penalty += 25;
    if (payload.Turbidity > 5.0) penalty += 30;
    if (payload.Chloramines > 8.0) penalty += 20;
    if (payload.Organic_carbon > 15.0) penalty += 20;
    if (payload.Solids > 25000.0) penalty += 15;
    if (payload.Trihalomethanes > 80.0) penalty += 20;

    const isSafe = penalty < 35;
    const probability = isSafe ? Math.max(0.65, 1 - (penalty / 100)) : Math.min(0.35, 1 - (penalty / 100));

    return {
      prediction: isSafe ? 1 : 0,
      status: isSafe ? 'Safe' : 'Unsafe',
      is_safe: isSafe,
      probability: Math.abs(probability),
      offline_heuristic: true
    };
  };

  // Execute ML Prediction via FastAPI backend with resilient error handling
  const handleRunInference = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorNotice(null);
    setIsFallbackMode(false);

    // Sanitize 9 features to pure floats
    const payload = {
      pH: parseFloat(metrics.pH) || 7.0,
      Hardness: parseFloat(metrics.Hardness) || 196.0,
      Solids: parseFloat(metrics.Solids) || 21000.0,
      Chloramines: parseFloat(metrics.Chloramines) || 7.0,
      Sulfate: parseFloat(metrics.Sulfate) || 333.0,
      Conductivity: parseFloat(metrics.Conductivity) || 426.0,
      Organic_carbon: parseFloat(metrics.Organic_carbon) || 14.0,
      Trihalomethanes: parseFloat(metrics.Trihalomethanes) || 66.0,
      Turbidity: parseFloat(metrics.Turbidity) || 3.9
    };

    const cleanUrl = backendUrl.replace(/\/+$/, '');
    let endpoint = `${cleanUrl}/api/predict`;

    try {
      // 8-second timeout for server response
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResult(data);
      setBackendStatus('online');

      // Scroll smoothly to verdict banner
      setTimeout(() => {
        const banner = document.getElementById('verdict-result');
        if (banner) {
          banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);

    } catch (err) {
      console.warn('Backend call failed, activating resilient offline heuristic:', err);
      // Rough & Tough safety pipeline: Activate offline fallback
      const fallbackResult = computeOfflineFallback(payload);
      setResult(fallbackResult);
      setIsFallbackMode(true);
      setBackendStatus('offline');
      setErrorNotice(
        `FastAPI backend is unreachable (${err.name === 'AbortError' ? 'Connection Timed Out' : 'Offline'}). Showing emergency local field heuristic.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-10">
      
      {/* Top Header */}
      <Header
        backendStatus={backendStatus}
        backendUrl={backendUrl}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTeam={() => changeTabWithHistory('team')}
        activeTab={activeTab}
        setActiveTab={changeTabWithHistory}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* TAB 1: FIELD ANALYZER (CLASSIFIER) */}
        {activeTab === 'classify' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            
            {/* Hero Banner / Problem Statement Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-sky-400/20 via-cyan-300/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100/80 text-sky-800 border border-sky-200 mb-3">
                  <Activity className="w-3.5 h-3.5 text-sky-600" />
                  <span>Real-Time Sensor Diagnostic</span>
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Water Safety & Potability Classification
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">
                  Enter digital water sensor readings below. The Random Forest Machine Learning classifier will standardize the parameters through a pre-fitted scaler and return an instant binary safety verdict.
                </p>

                {/* Quick Presets Bar */}
                <div className="mt-4 pt-4 border-t border-sky-100/80 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold mr-1">
                    Quick Samples:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset({
                      pH: 9.45,
                      Hardness: 145.81,
                      Solids: 13168.53,
                      Chloramines: 9.44,
                      Sulfate: 310.58,
                      Conductivity: 592.66,
                      Organic_carbon: 8.61,
                      Trihalomethanes: 77.58,
                      Turbidity: 3.88
                    })}
                    className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium hover:bg-emerald-100 transition-colors"
                  >
                    Load Safe Tap Water
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset({
                      pH: 7.04,
                      Hardness: 204.89,
                      Solids: 20791.32,
                      Chloramines: 7.30,
                      Sulfate: 368.52,
                      Conductivity: 564.31,
                      Organic_carbon: 10.38,
                      Trihalomethanes: 86.99,
                      Turbidity: 2.96
                    })}
                    className="text-xs px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium hover:bg-rose-100 transition-colors"
                  >
                    Load Contaminated Water
                  </button>
                  <button
                    type="button"
                    onClick={() => changeTabWithHistory('presets')}
                    className="text-xs text-sky-600 hover:text-sky-800 font-semibold ml-auto flex items-center gap-1"
                  >
                    <span>View All Presets</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Offline Fallback or Connection Notice */}
            {errorNotice && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{errorNotice}</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    To connect to your live FastAPI backend, ensure it is running at <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">{backendUrl}</code> or click the settings icon in the top right.
                  </p>
                </div>
              </div>
            )}

            {/* Verdict Result Banner */}
            {result && (
              <div id="verdict-result" className="scroll-mt-24">
                <VerdictBanner result={result} onReset={handleResetMetrics} />
              </div>
            )}

            {/* Form & 9-Metric Responsive Grid */}
            <form onSubmit={handleRunInference} className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                    Input Sensor Readings (9 Metrics)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Adjust numeric values or use the sliders for quick calibration
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetMetrics}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>
              </div>

              {/* Responsive Grid: Stacks on mobile, 2 cols on tablet, 3 cols on laptop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {WATER_METRICS.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    metric={metric}
                    value={metrics[metric.id]}
                    onChange={handleMetricChange}
                  />
                ))}
              </div>

              {/* Action Trigger Bar */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-sky-100 shadow-md">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  <span className="font-semibold text-slate-700">Target Backend:</span>{' '}
                  <span className="font-mono bg-sky-50 px-2 py-0.5 rounded text-sky-800 border border-sky-200">
                    {backendUrl}/api/predict
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-sky-500 via-sky-600 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing with ML Model...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Run Water Potability Test</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>

            {/* Team Showcase Card below the form */}
            <div className="pt-4">
              <TeamCard onClose={() => {}} />
            </div>

          </div>
        )}

        {/* TAB 2: FIELD SAMPLES & PRESETS */}
        {activeTab === 'presets' && (
          <div className="animate-fade-in">
            <PresetsTab onSelectPreset={handleSelectPreset} />
          </div>
        )}

        {/* TAB 3: WHO GUIDELINES */}
        {activeTab === 'guidelines' && (
          <div className="animate-fade-in">
            <GuidelinesTab />
          </div>
        )}

        {/* TAB 4: TEAM SKILL G & OWNERS */}
        {activeTab === 'team' && (
          <div className="animate-fade-in space-y-6">
            <TeamCard onClose={() => changeTabWithHistory('classify')} />
          </div>
        )}

      </main>

      {/* Backend Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        backendUrl={backendUrl}
        onSaveUrl={handleSaveBackendUrl}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={changeTabWithHistory} />

      {/* Footer Branding */}
      <footer className="mt-12 py-6 text-center text-xs text-slate-500 font-medium border-t border-sky-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-700">AquaPure</span>
            <span>• Water Quality Classification Architecture</span>
          </div>
          <div>
            <span>Developed with pride by </span>
            <span className="font-bold text-slate-800">Team Skill G</span>
            <span> (Owners: </span>
            <span className="font-semibold text-sky-700">Aqib Pansare</span>
            <span> & </span>
            <span className="font-semibold text-cyan-700">Shamita Marathe</span>
            <span>)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
