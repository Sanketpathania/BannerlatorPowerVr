import React from 'react';
import { ViewTab } from '../types';
import { 
  Box, 
  Gamepad2, 
  Sliders, 
  Cpu, 
  Layers, 
  Play, 
  Sparkles,
  Monitor
} from 'lucide-react';

interface NavbarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onLaunchContainer: () => void;
  activeContainerName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onLaunchContainer,
  activeContainerName,
}) => {
  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'containers', label: 'Containers', icon: <Box className="w-4 h-4" /> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'controls', label: 'Input Controls', icon: <Sliders className="w-4 h-4" /> },
    { id: 'drivers', label: 'PowerVR & Vegas Advisor', icon: <Cpu className="w-4 h-4" /> },
    { id: 'winecomponents', label: 'Wine Components', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <header id="main-header" className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">Bannerlator</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  PowerVR Edition
                </span>
                <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline-block">
                  v3.1.1 Bionic
                </span>
              </div>
              <div className="text-xs text-neutral-400 hidden md:block">
                Star Fork • PowerVR Rogue & Mali BCn Transcode • Bionic FG
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/80'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Launch & Status */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end text-right text-xs">
              <span className="text-neutral-400">Target Container:</span>
              <span className="text-neutral-200 font-medium truncate max-w-[140px]">
                {activeContainerName}
              </span>
            </div>

            <button
              id="quick-launch-button"
              onClick={onLaunchContainer}
              className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-md shadow-rose-950/50 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scroll */}
        <div className="lg:hidden flex overflow-x-auto py-2.5 space-x-2 border-t border-neutral-800/80 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-neutral-800 text-white border border-neutral-700'
                    : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
