import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { publicBlogRouter, adminBlogRouter } from './modules/blogs/blogRoutes.js';
import authRouter from './modules/auth/authRoutes.js';
import { publicNewsRouter, adminNewsRouter } from './modules/news/newsRoutes.js';
import { publicContactRouter, adminContactRouter } from './modules/contacts/contactRoutes.js';
import { Admin } from './modules/auth/adminModel.js';
import { generateSalt, hashPassword } from './modules/auth/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/orivance';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Public visitor routes
app.use('/api/blogs', publicBlogRouter);
app.use('/api/news', publicNewsRouter);
app.use('/api/contacts', publicContactRouter);

// Admin gateway routes
app.use('/api/admin/auth', authRouter);
app.use('/api/admin/blogs', adminBlogRouter);
app.use('/api/admin/news', adminNewsRouter);
app.use('/api/admin/contacts', adminContactRouter);

app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'OriVance Blog API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const startServer = async () => {
  try {
    mongoose.set('strictQuery', true);
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection established successfully.');

    // Seed default admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('Seeding default admin user...');
      const salt = generateSalt();
      const passwordHash = hashPassword('adminpassword', salt);
      const defaultAdmin = new Admin({
        username: 'admin',
        passwordHash,
        salt,
        role: 'admin',
      });
      await defaultAdmin.save();
      console.log('--------------------------------------------------');
      console.log('Default Admin Created Successfully!');
      console.log('Username: admin');
      console.log('Password: adminpassword');
      console.log('Please change these credentials in production.');
      console.log('--------------------------------------------------');
    }

    app.listen(PORT, () => {
      console.log(`Server is running in development mode on port ${PORT}`);
      console.log(`API health check at http://localhost:${PORT}/api`);
      console.log(`Serving uploads from: ${uploadsPath}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
