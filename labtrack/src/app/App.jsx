import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import HomePage from '../pages/HomePage';
import LabFormPage from '../pages/LabFormPage';
import LabsPage from '../pages/LabsPage';
import LoginPage from '../pages/LoginPage';
import Layout from '../shared/ui/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="labs" element={<LabsPage />} />
            <Route path="labs/new" element={<LabFormPage />} />
            <Route path="labs/:id/edit" element={<LabFormPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
