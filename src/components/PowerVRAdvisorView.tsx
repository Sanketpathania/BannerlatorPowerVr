import React, { useState } from 'react';
import { Container, GpuCard } from '../types';
import { BUNDLED_WRAPPERS, SAMPLE_GPUS } from '../data/initialData';
import { 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Terminal,
  Activity,
  Info
} from 'lucide-react';

interface PowerVRAdvisorViewProps {
  containers: Container[];
  activeContainerId: string;
  onApplyPixel10Profile: (containerId: string) => void;
  onUpdateContainer: (container: Container) => void;
}

export const PowerVRAdvisorView: React.FC<PowerVRAdvisorViewProps> = ({
  containers,
  activeContainerId,
  onApplyPixel10Profile,
  onUpdateContainer,
}) => {
  const currentContainer = containers.find((c) => c.id === activeContainerId) || containers[0];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const pixel10Gpu = SAMPLE_GPUS.find((g) => g.name.includes('Pixel 10'));

  const isConfiguredForPixel10 = 
    currentContainer?.gpuName.includes('Pixel 10') ||
    (currentContainer?.gpuVendorId === 4112 && currentContainer?.leegaoBcnEnabled);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const toggleEnvVar = (key: string, val: string) => {
    if (!currentContainer) return;
    const existing = currentContainer.envVars.find((e) => e.key === key);
    let updatedEnv = [...currentContainer.envVars];
    if (existing) {
      updatedEnv = updatedEnv.map((e) => (e.key === key ? { ...e, enabled: !e.enabled } : e));
    } else {
      updatedEnv.push({ key, value: val, enabled: true });
    }
    onUpdateContainer({ ...currentContainer, envVars: updatedEnv });
  };

  return (
    <div className="space-y-6">
      {/* Hero Card for Pixel 10 PowerVR DXT */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-rose-950/40 border border-rose-500/30 p-6 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Smartphone className="w-64 h-64 text-rose-500" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Pixel 10 (Tensor G5) • Imagination PowerVR DXT Support</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Pixel 10 PowerVR DXT GPU Compatibility Layer
          </h2>
          <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
            Google's Tensor G5 transitions to TSMC 3nm with the <strong>Imagination PowerVR DXT-48-1536 GPU</strong>. 
            While featuring hardware Vulkan 1.3 and ray tracing, mobile PowerVR silicon lacks native desktop 
            <strong> BC1–BC7 (DXT1–5)</strong> texture decompression formats used by Windows games. 
            Bannerlator provides specialized Bionic transcode hooks, <code>leegao_bcn</code> device memory emulation, 
            and Vegas Engine overrides for seamless execution.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              id="btn-apply-pixel10-preset"
              onClick={() => onApplyPixel10Profile(currentContainer.id)}
              className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-rose-950/60 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Configure "{currentContainer?.name}" for Pixel 10</span>
            </button>

            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Status: {isConfiguredForPixel10 ? 'Pixel 10 Optimized' : 'Standard Configuration'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Architecture & Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-rose-400 mb-2">
            <Cpu className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-white">Silicon Specs</h3>
          </div>
          <div className="space-y-1.5 text-xs text-neutral-300">
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400">SoC:</span>
              <span className="font-medium text-white">Google Tensor G5 (TSMC 3nm)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400">GPU Core:</span>
              <span className="font-medium text-white">PowerVR DXT-48-1536</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400">PCI Vendor ID:</span>
              <span className="font-mono text-amber-300">0x1010 (4112 dec)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">PCI Device ID:</span>
              <span className="font-mono text-amber-300">0x1536 (5430 dec)</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <Layers className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-white">Driver & Wrappers</h3>
          </div>
          <div className="space-y-1.5 text-xs text-neutral-300">
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400">Recommended Wrapper:</span>
              <span className="font-medium text-rose-300">GameNative 20260723</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400">Vulkan ICD:</span>
              <span className="font-mono text-white">libvulkan_powervr.so</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400">BCn Transcoder:</span>
              <span className="font-medium text-emerald-400">leegao bcn_layer 2026</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Ray Tracing Tier:</span>
              <span className="font-medium text-amber-300">DXR 1.1 / VK_KHR_ray_tracing</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <Activity className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-white">Vegas Engine Overrides</h3>
          </div>
          <div className="space-y-1.5 text-xs text-neutral-300">
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400">vegas.powervr.dxtFix:</span>
              <span className="font-mono text-emerald-300">1 (Enabled)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400">vegas.forceTranscode:</span>
              <span className="font-mono text-emerald-300">1 (Force BCn)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400">Bionic Frame Gen:</span>
              <span className="font-mono text-emerald-300">Enabled (LS-FG 2x)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Dynarec Preset:</span>
              <span className="font-mono text-amber-300">Performance (Bigblock=2)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Verification Checklist for Pixel 10 */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-rose-500" />
          <span>Active Container Configuration Audit: {currentContainer?.name}</span>
        </h3>

        <div className="space-y-3">
          {[
            {
              title: 'GPU Identity Emulation (Vendor: 4112, Device: 5430)',
              desc: 'Passes Imagination DXT-48-1536 device signature to Wine & DXVK for vendor-specific pipeline optimizations.',
              status: currentContainer?.gpuVendorId === 4112,
              recommend: 'Set GPU card to "Google Pixel 10 - Imagination PowerVR DXT-48-1536"',
              action: () => {
                onUpdateContainer({
                  ...currentContainer,
                  gpuName: 'Google Pixel 10 - Imagination PowerVR DXT-48-1536 (Tensor G5)',
                  gpuVendorId: 4112,
                  gpuDeviceId: 5430,
                });
              }
            },
            {
              title: 'BCn Texture Compression Transcoding (leegao_bcn)',
              desc: 'Translates BC1-BC7 block-compressed textures into ASTC/RGBA8 on-the-fly to prevent black textures in DirectX 9/11/12 games.',
              status: currentContainer?.leegaoBcnEnabled === true,
              recommend: 'Enable leegao BCn Transcoder checkbox',
              action: () => {
                onUpdateContainer({
                  ...currentContainer,
                  leegaoBcnEnabled: true,
                });
              }
            },
            {
              title: 'Vegas PowerVR DXT Compatibility Fix (vegas.powervr.dxtFix=1)',
              desc: 'Forces memory alignment fix for IMG DXT unified memory architecture and prevents shader pipeline stall.',
              status: currentContainer?.envVars.some((e) => e.key === 'vegas.powervr.dxtFix' && e.enabled),
              recommend: 'Add environment variable vegas.powervr.dxtFix=1',
              action: () => toggleEnvVar('vegas.powervr.dxtFix', '1')
            },
            {
              title: 'Box64 Dynarec FastNAN & BigBlock=2 Tuning',
              desc: 'High performance JIT compilation presets taking full advantage of the TSMC 3nm Tensor G5 Cortex-X4 core.',
              status: currentContainer?.box64Preset === 'Performance',
              recommend: 'Set Box64 Dynarec Preset to "Performance"',
              action: () => {
                onUpdateContainer({
                  ...currentContainer,
                  box64Preset: 'Performance',
                });
              }
            },
            {
              title: 'DirectAudio (AAudio) Driver Integration',
              desc: 'Low-latency direct audio stream directly mapped into Android Bionic audio server.',
              status: currentContainer?.audioDriver === 'DirectAudio',
              recommend: 'Switch Audio Driver to DirectAudio',
              action: () => {
                onUpdateContainer({
                  ...currentContainer,
                  audioDriver: 'DirectAudio',
                });
              }
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 gap-3"
            >
              <div className="flex items-start gap-3">
                {item.status ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">{item.title}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">{item.desc}</div>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end">
                {item.status ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Compliant
                  </span>
                ) : (
                  <button
                    onClick={item.action}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm"
                  >
                    Auto-Fix
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vegas Knowledge Base & Manual Override Helper */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-rose-400" />
            <h3 className="font-semibold text-sm text-white">Pixel 10 Vegas Environment Variables</h3>
          </div>
          <span className="text-xs text-neutral-400">Click to copy key=value</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { k: 'vegas.powervr.dxtFix', v: '1', note: 'Pixel 10 DXT alignment fix' },
            { k: 'vegas.forceTranscode', v: '1', note: 'Force BCn texture transcode' },
            { k: 'BOX64_DYNAREC_FASTNAN', v: '1', note: 'Fast NaN floating point' },
            { k: 'BOX64_DYNAREC_BIGBLOCK', v: '2', note: 'Large JIT block optimization' },
            { k: 'BOX64_DYNAREC_FORWARD', v: '512', note: 'Lookahead forward branch' },
            { k: 'DXVK_HUD', v: 'fps,frametimes,gpuload', note: 'Pixel 10 onscreen HUD' }
          ].map((item) => (
            <button
              key={item.k}
              onClick={() => copyToClipboard(`${item.k}=${item.v}`)}
              className="text-left p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition group"
            >
              <div className="font-mono text-xs text-amber-300 group-hover:text-amber-200">
                {item.k}={item.v}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">{item.note}</div>
              {copiedKey === `${item.k}=${item.v}` && (
                <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Copied!</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
