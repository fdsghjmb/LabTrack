import { load, save } from './storage';

const TOKEN_KEY = 'labtrack.token';

export const getToken = () => load(TOKEN_KEY, null);

export function setToken(token) {
  if (token) save(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Єдина точка звернень до сервера: додає токен, розбирає JSON і перетворює помилки на ApiError.
export async function api(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Сервер недоступний', 0);
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(data?.error ?? 'Помилка запиту', response.status);
  return data;
}
