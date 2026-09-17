import { Router, Request, Response } from 'express';
import { buildRunnerService } from '../services/buildRunner.service';

const router = Router();

// GET /api/firmware/device
router.get('/device', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: 'ESP32 Dev Module',
      target: 'esp32',
      chipFamily: 'ESP32-D0WD-V3 / WROOM-32',
      architecture: 'Xtensa Dual-Core 32-bit LX6 @ 240 MHz',
      flashSize: '4 MB SPI Flash',
      flashOffset: '0x00000000',
      partitionLayout: 'partitions/v2/4m.csv',
      firmwareVersion: '2.5.0',
      language: 'English (en-US)',
      wakeWord: 'Jarvis (FIRDAY Assistant)',
    },
  });
});

// POST /api/firmware/build
router.post('/build', async (req: Request, res: Response) => {
  try {
    // Standardized for ESP32 Dev Module
    const job = await buildRunnerService.startBuild();

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/firmware/build/:jobId
router.get('/build/:jobId', (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  const job = buildRunnerService.getJob(jobId);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Build job not found' });
  }
  res.json({ success: true, data: job });
});

// GET /api/firmware/build/:jobId/logs
router.get('/build/:jobId/logs', (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  const job = buildRunnerService.getJob(jobId);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Build job not found' });
  }
  res.json({
    success: true,
    jobId: job.id,
    status: job.status,
    logs: job.logs,
  });
});

// GET /api/firmware/build/:jobId/manifest
router.get('/build/:jobId/manifest', (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  const job = buildRunnerService.getJob(jobId);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Build job not found' });
  }
  if (!job.manifest) {
    return res.status(400).json({ success: false, error: 'Manifest not available yet for this job' });
  }
  res.json(job.manifest);
});

// GET /api/firmware/build/:jobId/download
router.get('/build/:jobId/download', (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  const artifactPath = buildRunnerService.getArtifactPath(jobId, 'merged-binary.bin');
  if (!artifactPath) {
    return res.status(404).json({ success: false, error: 'Artifact binary not found or not yet generated' });
  }
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename="merged-binary.bin"');
  res.sendFile(artifactPath);
});

// POST /api/firmware/build/:jobId/cancel
router.post('/build/:jobId/cancel', (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  const cancelled = buildRunnerService.cancelJob(jobId);
  if (!cancelled) {
    return res.status(400).json({ success: false, error: 'Job cannot be cancelled (either not found or already finished)' });
  }
  res.json({ success: true, message: 'Job cancelled' });
});

export default router;
