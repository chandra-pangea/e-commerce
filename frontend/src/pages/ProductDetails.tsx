import React, { useEffect, useState } from 'react';
import { getProductDetails } from '../api/products';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Heart, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { addToCart } from '../api/cart';
import { addToWishlist, removeFromWishlist } from '../api/wishlist';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    addToCart: false,
    buyNow: false,
    wishlist: false,
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        return;
      }
      try {
        setLoading(true);
        const productData = await getProductDetails(id);
        setProduct(productData);
      } catch (error) {
        toast.error('Failed to load product details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, addToCart: true }));
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setActionLoading((prev) => ({ ...prev, addToCart: false }));
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, buyNow: true }));
      await addToCart(product._id, quantity);
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to process buy now');
      setActionLoading((prev) => ({ ...prev, buyNow: false }));
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, wishlist: true }));
      if (isInWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
      setIsInWishlist(!isInWishlist);
      toast.success(isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!');
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setActionLoading((prev) => ({ ...prev, wishlist: false }));
    }
  };

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 w-24 h-8 bg-gray-200 rounded animate-pulse"></div>

        <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
            <div className="w-full h-[400px] bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Details Skeleton */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="mt-auto flex gap-4">
              <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Products</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-red-100">
        {/* Left Column - Image */}
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full max-w-md h-auto object-contain"
          />
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <button
              onClick={handleWishlistToggle}
              disabled={actionLoading.wishlist}
              className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading.wishlist ? (
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Heart
                  className={`w-6 h-6 ${
                    isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                />
              )}
            </button>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl font-bold text-red-600">₹{product.price}</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">({product.rating} rating)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-6">
            <span
              className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-r"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-6 py-2">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-l"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <span className="text-gray-600">Category: </span>
            <span className="font-medium text-gray-900">{product.category}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={product.stock <= 0 || actionLoading.addToCart || actionLoading.buyNow}
            >
              {actionLoading.addToCart ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={product.stock <= 0 || actionLoading.buyNow || actionLoading.addToCart}
            >
              {actionLoading.buyNow ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Buy Now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
