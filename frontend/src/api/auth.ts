import { jwtDecode } from 'jwt-decode';
import Http from './Http';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    picture?: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  mobile: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await Http.post('/api/auth/login', { email, password });
  return response.data;
};

export const googleLogin = async (credential: string): Promise<AuthResponse> => {
  const response = await Http.post('/api/auth/google', { credential });
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await Http.post('/api/auth/register', data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  return { success: true };
};

export const resetPassword = async (token: string, password: string) => {
  return { success: true };
};

export const updateProfile = async (data: any) => {
  return { success: true, user: { ...data } };
};

export const getCurrentUser = async () => {
  const response = await Http.get('/api/auth/me');
  return response.data;
};
