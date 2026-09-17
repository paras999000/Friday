import React from 'react';
import { ConnectedDevice } from '../types';
import { CheckCircle2, Cpu, HardDrive, Radio, Usb, Sparkles } from 'lucide-react';

interface DeviceInfoProps {
  device: ConnectedDevice;
  onDisconnect?: () => void;
}

export const DeviceInfo: React.FC<DeviceInfoProps> = ({ device, onDisconnect }) => {
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6 shadow-subtle animate-fade-in text-left">
      {/* Connected Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-base font-semibold text-white font-mono">ESP32 Connected</span>
        </div>

        {device.isMock && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-firday-violetDim text-violet-300 border border-firday-violet/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>MOCK</span>
          </span>
        )}
      </div>

      {/* Grid of Chip Specs */}
      <div className="grid grid-cols-2 gap-4 my-5 font-mono">
        {/* Chip */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-firday-dim text-xs mb-1">
            <Cpu className="w-3.5 h-3.5 text-firday-cyan" />
            <span>Chip</span>
          </div>
          <span className="text-sm font-bold text-white block truncate">{device.chip}</span>
        </div>

        {/* Port */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-firday-dim text-xs mb-1">
            <Usb className="w-3.5 h-3.5 text-emerald-400" />
            <span>Serial Port</span>
          </div>
          <span className="text-sm font-bold text-white block truncate">{device.port}</span>
        </div>

        {/* Flash Size */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-firday-dim text-xs mb-1">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>Flash Size</span>
          </div>
          <span className="text-sm font-bold text-white block truncate">{device.flashSize}</span>
        </div>

        {/* MAC Address */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-firday-dim text-xs mb-1">
            <Radio className="w-3.5 h-3.5 text-firday-violet" />
            <span>MAC Address</span>
          </div>
          <span className="text-xs font-bold text-white block truncate tracking-tight">{device.mac}</span>
        </div>
      </div>

      {onDisconnect && (
        <div className="text-center pt-2">
          <button
            onClick={onDisconnect}
            className="text-xs text-firday-dim hover:text-white transition-colors underline font-mono cursor-pointer"
          >
            Disconnect port
          </button>
        </div>
      )}
    </div>
  );
};
