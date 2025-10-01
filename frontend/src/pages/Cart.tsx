import React from 'react';
import { useNavigate } from 'react-router-dom';
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const total = 0; // Add a default value for 'total'

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-red-700">Your Cart</h2>
      <div className="mb-4">No items in cart.</div>
      <div className="font-bold text-lg">Total: ₹{total}</div>
      <button
        className="mt-4 bg-red-600 text-white px-6 py-2 rounded font-semibold"
        onClick={() => navigate('/checkout')}
      >
        Checkout
      </button>
    </div>
  );
};
export default Cart;
