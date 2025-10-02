import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { getWishlist, removeFromWishlist } from '../api/wishlist';
import { useCart } from '../providers/CartContext';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  images?: string[];
  stock?: number;
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlistItems(response.items);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: number) => {
    try {
      await removeFromWishlist(itemId);
      toast.success('Item removed from wishlist');
      setWishlistItems((items) => items.filter((item) => item.id !== itemId));
    } catch (error) {
      toast.error('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    try {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        images: item.images || ['/logo192.png'],
        stock: item.stock || 10,
      });
      toast.success('Item added to cart');
      handleRemoveFromWishlist(item.id); // Optional: remove from wishlist after adding to cart
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleBuyNow = (item: WishlistItem) => {
    handleAddToCart(item);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
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
            className="text-red-600 hover:text-red-700 font-medium"
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
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg border border-gray-300 hover:border-red-600 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>

                <button
                  onClick={() => handleBuyNow(item)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="text-gray-400 hover:text-red-600 p-2"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5" />
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
