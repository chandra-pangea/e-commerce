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

  useEffect(() => {
    if (id) {
      console.log(id);
      getProductDetails(id).then(setProduct);
    }
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product._id, quantity);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product._id, quantity);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!');
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
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
              className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
            >
              <Heart
                className={`w-6 h-6 ${
                  isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              />
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
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.stock <= 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
