import React from 'react';
import { WinComponentCategory } from '../types';
import { WIN_COMPONENTS_DATA } from '../data/initialData';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Tv, 
  Music, 
  Cpu, 
  RotateCw,
  FolderArchive
} from 'lucide-react';

interface WineComponentsViewProps {
  components: WinComponentCategory[];
  onToggleComponent: (id: string) => void;
}

export const WineComponentsView: React.FC<WineComponentsViewProps> = ({
  components,
  onToggleComponent,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-5 rounded-xl border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Wine Components & Native DLL Overrides</span>
            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-mono">
              7 Packages
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Install and manage Microsoft DirectX, XAudio2, and Visual C++ runtime DLLs inside the Wine prefix.
          </p>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {components.map((comp) => {
          return (
            <div
              key={comp.id}
              className={`p-5 rounded-xl border transition-all ${
                comp.installed
                  ? 'bg-neutral-900/80 border-neutral-700/80'
                  : 'bg-neutral-900/30 border-neutral-800/60 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white text-base">{comp.title}</h3>
                    {comp.installed && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Installed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">{comp.description}</p>
                </div>

                <button
                  onClick={() => onToggleComponent(comp.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                    comp.installed
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40'
                  }`}
                >
                  {comp.installed ? 'Uninstall' : 'Install'}
                </button>
              </div>

              {/* DLL list */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80">
                <div className="text-[11px] text-neutral-500 font-medium mb-1.5">Packaged DLLs:</div>
                <div className="flex flex-wrap gap-1.5">
                  {comp.dlls.map((dll, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300"
                    >
                      {dll}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
