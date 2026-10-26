const DAY = 24 * 60 * 60 * 1000;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Різниця в календарних днях між дедлайном (рядок YYYY-MM-DD) і сьогодні.
export function daysLeft(deadline, today = new Date()) {
  const [y, m, d] = deadline.split('-').map(Number);
  return Math.round((new Date(y, m - 1, d) - startOfDay(today)) / DAY);
}

export function getUrgency(deadline, today = new Date()) {
  const days = daysLeft(deadline, today);
  if (days < 0) return { level: 'overdue', label: `Прострочено ${-days} дн.` };
  if (days === 0) return { level: 'today', label: 'Сьогодні' };
  if (days <= 3) return { level: 'soon', label: `Через ${days} дн.` };
  return { level: 'ok', label: `Через ${days} дн.` };
}

export function formatDate(deadline) {
  const [y, m, d] = deadline.split('-');
  return `${d}.${m}.${y}`;
}
