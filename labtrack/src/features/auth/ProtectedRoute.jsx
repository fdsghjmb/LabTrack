import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from './useAuth';

export default function ProtectedRoute() {
  const { data: user, isLoading } = useCurrentUser();
  if (isLoading) return <p className="state">Завантаження…</p>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
