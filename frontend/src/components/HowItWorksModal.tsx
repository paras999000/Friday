import React from 'react';
import { X, Usb, Zap, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFlashing: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartFlashing,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Connect ESP32 Dev Module',
      desc: 'Plug your ESP32 Dev Module into your computer with a USB data cable. FIRDAY detects your device using browser Web Serial without installing external drivers.',
      icon: Usb,
      color: 'text-emerald-400',
    },
    {
      num: '02',
      title: 'Build & Flash FIRDAY',
      desc: 'FIRDAY compiles and bundles the complete XiaoZhi firmware into a single 4 MB merged-binary.bin and writes it at offset 0x00000000. No partition math required.',
      icon: Zap,
      color: 'text-firday-cyan',
    },
    {
      num: '03',
      title: 'Ready to Wake',
      desc: 'The device verifies checksum integrity, toggles RTS to reset, and immediately boots FIRDAY voice assistant ready for your commands.',
      icon: CheckCircle2,
      color: 'text-firday-violet',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-firday-surface p-6 sm:p-8 shadow-2xl overflow-hidden relative text-left">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">How FIRDAY Works</h3>
            <p className="text-xs text-firday-muted">Your ESP32 Dev Module, ready in 3 simple steps.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-firday-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 text-xs font-bold text-firday-cyan">
                  {s.num}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${s.color}`} />
                    {s.title}
                  </h4>
                  <p className="text-xs text-firday-muted mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

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
            Start Flashing Now
          </button>
        </div>
      </div>
    </div>
  );
};
