import { Router, Request, Response } from 'express';
import { boardDiscoveryService } from '../services/boardDiscovery.service';

const router = Router();

// GET /api/boards
router.get('/', async (req: Request, res: Response) => {
  try {
    const { target, search } = req.query;
    let boards = await boardDiscoveryService.loadBoards();

    if (target && typeof target === 'string') {
      boards = boards.filter((b) => b.target.toLowerCase() === target.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      boards = boards.filter(
        (b) =>
          b.display_name.toLowerCase().includes(q) ||
          b.name.toLowerCase().includes(q) ||
          b.board.toLowerCase().includes(q) ||
          b.manufacturer.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      total: boards.length,
      data: boards,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/boards/languages
router.get('/meta/languages', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: boardDiscoveryService.getLanguages(),
  });
});

// GET /api/boards/wakewords
router.get('/meta/wakewords', (req: Request, res: Response) => {
  const target = req.query.target as string | undefined;
  res.json({
    success: true,
    data: boardDiscoveryService.getWakeWords(target),
  });
});

// GET /api/boards/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const board = await boardDiscoveryService.getBoardById(id);
    if (!board) {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }
    res.json({ success: true, data: board });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
