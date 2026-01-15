// =====================================================
// ADMIN USERS PAGE
// Migrated from: PHP admin_users.php
// =====================================================

import { useEffect, useState } from 'react';
import { Loader2, Shield, Trash2, UserCheck, UserX } from 'lucide-react';
import { api } from '../../services';
import { User } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (id: number) => {
    if (id === currentUser?.id) {
      toast.error("You cannot change your own role");
      return;
    }

    try {
      await api.patch(`/users/${id}/toggle-role`);
      toast.success('User role updated');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDelete = async (id: number) => {
    if (id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="h-full overflow-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Users</h1>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-600/50">
                    <td className="px-6 py-4 text-gray-400">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{user.fullname}</span>
                        {user.id === currentUser?.id && (
                          <span className="badge badge-info text-xs">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${user.role === 'ADMIN' ? 'badge-info' : 'badge-success'}`}>
                        {user.role === 'ADMIN' ? (
                          <Shield className="w-3 h-3 mr-1" />
                        ) : null}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleRole(user.id)}
                          disabled={user.id === currentUser?.id}
                          className={`p-2 rounded-lg transition-colors ${
                            user.id === currentUser?.id
                              ? 'text-gray-600 cursor-not-allowed'
                              : user.role === 'ADMIN'
                              ? 'text-blue-400 hover:bg-blue-400/10'
                              : 'text-gray-400 hover:text-blue-400 hover:bg-dark-600'
                          }`}
                          title={user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                        >
                          {user.role === 'ADMIN' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={user.id === currentUser?.id}
                          className={`p-2 rounded-lg transition-colors ${
                            user.id === currentUser?.id
                              ? 'text-gray-600 cursor-not-allowed'
                              : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                          }`}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
