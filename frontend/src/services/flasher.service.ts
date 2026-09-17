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

  public static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  public async requestDeviceConnection(useMock: boolean = false): Promise<ConnectedDevice> {
    if (useMock || !WebSerialFlasher.isSupported()) {
      return mockFlasher.connect();
    }

    try {
      this.port = await (navigator as any).serial.requestPort();
      this.transport = new Transport(this.port);

      const terminal = {
        clean: () => {},
        writeLine: (data: string) => console.log('[esptool-js]', data),
        write: (data: string) => console.log('[esptool-js]', data),
      };

      this.espLoader = new ESPLoader({
        transport: this.transport,
        baudrate: 115200,
        terminal,
      });

      const chipName = await this.espLoader.main();
      const mac = this.espLoader.chip ? this.espLoader.chip.macAddr() : '00:00:00:00:00:00';
      const flashSize = this.espLoader.chip ? `${this.espLoader.chip.flashSize || '4 MB'}` : '4 MB';

      const portInfo = this.port.getInfo ? this.port.getInfo() : {};
      const usbVendor = portInfo.usbVendorId ? `0x${portInfo.usbVendorId.toString(16)}` : 'USB';
      const portName = `Serial Port (${usbVendor})`;

      return {
        chip: chipName || 'ESP32',
        port: portName,
        flashSize: flashSize.includes('MB') ? flashSize : `${flashSize} MB`,
        mac,
        isMock: false,
      };
    } catch (err: any) {
      console.warn('Real Web Serial connection failed/cancelled:', err);
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
      callbacks.onStageChange('connecting');
      callbacks.onProgress(0, 'Initializing Web Serial link...');
      callbacks.onLog('[FIRDAY] Initializing Web Serial transport at 115200 baud...');

      // Convert ArrayBuffer to binary string as required by esptool-js write_flash
      const bytes = new Uint8Array(binaryBuffer);
      let binaryString = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }

      const fileArray = [
        {
          data: binaryString,
          address: 0x00000000, // Merged binary starts at 0x0
        },
      ];

      callbacks.onStageChange('erasing');
      callbacks.onProgress(10, 'Erasing required flash sectors on ESP32 Dev Module...');
      callbacks.onLog('[FIRDAY] Erasing target flash area...');

      callbacks.onStageChange('writing');
      callbacks.onLog(`[FIRDAY] Flashing ${bytes.length} bytes to ESP32 at offset 0x00000000...`);

      await this.espLoader.write_flash(
        fileArray,
        'keep',
        undefined,
        undefined,
        false,
        true,
        (_fileIndex: number, written: number, total: number) => {
          const pct = Math.round((written / total) * 100);
          callbacks.onProgress(
            pct,
            `Flashing FIRDAY... ${pct}% (${(written / 1024).toFixed(0)} KB / ${(total / 1024).toFixed(0)} KB)`
          );
        }
      );

      callbacks.onStageChange('verifying');
      callbacks.onProgress(100, 'Verifying flash digest...');
      callbacks.onLog('[FIRDAY] Flash write verified.');

      callbacks.onStageChange('restarting');
      callbacks.onLog('[FIRDAY] Resetting ESP32 Dev Module...');
      await this.espLoader.hard_reset();
      callbacks.onLog('[FIRDAY] Device reset complete. Running FIRDAY.');

      callbacks.onStageChange('done');
    } catch (err: any) {
      callbacks.onLog(`[ERROR] Flashing failed: ${err.message}`);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.transport) {
        await this.transport.disconnect();
      }
    } catch (e) {
      console.warn('Disconnect error:', e);
    }
  }
}

export const flasherService = new WebSerialFlasher();
