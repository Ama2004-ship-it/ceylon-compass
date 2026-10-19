import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAuth();

  if (checking) return <Loader label="Checking session..." />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
}
