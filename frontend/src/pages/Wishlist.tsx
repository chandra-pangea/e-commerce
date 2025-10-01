import React from 'react';
const Wishlist: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-red-700">Your Wishlist</h2>
      <div className="mb-4">No items in wishlist.</div>
      <button className="text-red-600 hover:underline">Remove</button>
    </div>
  );
};

export default Wishlist;
