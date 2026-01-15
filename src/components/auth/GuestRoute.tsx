// =====================================================
// GUEST ROUTE
// Only accessible when not logged in
// =====================================================

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Loader2 } from 'lucide-react';

const GuestRoute = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuthStore();
  const location = useLocation();

  // Get the intended destination from navigation state
  const from = (location.state as any)?.from?.pathname || '/';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-800">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect admin to admin dashboard, users to home
    const redirectTo = isAdmin ? '/admin' : from;
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
