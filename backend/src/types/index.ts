export interface BuildOptionChoice {
  value: string;
  label: string;
}

export interface BuildOption {
  key: string;
  type: 'select' | 'boolean' | 'string';
  default: string | boolean;
  choices?: BuildOptionChoice[];
  label?: string;
  description?: string;
}

export interface BoardVariant {
  board: string;             // directory relative to main/boards, e.g. "espressif/esp32-s3-box-3"
  name: string;              // variant name, e.g. "esp-box-3"
  full_name: string;         // full artifact name
  type: string;              // reported type
  target: string;            // chip target: "esp32" | "esp32s3" | "esp32c3" | "esp32c6" | "esp32p4"
  config?: string;           // Kconfig symbol
  display_name: string;      // Human readable name
  wake_word_supported: boolean;
  build_options: BuildOption[];
}

export interface BoardSummary {
  id: string;                // URL-safe ID: e.g. "espressif-esp32-s3-box-3"
  board: string;
  name: string;
  full_name: string;
  type: string;
  target: string;
  display_name: string;
  manufacturer: string;
  wake_word_supported: boolean;
  build_options: BuildOption[];
}

export interface WakeWordInfo {
  model: string;
  phrase: string;
  targets: string[];
}

export interface LanguageInfo {
  code: string;
  label: string;
}

export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export interface BuildJobRequest {
  board_dir: string;
  board_name: string;
  language: string;
  wake_word: string;
  build_options?: Record<string, string | boolean>;
}

export interface BuildArtifact {
  kind: 'ota' | 'full';
  file: string;
  size: number;
  sha256: string;
}

export interface BuildManifest {
  schema_version: number;
  status: JobStatus;
  job_id: string;
  board_dir: string;
  board_type: string;
  board_name: string;
  target: string;
  language: string;
  wake_word: string;
  build_options: Record<string, string | boolean>;
  firmware_version: string;
  firmware_source_revision: string;
  started_at: string;
  finished_at?: string;
  exit_code?: number;
  error?: string;
  artifacts: BuildArtifact[];
}

export interface BuildJob {
  id: string;
  status: JobStatus;
  stage: string;
  progressPercent: number;
  request: BuildJobRequest;
  manifest?: BuildManifest;
  logs: string[];
  createdAt: string;
  updatedAt: string;
  error?: string;
  downloadUrl?: string;
  manifestUrl?: string;
}
