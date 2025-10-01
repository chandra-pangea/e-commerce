// Dummy Wishlist API for frontend only
export const getWishlist = async () => {
  return { items: [{ id: 2, name: 'Product 2', price: 200 }] };
};
export const addToWishlist = async (item: any) => {
  return { success: true };
};
export const removeFromWishlist = async (id: number) => {
  return { success: true };
};
export {};
