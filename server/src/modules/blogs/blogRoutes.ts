import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAdmin } from '../../middleware/authMiddleware.js';
import {
  getBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  deleteBlog,
} from './blogController.js';

const publicRouter = Router();
publicRouter.get('/', getBlogs);
publicRouter.get('/:identifier', getBlogBySlugOrId);

const adminRouter = Router();
adminRouter.get('/', requireAdmin, getBlogs);
adminRouter.post('/', requireAdmin, createBlog);
adminRouter.put('/:id', requireAdmin, updateBlog);
adminRouter.delete('/:id', requireAdmin, deleteBlog);

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
    cb(null, `cover-${uniqueSuffix}${ext}`);
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

// Blog Cover Image Upload route
adminRouter.post('/upload', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the relative URL which will be handled by static route in index.ts
    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ filePath });
  });
});

export { publicRouter as publicBlogRouter, adminRouter as adminBlogRouter };

