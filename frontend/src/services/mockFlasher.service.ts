import { ConnectedDevice, FlashStage } from '../types';

export interface FlasherCallbacks {
  onStageChange: (stage: FlashStage) => void;
  onProgress: (percent: number, details?: string) => void;
  onLog: (line: string) => void;
}

export class MockFlasherService {
  private isCancelled = false;

  public cancel(): void {
    this.isCancelled = true;
  }

  public async connect(): Promise<ConnectedDevice> {
    await new Promise((r) => setTimeout(r, 600));

    const randomMac = [
      '24',
      '6F',
      '28',
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase(),
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase(),
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase(),
    ].join(':');

    return {
      chip: 'ESP32 (revision v3.0)',
      port: 'COM4 (CP210x USB to UART Bridge)',
      flashSize: '4 MB (Quad SPI)',
      mac: randomMac,
      isMock: true,
    };
  }

  public async flash(
    callbacks: FlasherCallbacks,
    options?: { firmwareName?: string; binarySize?: number }
  ): Promise<void> {
    this.isCancelled = false;
    const fwName = options?.firmwareName || 'FIRDAY Firmware';
    const totalBytes = options?.binarySize || 4194304;

    const log = (msg: string) => callbacks.onLog(msg);

    // 1. Connecting
    callbacks.onStageChange('connecting');
    callbacks.onProgress(0, 'Connecting to ESP32 ROM bootloader...');
    log('[FIRDAY] Serial port opened at 115200 baud');
    log('[FIRDAY] Sending sync packet sequence (0x08)...');
    await new Promise((r) => setTimeout(r, 400));
    if (this.isCancelled) return;

    log('[FIRDAY] ESP32 detected: ESP32-D0WD-V3 (Xtensa Dual-Core LX6 @ 240MHz)');
    log('[FIRDAY] Uploading stub flasher (460800 baud)...');
    await new Promise((r) => setTimeout(r, 400));
    if (this.isCancelled) return;
    log('[FIRDAY] Stub flasher running on ESP32 Dev Module.');

    // 2. Erasing
    callbacks.onStageChange('erasing');
    log(`[FIRDAY] Auto-erasing flash sectors for 4 MB image...`);
    for (let p = 0; p <= 100; p += 20) {
      if (this.isCancelled) return;
      callbacks.onProgress(p, `Erasing flash: ${p}%`);
      await new Promise((r) => setTimeout(r, 90));
    }
    log('[FIRDAY] Flash sectors erased successfully.');

    // 3. Writing
    callbacks.onStageChange('writing');
    log(`[FIRDAY] Writing ${fwName} to offset 0x00000000...`);

    const chunks = 40;
    for (let i = 1; i <= chunks; i++) {
      if (this.isCancelled) return;
      const pct = Math.round((i / chunks) * 100);
      const writtenBytes = Math.round((i / chunks) * totalBytes);
      const speed = (290 + Math.random() * 30).toFixed(1);
      callbacks.onProgress(
        pct,
        `Writing firmware... ${pct}% (${(writtenBytes / 1024).toFixed(0)} KB / ${(totalBytes / 1024).toFixed(0)} KB at ${speed} KB/s)`
      );

      if (i % 8 === 0 || i === chunks) {
        log(`> Writing at 0x${((i * totalBytes) / chunks).toString(16).padStart(8, '0')} (${pct}%)`);
      }
      await new Promise((r) => setTimeout(r, 70));
    }

    log(`[FIRDAY] Wrote ${totalBytes} bytes (4 MB) to flash.`);

    // 4. Verifying
    callbacks.onStageChange('verifying');
    log('[FIRDAY] Calculating SHA-256 digest on device...');
    callbacks.onProgress(50, 'Verifying flash digest...');
    await new Promise((r) => setTimeout(r, 500));
    if (this.isCancelled) return;

    callbacks.onProgress(100, 'Flash checksum verified.');
    log('[FIRDAY] Hash matches. Flash verification OK.');

    // 5. Restarting
    callbacks.onStageChange('restarting');
    log('[FIRDAY] Hard resetting ESP32 via RTS pin...');
    callbacks.onProgress(100, 'Restarting device into application mode...');
    await new Promise((r) => setTimeout(r, 600));
    if (this.isCancelled) return;

    log('[FIRDAY] ESP32 Dev Module booted successfully.');
    log('[FIRDAY] Device is ready.');

    callbacks.onStageChange('done');
  }
}

export const mockFlasher = new MockFlasherService();
