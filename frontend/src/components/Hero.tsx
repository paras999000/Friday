import React from 'react';
import { Play, ArrowRight, ShieldCheck, Zap, Radio } from 'lucide-react';

interface HeroProps {
  onStartFlashing: () => void;
  onHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartFlashing, onHowItWorks }) => {
  return (
    <section className="relative pt-16 pb-24 overflow-hidden flex flex-col items-center text-center px-4 sm:px-6">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-firday-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[250px] bg-firday-violet/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-firday-cyan mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-firday-cyan animate-pulse" />
        <span>ESP32 DEV MODULE FLASHER</span>
      </div>

      {/* Main Title */}
      <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight font-mono text-white mb-4">
        FIR<span className="text-firday-cyan">DAY</span>
      </h1>

      {/* Tagline */}
      <p className="text-2xl sm:text-3xl font-medium tracking-tight text-white/90 max-w-2xl mb-4">
        "Your ESP32, Ready to Wake."
      </p>

      {/* Supporting text */}
      <p className="text-base sm:text-lg text-firday-muted max-w-xl mb-10 leading-relaxed font-light">
        Flash your ESP32 Dev Module directly from your browser. Zero command lines, zero toolchains, instant wake-word intelligence.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 z-10">
        <button
          onClick={onStartFlashing}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-firday-cyan text-black font-semibold text-base hover:bg-cyan-300 transition-all duration-150 shadow-cyan-glow group cursor-pointer"
        >
          <Play className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
          <span>Start Flashing</span>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={onHowItWorks}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.03] text-white font-medium text-base hover:bg-white/[0.08] border border-white/10 transition-all duration-150 cursor-pointer"
        >
          <span>How It Works</span>
        </button>
      </div>

      {/* Minimal Animated ESP32 Dev Module Visualization */}
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-firday-surface/60 backdrop-blur-md p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Schematic visual for ESP32 Dev Module */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-56 h-64 rounded-xl border border-firday-cyan/30 bg-firday-card p-4 shadow-subtle flex flex-col justify-between">
              {/* ESP32 Chip Top Antenna Area */}
              <div className="h-10 w-full rounded-md border border-dashed border-white/20 bg-black/40 flex items-center justify-center">
                <span className="text-[10px] font-mono text-firday-dim tracking-wider">ESP-WROOM-32</span>
              </div>

              {/* Metal Shield Can */}
              <div className="my-2 p-3 rounded-lg border border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono font-bold text-firday-cyan">ESP32 Dev Module</span>
                <span className="text-[9px] font-mono text-firday-muted">Xtensa Dual-Core LX6 @ 240MHz</span>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400">READY TO WAKE</span>
                </div>
              </div>

              {/* USB-C / Pins */}
              <div className="flex items-center justify-between text-[10px] font-mono text-firday-muted px-1">
                <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">USB UART</span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">4 MB FLASH</span>
                <span className="px-1.5 py-0.5 rounded bg-firday-cyanDim text-firday-cyan border border-firday-cyan/30">0x0</span>
              </div>

              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 rounded bg-firday-cyan/40 blur-[1px]" />
            </div>
          </div>

          {/* Key Value Points */}
          <div className="w-full md:w-1/2 flex flex-col items-start text-left gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-firday-cyanDim text-firday-cyan border border-firday-cyan/20">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Direct Web Serial Flashing</h4>
                <p className="text-xs text-firday-muted">Connect your ESP32 Dev Module with a USB cable and flash straight from Chrome or Edge.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-firday-violetDim text-firday-violet border border-firday-violet/20">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Voice Assistant Wake Word</h4>
                <p className="text-xs text-firday-muted">Equipped with ESP-SR acoustic model: wake your ESP32 with "Jarvis" or tap-to-talk.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/5 text-white/80 border border-white/10">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Full Unified Binary</h4>
                <p className="text-xs text-firday-muted">Single-offset flash at 0x00000000. Bootloader, partitions, and application in one seamless write.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
