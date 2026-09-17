export interface DeviceSpecs {
  name: string;
  target: string;
  chipFamily: string;
  architecture: string;
  flashSize: string;
  flashOffset: string;
  partitionLayout: string;
  firmwareVersion: string;
  language: string;
  wakeWord: string;
}

export interface ConnectedDevice {
  chip: string;
  port: string;
  flashSize: string;
  mac: string;
  isMock?: boolean;
}

export type FlashStage = 'connecting' | 'erasing' | 'writing' | 'verifying' | 'restarting' | 'done';

export type WizardStep = 1 | 2 | 3; // 1: CONNECT, 2: FLASH, 3: READY

export interface BuildArtifact {
  kind: string;
  file: string;
  size: number;
  sha256: string;
}

export interface BuildJob {
  id: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  stage: string;
  progressPercent: number;
  logs: string[];
  createdAt: string;
  updatedAt: string;
  error?: string;
  downloadUrl?: string;
  manifestUrl?: string;
}
