// Тонка обгортка над localStorage: застосунок не падає, якщо сховище недоступне.
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // сховище переповнене або заблоковане: дані живуть лише в пам’яті
  }
}
