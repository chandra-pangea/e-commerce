import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-red-100 to-white">
    <h1 className="text-5xl font-extrabold text-red-700 mb-6 tracking-tight">Welcome to E-Shop</h1>
    <p className="mb-8 text-lg text-gray-600 max-w-xl text-center">
      Discover the best products, add to your cart, and enjoy a seamless shopping experience. Start
      browsing now!
    </p>
    <Link
      to="/products"
      className="bg-red-600 text-white px-8 py-3 rounded-lg text-xl font-semibold shadow hover:bg-red-700 transition"
    >
      Shop Now
    </Link>
    <img src="/logo192.png" alt="E-Shop" className="mt-10 w-40 h-40" />
  </div>
);
export default Home;
