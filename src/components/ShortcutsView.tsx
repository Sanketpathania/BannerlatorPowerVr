import React, { useState } from 'react';
import { Shortcut, Container } from '../types';
import { 
  Play, 
  Plus, 
  Gamepad2, 
  Star, 
  Trash2, 
  Edit3, 
  Activity, 
  Check, 
  X, 
  Smartphone,
  Zap,
  FolderOpen
} from 'lucide-react';

interface ShortcutsViewProps {
  shortcuts: Shortcut[];
  containers: Container[];
  activeContainerId: string;
  onLaunchShortcut: (shortcut: Shortcut) => void;
  onSaveShortcut: (shortcut: Shortcut) => void;
  onDeleteShortcut: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const ShortcutsView: React.FC<ShortcutsViewProps> = ({
  shortcuts,
  containers,
  activeContainerId,
  onLaunchShortcut,
  onSaveShortcut,
  onDeleteShortcut,
  onToggleFavorite,
}) => {
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const startCreate = () => {
    const newSc: Shortcut = {
      id: `s_${Date.now()}`,
      name: 'New Application',
      containerId: activeContainerId,
      execPath: 'C:/Program Files/Game/game.exe',
      cmdArgs: '',
      workingDir: 'C:/Program Files/Game',
      iconType: 'game',
      hudEnabled: true,
      isFavorite: false,
      fpsTarget: 60,
    };
    setEditingShortcut(newSc);
  };

  const handleEdit = (sc: Shortcut) => {
    setEditingShortcut(JSON.parse(JSON.stringify(sc)));
  };

  const filtered = shortcuts.filter((sc) => {
    if (filterType === 'all') return true;
    if (filterType === 'favorites') return sc.isFavorite;
    return sc.iconType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-5 rounded-xl border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Shortcuts & Game Launcher</span>
            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-mono">
              {shortcuts.length}
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Windows executables linked to containers with per-game graphics, HUD, and PowerVR BCn presets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-add-shortcut"
            onClick={startCreate}
            className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-neutral-700 transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shortcut</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'favorites', label: 'Favorites' },
          { id: 'game', label: 'Games' },
          { id: 'benchmark', label: 'Graphics Benchmarks' },
          { id: 'tool', label: 'Tools' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterType === f.id
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sc) => {
          const container = containers.find((c) => c.id === sc.containerId) || containers[0];
          const isPixel10Container = container?.gpuName.includes('Pixel 10') || container?.id === 'c-pixel10';

          return (
            <div
              key={sc.id}
              className="bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 p-5 rounded-xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 text-rose-400 shadow-inner">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate group-hover:text-rose-300 transition">
                        {sc.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                          {sc.iconType}
                        </span>
                        {isPixel10Container && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                            <Smartphone className="w-2.5 h-2.5" />
                            <span>Pixel 10 DXT</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(sc.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-400 transition"
                  >
                    <Star className={`w-4 h-4 ${sc.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-1.5 text-xs text-neutral-400 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Target Container:</span>
                    <span className="text-neutral-300 font-medium truncate max-w-[150px]">
                      {container ? container.name : 'Default'}
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="text-neutral-500">Path: </span>
                    <span className="text-neutral-300 font-mono text-[11px]">{sc.execPath}</span>
                  </div>
                  {sc.cmdArgs && (
                    <div className="truncate">
                      <span className="text-neutral-500">Args: </span>
                      <span className="text-amber-400 font-mono text-[11px]">{sc.cmdArgs}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60">
                    <span className="text-neutral-500">HUD Overlay:</span>
                    <span className={`text-[11px] font-semibold ${sc.hudEnabled ? 'text-emerald-400' : 'text-neutral-500'}`}>
                      {sc.hudEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center gap-2">
                <button
                  id={`btn-launch-sc-${sc.id}`}
                  onClick={() => onLaunchShortcut(sc)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white py-2 px-3 rounded-lg text-xs font-semibold transition active:scale-95 shadow-md shadow-rose-950/30"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch</span>
                </button>

                <button
                  onClick={() => handleEdit(sc)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                  title="Edit Shortcut"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Delete shortcut "${sc.name}"?`)) {
                      onDeleteShortcut(sc.id);
                    }
                  }}
                  className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition"
                  title="Delete Shortcut"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Shortcut Modal */}
      {editingShortcut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">Shortcut Configuration</h3>
              <button
                onClick={() => setEditingShortcut(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Shortcut Name</label>
                <input
                  type="text"
                  value={editingShortcut.name}
                  onChange={(e) => setEditingShortcut({ ...editingShortcut, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Container</label>
                <select
                  value={editingShortcut.containerId}
                  onChange={(e) => setEditingShortcut({ ...editingShortcut, containerId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
                >
                  {containers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.gpuName.includes('Pixel 10') ? 'Pixel 10 PowerVR' : c.winArchitecture})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Executable Path</label>
                <input
                  type="text"
                  value={editingShortcut.execPath}
                  onChange={(e) => setEditingShortcut({ ...editingShortcut, execPath: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Command Line Arguments</label>
                <input
                  type="text"
                  value={editingShortcut.cmdArgs || ''}
                  placeholder="e.g. -windowed --force-vulkan"
                  onChange={(e) => setEditingShortcut({ ...editingShortcut, cmdArgs: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingShortcut.hudEnabled}
                    onChange={(e) => setEditingShortcut({ ...editingShortcut, hudEnabled: e.target.checked })}
                    className="rounded border-neutral-700 text-rose-600 bg-neutral-950"
                  />
                  <span className="text-xs text-neutral-200">Show WinlatorHUD Overlay</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingShortcut.isFavorite}
                    onChange={(e) => setEditingShortcut({ ...editingShortcut, isFavorite: e.target.checked })}
                    className="rounded border-neutral-700 text-amber-500 bg-neutral-950"
                  />
                  <span className="text-xs text-neutral-200">Favorite</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setEditingShortcut(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSaveShortcut(editingShortcut);
                  setEditingShortcut(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Save Shortcut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
