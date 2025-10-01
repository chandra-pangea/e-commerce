import React from 'react';
const Cart: React.FC = () => (
  <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Cart</h2>
    <div className="mb-4">No items in cart.</div>
    <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold">Checkout</button>
  </div>
);
export default Cart;
