import React, { useState, useEffect } from 'react';
import { ViewTab, Container, Shortcut, InputProfile, WinComponentCategory } from './types';
import { 
  INITIAL_CONTAINERS, 
  INITIAL_SHORTCUTS, 
  INITIAL_PROFILES, 
  WIN_COMPONENTS_DATA,
  SAMPLE_GPUS
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { ContainerManager } from './components/ContainerManager';
import { ShortcutsView } from './components/ShortcutsView';
import { InputControlsView } from './components/InputControlsView';
import { PowerVRAdvisorView } from './components/PowerVRAdvisorView';
import { WineComponentsView } from './components/WineComponentsView';
import { SessionSimulatorModal } from './components/SessionSimulatorModal';
import { ApkBuildModal } from './components/ApkBuildModal';
import { Sparkles, Check, Smartphone, Zap } from 'lucide-react';

export const App: React.FC = () => {
  // Load state from localStorage or initialData
  const [containers, setContainers] = useState<Container[]>(() => {
    try {
      const saved = localStorage.getItem('bannerlator_containers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CONTAINERS;
  });

  const [activeContainerId, setActiveContainerId] = useState<string>(() => {
    return containers.find((c) => c.id === 'c-pixel10')?.id || containers[0]?.id || 'c-pixel10';
  });

  const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => {
    try {
      const saved = localStorage.getItem('bannerlator_shortcuts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SHORTCUTS;
  });

  const [inputProfiles, setInputProfiles] = useState<InputProfile[]>(() => {
    try {
      const saved = localStorage.getItem('bannerlator_profiles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return inputProfiles[0]?.id || 'p1';
  });

  const [wineComponents, setWineComponents] = useState<WinComponentCategory[]>(() => {
    try {
      const saved = localStorage.getItem('bannerlator_winecomponents');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return WIN_COMPONENTS_DATA;
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('containers');
  const [apkModalOpen, setApkModalOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [activeSessionContainer, setActiveSessionContainer] = useState<Container | null>(null);
  const [activeSessionShortcut, setActiveSessionShortcut] = useState<Shortcut | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bannerlator_containers', JSON.stringify(containers));
  }, [containers]);

  useEffect(() => {
    localStorage.setItem('bannerlator_shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  useEffect(() => {
    localStorage.setItem('bannerlator_profiles', JSON.stringify(inputProfiles));
  }, [inputProfiles]);

  useEffect(() => {
    localStorage.setItem('bannerlator_winecomponents', JSON.stringify(wineComponents));
  }, [wineComponents]);

  const activeContainer = containers.find((c) => c.id === activeContainerId) || containers[0];
  const activeProfile = inputProfiles.find((p) => p.id === activeProfileId) || inputProfiles[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // One-click apply Pixel 10 PowerVR DXT profile to any container
  const handleApplyPixel10Profile = (targetContainerId: string) => {
    setContainers((prev) =>
      prev.map((c) => {
        if (c.id === targetContainerId) {
          const envVars = [...c.envVars];
          const ensureVar = (key: string, value: string) => {
            const idx = envVars.findIndex((e) => e.key === key);
            if (idx >= 0) {
              envVars[idx] = { key, value, enabled: true };
            } else {
              envVars.push({ key, value, enabled: true });
            }
          };

          ensureVar('BOX64_DYNAREC', '1');
          ensureVar('BOX64_DYNAREC_FASTNAN', '1');
          ensureVar('BOX64_DYNAREC_BIGBLOCK', '2');
          ensureVar('BOX64_DYNAREC_FORWARD', '512');
          ensureVar('DXVK_HUD', 'fps,frametimes,gpuload,version');
          ensureVar('WINE_VK_VULKAN_ICD', 'libvulkan_powervr.so');
          ensureVar('vegas.forceTranscode', '1');
          ensureVar('vegas.powervr.dxtFix', '1');

          return {
            ...c,
            gpuName: 'Google Pixel 10 - Imagination PowerVR DXT-48-1536 (Tensor G5)',
            gpuVendorId: 4112,
            gpuDeviceId: 5430,
            graphicsDriver: 'GameNative 20260723',
            dxwrapper: 'DXVK 2.3.1-arm64ec-gplasync',
            audioDriver: 'DirectAudio',
            videoMemorySizeMB: 4096,
            cpuCores: 8,
            box64Preset: 'Performance',
            bionicFgEnabled: true,
            leegaoBcnEnabled: true,
            envVars,
          };
        }
        return c;
      })
    );
    showToast(`Container "${activeContainer.name}" optimized for Google Pixel 10 PowerVR DXT!`);
  };

  // Launch handlers
  const handleLaunchContainer = (container: Container) => {
    setActiveSessionContainer(container);
    setActiveSessionShortcut(null);
    setSessionModalOpen(true);
  };

  const handleLaunchShortcut = (shortcut: Shortcut) => {
    const targetContainer = containers.find((c) => c.id === shortcut.containerId) || activeContainer;
    setActiveSessionContainer(targetContainer);
    setActiveSessionShortcut(shortcut);
    setSessionModalOpen(true);
  };

  // Container operations
  const handleSaveContainer = (container: Container) => {
    setContainers((prev) => {
      const exists = prev.some((c) => c.id === container.id);
      if (exists) {
        return prev.map((c) => (c.id === container.id ? container : c));
      }
      return [...prev, container];
    });
    setActiveContainerId(container.id);
    showToast(`Container "${container.name}" saved.`);
  };

  const handleDeleteContainer = (id: string) => {
    if (containers.length <= 1) {
      alert('Cannot delete the last remaining container.');
      return;
    }
    setContainers((prev) => prev.filter((c) => c.id !== id));
    if (activeContainerId === id) {
      const remaining = containers.filter((c) => c.id !== id);
      setActiveContainerId(remaining[0].id);
    }
    showToast('Container deleted.');
  };

  const handleCloneContainer = (container: Container) => {
    const cloned: Container = {
      ...JSON.parse(JSON.stringify(container)),
      id: `c_${Date.now()}`,
      name: `${container.name} (Copy)`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setContainers((prev) => [...prev, cloned]);
    setActiveContainerId(cloned.id);
    showToast(`Cloned into "${cloned.name}".`);
  };

  // Shortcut operations
  const handleSaveShortcut = (sc: Shortcut) => {
    setShortcuts((prev) => {
      const exists = prev.some((s) => s.id === sc.id);
      if (exists) {
        return prev.map((s) => (s.id === sc.id ? sc : s));
      }
      return [...prev, sc];
    });
    showToast(`Shortcut "${sc.name}" saved.`);
  };

  const handleDeleteShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
    showToast('Shortcut removed.');
  };

  const handleToggleFavorite = (id: string) => {
    setShortcuts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  // Input profile operations
  const handleSaveProfile = (profile: InputProfile) => {
    setInputProfiles((prev) =>
      prev.map((p) => (p.id === profile.id ? profile : p))
    );
  };

  // Wine components toggle
  const handleToggleComponent = (id: string) => {
    setWineComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, installed: !c.installed } : c))
    );
    showToast('Wine components manifest updated.');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLaunchContainer={() => handleLaunchContainer(activeContainer)}
        onOpenApkModal={() => setApkModalOpen(true)}
        activeContainerName={activeContainer?.name || 'Default'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'containers' && (
          <ContainerManager
            containers={containers}
            activeContainerId={activeContainerId}
            onSelectContainer={setActiveContainerId}
            onLaunchContainer={handleLaunchContainer}
            onSaveContainer={handleSaveContainer}
            onDeleteContainer={handleDeleteContainer}
            onCloneContainer={handleCloneContainer}
          />
        )}

        {activeTab === 'shortcuts' && (
          <ShortcutsView
            shortcuts={shortcuts}
            containers={containers}
            activeContainerId={activeContainerId}
            onLaunchShortcut={handleLaunchShortcut}
            onSaveShortcut={handleSaveShortcut}
            onDeleteShortcut={handleDeleteShortcut}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'controls' && (
          <InputControlsView
            profiles={inputProfiles}
            activeProfileId={activeProfileId}
            onSelectProfile={setActiveProfileId}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {activeTab === 'drivers' && (
          <PowerVRAdvisorView
            containers={containers}
            activeContainerId={activeContainerId}
            onApplyPixel10Profile={handleApplyPixel10Profile}
            onUpdateContainer={handleSaveContainer}
          />
        )}

        {activeTab === 'winecomponents' && (
          <WineComponentsView
            components={wineComponents}
            onToggleComponent={handleToggleComponent}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-4 text-xs text-neutral-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span>Bannerlator PowerVR • Winlator Star Engine</span>
            <span>•</span>
            <span className="text-neutral-400">Google Pixel 10 (Tensor G5 PowerVR DXT) Verified</span>
          </div>
          <div className="flex items-center space-x-3 text-neutral-400">
            <span>Vulkan 1.3</span>
            <span>•</span>
            <span>leegao BCn Transcode</span>
            <span>•</span>
            <span>Bionic FG</span>
          </div>
        </div>
      </footer>

      {/* Interactive Session Simulator Modal */}
      {sessionModalOpen && activeSessionContainer && (
        <SessionSimulatorModal
          container={activeSessionContainer}
          shortcut={activeSessionShortcut}
          inputProfile={activeProfile}
          onClose={() => {
            setSessionModalOpen(false);
            setActiveSessionContainer(null);
            setActiveSessionShortcut(null);
          }}
        />
      )}

      {/* APK Build & Release Modal */}
      <ApkBuildModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />
    </div>
  );
};
