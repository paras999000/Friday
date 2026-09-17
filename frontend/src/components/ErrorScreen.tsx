import React, { useState } from 'react';
import { AlertCircle, RotateCcw, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface ErrorScreenProps {
  title?: string;
  message: string;
  technicalDetails?: string;
  onRetry: () => void;
  onBack: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = 'Something went wrong',
  message,
  technicalDetails,
  onRetry,
  onBack,
}) => {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-12 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/40 flex items-center justify-center mx-auto mb-5 text-red-400">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight mb-2">
        {title}
      </h2>

      <p className="text-sm text-firday-muted max-w-md mx-auto mb-6">
        {message}
      </p>

      {/* Suggested Fixes Card */}
      <div className="rounded-xl border border-white/10 bg-firday-surface/80 p-5 text-left mb-6 font-mono text-xs">
        <span className="text-white font-semibold block mb-2">Try the following:</span>
        <ul className="space-y-2 text-firday-muted list-disc list-inside">
          <li>Check that your USB cable transfers data, not just power</li>
          <li>Hold the <strong className="text-white">BOOT</strong> button while plugging in or resetting</li>
          <li>Try connecting to another USB port on your computer</li>
          <li>Ensure no other serial monitor (e.g. Arduino IDE, PuTTY) is using the port</li>
        </ul>
      </div>

      {/* Expandable Technical Details */}
      {technicalDetails && (
        <div className="mb-6 text-left">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="flex items-center gap-1.5 text-xs text-firday-dim hover:text-white font-mono transition-colors"
          >
            {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>Technical details</span>
          </button>

          {showTechnical && (
            <div className="mt-2 p-3 rounded-lg bg-black/60 border border-white/5 font-mono text-[11px] text-red-300 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{technicalDetails}</pre>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-white hover:bg-white/[0.08] border border-white/10 text-xs font-medium transition-all"
        >
          Cancel
        </button>

        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-firday-cyan text-black font-semibold text-xs hover:bg-cyan-300 shadow-cyan-glow transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
