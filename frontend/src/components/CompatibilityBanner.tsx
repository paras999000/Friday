import React from 'react';
import { WebSerialFlasher } from '../services/flasher.service';
import { AlertTriangle, Sparkles } from 'lucide-react';

interface CompatibilityBannerProps {
  onEnableMock: () => void;
  mockMode: boolean;
}

export const CompatibilityBanner: React.FC<CompatibilityBannerProps> = ({ onEnableMock, mockMode }) => {
  const isSupported = WebSerialFlasher.isSupported();

  if (isSupported || mockMode) {
    return null;
  }

  return (
    <div className="w-full bg-amber-950/40 border-b border-amber-500/30 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Web Serial is not supported in this browser. Please use <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> for direct USB hardware flashing.
          </span>
        </div>

        <button
          onClick={onEnableMock}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-mono font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Enable Mock Mode to test anyway</span>
        </button>
      </div>
    </div>
  );
};
