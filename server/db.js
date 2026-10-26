import fs from 'node:fs';
import path from 'node:path';

// Мінімальне сховище: один JSON-файл. Запис через тимчасовий файл, щоб не пошкодити дані.
export function createDb(file) {
  function read() {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      return { users: [], labs: [] };
    }
  }

  function write(data) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, file);
  }

  return { read, write };
}
