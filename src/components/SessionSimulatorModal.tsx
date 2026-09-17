import React, { useState, useEffect } from 'react';
import { Container, Shortcut, InputProfile } from '../types';
import { 
  X, 
  Activity, 
  Cpu, 
  Sliders, 
  Maximize2, 
  RotateCcw, 
  Settings2, 
  Volume2, 
  Flame, 
  Zap, 
  Gamepad2, 
  Check, 
  Layers
} from 'lucide-react';

interface SessionSimulatorModalProps {
  container: Container;
  shortcut?: Shortcut | null;
  inputProfile: InputProfile;
  onClose: () => void;
}

export const SessionSimulatorModal: React.FC<SessionSimulatorModalProps> = ({
  container,
  shortcut,
  inputProfile,
  onClose,
}) => {
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.6);
  const [gpuLoad, setGpuLoad] = useState(64);
  const [vramUsage, setVramUsage] = useState(1280);
  const [showHud, setShowHud] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [aspectMode, setAspectMode] = useState<'fit' | 'stretch' | 'fill' | 'integer'>('fit');
  const [pressedButtons, setPressedButtons] = useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isPixel10 = container.gpuName.includes('Pixel 10') || container.id === 'c-pixel10';

  // Dynamic simulation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      // simulate realistic frame variation
      const baseFps = isPixel10 ? 60 : 54;
      const jitter = (Math.random() - 0.5) * 2.5;
      const currentFps = Math.max(30, Math.min(120, Number((baseFps + jitter).toFixed(1))));
      setFps(currentFps);
      setFrameTime(Number((1000 / currentFps).toFixed(1)));
      setGpuLoad(Math.min(98, Math.max(45, Math.round(62 + (Math.random() - 0.5) * 8))));
      setVramUsage(Math.round(1350 + Math.sin(Date.now() / 3000) * 120));
    }, 400);

    return () => clearInterval(interval);
  }, [isPixel10]);

  const handleTouchButton = (id: string, active: boolean) => {
    setPressedButtons((prev) => ({ ...prev, [id]: active }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden select-none">
      {/* Top Floating App Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent p-3 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-neutral-900/80 border border-neutral-700/80 backdrop-blur text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-white truncate max-w-[200px]">
              {shortcut ? shortcut.name : container.name}
            </span>
            {isPixel10 && (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30">
                Pixel 10 PowerVR DXT
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick HUD toggle */}
          <button
            onClick={() => setShowHud(!showHud)}
            className={`px-2.5 py-1 rounded text-xs font-semibold backdrop-blur transition ${
              showHud
                ? 'bg-neutral-800 text-rose-300 border border-neutral-700'
                : 'bg-black/60 text-neutral-400 hover:text-white'
            }`}
          >
            HUD
          </button>

          {/* Quick Controls toggle */}
          <button
            onClick={() => setShowControls(!showControls)}
            className={`px-2.5 py-1 rounded text-xs font-semibold backdrop-blur transition ${
              showControls
                ? 'bg-neutral-800 text-amber-300 border border-neutral-700'
                : 'bg-black/60 text-neutral-400 hover:text-white'
            }`}
          >
            Touch Pad
          </button>

          {/* Settings Drawer Button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white"
            title="In-Game Drawer"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Close / Exit Session */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/50"
            title="Exit Wine Session"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Display Container (Simulated Game Canvas) */}
      <div className="relative flex-1 w-full h-full bg-neutral-950 flex items-center justify-center overflow-hidden">
        {/* Rendered 3D Scene Mockup */}
        <div
          style={{
            aspectRatio: aspectMode === 'fit' ? '16/9' : 'auto',
            width: aspectMode === 'stretch' || aspectMode === 'fill' ? '100%' : undefined,
            height: aspectMode === 'stretch' || aspectMode === 'fill' ? '100%' : undefined,
          }}
          className="relative max-w-full max-h-full aspect-[16/9] w-full bg-gradient-to-tr from-neutral-950 via-slate-900 to-rose-950/30 flex flex-col items-center justify-center border border-neutral-800 shadow-2xl overflow-hidden"
        >
          {/* Animated 3D geometric grid representing Vulkan render */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

          {/* Center Title & Benchmark info */}
          <div className="relative z-10 text-center space-y-2 p-6 max-w-md pointer-events-none">
            <div className="inline-block p-3 rounded-2xl bg-neutral-900/90 border border-neutral-700 shadow-xl mb-2">
              <Gamepad2 className="w-10 h-10 text-rose-500 mx-auto" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {shortcut ? shortcut.name : 'Wine Desktop Session'}
            </h1>
            <p className="text-xs text-neutral-400 font-mono">
              Renderer: {container.graphicsDriver} • {container.dxwrapper}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                GPU: {isPixel10 ? 'PowerVR DXT-48-1536' : container.gpuName.split(' ')[0]}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {container.winArchitecture} Bionic
              </span>
            </div>
          </div>

          {/* WinlatorHUD Overlay (top-left or top-right) */}
          {showHud && (
            <div
              id="winlator-hud-overlay"
              className="absolute top-14 left-4 z-30 bg-black/85 backdrop-blur-md border border-neutral-800 text-[11px] font-mono p-3 rounded-xl shadow-2xl space-y-1.5 min-w-[210px] pointer-events-none"
            >
              <div className="flex items-center justify-between pb-1 border-b border-neutral-800 text-neutral-400 text-[10px]">
                <span className="font-bold text-rose-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  <span>WINLATOR HUD</span>
                </span>
                <span>{container.dxwrapper.split(' ')[0]}</span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-neutral-400">FPS:</span>
                <span className="text-base font-bold text-emerald-400">{fps}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Frame Time:</span>
                <span className="text-white">{frameTime} ms</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">GPU Load:</span>
                <span className="text-amber-300">{gpuLoad}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">VRAM:</span>
                <span className="text-neutral-200">
                  {vramUsage} / {container.videoMemorySizeMB} MB
                </span>
              </div>

              {isPixel10 && (
                <div className="pt-1 mt-1 border-t border-neutral-800 text-[10px] space-y-0.5">
                  <div className="flex justify-between text-rose-300">
                    <span>PowerVR DXT:</span>
                    <span>BCn Active</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Ray Tracing:</span>
                    <span className="text-emerald-400">Vulkan 1.3</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Virtual Touch Input Elements Overlay */}
          {showControls && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {inputProfile.elements.map((el) => {
                const isPressed = pressedButtons[el.id];

                return (
                  <button
                    key={el.id}
                    onMouseDown={() => handleTouchButton(el.id, true)}
                    onMouseUp={() => handleTouchButton(el.id, false)}
                    onTouchStart={() => handleTouchButton(el.id, true)}
                    onTouchEnd={() => handleTouchButton(el.id, false)}
                    style={{
                      left: `${el.xPercent}%`,
                      top: `${el.yPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${el.sizePx}px`,
                      height: `${el.sizePx}px`,
                      opacity: inputProfile.opacity,
                    }}
                    className={`absolute rounded-full flex flex-col items-center justify-center transition-transform active:scale-90 pointer-events-auto border ${
                      isPressed
                        ? 'bg-rose-500/60 border-rose-300 text-white shadow-lg shadow-rose-950/80 scale-95'
                        : 'bg-neutral-900/60 hover:bg-neutral-800/80 border-white/20 text-neutral-200 backdrop-blur-sm'
                    }`}
                  >
                    <span className="text-xs font-bold leading-none">{el.name}</span>
                    <span className="text-[8px] text-neutral-400 font-mono mt-0.5 leading-none">
                      {el.binding.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* In-Game Slide-over Drawer */}
      {drawerOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-neutral-950/95 border-l border-neutral-800 z-50 p-5 overflow-y-auto space-y-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="font-bold text-white text-sm">Session Drawer</h3>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">Fullscreen Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['fit', 'stretch', 'fill', 'integer'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAspectMode(mode)}
                  className={`py-1.5 px-2 rounded-lg border font-medium uppercase text-[11px] transition ${
                    aspectMode === mode
                      ? 'bg-rose-600/20 text-rose-300 border-rose-500/50'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
              <span>Winlator HUD Overlay</span>
              <input
                type="checkbox"
                checked={showHud}
                onChange={(e) => setShowHud(e.target.checked)}
                className="rounded border-neutral-700 text-rose-600 bg-neutral-900"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
              <span>Virtual Touch Controls</span>
              <input
                type="checkbox"
                checked={showControls}
                onChange={(e) => setShowControls(e.target.checked)}
                className="rounded border-neutral-700 text-rose-600 bg-neutral-900"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
              <span>Pixel 10 BCn Transcoder</span>
              <input
                type="checkbox"
                checked={container.leegaoBcnEnabled}
                readOnly
                className="rounded border-neutral-700 text-emerald-500 bg-neutral-900"
              />
            </label>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-neutral-800 space-y-2">
            <button
              onClick={() => {
                setFps(60);
                setDrawerOpen(false);
              }}
              className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-neutral-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Renderer Pipeline</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-rose-950/40"
            >
              Exit to Launcher
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
