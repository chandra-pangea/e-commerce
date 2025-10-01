import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/products';
import { Link } from 'react-router-dom';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts({}).then((res) => setProducts(res.products));
  }, []);

  return (
    <div className="py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition border border-red-100"
        >
          <Link to={`/products/${product.id}`} className="w-full flex flex-col items-center">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-32 h-32 object-contain mb-3"
            />
            <h3 className="text-lg font-bold mb-1 text-gray-800">{product.name}</h3>
            <p className="text-gray-500 mb-2">{product.description}</p>
            <span className="text-red-600 font-bold text-xl mb-2">₹{product.price}</span>
          </Link>
          <button className="bg-red-600 text-white px-4 py-1 rounded w-full mt-2 font-semibold hover:bg-red-700 transition">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};
export default Products;
