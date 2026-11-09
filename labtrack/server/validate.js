export const STATUSES = ['todo', 'work', 'done', 'defended'];

const text = (v, max) =>
  typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;

function isRealDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

// Перевіряє поля лабораторної. При partial=true перевіряються лише передані поля (PATCH).
export function validateLab(body, partial = false) {
  const lab = {};
  const has = (key) => body[key] !== undefined;

  if (!partial || has('subject')) {
    if (!text(body.subject, 120)) return { error: 'Вкажіть предмет (до 120 символів)' };
    lab.subject = body.subject.trim();
  }
  if (!partial || has('title')) {
    if (!text(body.title, 120))
      return { error: 'Вкажіть назву роботи (до 120 символів)' };
    lab.title = body.title.trim();
  }
  if (!partial || has('number')) {
    const number = Number(body.number);
    if (!Number.isInteger(number) || number < 1)
      return { error: 'Номер має бути цілим числом від 1' };
    lab.number = number;
  }
  if (!partial || has('deadline')) {
    if (typeof body.deadline !== 'string' || !isRealDate(body.deadline)) {
      return { error: 'Дедлайн має бути датою у форматі РРРР-ММ-ДД' };
    }
    lab.deadline = body.deadline;
  }
  if (!partial || has('status')) {
    if (!STATUSES.includes(body.status ?? 'todo')) return { error: 'Невідомий статус' };
    lab.status = body.status ?? 'todo';
  }
  if (has('note')) {
    if (typeof body.note !== 'string' || body.note.length > 500) {
      return { error: 'Нотатка має бути рядком до 500 символів' };
    }
    lab.note = body.note;
  }
  return { value: lab };
}

export function validateCredentials(body, withName) {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Некоректна пошта' };
  if (password.length < 6) return { error: 'Пароль має містити щонайменше 6 символів' };
  if (withName && !text(body.name, 80)) return { error: 'Вкажіть ім’я' };
  return { value: { email, password, name: withName ? body.name.trim() : undefined } };
}
