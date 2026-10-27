import React from 'react';
import { Sliders, Sparkles, BookOpen, Users } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'classify', label: 'Analyzer', icon: Sliders },
    { id: 'presets', label: 'Presets', icon: Sparkles },
    { id: 'guidelines', label: 'Standards', icon: BookOpen },
    { id: 'team', label: 'Skill G', icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-sky-100 px-4 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-sky-100 text-sky-600 scale-105 shadow-xs' 
                  : 'bg-transparent text-slate-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
