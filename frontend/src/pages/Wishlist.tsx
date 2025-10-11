import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { getWishlist, removeFromWishlist } from '../api/wishlist';
import { addToCart } from '../api/cart';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlistItems(
        response.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          images: item.images ?? [],
          stock: item.stock ?? 0,
        })),
      );
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, [itemId]: true }));
      await removeFromWishlist(itemId);
      toast.success('Item removed from wishlist');
      setWishlistItems((items) => items.filter((item) => item.id !== itemId));
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setActionLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    const actionId = `cart_${item.id}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionId]: true }));
      await addToCart(item.id, 1);
      toast.success('Item added to cart');
      await handleRemoveFromWishlist(item.id);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionId]: false }));
    }
  };

  const handleBuyNow = async (item: WishlistItem) => {
    const actionId = `buy_${item.id}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionId]: true }));
      await addToCart(item.id, 1);
      await handleRemoveFromWishlist(item.id);
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to process buy now');
      setActionLoading((prev) => ({ ...prev, [actionId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>

          {/* Wishlist Items */}
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-28 bg-gray-200 rounded"></div>
                  <div className="h-10 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <Heart className="w-6 h-6 text-red-600 mr-2" />
        <h2 className="text-2xl font-bold text-red-700">Your Wishlist</h2>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.images?.[0] || '/logo192.png'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-red-600 font-semibold">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={actionLoading[`cart_${item.id}`] || actionLoading[item.id]}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg border border-gray-300 hover:border-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading[`cart_${item.id}`] ? (
                    <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  Add to Cart
                </button>

                <button
                  onClick={() => handleBuyNow(item)}
                  disabled={actionLoading[`buy_${item.id}`] || actionLoading[item.id]}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actionLoading[`buy_${item.id}`] ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : null}
                  Buy Now
                </button>

                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  disabled={
                    actionLoading[item.id] ||
                    actionLoading[`cart_${item.id}`] ||
                    actionLoading[`buy_${item.id}`]
                  }
                  className="text-gray-400 hover:text-red-600 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove from wishlist"
                >
                  {actionLoading[item.id] ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
