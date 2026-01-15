// =====================================================
// AUTH LAYOUT
// Layout for authentication pages (login, signup)
// =====================================================

import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-3xl font-bold">
            <span className="text-primary-500">Daily</span>
            <span className="text-secondary-400">Mart</span>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
