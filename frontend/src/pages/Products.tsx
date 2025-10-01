import React from 'react';
const Products: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
    {[1, 2, 3, 4, 5, 6].map((id) => (
      <div key={id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
        <img src="/logo192.png" alt="Product" className="w-24 h-24 mb-2" />
        <h3 className="font-bold text-lg mb-1">Product {id}</h3>
        <p className="text-gray-600 mb-2">Description for product {id}</p>
        <span className="text-blue-600 font-bold mb-2">₹{id * 100}</span>
        <button className="bg-green-600 text-white px-4 py-1 rounded">Add to Cart</button>
      </div>
    ))}
  </div>
);
export default Products;
