
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // ✅ ensures cookies are sent
});

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.get(url, config);
  return response.data;
};

export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.post(url, data, config);
  return response.data;
};

export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.put(url, data, config);
  return response.data;
};

export const patch = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.patch(url, data, config);
  return response.data;
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.delete(url, config);
  return response.data;
};

export default api;
