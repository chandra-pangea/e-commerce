import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    images?: string[];
    rating?: number;
    stock?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg p-6 group relative transition-all duration-300 border border-gray-100"
    >
      {/* Product Image */}
      <div className="relative w-full pt-[100%] mb-4">
        <img
          src={product.images?.[0] || '/logo192.png'} // Fallback to default image
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-red-600 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

        <div className="mt-auto">
          <div className="flex items-baseline">
            <span className="text-red-600 font-bold text-xl">₹{product.price}</span>
            {product.stock === 0 && <span className="ml-2 text-xs text-red-500">Out of Stock</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
