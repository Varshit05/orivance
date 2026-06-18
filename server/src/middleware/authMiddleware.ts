import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../modules/auth/auth.js';

export interface AuthenticatedRequest extends Request {
  admin?: TokenPayload;
}

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. Authentication token missing.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Session expired or authentication token invalid.' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};
