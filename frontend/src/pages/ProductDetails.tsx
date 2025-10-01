import React from 'react';
const ProductDetails: React.FC = () => (
  <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
    <img src="/logo192.png" alt="Product" className="w-48 h-48 mx-auto mb-4" />
    <h2 className="text-2xl font-bold mb-2 text-blue-700">Product Name</h2>
    <p className="mb-2 text-gray-600">Detailed description of the product goes here.</p>
    <span className="text-blue-600 font-bold mb-2">₹999</span>
    <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold">Add to Cart</button>
  </div>
);
export default ProductDetails;
