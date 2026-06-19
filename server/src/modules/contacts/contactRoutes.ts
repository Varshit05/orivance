import { Router } from 'express';
import { requireAdmin } from '../../middleware/authMiddleware.js';
import {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact,
} from './contactController.js';

const publicRouter = Router();
publicRouter.post('/', createContact);

const adminRouter = Router();
adminRouter.get('/', requireAdmin, getContacts as any);
adminRouter.patch('/:id/status', requireAdmin, updateContactStatus as any);
adminRouter.delete('/:id', requireAdmin, deleteContact as any);

export { publicRouter as publicContactRouter, adminRouter as adminContactRouter };
