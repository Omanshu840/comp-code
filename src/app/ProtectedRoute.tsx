import { useAuth } from '@/features/auth/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { SplashScreen } from './SplashScreen';

export const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
