import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3001;
const secret = process.env.JWT_SECRET || 'labtrack-dev-secret-change-me';

createApp({ dbFile: path.join(dir, 'data', 'db.json'), secret }).listen(port, () => {
  console.log(`LabTrack API: http://localhost:${port}/api`);
});
