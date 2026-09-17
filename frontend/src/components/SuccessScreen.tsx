import React from 'react';
import { Check, ArrowRight, RotateCcw, Cpu, ShieldCheck } from 'lucide-react';

interface SuccessScreenProps {
  onDone: () => void;
  onFlashAgain: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onDone, onFlashAgain }) => {
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-12 text-center animate-fade-in font-mono">
      {/* Large Checkmark with Subtle Glow */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_35px_-5px_rgba(16,185,129,0.3)]">
          <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
        FIRDAY IS READY
      </h2>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-firday-muted max-w-sm mx-auto mb-8 font-light">
        Your ESP32 Dev Module has been successfully flashed.
      </p>

      {/* Device & Status Card */}
      <div className="rounded-2xl border border-white/10 bg-firday-surface/90 p-6 mb-8 text-left shadow-subtle text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-firday-cyan" />
            <span className="font-bold text-white uppercase">Device</span>
          </div>
          <span className="text-white font-semibold">ESP32 Dev Module</span>
        </div>

        <div className="py-3 space-y-2.5 text-firday-dim">
          <div className="flex justify-between">
            <span>Firmware</span>
            <span className="text-white font-semibold">FIRDAY v2.5.0</span>
          </div>
          <div className="flex justify-between">
            <span>Flash Offset</span>
            <span className="text-firday-cyan font-mono">0x00000000 (Full Image)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Status</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onDone}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-firday-cyan text-black font-semibold text-sm hover:bg-cyan-300 shadow-cyan-glow transition-all cursor-pointer"
        >
          <span>Done</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onFlashAgain}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] text-white hover:bg-white/[0.08] border border-white/10 text-sm font-medium transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-firday-muted" />
          <span>Flash Again</span>
        </button>
      </div>
    </div>
  );
};
