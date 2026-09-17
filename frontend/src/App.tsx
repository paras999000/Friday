import React, { useState } from 'react';
import { ConnectedDevice, FlashStage, WizardStep, BuildJob } from './types';
import { triggerBuild, getBuildJob, downloadBinaryArrayBuffer } from './services/api';
import { flasherService } from './services/flasher.service';
import { mockFlasher } from './services/mockFlasher.service';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CompatibilityBanner } from './components/CompatibilityBanner';
import { WizardProgress } from './components/WizardProgress';
import { ConnectDevice } from './components/ConnectDevice';
import { FirmwareSummary } from './components/FirmwareSummary';
import { FlashProgress } from './components/FlashProgress';
import { SuccessScreen } from './components/SuccessScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { SupportedHardwareModal } from './components/SupportedHardwareModal';
import { HowItWorksModal } from './components/HowItWorksModal';

export const App: React.FC = () => {
  // Navigation & View State
  const [view, setView] = useState<'landing' | 'wizard'>('landing');
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Mock Mode toggle (can be enabled via env VITE_MOCK_FLASH or user toggle in UI)
  const [mockMode, setMockMode] = useState<boolean>(() => {
    return import.meta.env.VITE_MOCK_FLASH === 'true';
  });

  // Modal States
  const [showHardwareModal, setShowHardwareModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  // Hardware / Connection State
  const [connectedDevice, setConnectedDevice] = useState<ConnectedDevice | null>(null);

  // Flash Stage Machine State
  type FlashState = 'confirm' | 'building' | 'flashing' | 'success' | 'error';
  const [flashState, setFlashState] = useState<FlashState>('confirm');
  const [flashStage, setFlashStage] = useState<FlashStage>('connecting');
  const [flashPercent, setFlashPercent] = useState<number>(0);
  const [flashStatusText, setFlashStatusText] = useState<string>('Preparing...');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [simplifiedLogs, setSimplifiedLogs] = useState<string[]>([]);
  const [flashError, setFlashError] = useState<{ title: string; message: string; details?: string } | null>(null);

  // Start Flashing flow
  const handleStartFlashing = () => {
    setView('wizard');
    setCurrentStep(1);
    setFlashState('confirm');
  };

  const handleGoHome = () => {
    setView('landing');
  };

  const handleDeviceDisconnected = async () => {
    try {
      await flasherService.disconnect();
    } catch (e) {
      console.warn('Disconnect error:', e);
    }
    setConnectedDevice(null);
  };

  // Perform Build and Flash Execution specifically for ESP32 Dev Module
  const executeFlashing = async () => {
    if (!connectedDevice) return;

    setConsoleLogs([]);
    setSimplifiedLogs([
      'Connecting to ESP32...',
      'ESP32 detected.',
      'Preparing flash...',
    ]);
    setFlashState('building');
    setFlashPercent(15);
    setFlashStatusText('Compiling firmware for ESP32 Dev Module...');
    setFlashStage('connecting');

    try {
      // 1. Trigger Backend Build Job (automatically builds for ESP32 Dev Module)
      const job = await triggerBuild();

      // Poll until build succeeds
      let currentJob: BuildJob = job;
      while (currentJob.status === 'queued' || currentJob.status === 'running') {
        await new Promise((r) => setTimeout(r, 600));
        currentJob = await getBuildJob(job.id);
        setConsoleLogs([...currentJob.logs]);
        setFlashPercent(Math.min(30, currentJob.progressPercent || 25));
      }

      if (currentJob.status !== 'succeeded') {
        throw new Error(currentJob.error || 'Firmware compilation failed on backend.');
      }

      // 2. Fetch the generated merged-binary.bin (4 MB)
      setFlashStatusText('Loading compiled merged-binary.bin...');
      const binaryBuffer = await downloadBinaryArrayBuffer(job.id);

      // 3. Initiate Flashing
      setFlashState('flashing');
      setFlashStatusText('Writing firmware...');

      const callbacks = {
        onStageChange: (stage: FlashStage) => {
          setFlashStage(stage);
          if (stage === 'writing') {
            setSimplifiedLogs((prev) => [...prev, 'Writing firmware...']);
          } else if (stage === 'verifying') {
            setSimplifiedLogs((prev) => [...prev, 'Verifying firmware...']);
          } else if (stage === 'restarting') {
            setSimplifiedLogs((prev) => [...prev, 'Restarting device...']);
          }
        },
        onProgress: (percent: number, details?: string) => {
          setFlashPercent(percent);
          if (details) setFlashStatusText(details);
        },
        onLog: (line: string) => {
          setConsoleLogs((prev) => [...prev, line]);
        },
      };

      await flasherService.flash(binaryBuffer, callbacks, mockMode || connectedDevice.isMock);

      // 4. Success -> Advance to Step 3: READY
      setCurrentStep(3);
      setFlashState('success');
    } catch (err: any) {
      console.error('Flash error:', err);
      setFlashError({
        title: 'Something went wrong',
        message: err.message || 'Could not communicate with your ESP32 Dev Module.',
        details: err.stack || err.toString(),
      });
      setFlashState('error');
    }
  };

  return (
    <div className="min-h-screen bg-firday-bg text-firday-text flex flex-col font-sans bg-mesh selection:bg-firday-cyan selection:text-black">
      {/* Compatibility Notice */}
      <CompatibilityBanner
        mockMode={mockMode}
        onEnableMock={() => setMockMode(true)}
      />

      {/* Top Bar */}
      <Navbar
        onStartFlashing={handleStartFlashing}
        onOpenSupportedHardware={() => setShowHardwareModal(true)}
        onOpenHowItWorks={() => setShowHowItWorksModal(true)}
        mockMode={mockMode}
        onToggleMockMode={setMockMode}
        inWizard={view === 'wizard'}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {view === 'landing' ? (
          <>
            <Hero
              onStartFlashing={handleStartFlashing}
              onHowItWorks={() => setShowHowItWorksModal(true)}
            />

            {/* Quick Specs Strip */}
            <section className="border-t border-white/[0.06] bg-black/40 py-12">
              <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
                <div className="p-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">ESP32</div>
                  <div className="text-xs text-firday-dim uppercase mt-1">Dev Module (Standard)</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-firday-cyan">0x0</div>
                  <div className="text-xs text-firday-dim uppercase mt-1">Unified Flash Offset</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">English</div>
                  <div className="text-xs text-firday-dim uppercase mt-1">Voice & Interface</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-firday-violet">1-Click</div>
                  <div className="text-xs text-firday-dim uppercase mt-1">Browser Web Serial</div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-start py-4">
            {/* 3-Step Wizard Progression Bar: 01 CONNECT -> 02 FLASH -> 03 READY */}
            <WizardProgress currentStep={currentStep} />

            {/* Step 01: CONNECT */}
            {currentStep === 1 && (
              <ConnectDevice
                connectedDevice={connectedDevice}
                onDeviceConnected={setConnectedDevice}
                onDeviceDisconnected={handleDeviceDisconnected}
                mockMode={mockMode}
                onContinue={() => {
                  setFlashState('confirm');
                  setCurrentStep(2);
                }}
              />
            )}

            {/* Step 02: FLASH */}
            {currentStep === 2 && connectedDevice && (
              <div className="flex-1">
                {flashState === 'confirm' && (
                  <FirmwareSummary
                    connectedDevice={connectedDevice}
                    onFlash={executeFlashing}
                    onBack={() => setCurrentStep(1)}
                    building={false}
                  />
                )}

                {(flashState === 'building' || flashState === 'flashing') && (
                  <FlashProgress
                    stage={flashStage}
                    progressPercent={flashPercent}
                    statusText={flashStatusText}
                    logs={consoleLogs}
                    simplifiedLogs={simplifiedLogs}
                    onCancel={() => {
                      mockFlasher.cancel();
                      setFlashState('confirm');
                    }}
                  />
                )}

                {flashState === 'error' && flashError && (
                  <ErrorScreen
                    title={flashError.title}
                    message={flashError.message}
                    technicalDetails={flashError.details}
                    onRetry={executeFlashing}
                    onBack={() => setFlashState('confirm')}
                  />
                )}
              </div>
            )}

            {/* Step 03: READY */}
            {currentStep === 3 && (
              <SuccessScreen
                onDone={() => setView('landing')}
                onFlashAgain={() => {
                  setFlashState('confirm');
                  setCurrentStep(1);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-firday-surface/60 py-6 text-center text-xs text-firday-dim font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">FIRDAY</span>
            <span>— "Your ESP32, Ready to Wake."</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => setShowHardwareModal(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Supported Hardware
            </button>
            <span>v2.5.0</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SupportedHardwareModal
        isOpen={showHardwareModal}
        onClose={() => setShowHardwareModal(false)}
        onStartFlashing={() => {
          setShowHardwareModal(false);
          handleStartFlashing();
        }}
      />

      <HowItWorksModal
        isOpen={showHowItWorksModal}
        onClose={() => setShowHowItWorksModal(false)}
        onStartFlashing={() => {
          setShowHowItWorksModal(false);
          handleStartFlashing();
        }}
      />
    </div>
  );
};

export default App;
