import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../providers/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
  };
  return (
    <nav className="bg-white shadow flex items-center justify-between px-8 py-4 sticky top-0 z-50 border-b border-red-600">
      <Link to="/" className="text-2xl font-bold text-red-600">
        E-Shop
      </Link>
      <div className="flex gap-6 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/cart" className="hover:text-red-600 font-medium relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to="/wishlist" className="hover:text-red-600 font-medium">
              Wishlist
            </Link>
            <Link to="/orders" className="hover:text-red-600 font-medium">
              Orders
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin/dashboard" className="hover:text-red-600 font-medium">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-red-600 text-white px-3 py-1 rounded font-medium hover:bg-red-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
