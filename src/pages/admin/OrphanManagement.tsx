
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';

interface Orphan {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  location: string;
  guardianName: string;
  monthlyAllowance: number;
  status: 'Active' | 'Pending' | 'Inactive';
  registrationDate: string;
  lastPayment: string;
  schoolStatus: string;
  healthStatus: string;
}

const OrphanManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedOrphan, setSelectedOrphan] = useState<Orphan | null>(null);
  
  // Mock data - in real app, this would come from your Django backend
  const [orphans, setOrphans] = useState<Orphan[]>([
    {
      id: '1',
      name: 'Amina Hassan',
      age: 8,
      gender: 'Female',
      location: 'Kano State',
      guardianName: 'Fatima Hassan',
      monthlyAllowance: 30,
      status: 'Active',
      registrationDate: '2024-01-15',
      lastPayment: '2024-11-01',
      schoolStatus: 'Enrolled - Primary 3',
      healthStatus: 'Good'
    },
    {
      id: '2',
      name: 'Ibrahim Mohammed',
      age: 12,
      gender: 'Male',
      location: 'Jigawa State',
      guardianName: 'Aisha Mohammed',
      monthlyAllowance: 35,
      status: 'Active',
      registrationDate: '2024-02-20',
      lastPayment: '2024-11-01',
      schoolStatus: 'Enrolled - Primary 6',
      healthStatus: 'Good'
    },
    {
      id: '3',
      name: 'Zainab Usman',
      age: 6,
      gender: 'Female',
      location: 'Kano State',
      guardianName: 'Maryam Usman',
      monthlyAllowance: 30,
      status: 'Pending',
      registrationDate: '2024-11-10',
      lastPayment: 'N/A',
      schoolStatus: 'Not enrolled',
      healthStatus: 'Pending medical checkup'
    }
  ]);

  const [newOrphan, setNewOrphan] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    location: '',
    guardianName: '',
    monthlyAllowance: '',
    schoolStatus: '',
    healthStatus: ''
  });

  const filteredOrphans = orphans.filter(orphan =>
    orphan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orphan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orphan.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrphan = (e: React.FormEvent) => {
    e.preventDefault();
    const orphan: Orphan = {
      id: Date.now().toString(),
      name: newOrphan.name,
      age: parseInt(newOrphan.age),
      gender: newOrphan.gender,
      location: newOrphan.location,
      guardianName: newOrphan.guardianName,
      monthlyAllowance: parseInt(newOrphan.monthlyAllowance),
      status: 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
      lastPayment: 'N/A',
      schoolStatus: newOrphan.schoolStatus,
      healthStatus: newOrphan.healthStatus
    };

    setOrphans([...orphans, orphan]);
    setNewOrphan({
      name: '',
      age: '',
      gender: 'Male',
      location: '',
      guardianName: '',
      monthlyAllowance: '',
      schoolStatus: '',
      healthStatus: ''
    });
    setShowAddForm(false);
    toast({
      title: "Orphan Added",
      description: `${orphan.name} has been successfully registered.`,
    });
  };

  const updateOrphanStatus = (id: string, status: 'Active' | 'Pending' | 'Inactive') => {
    setOrphans(orphans.map(orphan =>
      orphan.id === id ? { ...orphan, status } : orphan
    ));
    toast({
      title: "Status Updated",
      description: "Orphan status has been updated successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title="Orphan Management" userRole="admin">
      <div className="space-y-6">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Orphan Management</h2>
            <p className="text-gray-600">Manage orphan records, allowances, and status updates</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-ngo-primary-500 hover:bg-ngo-primary-600"
          >
            Add New Orphan
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search by name, location, or guardian..."
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
              <div className="text-2xl font-bold text-green-600">
                {orphans.filter(o => o.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Cases</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {orphans.filter(o => o.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ngo-primary-600">
                €{orphans.filter(o => o.status === 'Active').reduce((sum, o) => sum + o.monthlyAllowance, 0)}
              </div>
              <div className="text-sm text-gray-600">Monthly Budget</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-700">
                {orphans.length}
              </div>
              <div className="text-sm text-gray-600">Total Registered</div>
            </CardContent>
          </Card>
        </div>

        {/* Orphan List */}
        <Card>
          <CardHeader>
            <CardTitle>Orphan Records ({filteredOrphans.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrphans.map((orphan) => (
                <div key={orphan.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{orphan.name}</h3>
                        <Badge className={getStatusColor(orphan.status)}>
                          {orphan.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>Age: {orphan.age} years ({orphan.gender})</div>
                        <div>Location: {orphan.location}</div>
                        <div>Guardian: {orphan.guardianName}</div>
                        <div>Allowance: €{orphan.monthlyAllowance}/month</div>
                        <div>School: {orphan.schoolStatus}</div>
                        <div>Health: {orphan.healthStatus}</div>
                        <div>Registered: {orphan.registrationDate}</div>
                        <div>Last Payment: {orphan.lastPayment}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedOrphan(orphan)}
                      >
                        View Details
                      </Button>
                      {orphan.status === 'Pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateOrphanStatus(orphan.id, 'Active')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                      )}
                      {orphan.status === 'Active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOrphanStatus(orphan.id, 'Inactive')}
                        >
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Orphan Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Orphan</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddOrphan} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <Input
                      value={newOrphan.name}
                      onChange={(e) => setNewOrphan({...newOrphan, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <Input
                      type="number"
                      value={newOrphan.age}
                      onChange={(e) => setNewOrphan({...newOrphan, age: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select 
                      value={newOrphan.gender}
                      onChange={(e) => setNewOrphan({...newOrphan, gender: e.target.value as 'Male' | 'Female'})}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <Input
                      value={newOrphan.location}
                      onChange={(e) => setNewOrphan({...newOrphan, location: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name *</label>
                    <Input
                      value={newOrphan.guardianName}
                      onChange={(e) => setNewOrphan({...newOrphan, guardianName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Allowance (€) *</label>
                    <Input
                      type="number"
                      value={newOrphan.monthlyAllowance}
                      onChange={(e) => setNewOrphan({...newOrphan, monthlyAllowance: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Status</label>
                    <Input
                      value={newOrphan.schoolStatus}
                      onChange={(e) => setNewOrphan({...newOrphan, schoolStatus: e.target.value})}
                      placeholder="e.g., Enrolled - Primary 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
                    <Input
                      value={newOrphan.healthStatus}
                      onChange={(e) => setNewOrphan({...newOrphan, healthStatus: e.target.value})}
                      placeholder="e.g., Good, Needs medical attention"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-ngo-primary-500 hover:bg-ngo-primary-600">
                    Add Orphan
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Orphan Details Modal */}
        {selectedOrphan && (
          <Card>
            <CardHeader>
              <CardTitle>Orphan Details - {selectedOrphan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div><strong>Name:</strong> {selectedOrphan.name}</div>
                  <div><strong>Age:</strong> {selectedOrphan.age} years</div>
                  <div><strong>Gender:</strong> {selectedOrphan.gender}</div>
                  <div><strong>Location:</strong> {selectedOrphan.location}</div>
                  <div><strong>Guardian:</strong> {selectedOrphan.guardianName}</div>
                </div>
                <div className="space-y-2">
                  <div><strong>Monthly Allowance:</strong> €{selectedOrphan.monthlyAllowance}</div>
                  <div><strong>Status:</strong> <Badge className={getStatusColor(selectedOrphan.status)}>{selectedOrphan.status}</Badge></div>
                  <div><strong>Registration Date:</strong> {selectedOrphan.registrationDate}</div>
                  <div><strong>Last Payment:</strong> {selectedOrphan.lastPayment}</div>
                  <div><strong>School Status:</strong> {selectedOrphan.schoolStatus}</div>
                  <div><strong>Health Status:</strong> {selectedOrphan.healthStatus}</div>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button onClick={() => setSelectedOrphan(null)}>Close</Button>
                <Button variant="outline">Edit Details</Button>
                <Button variant="outline">Print Record</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrphanManagement;
