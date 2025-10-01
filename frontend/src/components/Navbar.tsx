import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow flex items-center justify-between px-8 py-4 mb-4 sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        E-Shop
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/products" className="hover:text-blue-600 font-medium">
          Products
        </Link>
        <Link to="/cart" className="hover:text-blue-600 font-medium">
          Cart
        </Link>
        <Link to="/wishlist" className="hover:text-blue-600 font-medium">
          Wishlist
        </Link>
        <Link to="/orders" className="hover:text-blue-600 font-medium">
          Orders
        </Link>
        <Link to="/admin/dashboard" className="hover:text-blue-600 font-medium">
          Admin
        </Link>
        <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded font-medium">
          Login
        </Link>
      </div>
    </nav>
  );
};
export default Navbar;
