import React from 'react';

const Checkout: React.FC = () => {
  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-red-700">Checkout</h2>
      <div className="mb-4">Add your address and payment details here.</div>
      <button
        className="bg-red-600 text-white px-6 py-2 rounded font-semibold w-full"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
      <div className="text-green-600 font-bold text-xl">Order placed successfully!</div>
    </div>
  );
};

export default Checkout;
