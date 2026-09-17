import React, { useState } from 'react';
import { Container, GpuCard } from '../types';
import { 
  BUNDLED_WRAPPERS, 
  DX_WRAPPERS, 
  WINE_VERSIONS, 
  SCREEN_RESOLUTIONS, 
  SAMPLE_GPUS 
} from '../data/initialData';
import { 
  Plus, 
  Play, 
  Settings2, 
  Copy, 
  Trash2, 
  HardDrive, 
  Cpu, 
  Monitor, 
  Layers, 
  Zap, 
  Volume2, 
  Check, 
  X,
  Sliders,
  FolderOpen
} from 'lucide-react';

interface ContainerManagerProps {
  containers: Container[];
  activeContainerId: string;
  onSelectContainer: (id: string) => void;
  onLaunchContainer: (container: Container) => void;
  onSaveContainer: (container: Container) => void;
  onDeleteContainer: (id: string) => void;
  onCloneContainer: (container: Container) => void;
}

export const ContainerManager: React.FC<ContainerManagerProps> = ({
  containers,
  activeContainerId,
  onSelectContainer,
  onLaunchContainer,
  onSaveContainer,
  onDeleteContainer,
  onCloneContainer,
}) => {
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'graphics' | 'cpu' | 'env' | 'drives'>('general');

  const startCreate = () => {
    const newContainer: Container = {
      id: `c_${Date.now()}`,
      name: `Container ${containers.length + 1}`,
      screenSize: '1280x720 (16:9)',
      graphicsDriver: 'GameNative 20260723',
      dxwrapper: 'DXVK 2.3.1-arm64ec-gplasync',
      audioDriver: 'DirectAudio',
      wineVersion: 'Wine 10.0 Staging Bionic (ARM64EC)',
      winArchitecture: '64-bit',
      gpuName: 'PowerVR Rogue GE8320 (Vulkan 1.1 / BCn Layer)',
      gpuVendorId: 4098,
      gpuDeviceId: 5710,
      videoMemorySizeMB: 2048,
      cpuCores: 8,
      box64Preset: 'Performance',
      bionicFgEnabled: true,
      leegaoBcnEnabled: true,
      createdDate: new Date().toISOString().split('T')[0],
      envVars: [
        { key: 'BOX64_DYNAREC', value: '1', enabled: true },
        { key: 'BOX64_DYNAREC_FASTNAN', value: '1', enabled: true },
        { key: 'DXVK_HUD', value: 'fps,frametimes', enabled: true },
      ],
      drives: [
        { letter: 'C:', path: '/storage/emulated/0/Winlator/drives/c' },
        { letter: 'D:', path: '/storage/emulated/0/Download' },
      ],
    };
    setEditingContainer(newContainer);
    setIsCreatingNew(true);
    setActiveTab('general');
  };

  const handleEdit = (container: Container) => {
    setEditingContainer(JSON.parse(JSON.stringify(container)));
    setIsCreatingNew(false);
    setActiveTab('general');
  };

  const handleSaveModal = () => {
    if (editingContainer) {
      onSaveContainer(editingContainer);
      setEditingContainer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-5 rounded-xl border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Containers</span>
            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-mono">
              {containers.length}
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Wine environments configured with PowerVR Vulkan ICD, Box64 dynarec, and Bionic Frame Gen layers.
          </p>
        </div>

        <button
          id="btn-create-container"
          onClick={startCreate}
          className="flex items-center justify-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-neutral-700 transition shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Container</span>
        </button>
      </div>

      {/* Containers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {containers.map((container) => {
          const isSelected = container.id === activeContainerId;
          return (
            <div
              key={container.id}
              id={`container-card-${container.id}`}
              onClick={() => onSelectContainer(container.id)}
              className={`flex flex-col justify-between p-5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900 border-rose-500/60 shadow-lg shadow-rose-950/20 ring-1 ring-rose-500/30'
                  : 'bg-neutral-900/40 hover:bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white text-base truncate">
                        {container.name}
                      </h3>
                      {isSelected && (
                        <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                        {container.winArchitecture}
                      </span>
                      <span className="text-xs text-neutral-400 truncate">
                        {container.wineVersion.split(' ')[0]} {container.wineVersion.split(' ')[1]}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                    <HardDrive className="w-4 h-4" />
                  </div>
                </div>

                {/* Specs List */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-400 py-1 border-b border-neutral-800/60">
                    <span className="flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-neutral-500" />
                      Screen:
                    </span>
                    <span className="text-neutral-200 font-medium">{container.screenSize}</span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-400 py-1 border-b border-neutral-800/60">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-neutral-500" />
                      Graphics:
                    </span>
                    <span className="text-neutral-200 font-medium truncate max-w-[170px]">
                      {container.graphicsDriver}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-400 py-1 border-b border-neutral-800/60">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-neutral-500" />
                      DX Wrapper:
                    </span>
                    <span className="text-neutral-200 font-medium truncate max-w-[170px]">
                      {container.dxwrapper}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-400 py-1">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-neutral-500" />
                      Box64 Preset:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-200 font-medium">{container.box64Preset}</span>
                      {container.bionicFgEnabled && (
                        <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300 font-mono">
                          FG
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  id={`btn-run-${container.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchContainer(container);
                  }}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white py-2 px-3 rounded-lg text-xs font-semibold transition active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Session</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    id={`btn-edit-${container.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(container);
                    }}
                    title="Configure Container"
                    className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>

                  <button
                    id={`btn-clone-${container.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloneContainer(container);
                    }}
                    title="Clone Container"
                    className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {containers.length > 1 && (
                    <button
                      id={`btn-delete-${container.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete container "${container.name}"?`)) {
                          onDeleteContainer(container.id);
                        }
                      }}
                      title="Delete Container"
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Container Modal */}
      {editingContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isCreatingNew ? 'Create New Container' : `Edit: ${editingContainer.name}`}
                </h3>
                <p className="text-xs text-neutral-400">
                  Wine environment configuration & PowerVR driver bindings
                </p>
              </div>
              <button
                onClick={() => setEditingContainer(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex overflow-x-auto border-b border-neutral-800 bg-neutral-950/40 px-6 py-2 gap-2 text-xs no-scrollbar">
              {[
                { id: 'general', label: 'General', icon: <HardDrive className="w-3.5 h-3.5" /> },
                { id: 'graphics', label: 'Graphics & DXVK', icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'cpu', label: 'CPU & Box64', icon: <Cpu className="w-3.5 h-3.5" /> },
                { id: 'env', label: 'Environment Vars', icon: <Sliders className="w-3.5 h-3.5" /> },
                { id: 'drives', label: 'Drives', icon: <FolderOpen className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Tab Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Container Name
                    </label>
                    <input
                      type="text"
                      value={editingContainer.name}
                      onChange={(e) => setEditingContainer({ ...editingContainer, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Screen Resolution
                      </label>
                      <select
                        value={editingContainer.screenSize}
                        onChange={(e) => setEditingContainer({ ...editingContainer, screenSize: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                      >
                        {SCREEN_RESOLUTIONS.map((res) => (
                          <option key={res} value={res}>
                            {res}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Wine Version
                      </label>
                      <select
                        value={editingContainer.wineVersion}
                        onChange={(e) => setEditingContainer({ ...editingContainer, wineVersion: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                      >
                        {WINE_VERSIONS.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Windows Architecture
                      </label>
                      <div className="flex gap-2">
                        {(['64-bit', '32-bit'] as const).map((arch) => (
                          <button
                            key={arch}
                            type="button"
                            onClick={() => setEditingContainer({ ...editingContainer, winArchitecture: arch })}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                              editingContainer.winArchitecture === arch
                                ? 'bg-rose-600/20 text-rose-300 border-rose-500/50'
                                : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                            }`}
                          >
                            {arch}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Audio Driver
                      </label>
                      <select
                        value={editingContainer.audioDriver}
                        onChange={(e) => setEditingContainer({ ...editingContainer, audioDriver: e.target.value as any })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                      >
                        <option value="DirectAudio">DirectAudio (AAudio Low Latency)</option>
                        <option value="PulseAudio">PulseAudio (Legacy standard)</option>
                        <option value="ALSA">ALSA Client Connection</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'graphics' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Graphics Driver Wrapper (PowerVR / Vulkan)
                    </label>
                    <select
                      value={editingContainer.graphicsDriver}
                      onChange={(e) => setEditingContainer({ ...editingContainer, graphicsDriver: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                    >
                      {BUNDLED_WRAPPERS.map((w) => (
                        <option key={w.id} value={w.version}>
                          {w.version} ({w.recommendedFor})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      GameNative and leegao ICD provide Bionic Vulkan translation and PowerVR BCn support.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        DirectX Wrapper (DXVK / VKD3D)
                      </label>
                      <select
                        value={editingContainer.dxwrapper}
                        onChange={(e) => setEditingContainer({ ...editingContainer, dxwrapper: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                      >
                        {DX_WRAPPERS.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Emulated GPU Identifier
                      </label>
                      <select
                        value={editingContainer.gpuName}
                        onChange={(e) => {
                          const found = SAMPLE_GPUS.find((g) => g.name === e.target.value);
                          if (found) {
                            setEditingContainer({
                              ...editingContainer,
                              gpuName: found.name,
                              gpuDeviceId: found.deviceID,
                              gpuVendorId: found.vendorID,
                            });
                          }
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                      >
                        {SAMPLE_GPUS.map((g) => (
                          <option key={g.name} value={g.name}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Video Memory Size (VRAM)
                      </label>
                      <select
                        value={editingContainer.videoMemorySizeMB}
                        onChange={(e) => setEditingContainer({ ...editingContainer, videoMemorySizeMB: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                      >
                        <option value={512}>512 MB (Low RAM devices)</option>
                        <option value={1024}>1024 MB (1 GB)</option>
                        <option value={2048}>2048 MB (2 GB - Recommended)</option>
                        <option value={4096}>4096 MB (4 GB)</option>
                      </select>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingContainer.bionicFgEnabled}
                          onChange={(e) => setEditingContainer({ ...editingContainer, bionicFgEnabled: e.target.checked })}
                          className="rounded border-neutral-700 text-rose-600 focus:ring-rose-500 bg-neutral-950"
                        />
                        <span className="text-xs text-neutral-200">
                          Enable Bionic Frame Generation (LS-FG 2x)
                        </span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingContainer.leegaoBcnEnabled}
                          onChange={(e) => setEditingContainer({ ...editingContainer, leegaoBcnEnabled: e.target.checked })}
                          className="rounded border-neutral-700 text-rose-600 focus:ring-rose-500 bg-neutral-950"
                        />
                        <span className="text-xs text-neutral-200">
                          leegao BCn Texture Transcoder (Essential for PowerVR)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cpu' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Box64 Dynarec Preset
                      </label>
                      <select
                        value={editingContainer.box64Preset}
                        onChange={(e) => setEditingContainer({ ...editingContainer, box64Preset: e.target.value as any })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                      >
                        <option value="Performance">Performance (Fastest, Bigblock=2, FastNAN=1)</option>
                        <option value="Intermediate">Intermediate (Balanced stability)</option>
                        <option value="Compatibility">Compatibility (Safe flags, slower)</option>
                        <option value="Safe">Safe (Maximum compatibility)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        CPU Core Affinity
                      </label>
                      <select
                        value={editingContainer.cpuCores}
                        onChange={(e) => setEditingContainer({ ...editingContainer, cpuCores: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                      >
                        <option value={2}>2 Cores</option>
                        <option value={4}>4 Cores</option>
                        <option value={6}>6 Cores</option>
                        <option value={8}>8 Cores (All cores)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-1">
                    <div className="font-semibold text-neutral-200">Box64 Dynarec Engine</div>
                    <p>
                      x86_64 CPU instructions are translated JIT into native ARM64 assembly with strong memory barrier mitigations for Android Bionic.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'env' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Custom Wine & Box64 Environment Variables</span>
                    <button
                      type="button"
                      onClick={() => {
                        const key = prompt('Enter variable name (e.g. DXVK_ASYNC):');
                        if (key) {
                          setEditingContainer({
                            ...editingContainer,
                            envVars: [...editingContainer.envVars, { key, value: '1', enabled: true }],
                          });
                        }
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                    >
                      + Add Variable
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {editingContainer.envVars.map((env, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                        <input
                          type="checkbox"
                          checked={env.enabled}
                          onChange={(e) => {
                            const copy = [...editingContainer.envVars];
                            copy[idx].enabled = e.target.checked;
                            setEditingContainer({ ...editingContainer, envVars: copy });
                          }}
                          className="rounded border-neutral-700 text-rose-600 bg-neutral-900"
                        />
                        <input
                          type="text"
                          value={env.key}
                          onChange={(e) => {
                            const copy = [...editingContainer.envVars];
                            copy[idx].key = e.target.value;
                            setEditingContainer({ ...editingContainer, envVars: copy });
                          }}
                          className="flex-1 bg-transparent text-xs text-white font-mono focus:outline-none"
                        />
                        <span className="text-neutral-500">=</span>
                        <input
                          type="text"
                          value={env.value}
                          onChange={(e) => {
                            const copy = [...editingContainer.envVars];
                            copy[idx].value = e.target.value;
                            setEditingContainer({ ...editingContainer, envVars: copy });
                          }}
                          className="w-24 bg-neutral-900 border border-neutral-800 rounded px-2 py-0.5 text-xs text-amber-300 font-mono focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = editingContainer.envVars.filter((_, i) => i !== idx);
                            setEditingContainer({ ...editingContainer, envVars: copy });
                          }}
                          className="text-neutral-500 hover:text-rose-400 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'drives' && (
                <div className="space-y-3">
                  <div className="text-xs text-neutral-400">Mapped Virtual File System Drives</div>
                  <div className="space-y-2">
                    {editingContainer.drives.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                        <span className="font-mono font-bold text-rose-400 text-sm">{d.letter}</span>
                        <span className="text-xs font-mono text-neutral-300 truncate flex-1">{d.path}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-900/80">
              <button
                type="button"
                onClick={() => setEditingContainer(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition shadow-md shadow-rose-950/40"
              >
                <Check className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
