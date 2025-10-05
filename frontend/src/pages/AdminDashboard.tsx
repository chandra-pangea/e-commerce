import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
import UsersList from '../components/admin/UsersList';
import ProductsList from '../components/admin/ProductsList';
import OrdersList from '../components/admin/OrdersList';
import { getAllOrders, getAllUsers, getAllProducts } from '../api/admin';

type TabType = 'products' | 'orders' | 'users';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
        getAllProducts(),
      ]);

      const totalRevenue = ordersRes.orders.reduce((sum, order) => sum + order.amount, 0);

      setStats({
        totalUsers: usersRes.users.length,
        totalProducts: productsRes.products.length,
        totalOrders: ordersRes.orders.length,
        totalRevenue,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Users className="h-12 w-12 text-red-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Package className="h-12 w-12 text-red-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <ShoppingBag className="h-12 w-12 text-red-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <DollarSign className="h-12 w-12 text-red-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto mt-10 p-8">
      <h2 className="text-2xl font-bold mb-6 text-red-700">Admin Dashboard</h2>

      <StatsSection />

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

      <div className="mt-6">
        {activeTab === 'products' && <ProductsList />}
        {activeTab === 'orders' && <OrdersList />}
        {activeTab === 'users' && <UsersList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
