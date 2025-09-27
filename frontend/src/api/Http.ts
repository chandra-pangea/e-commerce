// api/http.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

export const get = (url: string) => api.get(url).then((res) => res.data);
export const post = (url: string, data?: any) => api.post(url, data).then((res) => res.data);
export const put = (url: string, data?: any) => api.put(url, data).then((res) => res.data);
export const patch = (url: string, data?: any) => api.patch(url, data).then((res) => res.data);
export const del = (url: string) => api.delete(url).then((res) => res.data);

export default api;
