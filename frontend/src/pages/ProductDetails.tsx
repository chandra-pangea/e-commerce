import React, { useEffect, useState } from 'react';
import { getProductDetails } from '../api/products';
import { useParams } from 'react-router-dom';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getProductDetails(Number(id)).then(setProduct);
    }
  }, [id]);

  if (!product) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg flex flex-col md:flex-row gap-8 border border-red-100">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-64 h-64 object-contain mx-auto"
      />
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-2 text-red-700">{product.name}</h2>
        <p className="mb-2 text-gray-600">{product.description}</p>
        <span className="text-red-600 font-bold text-2xl mb-2">₹{product.price}</span>
        <p className="mb-2">
          Stock:{' '}
          <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
            {product.stock > 0 ? 'Available' : 'Out of stock'}
          </span>
        </p>
        <button className="bg-red-600 text-white px-6 py-2 rounded font-semibold mt-4 hover:bg-red-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
};
export default ProductDetails;
