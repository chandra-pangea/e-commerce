import { get, post, put, del } from './Http';

export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export const getCart = async (): Promise<CartResponse> => {
  return await get<CartResponse>('/cart');
};

export const addToCart = async (productId: string, quantity: number): Promise<CartResponse> => {
  return await post<CartResponse>('/cart', { productId, quantity });
};

export const updateCartItem = async (
  productId: string,
  quantity: number,
): Promise<CartResponse> => {
  return await put<CartResponse>(`/cart/${productId}`, { quantity });
};

export const removeFromCart = async (productId: string): Promise<void> => {
  return await del(`/cart/${productId}`);
};
