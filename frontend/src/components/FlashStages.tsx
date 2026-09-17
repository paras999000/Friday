import React from 'react';
import { FlashStage } from '../types';
import { Check } from 'lucide-react';

interface FlashStagesProps {
  currentStage: FlashStage;
}

const STAGES: Array<{ id: FlashStage; label: string }> = [
  { id: 'connecting', label: 'Connecting' },
  { id: 'erasing', label: 'Erasing' },
  { id: 'writing', label: 'Writing' },
  { id: 'verifying', label: 'Verifying' },
  { id: 'restarting', label: 'Restarting' },
];

export const FlashStages: React.FC<FlashStagesProps> = ({ currentStage }) => {
  const stageOrder: Record<FlashStage, number> = {
    connecting: 1,
    erasing: 2,
    writing: 3,
    verifying: 4,
    restarting: 5,
    done: 6,
  };

  const currentOrder = stageOrder[currentStage] || 1;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4 font-mono text-xs">
      {STAGES.map((s) => {
        const order = stageOrder[s.id];
        const isDone = currentOrder > order;
        const isCurrent = currentOrder === order;

        return (
          <div
            key={s.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 ${
              isCurrent
                ? 'bg-firday-cyan/15 border-firday-cyan text-firday-cyan font-bold shadow-cyan-glow'
                : isDone
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-white/[0.02] border-white/5 text-firday-dim'
            }`}
          >
            {isDone ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : isCurrent ? (
              <span className="w-2 h-2 rounded-full bg-firday-cyan animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full border border-current" />
            )}
            <span>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
};
