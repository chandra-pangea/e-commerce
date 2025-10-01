import React from 'react';
const Home: React.FC = () => (
  <div className="bg-white rounded-lg shadow-lg p-8 mt-8 text-center">
    <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to E-Shop</h1>
    <p className="mb-6 text-gray-600">
      Your one-stop shop for the best products. Browse, add to cart, and order with ease!
    </p>
    <img src="/logo192.png" alt="E-Shop" className="mx-auto mb-4 w-32 h-32" />
  </div>
);
export default Home;
