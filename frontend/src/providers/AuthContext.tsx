import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logout as apiLogout } from '../api/auth';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthStatus = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const response = await getCurrentUser();
      console.log(response.user);
      setUser(response.user);

      // If on login/register page and authenticated, redirect to home
      if (['/login', '/register'].includes(location.pathname)) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      setUser(null);
      // Only redirect to login if not on public routes
      const publicPaths = ['/', '/login', '/register', '/products'];
      if (!publicPaths.some((path) => location.pathname.startsWith(path))) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [loading, location.pathname, navigate]);

  const login = useCallback(
    (userData: User) => {
      setUser(userData);
      const intendedPath = location.state?.from || '/';
      navigate(intendedPath, { replace: true });
    },
    [navigate, location],
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await apiLogout();
      setUser(null);
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  console.log(user);
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    updateUser: setUser,
    checkAuthStatus, // Expose this to manually check auth status
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
