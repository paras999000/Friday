import path from 'path';
import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import boardsRouter from './routes/boards.routes';
import firmwareRouter from './routes/firmware.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API healthcheck
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    product: 'FIRDAY',
    version: '1.0.0',
    tagline: 'Your ESP32, Ready to Wake.',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.use('/api/boards', boardsRouter);
app.use('/api/firmware', firmwareRouter);

// Serve static frontend build if present (for unified single-service deployments)
const possibleDistPaths = [
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(__dirname, '../../../frontend/dist'),
  path.resolve(process.cwd(), '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
];

for (const distPath of possibleDistPaths) {
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`[FIRDAY] Serving frontend static assets from ${distPath}`);
    break;
  }
}

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

app.listen(PORT, () => {
  console.log(`[FIRDAY] Backend server running on http://localhost:${PORT}`);
  console.log(`[FIRDAY] Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
