import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, login, logout, register } from '../store/features/authSlice';
import { AppDispatch, RootState } from '../store/store';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Explicitly tell TypeScript that auth slice has type AuthState
  const authState = useSelector((state: RootState) => state.auth);

  const { user, loading, error } = authState; // now TypeScript knows types

  // Check authentication on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login: (email: string, password: string) => dispatch(login({ email, password })),
    register: (name: string, email: string, password: string) =>
      dispatch(register({ name, email, password })),
    logout: () => dispatch(logout()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
