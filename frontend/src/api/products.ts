import { get, post, put, del } from './Http';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  stock: number;
  rating?: number;
}

export interface ProductsParams {
  page?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export const getProducts = async (params: ProductsParams): Promise<ProductsResponse> => {
  return await get<ProductsResponse>('/products', { params });
};

export const getProductDetails = async (id: string): Promise<Product> => {
  return await get<Product>(`/products/${id}`);
};

export const getCategories = async (): Promise<string[]> => {
  return await get<string[]>('/products/categories');
};

export const addReview = async (
  productId: string,
  rating: number,
  comment: string,
): Promise<void> => {
  return await post(`/products/${productId}/reviews`, { rating, comment });
};
