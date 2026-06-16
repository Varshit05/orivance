import crypto from 'crypto';

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

// Creates a custom HMAC-SHA256 signed JWT-like token
export const createToken = (payload: Omit<TokenPayload, 'exp'>, expiresInDays = 7): string => {
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const tokenPayload: TokenPayload = { ...payload, exp };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');

  return `${header}.${body}.${signature}`;
};

// Verifies the custom signed token and returns the payload if valid
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, body, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const decodedBody = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
    if (Date.now() > decodedBody.exp) {
      return null; // Token expired
    }

    return decodedBody;
  } catch (error) {
    return null;
  }
};
