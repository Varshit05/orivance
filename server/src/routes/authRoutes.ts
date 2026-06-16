import { Router } from 'express';
import { Admin } from '../models/adminModel.js';
import { hashPassword, createToken } from '../utils/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find the admin
    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Verify password
    const computedHash = hashPassword(password, admin.salt);
    if (computedHash !== admin.passwordHash) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Generate token
    const token = createToken({
      id: String(admin._id),
      username: admin.username,
      role: admin.role,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error during login', error: error.message });
  }
});

export default router;
