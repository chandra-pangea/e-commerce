// Dummy Auth API for frontend only
export const login = async (email: string, password: string) => {
  return {
    token: 'dummy-jwt',
    user: { email, name: 'John Doe', role: 'USER', mobile: '1234567890' },
  };
};
export const register = async (data: {
  email: string;
  password: string;
  name: string;
  mobile: string;
}) => {
  return { success: true };
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
export {};
