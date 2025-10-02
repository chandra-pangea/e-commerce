import React, { useState } from 'react';
import UsersList from '../components/admin/UsersList';
import ProductsList from '../components/admin/ProductsList';
import OrdersList from '../components/admin/OrdersList';

type TabType = 'products' | 'orders' | 'users';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('products');

  return (
    <div className="max-w-7xl mx-auto mt-10 p-8">
      <h2 className="text-2xl font-bold mb-6 text-red-700">Admin Dashboard</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded font-semibold transition-colors ${
            activeTab === 'products'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded font-semibold transition-colors ${
            activeTab === 'users'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Users
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'products' && <ProductsList />}
        {activeTab === 'orders' && <OrdersList />}
        {activeTab === 'users' && <UsersList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
