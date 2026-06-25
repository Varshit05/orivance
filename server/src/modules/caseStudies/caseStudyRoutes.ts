import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAdmin } from '../../middleware/authMiddleware.js';
import {
  getCaseStudies,
  getCaseStudyBySlugOrId,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from './caseStudyController.js';

const publicRouter = Router();
publicRouter.get('/', getCaseStudies);
publicRouter.get('/:identifier', getCaseStudyBySlugOrId);

const adminRouter = Router();
adminRouter.get('/', requireAdmin, getCaseStudies);
adminRouter.post('/', requireAdmin, createCaseStudy);
adminRouter.put('/:id', requireAdmin, updateCaseStudy);
adminRouter.delete('/:id', requireAdmin, deleteCaseStudy);

// Ensure upload directory exists
const UPLOAD_DIR = './uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `case-study-${uniqueSuffix}${ext}`);
  },
});

// Multer Upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed!'));
  },
});

// Case Study Cover Image Upload route
adminRouter.post('/upload', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ filePath });
  });
});

export { publicRouter as publicCaseStudyRouter, adminRouter as adminCaseStudyRouter };
