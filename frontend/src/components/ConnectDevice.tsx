import React, { useState } from 'react';
import { ConnectedDevice } from '../types';
import { flasherService } from '../services/flasher.service';
import { DeviceInfo } from './DeviceInfo';
import { TroubleshootingPanel } from './TroubleshootingPanel';
import { Usb, ArrowRight, Loader2, AlertCircle, Cpu } from 'lucide-react';

interface ConnectDeviceProps {
  connectedDevice: ConnectedDevice | null;
  onDeviceConnected: (device: ConnectedDevice) => void;
  onDeviceDisconnected: () => void;
  mockMode: boolean;
  onContinue: () => void;
}

export const ConnectDevice: React.FC<ConnectDeviceProps> = ({
  connectedDevice,
  onDeviceConnected,
  onDeviceDisconnected,
  mockMode,
  onContinue,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const device = await flasherService.requestDeviceConnection(mockMode);
      onDeviceConnected(device);
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setError(err.message || 'Could not connect to ESP32 Dev Module.');
      }
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 text-center animate-fade-in">
      {/* Title & Subtitle */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-mono">
          Connect your ESP32
        </h2>
        <p className="text-base text-firday-muted max-w-md mx-auto">
          Connect your ESP32 Dev Module using a USB data cable.
        </p>
      </div>

      {/* Main Connection Panel */}
      <div className="py-4">
        {!connectedDevice ? (
          <div className="flex flex-col items-center">
            {/* Clean ESP32 Device Illustration */}
            <div className="relative w-48 h-48 rounded-2xl border border-white/10 bg-firday-surface/80 p-5 flex flex-col justify-between mb-6 shadow-subtle">
              {/* Antenna Area */}
              <div className="h-7 w-full rounded border border-dashed border-white/20 bg-black/40 flex items-center justify-center">
                <span className="text-[9px] font-mono text-firday-dim">ESP-WROOM-32</span>
              </div>

              {/* Center Can */}
              <div className="p-3 rounded-lg border border-firday-cyan/30 bg-white/[0.02] text-center">
                <span className="text-xs font-mono font-bold text-firday-cyan block">ESP32 Dev Module</span>
                <span className="text-[10px] font-mono text-firday-muted">Standard Target</span>
              </div>

              {/* Connection Status Badge */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-firday-dim">Connection:</span>
                <span className="text-amber-400 font-semibold">Not Connected</span>
              </div>
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="mb-6 p-4 max-w-md rounded-xl bg-red-950/40 border border-red-800/40 text-left flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-200">Could not connect to your ESP32</p>
                  <p className="text-xs text-red-300/80 mt-1 font-mono">{error}</p>
                </div>
              </div>
            )}

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="flex items-center gap-3 px-8 py-3.5 rounded-xl bg-firday-cyan text-black font-semibold text-base hover:bg-cyan-300 shadow-cyan-glow transition-all duration-150 disabled:opacity-70 cursor-pointer"
            >
              {connecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Usb className="w-5 h-5" />
                  <span>Connect ESP32</span>
                </>
              )}
            </button>

            {/* Troubleshooting bootloader help */}
            <TroubleshootingPanel />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <DeviceInfo device={connectedDevice} onDisconnect={onDeviceDisconnected} />
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.08]">
        <div className="text-left font-mono text-xs text-firday-dim">
          <span>Target: </span>
          <span className="text-white font-semibold">ESP32 Dev Module (Xtensa LX6)</span>
        </div>

        <button
          disabled={!connectedDevice}
          onClick={onContinue}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            connectedDevice
              ? 'bg-firday-cyan text-black hover:bg-cyan-300 shadow-cyan-glow cursor-pointer'
              : 'bg-white/5 text-firday-dim cursor-not-allowed border border-white/5'
          }`}
        >
          <span>Continue to Flash</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
