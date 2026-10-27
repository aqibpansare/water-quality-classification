import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

export default function ApiSettingsModal({ isOpen, onClose, backendUrl, onSaveUrl }) {
  const [urlInput, setUrlInput] = useState(backendUrl);
  const [testStatus, setTestStatus] = useState(null); // 'testing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleTest = async () => {
    setTestStatus('testing');
    setErrorMessage('');
    try {
      const cleanUrl = urlInput.replace(/\/+$/, '');
      const res = await fetch(`${cleanUrl}/`, { method: 'GET' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setTestStatus('success');
      onSaveUrl(cleanUrl);
    } catch (err) {
      setTestStatus('error');
      setErrorMessage(err.message || 'Could not connect to FastAPI server');
    }
  };

  const handleSave = () => {
    const cleanUrl = urlInput.replace(/\/+$/, '');
    onSaveUrl(cleanUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">FastAPI Server Settings</h3>
            <p className="text-xs text-slate-500">Configure connection between Vite and FastAPI</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Backend Base URL
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="http://localhost:8000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Use <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">http://localhost:8000</code> locally, or your live Render backend URL when deployed.
            </p>
          </div>

          {/* Test Status feedback */}
          {testStatus === 'testing' && (
            <div className="flex items-center gap-2 text-xs text-sky-600 bg-sky-50 p-2.5 rounded-xl border border-sky-100">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Testing connection to {urlInput}...</span>
            </div>
          )}

          {testStatus === 'success' && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Connection successful! Server responded with HTTP 200.</span>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Connection failed</span>
              </div>
              <p className="text-[11px] text-rose-600">{errorMessage}</p>
              <p className="text-[10px] text-slate-500 pt-1">
                Tip: If running locally, make sure your FastAPI backend is running via <code className="bg-white px-1 py-0.5 rounded">uvicorn api.index:app --reload</code>
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleTest}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Test Connection</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all"
            >
              Save & Apply
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
