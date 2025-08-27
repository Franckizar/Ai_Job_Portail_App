// ```typescriptreact
'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/Job_portail/Dashboard/ui/button';
import { Input } from '../../../components/Job_portail/Dashboard/ui/input';
import { Select } from '../../../components/Job_portail/Dashboard/ui/select';
import { UserModal } from '../../../components/Job_portail/Dashboard/ui/UserModal';
import { DeleteConfirmationModal } from '../../../components/Job_portail/Dashboard/ui/DeleteConfirmationModal';
import { fetchUsers } from '../../../components/Job_portail/Dashboard/ui/services/userService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const Badge = ({ variant = 'primary', children }: { 
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger', 
  children: React.ReactNode 
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const usersFromApi = await fetchUsers();
        setUsers(usersFromApi);
        setFilteredUsers(usersFromApi);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (searchTerm) {
      result = result.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedRole !== 'all') {
      result = result.filter(u => u.role === selectedRole);
    }
    setFilteredUsers(result);
  }, [searchTerm, selectedRole, users]);

  const handleEdit = (user: User) => { 
    setCurrentUser(user); 
    setIsModalOpen(true); 
  };

  const handleDelete = (user: User) => { 
    setCurrentUser(user); 
    setIsDeleteConfirmOpen(true); 
  };

  const handleSave = (userData: User) => {
    if (currentUser) {
      setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...userData } : u));
    } else {
      const newUser = { ...userData, id: users.length + 1 };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false); 
    setCurrentUser(null);
  };

  const confirmDelete = () => {
    if (!currentUser) return;
    setUsers(users.filter(u => u.id !== currentUser.id));
    setIsDeleteConfirmOpen(false); 
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const uniqueRoles = Array.from(new Set(users.map(u => u.role)));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <Button 
              onClick={() => { 
                setCurrentUser(null); 
                setIsModalOpen(true); 
              }}
              className="w-full sm:w-auto px-6 py-2 text-base"
            >
              Add New User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <Input 
                id="search"
                placeholder="Search by name or email..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-base py-2.5"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <Select 
                id="role"
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)} 
                options={[
                  { value: 'all', label: 'All Roles' }, 
                  ...uniqueRoles.map(r => ({ value: r, label: r }))
                ]}
                className="w-full text-base py-2.5"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, index) => (
                    <tr key={u.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-25' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={
                          u.role === 'ADMIN' ? 'primary' : 
                          u.role === 'TECHNICIAN' ? 'secondary' : 
                          'warning'
                        }>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={u.active ? 'success' : 'danger'}>
                          {u.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                        <div className="flex space-x-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(u)}
                            className="px-4 py-1.5 hover:bg-gray-100"
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDelete(u)}
                            className="px-4 py-1.5 hover:bg-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-base text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => { 
          setIsModalOpen(false); 
          setCurrentUser(null); 
        }} 
        user={currentUser} 
        roles={uniqueRoles.map(r => ({ id: r, name: r, permissions: [] }))} 
        onSave={handleSave} 
      />
      
      <DeleteConfirmationModal 
        isOpen={isDeleteConfirmOpen} 
        onClose={() => setIsDeleteConfirmOpen(false)} 
        onConfirm={confirmDelete} 
        userName={currentUser?.name || ''} 
      />
    </div>
  );
}
// ```