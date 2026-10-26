import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export default function LoginPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/labs" replace />;

  const isRegister = mode === 'register';
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    const result = isRegister ? register(form) : login(form);
    if (result.ok) navigate('/labs');
    else setError(result.error);
  }

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit} data-cy="auth-form">
        <div className="logo">
          <span className="mark">✓</span>LabTrack
        </div>
        <div className="tabs">
          <button
            type="button"
            className={!isRegister ? 'on' : ''}
            onClick={() => setMode('login')}
          >
            Вхід
          </button>
          <button
            type="button"
            className={isRegister ? 'on' : ''}
            data-cy="tab-register"
            onClick={() => setMode('register')}
          >
            Реєстрація
          </button>
        </div>
        {isRegister && (
          <label>
            Ім’я
            <input data-cy="name" required value={form.name} onChange={update('name')} />
          </label>
        )}
        <label>
          Пошта
          <input
            data-cy="email"
            type="email"
            required
            value={form.email}
            onChange={update('email')}
          />
        </label>
        <label>
          Пароль
          <input
            data-cy="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update('password')}
          />
        </label>
        {error && (
          <p className="error" data-cy="auth-error">
            {error}
          </p>
        )}
        <button className="btn primary" data-cy="submit" type="submit">
          {isRegister ? 'Створити акаунт' : 'Увійти'}
        </button>
      </form>
    </div>
  );
}
