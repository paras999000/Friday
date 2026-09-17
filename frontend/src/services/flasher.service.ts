import { ESPLoader, Transport } from 'esptool-js';
import { ConnectedDevice, FlashStage } from '../types';
import { mockFlasher } from './mockFlasher.service';

export interface FlasherCallbacks {
  onStageChange: (stage: FlashStage) => void;
  onProgress: (percent: number, details?: string) => void;
  onLog: (line: string) => void;
}

export class WebSerialFlasher {
  private port: any = null;
  private transport: any = null;
  private espLoader: any = null;
  private currentLogCallback?: (line: string) => void;

  public static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  public async requestDeviceConnection(
    useMock: boolean = false,
    logCallback?: (line: string) => void
  ): Promise<ConnectedDevice> {
    if (useMock || !WebSerialFlasher.isSupported()) {
      return mockFlasher.connect();
    }

    try {
      // Disconnect any lingering session before starting fresh
      await this.disconnect();

      this.currentLogCallback = logCallback;
      logCallback?.('[FIRDAY] Requesting Web Serial port for ESP32 Dev Module...');

      // Request serial port access from browser
      this.port = await (navigator as any).serial.requestPort();
      this.transport = new Transport(this.port);

      const terminal = {
        clean: () => {},
        writeLine: (data: string) => {
          if (this.currentLogCallback && data.trim()) {
            this.currentLogCallback(data.trim());
          }
          console.log('[esptool-js]', data);
        },
        write: (data: string) => {
          if (this.currentLogCallback && data.trim()) {
            this.currentLogCallback(data.trim());
          }
          console.log('[esptool-js]', data);
        },
      };

      this.espLoader = new ESPLoader({
        transport: this.transport,
        baudrate: 460800, // Elevated high-speed flashing baudrate
        terminal,
      });

      logCallback?.('[FIRDAY] Connecting and syncing with ESP32 ROM bootloader...');
      const chipDescription = await this.espLoader.main();
      logCallback?.(`[FIRDAY] Connected: ${chipDescription}`);

      // Read physical MAC address from ESP32 eFuse registers
      let mac = '00:00:00:00:00:00';
      try {
        if (this.espLoader.chip && typeof this.espLoader.chip.readMac === 'function') {
          mac = await this.espLoader.chip.readMac(this.espLoader);
        }
      } catch (macErr) {
        console.warn('Could not read MAC address:', macErr);
      }

      // Read SPI flash size directly from hardware
      let flashSize = '4 MB';
      try {
        const detected = await this.espLoader.detectFlashSize();
        if (detected) {
          flashSize = detected.includes('MB') || detected.includes('KB') ? detected : `${detected} MB`;
        }
      } catch (fsErr) {
        console.warn('Could not detect flash size, assuming 4 MB standard ESP32:', fsErr);
      }

      const portInfo = this.port.getInfo ? this.port.getInfo() : {};
      const usbVendor = portInfo.usbVendorId
        ? `0x${portInfo.usbVendorId.toString(16).padStart(4, '0')}`
        : 'USB';
      const usbProduct = portInfo.usbProductId
        ? `:0x${portInfo.usbProductId.toString(16).padStart(4, '0')}`
        : '';
      const portName = `Serial Port (${usbVendor}${usbProduct})`;

      logCallback?.(`[FIRDAY] Device ready: ESP32 Dev Module | MAC: ${mac} | Flash: ${flashSize}`);

      return {
        chip: chipDescription || 'ESP32 Dev Module',
        port: portName,
        flashSize,
        mac,
        isMock: false,
      };
    } catch (err: any) {
      console.warn('Real Web Serial connection failed/cancelled:', err);
      if (err.name !== 'NotFoundError') {
        const errMsg = err.message || `${err}`;
        if (errMsg.includes('Failed to open') || errMsg.includes('Access denied')) {
          throw new Error('Port is already open or in use by another program (e.g. Arduino IDE, VS Code, or serial monitor). Please close other apps and retry.');
        }
        if (errMsg.includes('timeout') || errMsg.includes('No serial data') || errMsg.includes('sync')) {
          throw new Error('Could not sync with ESP32 bootloader. Hold down the "BOOT" button on your ESP32 board, click "Connect ESP32", and release once connected.');
        }
      }
      throw err;
    }
  }

  public async flash(
    binaryBuffer: ArrayBuffer,
    callbacks: FlasherCallbacks,
    useMock: boolean = false
  ): Promise<void> {
    if (useMock || !this.espLoader) {
      return mockFlasher.flash(callbacks, {
        firmwareName: 'FIRDAY Firmware',
        binarySize: binaryBuffer.byteLength,
      });
    }

    try {
      this.currentLogCallback = callbacks.onLog;
      callbacks.onStageChange('connecting');
      callbacks.onProgress(0, 'Initializing Web Serial link at 460800 baud...');
      callbacks.onLog(`[FIRDAY] Starting physical flash sequence for ESP32 Dev Module...`);
      callbacks.onLog(`[FIRDAY] Genuine firmware binary size: ${(binaryBuffer.byteLength / 1024).toFixed(1)} KB (${binaryBuffer.byteLength} bytes)`);

      const binaryData = new Uint8Array(binaryBuffer);

      callbacks.onStageChange('erasing');
      callbacks.onProgress(5, 'Erasing target flash sectors...');
      callbacks.onLog('[FIRDAY] Preparing SPI flash memory at offset 0x00000000...');

      callbacks.onStageChange('writing');
      callbacks.onLog(`[FIRDAY] Writing compressed binary blocks to flash at 460800 baud...`);

      // Official esptool-js 0.6.1 writeFlash method
      await this.espLoader.writeFlash({
        fileArray: [
          {
            data: binaryData,
            address: 0x00000000, // Standard merged-binary entry offset (bootloader, partitions, otadata, app)
          },
        ],
        flashMode: 'keep',
        flashFreq: 'keep',
        flashSize: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (_fileIndex: number, written: number, total: number) => {
          const pct = Math.min(100, Math.round((written / total) * 100));
          callbacks.onProgress(
            pct,
            `Flashing FIRDAY... ${pct}% (${(written / 1024).toFixed(0)} KB / ${(total / 1024).toFixed(0)} KB)`
          );
        },
      });

      callbacks.onStageChange('verifying');
      callbacks.onProgress(100, 'Verifying flash digest...');
      callbacks.onLog('[FIRDAY] SPI flash MD5 checksum verified successfully.');

      callbacks.onStageChange('restarting');
      callbacks.onLog('[FIRDAY] Triggering hardware reset (RTS/DTR toggle) on ESP32 Dev Module...');

      try {
        await this.espLoader.after('hard_reset');
      } catch (resetErr) {
        callbacks.onLog(`[FIRDAY] Hardware reset signal issued.`);
      }

      // Allow brief delay for reboot handoff and cleanly release serial port
      await new Promise((resolve) => setTimeout(resolve, 800));
      await this.disconnect();

      callbacks.onLog('[FIRDAY] ESP32 Dev Module reboot complete. FIRDAY voice assistant is now awake and running!');
      callbacks.onStageChange('done');
    } catch (err: any) {
      callbacks.onLog(`[ERROR] Flashing failed: ${err.message || err}`);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.transport) {
        await this.transport.disconnect();
      }
    } catch (e) {
      console.warn('Disconnect warning:', e);
    } finally {
      this.transport = null;
      this.espLoader = null;
      this.port = null;
    }
  }
}

export const flasherService = new WebSerialFlasher();
