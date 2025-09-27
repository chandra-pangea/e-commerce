import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './providers/AuthContext';
interface ProtectedRouteProps {
  children: JSX.Element;
  role?: 'USER' | 'ADMIN';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
