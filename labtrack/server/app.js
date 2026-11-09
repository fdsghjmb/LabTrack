import crypto from 'node:crypto';
import express from 'express';
import { hashPassword, requireAuth, signToken, verifyPassword } from './auth.js';
import { createDb } from './db.js';
import { validateCredentials, validateLab } from './validate.js';

export function createApp({ dbFile, secret }) {
  const db = createDb(dbFile);
  const auth = requireAuth(secret, db);
  const app = express();
  app.use(express.json());

  const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });
  const publicLab = ({ userId: _userId, ...lab }) => lab;

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  // ---------- авторизація ----------
  app.post('/api/auth/register', (req, res) => {
    const { value, error } = validateCredentials(req.body ?? {}, true);
    if (error) return res.status(400).json({ error });
    const data = db.read();
    if (data.users.some((u) => u.email === value.email)) {
      return res.status(409).json({ error: 'Користувач із такою поштою вже існує' });
    }
    const user = {
      id: crypto.randomUUID(),
      name: value.name,
      email: value.email,
      passwordHash: hashPassword(value.password),
    };
    db.write({ ...data, users: [...data.users, user] });
    res.status(201).json({ token: signToken(user.id, secret), user: publicUser(user) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { value, error } = validateCredentials(req.body ?? {}, false);
    const user = value && db.read().users.find((u) => u.email === value.email);
    if (error || !user || !verifyPassword(value.password, user.passwordHash)) {
      return res.status(401).json({ error: 'Невірна пошта або пароль' });
    }
    res.json({ token: signToken(user.id, secret), user: publicUser(user) });
  });

  app.get('/api/auth/me', auth, (req, res) => res.json(publicUser(req.user)));

  // ---------- лабораторні (лише власні) ----------
  app.get('/api/labs', auth, (req, res) => {
    res.json(
      db
        .read()
        .labs.filter((l) => l.userId === req.user.id)
        .map(publicLab),
    );
  });

  app.post('/api/labs', auth, (req, res) => {
    const { value, error } = validateLab(req.body ?? {});
    if (error) return res.status(400).json({ error });
    const data = db.read();
    const lab = { id: crypto.randomUUID(), userId: req.user.id, note: '', ...value };
    db.write({ ...data, labs: [...data.labs, lab] });
    res.status(201).json(publicLab(lab));
  });

  app.patch('/api/labs/:id', auth, (req, res) => {
    const data = db.read();
    const index = data.labs.findIndex(
      (l) => l.id === req.params.id && l.userId === req.user.id,
    );
    if (index === -1) return res.status(404).json({ error: 'Лабораторну не знайдено' });
    const { value, error } = validateLab(req.body ?? {}, true);
    if (error) return res.status(400).json({ error });
    const updated = { ...data.labs[index], ...value };
    const labs = data.labs.map((l, i) => (i === index ? updated : l));
    db.write({ ...data, labs });
    res.json(publicLab(updated));
  });

  app.delete('/api/labs/:id', auth, (req, res) => {
    const data = db.read();
    const exists = data.labs.some(
      (l) => l.id === req.params.id && l.userId === req.user.id,
    );
    if (!exists) return res.status(404).json({ error: 'Лабораторну не знайдено' });
    db.write({ ...data, labs: data.labs.filter((l) => l.id !== req.params.id) });
    res.status(204).end();
  });

  // Невідомий API-маршрут і непередбачені помилки теж повертають JSON.
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Маршрут не знайдено' }));
  app.use((err, _req, res, _next) => {
    const status = err.status === 400 ? 400 : 500;
    res
      .status(status)
      .json({ error: status === 400 ? 'Некоректний JSON' : 'Помилка сервера' });
  });

  return app;
}
