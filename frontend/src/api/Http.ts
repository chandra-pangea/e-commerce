// api/http.ts
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const Http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
Http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
Http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Export HTTP methods
export const get = (url: string) => Http.get(url);
export const post = (url: string, data: any) => Http.post(url, data);
export const put = (url: string, data: any) => Http.put(url, data);
export const del = (url: string) => Http.delete(url);

export default Http;
