import React from 'react';
import { FIRDAYLogo } from './FIRDAYLogo';
import { Cpu, HelpCircle, Play, Sparkles } from 'lucide-react';

interface NavbarProps {
  onStartFlashing: () => void;
  onOpenSupportedHardware: () => void;
  onOpenHowItWorks: () => void;
  mockMode: boolean;
  onToggleMockMode: (val: boolean) => void;
  inWizard?: boolean;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartFlashing,
  onOpenSupportedHardware,
  onOpenHowItWorks,
  mockMode,
  onToggleMockMode,
  inWizard = false,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-firday-bg/80 backdrop-blur-xl transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onGoHome}
          className="focus:outline-none flex items-center transition-opacity hover:opacity-90 cursor-pointer"
        >
          <FIRDAYLogo size="md" />
        </button>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-firday-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04] cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 opacity-80" />
            <span>How It Works</span>
          </button>

          <button
            onClick={onOpenSupportedHardware}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-firday-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04] cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-firday-cyan opacity-80" />
            <span>Supported Hardware</span>
          </button>

          <a
            href="https://github.com/paras999000/Friday"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-firday-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
          >
            <svg className="w-4 h-4 opacity-80 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Mock Mode Toggle Switch */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/10">
            <button
              onClick={() => onToggleMockMode(!mockMode)}
              title={mockMode ? 'Hardware Simulation Mode is ON' : 'Real Web Serial Mode is ON'}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-full border transition-all duration-200 cursor-pointer ${
                mockMode
                  ? 'bg-firday-violetDim text-violet-300 border-firday-violet/40 shadow-violet-glow'
                  : 'bg-white/[0.03] text-firday-muted border-white/10 hover:border-white/20'
              }`}
            >
              <Sparkles className="w-3 h-3 text-firday-violet" />
              <span>MOCK: {mockMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {!inWizard && (
            <button
              onClick={onStartFlashing}
              className="ml-2 hidden sm:flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-firday-cyan text-black hover:bg-cyan-300 transition-all duration-150 shadow-cyan-glow cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Start Flashing</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
