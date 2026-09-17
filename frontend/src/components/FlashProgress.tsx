import React from 'react';
import { FlashStage } from '../types';
import { FlashStages } from './FlashStages';
import { TerminalLog } from './TerminalLog';

interface FlashProgressProps {
  stage: FlashStage;
  progressPercent: number;
  statusText?: string;
  logs: string[];
  simplifiedLogs?: string[];
  onCancel?: () => void;
}

export const FlashProgress: React.FC<FlashProgressProps> = ({
  stage,
  progressPercent,
  statusText = 'Writing FIRDAY...',
  logs,
  simplifiedLogs,
  onCancel,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 text-center animate-fade-in font-mono">
      {/* Focused Screen Header */}
      <div className="mb-2">
        <span className="text-xs text-firday-cyan tracking-widest uppercase font-bold">FIRDAY</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-6">
        Flashing your ESP32
      </h2>

      {/* Large Numerical Progress Indicator */}
      <div className="mb-6">
        <div className="text-6xl sm:text-8xl font-extrabold text-white tracking-tight">
          {progressPercent}<span className="text-firday-cyan text-4xl sm:text-5xl">%</span>
        </div>
        <p className="text-sm text-firday-muted mt-2">{statusText}</p>
      </div>

      {/* Smooth Progress Bar */}
      <div className="w-full bg-white/5 rounded-full h-2.5 p-0.5 border border-white/10 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-firday-cyan to-firday-violet h-full rounded-full transition-all duration-300 shadow-cyan-glow"
          style={{ width: `${Math.min(100, Math.max(3, progressPercent))}%` }}
        />
      </div>

      {/* Stages Display */}
      <FlashStages currentStage={stage} />

      {/* Terminal with Normal / Technical Log Split */}
      <div className="mt-8">
        <TerminalLog logs={logs} simplifiedLogs={simplifiedLogs} />
      </div>

      {onCancel && stage !== 'restarting' && stage !== 'done' && (
        <div className="mt-6">
          <button
            onClick={onCancel}
            className="text-xs text-firday-dim hover:text-red-400 transition-colors cursor-pointer"
          >
            Cancel Flashing
          </button>
        </div>
      )}
    </div>
  );
};
