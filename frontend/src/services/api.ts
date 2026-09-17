import { DeviceSpecs, BuildJob } from '../types';

const API_BASE = '/api';

export async function fetchDeviceSpecs(): Promise<DeviceSpecs> {
  const res = await fetch(`${API_BASE}/firmware/device`);
  if (!res.ok) throw new Error('Failed to fetch ESP32 Dev Module specification');
  const json = await res.json();
  return json.data;
}

export async function triggerBuild(): Promise<BuildJob> {
  const res = await fetch(`${API_BASE}/firmware/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Build initiation failed (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

export async function getBuildJob(jobId: string): Promise<BuildJob> {
  const res = await fetch(`${API_BASE}/firmware/build/${encodeURIComponent(jobId)}`);
  if (!res.ok) throw new Error(`Failed to fetch job (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function getBuildLogs(jobId: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/firmware/build/${encodeURIComponent(jobId)}/logs`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  const json = await res.json();
  return json.logs || [];
}

export async function cancelBuild(jobId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/firmware/build/${encodeURIComponent(jobId)}/cancel`, {
    method: 'POST',
  });
  return res.ok;
}

export async function downloadBinaryArrayBuffer(jobId: string): Promise<ArrayBuffer> {
  const res = await fetch(`${API_BASE}/firmware/build/${encodeURIComponent(jobId)}/download`);
  if (!res.ok) throw new Error('Failed to download binary');
  return await res.arrayBuffer();
}
