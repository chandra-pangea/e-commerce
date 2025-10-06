import { get, post, put, del } from './Http';

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface SearchParams {
  search?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

type QueryParams = PaginationParams & SearchParams;

// Helper function to build query string
const buildQueryString = (params: QueryParams): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString();
};

// Types
interface User {
  id: number;
  email: string;
  name: string;
  blocked: boolean;
}

interface OrderItem {
  id: number;
  name: string;
  qty: number;
}

interface Order {
  id: number;
  _id: string;
  status: string;
  amount: number;
  items: OrderItem[];
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  description: string;
}

interface OrderFilters {
  page: number;
  limit: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

// User management
export const getAllUsers = async (
  params: QueryParams = {},
): Promise<{
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryString = buildQueryString(params);
  return await get(`/auth/users?${queryString}`);
};

export const blockUser = async (id: number): Promise<{ success: boolean }> => {
  return await put(`/admin/users/${id}/block`);
};

// Order management
export const getAllOrders = async (
  params: QueryParams = {},
): Promise<{
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryString = buildQueryString(params);
  return await get(`/orders/admin/all?${queryString}`);
};

export const updateOrderStatus = async (
  id: string,
  status: string,
): Promise<{ success: boolean }> => {
  return await put(`/orders/${id}/status`, { status });
};

// Product management
export const getAllProducts = async (
  params: QueryParams = {},
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryString = buildQueryString(params);
  return await get(`/products/all?${queryString}`);
};

export const createProduct = async (product: FormData): Promise<any> => {
  return await post('/products', product, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProduct = async (
  id: string,
  data: FormData | Partial<Product>,
): Promise<any> => {
  const headers =
    data instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };

  return await put(`/products/${id}`, data, { headers });
};

export const deleteProduct = async (id: string): Promise<{ success: boolean }> => {
  return await del(`/products/${id}`);
};

export type { User, Order, OrderItem, OrderFilters };
