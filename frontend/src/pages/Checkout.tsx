import React from 'react';
const Checkout: React.FC = () => (
  <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-4 text-blue-700">Checkout</h2>
    <div className="mb-4">Add your address and payment details here.</div>
    <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold">Place Order</button>
  </div>
);
export default Checkout;
