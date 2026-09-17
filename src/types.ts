export type ViewTab = 'containers' | 'shortcuts' | 'controls' | 'drivers' | 'winecomponents' | 'session';

export interface EnvVar {
  key: string;
  value: string;
  enabled: boolean;
}

export interface DriveMapping {
  letter: string;
  path: string;
}

export interface Container {
  id: string;
  name: string;
  screenSize: string; // e.g. "1280x720", "1920x1080"
  graphicsDriver: string; // e.g. "GameNative 20260723", "leegao ICD 2025-10", "VirGL v9"
  dxwrapper: string; // e.g. "DXVK 2.3.1-arm64ec-gplasync", "DXVK 1.10.3", "VKD3D 2.14.1"
  audioDriver: 'PulseAudio' | 'DirectAudio' | 'ALSA';
  wineVersion: string; // e.g. "Wine 10 Staging Bionic", "Wine 9.0 Standard"
  winArchitecture: '64-bit' | '32-bit';
  gpuName: string; // from gpu_cards.json
  gpuVendorId: number;
  gpuDeviceId: number;
  videoMemorySizeMB: number;
  cpuCores: number;
  box64Preset: 'Performance' | 'Compatibility' | 'Intermediate' | 'Safe' | 'Custom';
  bionicFgEnabled: boolean;
  leegaoBcnEnabled: boolean;
  envVars: EnvVar[];
  drives: DriveMapping[];
  createdDate: string;
}

export interface Shortcut {
  id: string;
  name: string;
  containerId: string;
  execPath: string;
  cmdArgs?: string;
  workingDir?: string;
  iconType: 'game' | 'benchmark' | 'tool' | 'utility';
  graphicsDriverOverride?: string;
  dxwrapperOverride?: string;
  box64PresetOverride?: string;
  hudEnabled: boolean;
  isFavorite: boolean;
  fpsTarget?: number;
}

export interface InputElement {
  id: string;
  name: string;
  type: 'button' | 'dpad' | 'joystick' | 'trigger' | 'bumper' | 'touchpad';
  binding: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  sizePx: number;
  iconIndex?: number;
}

export interface InputProfile {
  id: string;
  name: string;
  description: string;
  opacity: number; // 0.1 - 1.0
  elements: InputElement[];
}

export interface GpuCard {
  name: string;
  deviceID: number;
  vendorID: number;
  type?: 'PowerVR' | 'NVIDIA' | 'AMD' | 'Intel' | 'Mali' | 'Adreno';
}

export interface BundledWrapper {
  id: string;
  file: string;
  version: string;
  notes: string;
  catalogId: string;
  recommendedFor: string;
}

export interface WinComponentCategory {
  id: string;
  title: string;
  description: string;
  dlls: string[];
  installed: boolean;
}

export interface WineProcess {
  pid: number;
  name: string;
  memoryMb: number;
  cpuPercent: number;
}
