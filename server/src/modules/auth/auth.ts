import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const ITERATIONS = 10000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';
const JWT_SECRET = process.env.JWT_SECRET || 'orivance-secret-fallback-key-18239128';

export interface TokenPayload {
  id: string;
  username: string;
  role: string;
  exp: number;
}

// Generates a cryptographically secure random salt
export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

// Hashes a password using PBKDF2
export const hashPassword = (password: string, salt: string): string => {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
};

// Creates a standard JWT token
export const createToken = (payload: Omit<TokenPayload, 'exp'>, expiresInDays = 7): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${expiresInDays}d` });
};

// Verifies the standard JWT token and returns the payload if valid
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && decoded !== null) {
      return {
        id: decoded.id as string,
        username: decoded.username as string,
        role: decoded.role as string,
        exp: decoded.exp ? decoded.exp * 1000 : 0,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

