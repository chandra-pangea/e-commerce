import React from 'react';
const AdminDashboard: React.FC = () => (
  <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-6 text-red-700">Admin Dashboard</h2>
    <div className="mb-4">Manage products, orders, and users here.</div>
    <div className="flex space-x-4">
      <button className="bg-red-600 text-white px-6 py-2 rounded font-semibold">Products</button>
      <button className="bg-red-600 text-white px-6 py-2 rounded font-semibold">Orders</button>
      <button className="bg-red-600 text-white px-6 py-2 rounded font-semibold">Users</button>
    </div>
  </div>
);
export default AdminDashboard;
