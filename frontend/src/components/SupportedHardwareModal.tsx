import React from 'react';
import { X, Cpu, HardDrive, Zap, CheckCircle2, Usb } from 'lucide-react';

interface SupportedHardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFlashing: () => void;
}

export const SupportedHardwareModal: React.FC<SupportedHardwareModalProps> = ({
  isOpen,
  onClose,
  onStartFlashing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-firday-surface p-6 sm:p-8 shadow-2xl overflow-hidden text-left relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-firday-cyan" />
              Supported Hardware Specification
            </h3>
            <p className="text-xs text-firday-muted">Standard ESP32 Dev Module (WROOM-32 / DevKit)</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-firday-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Specifications Grid */}
        <div className="space-y-4 mb-8 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-firday-dim">Microcontroller</span>
              <span className="text-white font-semibold">ESP32 (Xtensa Dual-Core 32-bit LX6 @ 240 MHz)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-firday-dim">Flash Memory</span>
              <span className="text-emerald-400 font-semibold">4 MB SPI Flash (Quad SPI)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-firday-dim">SRAM</span>
              <span className="text-white">520 KB internal SRAM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-firday-dim">Flash Address</span>
              <span className="text-firday-cyan font-bold">0x00000000 (Complete Unified Image)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-firday-dim">USB Interface</span>
              <span className="text-white">CP2102 / CH340 USB-UART serial bridge</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-firday-cyanDim border border-firday-cyan/20">
            <div className="flex items-center gap-2 text-firday-cyan font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Standard Dev Module Compatibility</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              FIRDAY is exclusively optimized for the standard 30-pin and 38-pin ESP32 DevKit boards. The build pipeline bundles the partition table, OTA metadata, and voice model into a single 4 MB image so you never need to calculate flash offsets.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-firday-muted hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onStartFlashing();
            }}
            className="px-6 py-2 rounded-xl bg-firday-cyan text-black font-semibold text-xs hover:bg-cyan-300 shadow-cyan-glow transition-all cursor-pointer"
          >
            Start Flashing
          </button>
        </div>
      </div>
    </div>
  );
};
