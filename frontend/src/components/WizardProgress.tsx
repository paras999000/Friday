import React from 'react';
import { WizardStep } from '../types';
import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: WizardStep;
}

const STEPS: Array<{ step: WizardStep; number: string; title: string }> = [
  { step: 1, number: '01', title: 'CONNECT' },
  { step: 2, number: '02', title: 'FLASH' },
  { step: 3, number: '03', title: 'READY' },
];

export const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[1px] bg-white/10 -z-0" />

        {STEPS.map(({ step, number, title }) => {
          const isActive = currentStep === step;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-firday-cyan text-black font-bold ring-4 ring-firday-cyan/20 shadow-cyan-glow'
                    : isCompleted
                    ? 'bg-firday-card border border-firday-cyan/50 text-firday-cyan'
                    : 'bg-firday-card border border-white/10 text-firday-dim'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : number}
              </div>

              <span
                className={`mt-2 font-mono text-[11px] tracking-wider transition-colors ${
                  isActive
                    ? 'text-firday-cyan font-bold'
                    : isCompleted
                    ? 'text-white/80'
                    : 'text-firday-dim'
                }`}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
