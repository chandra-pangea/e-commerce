import { get, post, del } from './Http';

export interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
  name: string;
  price: number;
}

export const getWishlist = async (): Promise<{ items: WishlistItem[] }> => {
  return await get('/wishlist');
};

export const addToWishlist = async (productId: string): Promise<void> => {
  return await post(`/wishlist/${productId}`);
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  return await del(`/wishlist/${productId}`);
};
