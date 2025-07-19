
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/login' 
}) => {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-ngo-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check if user's role is allowed
  const userRole = profile?.role || 'staff';
  if (!allowedRoles.includes(userRole)) {
    // Redirect based on user role
    let redirectPath = '/';
    switch (userRole) {
      case 'admin':
        redirectPath = '/admin';
        break;
      case 'coordinator':
        redirectPath = '/coordinator';
        break;
      case 'staff':
        redirectPath = '/staff';
        break;
    }
    return <Navigate to={redirectPath} replace />;
  }

  // Check if user account is active
  if (profile && !profile.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="font-bold mb-2">Account Deactivated</h2>
            <p>Your account has been deactivated. Please contact an administrator for assistance.</p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
