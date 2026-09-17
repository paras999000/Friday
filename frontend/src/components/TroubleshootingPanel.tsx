import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cable, RefreshCw } from 'lucide-react';

export const TroubleshootingPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto mt-6 rounded-xl border border-white/10 bg-firday-surface/60 overflow-hidden text-left font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-xs text-firday-muted hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-firday-cyan" />
          <span className="font-semibold text-white">Having trouble connecting?</span>
        </div>
        <div className="flex items-center gap-1.5 text-firday-dim">
          <span className="text-[11px]">Troubleshooting</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-2 border-t border-white/5 text-xs text-firday-muted space-y-3">
          <div className="flex items-start gap-2.5">
            <Cable className="w-4 h-4 text-firday-cyan shrink-0 mt-0.5" />
            <p className="text-firday-dim leading-relaxed">
              1. Make sure your USB cable supports data (not a charge-only cable).
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <RefreshCw className="w-4 h-4 text-firday-violet shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-white font-medium">Bootloader sequence:</p>
              <ol className="list-decimal list-inside text-firday-dim space-y-1 pl-1">
                <li>Connect the ESP32 Dev Module.</li>
                <li>Hold the <strong className="text-white">BOOT</strong> button.</li>
                <li>Press and release the <strong className="text-white">EN/RESET</strong> button.</li>
                <li>Release the <strong className="text-white">BOOT</strong> button.</li>
                <li>Try connecting again.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
