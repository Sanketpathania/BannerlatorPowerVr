import { Container, Shortcut, InputProfile, GpuCard, BundledWrapper, WinComponentCategory } from '../types';

export const BUNDLED_WRAPPERS: BundledWrapper[] = [
  {
    id: 'wrapper-gamenative',
    file: 'wrapper-gamenative.tzst',
    version: 'GameNative 20260723',
    notes: "GameNative's wrapper (DX12 + integrated BCn), 32-bit game support; leegao's changes for older devices.",
    catalogId: 'gamenative-wrapper',
    recommendedFor: 'PowerVR GE8320/GM9446, Mali-G77/G78, Adreno 600+',
  },
  {
    id: 'wrapper-leegao',
    file: 'wrapper-leegao.tzst',
    version: 'leegao ICD 2025-10',
    notes: "leegao's Bionic Vulkan wrapper ICD (GameNative-packaged build).",
    catalogId: 'bannerlator-leegao',
    recommendedFor: 'PowerVR Rogue & MediaTek Helio G-series',
  },
  {
    id: 'wrapper-legacy',
    file: 'wrapper-legacy.tzst',
    version: 'Winlator Bionic Legacy',
    notes: "Pipetto-crypto's Winlator Bionic wrapper with low-overhead SysV SHM.",
    catalogId: 'bannerlator-legacy',
    recommendedFor: 'Compatibility fallback & older Android versions',
  },
  {
    id: 'wrapper-original',
    file: 'wrapper-original.tzst',
    version: 'Winlator Original (Bruno)',
    notes: "Bruno's original Winlator wrapper for Turnip and Mesa drivers.",
    catalogId: 'bannerlator-original',
    recommendedFor: 'Adreno Qualcomm GPUs with Turnip',
  },
  {
    id: 'virgl-renderer',
    file: 'virglrenderer.tzst',
    version: 'VirGL Renderer v9 (GLES)',
    notes: 'OpenGL ES to Gallium3D desktop OpenGL translation for devices lacking Vulkan.',
    catalogId: 'virgl-gles',
    recommendedFor: 'Non-Vulkan PowerVR & Mali devices',
  }
];

export const DX_WRAPPERS = [
  'DXVK 2.3.1-arm64ec-gplasync',
  'DXVK 1.10.3 (Legacy D3D9/11)',
  'DXVK 1.11.1-sarek',
  'D8VK 1.0 (Direct3D 8)',
  'VKD3D 2.14.1 (Direct3D 12)',
  'VKD3D 2.8',
  'cnc-ddraw (Classic 2D/DirectDraw)',
  'dgvoodoo (DirectX 1-7 wrapper)',
  'nglide (3dfx Glide)'
];

export const WINE_VERSIONS = [
  'Wine 10.0 Staging Bionic (ARM64EC)',
  'Wine 9.0 Standard Bionic',
  'Wine 8.0.2 Vanilla (Star Fork)',
  'Wine 7.22 Proton Custom'
];

export const SCREEN_RESOLUTIONS = [
  '1280x720 (16:9)',
  '1920x1080 (16:9)',
  '1600x900 (16:9)',
  '1024x768 (4:3)',
  '800x600 (4:3)',
  '1280x800 (16:10)',
  '2400x1080 (20:9 Ultrawide)'
];

