import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllUsers } from '../../api/admin';

interface User {
  id: number;
  email: string;
  name: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const searchSection = (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers({
        page,
        limit: 10,
        search: searchTerm,
      });

      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, searchTerm]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {searchSection}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Updated Pagination */}
      <div className="mt-8 py-2 flex items-center justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UsersList;
