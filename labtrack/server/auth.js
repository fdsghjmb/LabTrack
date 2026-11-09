import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const actual = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}

export function signToken(userId, secret) {
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

// Middleware: читає заголовок Authorization: Bearer <token> і додає req.user.
export function requireAuth(secret, db) {
  return (req, res, next) => {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Потрібна авторизація' });
    try {
      const { sub } = jwt.verify(token, secret);
      const user = db.read().users.find((u) => u.id === sub);
      if (!user) throw new Error('unknown user');
      req.user = user;
      next();
    } catch {
      res.status(401).json({ error: 'Сесія недійсна, увійдіть знову' });
    }
  };
}