export const SAMPLE_GPUS: GpuCard[] = [
  { name: 'PowerVR Rogue GE8320 (Vulkan 1.1 / BCn Layer)', deviceID: 5710, vendorID: 4098, type: 'PowerVR' },
  { name: 'PowerVR B-Series BXM-4-64', deviceID: 5711, vendorID: 4098, type: 'PowerVR' },
  { name: 'ARM Mali-G77 MC9 (Bionic Vulkan)', deviceID: 26544, vendorID: 4098, type: 'Mali' },
  { name: 'Qualcomm Adreno 730 (Turnip 25.1.0)', deviceID: 8758, vendorID: 4318, type: 'Adreno' },
  { name: 'NVIDIA GeForce GTX 1060', deviceID: 7171, vendorID: 4318, type: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 750 Ti', deviceID: 4992, vendorID: 4318, type: 'NVIDIA' },
  { name: 'AMD Radeon RX 5700 XT', deviceID: 29471, vendorID: 4098, type: 'AMD' },
  { name: 'Intel(R) Iris(TM) Pro Graphics 5200', deviceID: 3362, vendorID: 32902, type: 'Intel' }
];

export const INITIAL_CONTAINERS: Container[] = [
  {
    id: 'c1',
    name: 'PowerVR Bionic Gaming (64-bit)',
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
    createdDate: '2026-09-10',
    envVars: [
      { key: 'BOX64_DYNAREC', value: '1', enabled: true },
      { key: 'BOX64_DYNAREC_FASTNAN', value: '1', enabled: true },
      { key: 'BOX64_DYNAREC_BIGBLOCK', value: '2', enabled: true },
      { key: 'BOX64_DYNAREC_FORWARD', value: '512', enabled: true },
      { key: 'DXVK_HUD', value: 'fps,frametimes,gpuload', enabled: true },
      { key: 'WINE_VK_VULKAN_ICD', value: 'libvulkan_powervr.so', enabled: true }
    ],
    drives: [
      { letter: 'C:', path: '/storage/emulated/0/Winlator/drives/c' },
      { letter: 'D:', path: '/storage/emulated/0/Download' },
      { letter: 'Z:', path: '/' }
    ]
  },
  {
    id: 'c2',
    name: 'Classic 32-bit DirectDraw & D3D9',
    screenSize: '1024x768 (4:3)',
    graphicsDriver: 'leegao ICD 2025-10',
    dxwrapper: 'cnc-ddraw (Classic 2D/DirectDraw)',
    audioDriver: 'PulseAudio',
    wineVersion: 'Wine 9.0 Standard Bionic',
    winArchitecture: '32-bit',
    gpuName: 'PowerVR B-Series BXM-4-64',
    gpuVendorId: 4098,
    gpuDeviceId: 5711,
    videoMemorySizeMB: 1024,
    cpuCores: 4,
    box64Preset: 'Compatibility',
    bionicFgEnabled: false,
    leegaoBcnEnabled: true,
    createdDate: '2026-09-12',
    envVars: [
      { key: 'BOX64_DYNAREC_SAFEFLAGS', value: '1', enabled: true },
      { key: 'BOX64_DYNAREC_WAIT', value: '1', enabled: true }
    ],
    drives: [
      { letter: 'C:', path: '/storage/emulated/0/Winlator/drives/c' },
      { letter: 'D:', path: '/storage/emulated/0/Games' }
    ]
  },
  {
    id: 'c3',
    name: 'Turnip / Adreno High-Performance',
    screenSize: '1920x1080 (16:9)',
    graphicsDriver: 'Winlator Original (Bruno)',
    dxwrapper: 'DXVK 2.3.1-arm64ec-gplasync',
    audioDriver: 'DirectAudio',
    wineVersion: 'Wine 10.0 Staging Bionic (ARM64EC)',
    winArchitecture: '64-bit',
    gpuName: 'Qualcomm Adreno 730 (Turnip 25.1.0)',
    gpuVendorId: 4318,
    gpuDeviceId: 8758,
    videoMemorySizeMB: 4096,
    cpuCores: 8,
    box64Preset: 'Performance',
    bionicFgEnabled: true,
    leegaoBcnEnabled: false,
    createdDate: '2026-09-14',
    envVars: [
      { key: 'BOX64_DYNAREC', value: '1', enabled: true },
      { key: 'BOX64_AVX', value: '1', enabled: true }
    ],
    drives: [
      { letter: 'C:', path: '/storage/emulated/0/Winlator/drives/c' }
    ]
  }
];

export const INITIAL_SHORTCUTS: Shortcut[] = [
  {
    id: 's1',
    name: 'AIO Graphics Test (64-bit)',
    containerId: 'c1',
    execPath: 'C:/AIO Graphics Test v2/AIO-Graphics-Test-64bit.exe',
    cmdArgs: '--benchmark --vulkan',
    workingDir: 'C:/AIO Graphics Test v2',
    iconType: 'benchmark',
    hudEnabled: true,
    isFavorite: true,
    fpsTarget: 60
  },
  {
    id: 's2',
    name: 'AIO Graphics Test (OpenGL)',
    containerId: 'c1',
    execPath: 'C:/AIO Graphics Test v2/AIO-Graphics-Test-64bit.exe',
    cmdArgs: '--force-gl',
    workingDir: 'C:/AIO Graphics Test v2',
    iconType: 'benchmark',
    hudEnabled: true,
    isFavorite: false,
    fpsTarget: 60
  },
  {
    id: 's3',
    name: 'AIO Graphics Test HDR',
    containerId: 'c1',
    execPath: 'C:/AIO Graphics Test v2/AIO-Graphics-Test-64bit.exe',
    cmdArgs: '--hdr',
    workingDir: 'C:/AIO Graphics Test v2',
    iconType: 'benchmark',
    hudEnabled: true,
    isFavorite: true,
    fpsTarget: 60
  },
  {
    id: 's4',
    name: 'Game Controller Test',
    containerId: 'c1',
    execPath: 'C:/Game Controller Test/GameConTest.exe',
    workingDir: 'C:/Game Controller Test',
    iconType: 'tool',
    hudEnabled: false,
    isFavorite: true,
    fpsTarget: 120
  },
  {
    id: 's5',
    name: '7-Zip File Manager',
    containerId: 'c2',
    execPath: 'C:/Program Files/7-Zip/7zFM.exe',
    iconType: 'utility',
    hudEnabled: false,
    isFavorite: false
  },
  {
    id: 's6',
    name: 'Fallout: New Vegas (Bionic FG)',
    containerId: 'c1',
    execPath: 'C:/Games/FalloutNV/FalloutNV.exe',
    cmdArgs: '-windowed',
    iconType: 'game',
    hudEnabled: true,
    isFavorite: true,
    fpsTarget: 60
  }
];

export const INITIAL_PROFILES: InputProfile[] = [
  {
    id: 'p1',
    name: 'Standard Gamepad (Xbox/PlayStation layout)',
    description: 'Dual analog sticks, D-Pad, A/B/X/Y buttons, L1/R1 bumpers, and L2/R2 triggers.',
    opacity: 0.85,
    elements: [
      { id: 'el1', name: 'Left Stick', type: 'joystick', binding: 'LS (Movement)', xPercent: 12, yPercent: 68, sizePx: 130 },
      { id: 'el2', name: 'Right Stick', type: 'joystick', binding: 'RS (Aim / Camera)', xPercent: 78, yPercent: 68, sizePx: 130 },
      { id: 'el3', name: 'D-Pad', type: 'dpad', binding: 'D-Pad Up/Down/Left/Right', xPercent: 12, yPercent: 35, sizePx: 110 },
      { id: 'el4', name: 'Button A', type: 'button', binding: 'Gamepad A (Space / Jump)', xPercent: 88, yPercent: 52, sizePx: 54 },
      { id: 'el5', name: 'Button B', type: 'button', binding: 'Gamepad B (Crouch / Cancel)', xPercent: 94, yPercent: 42, sizePx: 54 },
      { id: 'el6', name: 'Button X', type: 'button', binding: 'Gamepad X (Reload / Action)', xPercent: 82, yPercent: 42, sizePx: 54 },
      { id: 'el7', name: 'Button Y', type: 'button', binding: 'Gamepad Y (Weapon Switch)', xPercent: 88, yPercent: 32, sizePx: 54 },
      { id: 'el8', name: 'L1', type: 'bumper', binding: 'Left Bumper', xPercent: 14, yPercent: 14, sizePx: 70 },
      { id: 'el9', name: 'R1', type: 'bumper', binding: 'Right Bumper', xPercent: 86, yPercent: 14, sizePx: 70 },
      { id: 'el10', name: 'L2', type: 'trigger', binding: 'Left Trigger (Aim)', xPercent: 24, yPercent: 14, sizePx: 70 },
      { id: 'el11', name: 'R2', type: 'trigger', binding: 'Right Trigger (Fire)', xPercent: 76, yPercent: 14, sizePx: 70 }
    ]
  },
  {
    id: 'p2',
    name: 'FPS Keyboard & Mouse Emulation',
    description: 'WASD D-Pad, Mouse Look trackpad, Left/Right Click triggers, Shift, Ctrl, Space.',
    opacity: 0.75,
    elements: [
      { id: 'el21', name: 'WASD Pad', type: 'dpad', binding: 'Keys W/A/S/D', xPercent: 14, yPercent: 60, sizePx: 130 },
      { id: 'el22', name: 'Look Touchpad', type: 'touchpad', binding: 'Mouse Move / Camera', xPercent: 76, yPercent: 60, sizePx: 150 },
      { id: 'el23', name: 'Fire (LMB)', type: 'button', binding: 'Mouse Left Click', xPercent: 88, yPercent: 32, sizePx: 64 },
      { id: 'el24', name: 'Aim (RMB)', type: 'button', binding: 'Mouse Right Click', xPercent: 78, yPercent: 25, sizePx: 60 },
      { id: 'el25', name: 'Jump', type: 'button', binding: 'Key Space', xPercent: 88, yPercent: 78, sizePx: 54 },
      { id: 'el26', name: 'Crouch', type: 'button', binding: 'Key C / Ctrl', xPercent: 26, yPercent: 75, sizePx: 50 },
      { id: 'el27', name: 'Sprint', type: 'button', binding: 'Key Shift', xPercent: 26, yPercent: 55, sizePx: 50 }
    ]
  }
];

export const WIN_COMPONENTS_DATA: WinComponentCategory[] = [
  {
    id: 'direct3d',
    title: 'Direct3D & D3DCompilers',
    description: 'd3dcompiler 33-47, d3dx9 24-43, d3dx10, and d3dx11 runtime libraries',
    dlls: ['d3dcompiler_43', 'd3dcompiler_47', 'd3dx9_43', 'd3dx10_43', 'd3dx11_43'],
    installed: true
  },
  {
    id: 'directsound',
    title: 'DirectSound',
    description: 'Hardware/software audio mixing driver (dsound.dll)',
    dlls: ['dsound.dll'],
    installed: true
  },
  {
    id: 'directmusic',
    title: 'DirectMusic & MIDI Synth',
    description: 'Synthesizer, wave table, and dynamic sound tracks (dmusic, dmsynth, dswave)',
    dlls: ['dmusic', 'dmloader', 'dmsynth', 'dswave'],
    installed: true
  },
  {
    id: 'xaudio',
    title: 'XAudio2 & XACT Engine',
    description: 'XAudio 2.0-2.7 and X3DAudio spatial audio libraries',
    dlls: ['xaudio2_7', 'x3daudio1_7', 'xactengine3_7', 'xapofx1_5'],
    installed: true
  },
  {
    id: 'directplay',
    title: 'DirectPlay (Legacy LAN/Multiplayer)',
    description: 'DirectPlay network services for retro multiplayer Windows games',
    dlls: ['dplayx.dll', 'dpnet.dll', 'dpnhpast.dll'],
    installed: false
  },
  {
    id: 'vcrun2010',
    title: 'Visual C++ 2010 Runtime (x86/x64)',
    description: 'Microsoft VC++ 2010 Redistributable (msvcp100, msvcr100, vcomp100, atl100)',
    dlls: ['msvcp100', 'msvcr100', 'vcomp100', 'atl100'],
    installed: true
  },
  {
    id: 'directshow',
    title: 'DirectShow Video Codecs',
    description: 'Quartz media streaming and playback filters (amstream, quartz)',
    dlls: ['amstream', 'quartz', 'qcap'],
    installed: false
  }
];
