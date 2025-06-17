
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'coordinator' | 'staff';
  isActive: boolean;
  lastLogin: string;
  createdDate: string;
  permissions: string[];
  assignedRegions: string[];
}

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Mock data - in real app, this would come from your Django backend
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@betulabla.org',
      role: 'admin',
      isActive: true,
      lastLogin: '2024-11-15 14:30',
      createdDate: '2024-01-01',
      permissions: ['all'],
      assignedRegions: ['All Regions']
    },
    {
      id: '2',
      username: 'coordinator1',
      fullName: 'Ibrahim Mohammed',
      email: 'ibrahim@betulabla.org',
      role: 'coordinator',
      isActive: true,
      lastLogin: '2024-11-15 09:15',
      createdDate: '2024-02-15',
      permissions: ['orphan_management', 'borehole_management', 'reports'],
      assignedRegions: ['Kano State', 'Jigawa State']
    },
    {
      id: '3',
      username: 'coordinator2',
      fullName: 'Fatima Usman',
      email: 'fatima@betulabla.org',
      role: 'coordinator',
      isActive: true,
      lastLogin: '2024-11-14 16:45',
      createdDate: '2024-03-01',
      permissions: ['orphan_management', 'borehole_management', 'reports'],
      assignedRegions: ['Katsina State']
    },
    {
      id: '4',
      username: 'staff1',
      fullName: 'Ahmed Hassan',
      email: 'ahmed@betulabla.org',
      role: 'staff',
      isActive: true,
      lastLogin: '2024-11-15 11:20',
      createdDate: '2024-04-10',
      permissions: ['reports', 'print_records'],
      assignedRegions: ['Kano State']
    },
    {
      id: '5',
      username: 'staff2',
      fullName: 'Maryam Ibrahim',
      email: 'maryam@betulabla.org',
      role: 'staff',
      isActive: false,
      lastLogin: '2024-10-28 13:10',
      createdDate: '2024-05-20',
      permissions: ['reports', 'export_data'],
      assignedRegions: ['Jigawa State']
    }
  ]);

  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'staff' as 'admin' | 'coordinator' | 'staff',
    assignedRegions: [] as string[],
    permissions: [] as string[]
  });

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      isActive: true,
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0],
      permissions: newUser.permissions,
      assignedRegions: newUser.assignedRegions
    };

    setUsers([...users, user]);
    setNewUser({
      username: '',
      fullName: '',
      email: '',
      role: 'staff',
      assignedRegions: [],
      permissions: []
    });
    setShowAddForm(false);
    toast({
      title: "User Added",
      description: `${user.fullName} has been successfully added to the system.`,
    });
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
    const user = users.find(u => u.id === id);
    toast({
      title: "User Status Updated",
      description: `${user?.fullName} has been ${user?.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const resetPassword = (id: string) => {
    const user = users.find(u => u.id === id);
    toast({
      title: "Password Reset",
      description: `Password reset link sent to ${user?.email}`,
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'coordinator': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const availablePermissions = [
    'orphan_management',
    'borehole_management', 
    'user_management',
    'reports',
    'print_records',
    'export_data'
  ];

  const availableRegions = [
    'Kano State',
    'Jigawa State',
    'Katsina State',
    'Kaduna State'
  ];

  return (
    <DashboardLayout title="User Management" userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-ngo-primary-500 hover:bg-ngo-primary-600"
          >
            Add New User
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search by username, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm text-gray-600">Administrators</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'coordinator').length}
              </div>
              <div className="text-sm text-gray-600">Coordinators</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.role === 'staff').length}
              </div>
              <div className="text-sm text-gray-600">Staff Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ngo-primary-600">
                {users.filter(u => u.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle>System Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                        <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div><strong>Username:</strong> {user.username}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Last Login:</strong> {user.lastLogin}</div>
                        <div><strong>Created:</strong> {user.createdDate}</div>
                        <div><strong>Regions:</strong> {user.assignedRegions.join(', ')}</div>
                        <div><strong>Permissions:</strong> {user.permissions.join(', ')}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resetPassword(user.id)}
                      >
                        Reset Password
                      </Button>
                      <Button 
                        size="sm" 
                        variant={user.isActive ? "destructive" : "default"}
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add User Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                    <Input
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <Input
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'coordinator' | 'staff'})}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="staff">Staff</option>
                      <option value="coordinator">Coordinator</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Regions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableRegions.map((region) => (
                      <label key={region} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newUser.assignedRegions.includes(region)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewUser({...newUser, assignedRegions: [...newUser.assignedRegions, region]});
                            } else {
                              setNewUser({...newUser, assignedRegions: newUser.assignedRegions.filter(r => r !== region)});
                            }
                          }}
                          className="mr-2"
                        />
                        {region}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePermissions.map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newUser.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewUser({...newUser, permissions: [...newUser.permissions, permission]});
                            } else {
                              setNewUser({...newUser, permissions: newUser.permissions.filter(p => p !== permission)});
                            }
                          }}
                          className="mr-2"
                        />
                        {permission.replace('_', ' ')}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-ngo-primary-500 hover:bg-ngo-primary-600">
                    Add User
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <Card>
            <CardHeader>
              <CardTitle>User Details - {selectedUser.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div><strong>Full Name:</strong> {selectedUser.fullName}</div>
                  <div><strong>Username:</strong> {selectedUser.username}</div>
                  <div><strong>Email:</strong> {selectedUser.email}</div>
                  <div><strong>Role:</strong> <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role}</Badge></div>
                  <div><strong>Status:</strong> <Badge className={selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{selectedUser.isActive ? 'Active' : 'Inactive'}</Badge></div>
                </div>
                <div className="space-y-2">
                  <div><strong>Created Date:</strong> {selectedUser.createdDate}</div>
                  <div><strong>Last Login:</strong> {selectedUser.lastLogin}</div>
                  <div><strong>Assigned Regions:</strong> {selectedUser.assignedRegions.join(', ')}</div>
                  <div><strong>Permissions:</strong> {selectedUser.permissions.join(', ')}</div>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button onClick={() => setSelectedUser(null)}>Close</Button>
                <Button variant="outline">Edit User</Button>
                <Button variant="outline" onClick={() => resetPassword(selectedUser.id)}>Reset Password</Button>
                <Button 
                  variant={selectedUser.isActive ? "destructive" : "default"}
                  onClick={() => {
                    toggleUserStatus(selectedUser.id);
                    setSelectedUser(null);
                  }}
                >
                  {selectedUser.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
