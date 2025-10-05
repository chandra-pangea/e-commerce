import { get, post, put, del } from './Http';

export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock: number;
  images: string[];
  rating?: number;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export const getCart = async (): Promise<CartResponse> => {
  const response = await get<{ success: boolean; data: CartResponse }>('/cart');
  return response.data;
};

export const addToCart = async (productId: string, quantity: number): Promise<CartResponse> => {
  const response = await post<{ success: boolean; data: CartResponse }>('/cart', {
    productId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (
  productId: string,
  quantity: number,
): Promise<CartResponse> => {
  const response = await put<{ success: boolean; data: CartResponse }>(`/cart/${productId}`, {
    quantity,
  });
  return response.data;
};

export const removeFromCart = async (productId: string): Promise<CartResponse> => {
  const response = await del<{ success: boolean; data: CartResponse }>(`/cart/${productId}`);
  return response.data;
};
