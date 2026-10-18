import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <header className="nav">
        <div className="logo">
          <span className="mark">✓</span>LabTrack
        </div>
        <nav className="links">
          <NavLink to="/" end>
            Головна
          </NavLink>
          <NavLink to="/labs">Мої лабораторні</NavLink>
        </nav>
        <div className="nav-user">
          <span data-cy="user-name">{user.name}</span>
          <button className="btn ghost sm" data-cy="logout" onClick={handleLogout}>
            Вийти
          </button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">© 2026 LabTrack · Навчальний проєкт</footer>
    </>
  );
}
