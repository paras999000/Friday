import React from 'react';
import { ConnectedDevice } from '../types';
import { Cpu, Zap, ShieldAlert, Play, ArrowLeft } from 'lucide-react';

interface FirmwareSummaryProps {
  connectedDevice: ConnectedDevice;
  onFlash: () => void;
  onBack: () => void;
  building: boolean;
}

export const FirmwareSummary: React.FC<FirmwareSummaryProps> = ({
  connectedDevice,
  onFlash,
  onBack,
  building,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 animate-fade-in text-left font-mono">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          Flash FIRDAY
        </h2>
        <p className="text-sm text-firday-muted">
          Ready to install FIRDAY onto your ESP32 Dev Module.
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-white/10 bg-firday-surface/90 p-6 mb-6 shadow-subtle text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] text-firday-cyan uppercase tracking-wider font-bold">Firmware</span>
            <h3 className="text-base font-bold text-white mt-0.5">FIRDAY v2.5.0</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected</span>
          </span>
        </div>

        <div className="py-4 space-y-3">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-firday-dim flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-firday-cyan" />
              Device
            </span>
            <span className="text-white font-semibold">ESP32 Dev Module</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-firday-dim">Hardware Chip</span>
            <span className="text-white">{connectedDevice.chip}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-firday-dim">Serial Port</span>
            <span className="text-emerald-400 font-bold">{connectedDevice.port}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-firday-dim">Flash Target</span>
            <span className="text-white">{connectedDevice.flashSize} (Single 0x0 Offset)</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-firday-dim">Wake Word</span>
            <span className="text-firday-violet font-semibold">Jarvis (FIRDAY Assistant)</span>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
            This process will overwrite the firmware currently installed on your ESP32.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <button
          onClick={onBack}
          disabled={building}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-firday-muted hover:text-white hover:bg-white/[0.04] transition-all text-xs font-medium disabled:opacity-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <button
          onClick={onFlash}
          disabled={building}
          className="flex items-center gap-2.5 px-8 py-3 rounded-xl bg-firday-cyan text-black font-bold text-xs hover:bg-cyan-300 shadow-cyan-glow transition-all duration-150 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>Flash FIRDAY</span>
        </button>
      </div>
    </div>
  );
};
