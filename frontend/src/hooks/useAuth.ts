// useAuth.ts
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login, logoutThunk, updateUser, User } from '../store/features/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,

    login: (userData: User) => dispatch(login(userData)),
    logout: () => dispatch(logoutThunk()),
    updateUser: (userData: User) => dispatch(updateUser(userData)),
    setUser: (userData: User) => dispatch(updateUser(userData)),
  };
};
