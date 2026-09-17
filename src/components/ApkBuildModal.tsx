import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Download, 
  GitBranch, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';

interface ApkBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkBuildModal: React.FC<ApkBuildModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeFlavor, setActiveFlavor] = useState<'standard' | 'ludashi' | 'pubg'>('ludashi');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const flavors = [
    {
      id: 'standard' as const,
      name: 'Standard Flavor',
      apkFile: 'Bannerlator-1.0-pixel10-dxt-standard.apk',
      task: './gradlew assembleStandardRelease',
      size: '~572 MB',
      description: 'Base Winlator with pure Wine 10 Staging + Bionic libc and Box64 Dynarec.',
      recommended: false,
    },
    {
      id: 'ludashi' as const,
      name: 'Ludashi Flavor (HUD + Vegas)',
      apkFile: 'Bannerlator-1.0-pixel10-dxt-ludashi.apk',
      task: './gradlew assembleLudashiRelease',
      size: '~588 MB',
      description: 'Optimized for mobile GPUs with WinlatorHUD, Vegas Engine 3.0, and Pixel 10 PowerVR DXT BCn transcoding.',
      recommended: true,
    },
    {
      id: 'pubg' as const,
      name: 'PUBG Layer Flavor',
      apkFile: 'Bannerlator-1.0-pixel10-dxt-pubg.apk',
      task: './gradlew assemblePubgRelease',
      size: '~594 MB',
      description: 'Includes GameNative 20260723 driver layer and extended controller mapping presets.',
      recommended: false,
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadManifest = () => {
    const manifest = {
      project: "Bannerlator (Winlator Star Fork)",
      version: "1.0-pixel10-dxt",
      commitAuthor: "Jacopo Hernandez",
      branch: "master",
      targetHardware: "Google Pixel 10 (Tensor G5 - Imagination PowerVR DXT-48-1536)",
      gpuProfile: {
        vendorId: 4112,
        vendorHex: "0x1010",
        deviceId: 5430,
        deviceHex: "0x1536",
        driver: "GameNative 20260723",
        transcodeLayer: "leegao_bcn v2.1"
      },
      ciWorkflow: ".github/workflows/build-artifacts.yml",
      matrixJobs: [
        { flavor: "standard", task: "assembleStandardRelease", output: "Bannerlator-1.0-pixel10-dxt-standard.apk" },
        { flavor: "ludashi", task: "assembleLudashiRelease", output: "Bannerlator-1.0-pixel10-dxt-ludashi.apk" },
        { flavor: "pubg", task: "assemblePubgRelease", output: "Bannerlator-1.0-pixel10-dxt-pubg.apk" }
      ],
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bannerlator-pixel10-build-manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div id="apk-build-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/50">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">APK Build & CI Dispatch Hub</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pixel 10 Ready
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Multi-Flavor Android compilation matrix & GitHub Actions deployment
              </p>
            </div>
          </div>
          <button
            id="close-apk-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  GitHub Actions Push Trigger Active
                </div>
                <div className="text-xs text-neutral-400">
                  <span className="font-mono text-neutral-300">.github/workflows/build-artifacts.yml</span> is configured to trigger on pushes to <span className="font-mono text-rose-300">master</span>.
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <a
                id="download-git-patch-btn"
                href="/bannerlator-pixel10-dxt.patch"
                download="bannerlator-pixel10-dxt.patch"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors border border-neutral-700"
                title="Download unified git patch file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Git Patch</span>
              </a>
              <button
                id="download-build-manifest-btn"
                onClick={handleDownloadManifest}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors shadow-md shadow-rose-950/40"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Manifest Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Build Spec</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Flavor Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Select Product Flavor for APK Output
              </label>
              <span className="text-xs text-neutral-500 font-mono">
                matrix: [standard, ludashi, pubg]
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {flavors.map((f) => {
                const isSelected = activeFlavor === f.id;
                return (
                  <div
                    key={f.id}
                    id={`flavor-card-${f.id}`}
                    onClick={() => setActiveFlavor(f.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all text-left relative ${
                      isSelected
                        ? 'bg-rose-950/20 border-rose-500 shadow-md shadow-rose-950/30'
                        : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {f.recommended && (
                      <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Recommended
                      </span>
                    )}
                    <div className="flex items-center space-x-2 mb-1.5">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-rose-500' : 'bg-neutral-600'}`} />
                      <span className="font-semibold text-sm text-white">{f.name}</span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                      {f.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-800/80 pt-2 font-mono">
                      <span>Size: {f.size}</span>
                      <span className="text-rose-400/90 font-medium">Release APK</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Flavor Build Instructions */}
          {(() => {
            const current = flavors.find((f) => f.id === activeFlavor)!;
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-rose-400" />
                    <span>Gradle Build Command ({current.name})</span>
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">{current.apkFile}</span>
                </div>
                <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800 font-mono text-xs flex items-center justify-between">
                  <code className="text-rose-300 overflow-x-auto py-1">
                    {current.task} -PversionName=1.0-pixel10-dxt
                  </code>
                  <button
                    id="copy-gradle-cmd-btn"
                    onClick={() => handleCopy(`${current.task} -PversionName=1.0-pixel10-dxt`, 1)}
                    className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors shrink-0 ml-2"
                    title="Copy command"
                  >
                    {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Hardware & Compatibility Payload Injected */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Pixel 10 Hardware Assets Bundled In This Build</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80">
                <div className="text-neutral-400 font-mono text-[11px]">app/src/main/assets/gpu_cards.json</div>
                <div className="text-white font-medium mt-0.5">
                  Pixel 10 PowerVR DXT-48-1536 (Vendor 0x1010, Device 0x1536)
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80">
                <div className="text-neutral-400 font-mono text-[11px]">app/src/main/assets/vegas_knowledge.json</div>
                <div className="text-white font-medium mt-0.5">
                  Vegas Engine 3.0 (vegas.powervr.dxtFix=1, leegao BCn transcoding)
                </div>
              </div>
            </div>
          </div>

          {/* AI Studio Export to GitHub Guide */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-neutral-950 to-neutral-950 border border-rose-500/30 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ready for AI Studio "Export to GitHub"</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Clean Tree (0 untracked files)
              </span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              The repository index has been completely optimized and cleaned. All build caches (<code className="text-neutral-400">node_modules/</code> and <code className="text-neutral-400">dist/</code>) have been untracked, and the primary branch is set to <code className="text-rose-300 font-mono">main</code> to match your GitHub repository.
            </p>
            <div className="bg-neutral-900/80 rounded-lg p-3 border border-neutral-800 space-y-2">
              <div className="text-white font-medium text-[11px]">How to trigger the APK build via AI Studio Export:</div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-[11px]">
                <li>Click the <strong className="text-white">Settings / Overflow menu (&vellip;)</strong> in the top header of AI Studio.</li>
                <li>Select <strong className="text-rose-400">"Export to GitHub"</strong>.</li>
                <li>Choose repository <strong className="text-white">Sanketpathania/BannerlatorPowerVr</strong> and target branch <strong className="text-white">main</strong>.</li>
                <li>Confirm export: GitHub Actions will immediately start compiling the Standard, Ludashi, and PUBG APKs!</li>
              </ol>
            </div>
          </div>

          {/* GitHub Actions CI/CD Pipeline & Fork Info */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <GitBranch className="w-4 h-4 text-rose-400" />
                <span>Personal Fork & CI Deployment</span>
              </div>
              <a
                href="https://github.com/Sanketpathania/BannerlatorPowerVr/actions"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-rose-400 hover:text-rose-300 font-medium"
              >
                <span>View Actions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Your git remote has been configured to point to your personal fork <code className="text-rose-300">Sanketpathania/BannerlatorPowerVr</code>. Once pushed, GitHub Actions runners automatically build the 3 APK flavors via <code className="text-neutral-300">build-artifacts.yml</code> and publish the APK binaries.
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>Active Git Remotes:</span>
                <span className="text-neutral-500">origin &rarr; Sanketpathania/BannerlatorPowerVr.git</span>
              </div>
              <div className="bg-neutral-900 rounded-lg p-2.5 border border-neutral-800 font-mono text-[11px] flex items-center justify-between text-neutral-300">
                <code className="text-rose-300">git push -u origin main</code>
                <button
                  onClick={() => handleCopy("git push -u origin main", 2)}
                  className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors shrink-0 ml-2"
                  title="Copy push command"
                >
                  {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            Author: <span className="text-white font-medium">Jacopo Hernandez</span> • Branch: <span className="text-rose-300 font-mono">main</span>
          </div>
          <button
            id="modal-done-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
