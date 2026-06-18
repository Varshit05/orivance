import { Router } from 'express';
import { requireAdmin } from '../../middleware/authMiddleware.js';
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from './newsController.js';

const publicRouter = Router();
publicRouter.get('/', getNews);
publicRouter.get('/:id', getNewsById);

const adminRouter = Router();
adminRouter.get('/', requireAdmin, getNews);
adminRouter.post('/', requireAdmin, createNews as any);
adminRouter.put('/:id', requireAdmin, updateNews as any);
adminRouter.delete('/:id', requireAdmin, deleteNews as any);

export { publicRouter as publicNewsRouter, adminRouter as adminNewsRouter };

