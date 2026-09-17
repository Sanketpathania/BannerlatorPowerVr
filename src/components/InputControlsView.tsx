import React, { useState } from 'react';
import { InputProfile, InputElement } from '../types';
import { INITIAL_PROFILES } from '../data/initialData';
import { 
  Sliders, 
  Plus, 
  Gamepad2, 
  Trash2, 
  Move, 
  Check, 
  Maximize2, 
  Download, 
  Upload,
  Eye,
  Crosshair
} from 'lucide-react';

interface InputControlsViewProps {
  profiles: InputProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onSaveProfile: (profile: InputProfile) => void;
}

export const InputControlsView: React.FC<InputControlsViewProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onSaveProfile,
}) => {
  const currentProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const selectedElement = currentProfile?.elements.find((el) => el.id === selectedElementId);

  const handleUpdateElement = (updated: InputElement) => {
    if (!currentProfile) return;
    const elements = currentProfile.elements.map((el) => (el.id === updated.id ? updated : el));
    onSaveProfile({ ...currentProfile, elements });
  };

  const handleAddElement = (type: InputElement['type']) => {
    if (!currentProfile) return;
    const newEl: InputElement = {
      id: `el_${Date.now()}`,
      name: `${type.toUpperCase()} ${currentProfile.elements.length + 1}`,
      type,
      binding: type === 'joystick' ? 'LS (Movement)' : 'Key Space',
      xPercent: 50,
      yPercent: 50,
      sizePx: type === 'joystick' ? 120 : type === 'dpad' ? 110 : 54,
    };
    onSaveProfile({
      ...currentProfile,
      elements: [...currentProfile.elements, newEl],
    });
    setSelectedElementId(newEl.id);
  };

  const handleDeleteElement = (id: string) => {
    if (!currentProfile) return;
    const elements = currentProfile.elements.filter((el) => el.id !== id);
    onSaveProfile({ ...currentProfile, elements });
    if (selectedElementId === id) setSelectedElementId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-5 rounded-xl border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>On-Screen Touch Controls</span>
            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-mono">
              {profiles.length} Profiles
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Customizable virtual touchscreen overlays (.icp profiles) mapped to XInput gamepads and DirectInput keys.
          </p>
        </div>

        {/* Profile Selector */}
        <div className="flex items-center gap-3">
          <select
            value={activeProfileId}
            onChange={(e) => onSelectProfile(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Stage & Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Visual Touch Canvas */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-rose-400" />
              <span>Interactive Virtual Gamepad Canvas (Drag elements or click to configure)</span>
            </span>
            <span className="font-mono text-neutral-500">
              Aspect Ratio 16:9 / Landscape Touch Arena
            </span>
          </div>

          <div
            id="touch-controls-canvas"
            className="relative w-full aspect-[16/9] bg-neutral-950 border-2 border-dashed border-neutral-800 rounded-2xl overflow-hidden shadow-2xl select-none flex items-center justify-center"
          >
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

            {/* Screen center watermark */}
            <div className="text-neutral-700/60 font-mono text-xs flex flex-col items-center pointer-events-none">
              <Crosshair className="w-8 h-8 stroke-[1.5]" />
              <span className="mt-1">XServer Display Area</span>
            </div>

            {/* Rendered Input Elements */}
            {currentProfile?.elements.map((el) => {
              const isSelected = el.id === selectedElementId;

              return (
                <div
                  key={el.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(el.id);
                  }}
                  style={{
                    left: `${el.xPercent}%`,
                    top: `${el.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${el.sizePx}px`,
                    height: `${el.sizePx}px`,
                    opacity: currentProfile.opacity,
                  }}
                  className={`absolute rounded-full flex flex-col items-center justify-center cursor-move transition-shadow ${
                    isSelected
                      ? 'ring-2 ring-rose-500 shadow-lg shadow-rose-950/80 bg-rose-600/30 border border-rose-400 text-white z-20'
                      : 'bg-neutral-800/80 hover:bg-neutral-800 border border-white/20 text-neutral-200 z-10'
                  }`}
                >
                  <span className="text-[11px] font-bold tracking-tight text-center px-1 truncate max-w-full">
                    {el.name}
                  </span>
                  <span className="text-[8px] text-neutral-300 font-mono truncate max-w-[85%]">
                    {el.binding}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Add Elements Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-xs">
            <span className="text-neutral-400 font-medium">Add Touch Element:</span>
            <button
              onClick={() => handleAddElement('button')}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 transition"
            >
              + Button
            </button>
            <button
              onClick={() => handleAddElement('joystick')}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 transition"
            >
              + Analog Stick
            </button>
            <button
              onClick={() => handleAddElement('dpad')}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 transition"
            >
              + D-Pad
            </button>
            <button
              onClick={() => handleAddElement('trigger')}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 transition"
            >
              + Trigger (L2/R2)
            </button>
            <button
              onClick={() => handleAddElement('touchpad')}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 transition"
            >
              + Mouse Touchpad
            </button>
          </div>
        </div>

        {/* Selected Element Property Inspector */}
        <div className="space-y-4">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-white text-sm">Control Inspector</h3>
              {selectedElement && (
                <button
                  onClick={() => handleDeleteElement(selectedElement.id)}
                  className="p-1 rounded text-neutral-400 hover:text-rose-400"
                  title="Remove Element"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedElement ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Element Name</label>
                  <input
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) => handleUpdateElement({ ...selectedElement, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Key / Gamepad Binding</label>
                  <input
                    type="text"
                    value={selectedElement.binding}
                    onChange={(e) => handleUpdateElement({ ...selectedElement, binding: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-400 mb-1">X Position ({selectedElement.xPercent}%)</label>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={selectedElement.xPercent}
                      onChange={(e) => handleUpdateElement({ ...selectedElement, xPercent: Number(e.target.value) })}
                      className="w-full accent-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Y Position ({selectedElement.yPercent}%)</label>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={selectedElement.yPercent}
                      onChange={(e) => handleUpdateElement({ ...selectedElement, yPercent: Number(e.target.value) })}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Size ({selectedElement.sizePx}px)</label>
                  <input
                    type="range"
                    min="36"
                    max="180"
                    value={selectedElement.sizePx}
                    onChange={(e) => handleUpdateElement({ ...selectedElement, sizePx: Number(e.target.value) })}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-neutral-500">
                Click on any on-screen button or stick in the canvas to adjust position, size, and binding.
              </div>
            )}
          </div>

          {/* Profile Global Opacity */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 text-xs space-y-3">
            <h4 className="font-semibold text-white">Profile Settings</h4>
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Overlay Opacity:</span>
                <span className="font-mono text-white">{Math.round((currentProfile?.opacity || 0.8) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={currentProfile?.opacity || 0.8}
                onChange={(e) => onSaveProfile({ ...currentProfile, opacity: Number(e.target.value) })}
                className="w-full accent-rose-500"
              />
            </div>

            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Elements count:</span>
              <span className="font-mono text-white">{currentProfile?.elements.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
