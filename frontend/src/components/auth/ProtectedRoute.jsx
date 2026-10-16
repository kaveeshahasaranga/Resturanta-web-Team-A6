import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#0b0a09]" aria-busy="true" />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  return children;
}
