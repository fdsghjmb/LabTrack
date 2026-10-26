import { createContext, useContext, useMemo, useState } from 'react';
import { load, save } from '../../shared/lib/storage';

const USERS_KEY = 'labtrack.users';
const SESSION_KEY = 'labtrack.session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => load(SESSION_KEY, null));

  const value = useMemo(
    () => ({
      user,
      // Навчальна реалізація без сервера: користувачі зберігаються в localStorage.
      register({ name, email, password }) {
        const users = load(USERS_KEY, []);
        if (users.some((u) => u.email === email)) {
          return { ok: false, error: 'Користувач із такою поштою вже існує' };
        }
        save(USERS_KEY, [...users, { name, email, password }]);
        const session = { name, email };
        save(SESSION_KEY, session);
        setUser(session);
        return { ok: true };
      },
      login({ email, password }) {
        const found = load(USERS_KEY, []).find(
          (u) => u.email === email && u.password === password,
        );
        if (!found) return { ok: false, error: 'Невірна пошта або пароль' };
        const session = { name: found.name, email: found.email };
        save(SESSION_KEY, session);
        setUser(session);
        return { ok: true };
      },
      logout() {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth потрібно використовувати всередині AuthProvider');
  return ctx;
}
