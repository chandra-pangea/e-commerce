import { get, post } from './Http'; // ✅ use centralized axios wrappers

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

interface AuthResponse {
  token?: string; // might be set in cookies, so optional
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
  return await post<AuthResponse>('/auth/login', { email, password });
};

export const googleLogin = async (credential: string): Promise<AuthResponse> => {
  return await post<AuthResponse>('/auth/google', { credential });
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return await post<AuthResponse>('/auth/register', data);
};

export const getUserDetails = async (): Promise<AuthResponse> => {
  return await get<AuthResponse>('/auth/me');
};

export const logoutUser = async (): Promise<{ message: string }> => {
  return await post<{ message: string }>('/auth/logout');
};
