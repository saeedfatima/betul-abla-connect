
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import AddOrphanForm from '../../components/AddOrphanForm';
import EditOrphanForm from '../../components/EditOrphanForm';

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
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedOrphan, setSelectedOrphan] = useState<Orphan | null>(null);
  const [editingOrphan, setEditingOrphan] = useState<Orphan | null>(null);
  
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

  const filteredOrphans = orphans.filter(orphan =>
    orphan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orphan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orphan.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrphan = (orphanData: any) => {
    setOrphans([...orphans, orphanData]);
    setShowAddForm(false);
    toast({
      title: "Orphan Added",
      description: `${orphanData.name} has been successfully registered.`,
    });
  };

  const handleEditOrphan = (orphanData: any) => {
    setOrphans(orphans.map(orphan => 
      orphan.id === orphanData.id ? orphanData : orphan
    ));
    setShowEditForm(false);
    setEditingOrphan(null);
    toast({
      title: "Orphan Updated",
      description: `${orphanData.name} has been successfully updated.`,
    });
  };

  const handleDeleteOrphan = (orphanId: string) => {
    const orphanToDelete = orphans.find(o => o.id === orphanId);
    if (window.confirm(`Are you sure you want to delete ${orphanToDelete?.name}? This action cannot be undone.`)) {
      setOrphans(orphans.filter(orphan => orphan.id !== orphanId));
      toast({
        title: "Orphan Deleted",
        description: `${orphanToDelete?.name} has been removed from the system.`,
        variant: "destructive"
      });
    }
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

        {/* Add Orphan Form */}
        {showAddForm && (
          <AddOrphanForm 
            onSubmit={handleAddOrphan}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Edit Orphan Form */}
        {showEditForm && editingOrphan && (
          <EditOrphanForm 
            orphan={editingOrphan}
            onSubmit={handleEditOrphan}
            onCancel={() => {
              setShowEditForm(false);
              setEditingOrphan(null);
            }}
          />
        )}

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
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedOrphan(orphan)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingOrphan(orphan);
                          setShowEditForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteOrphan(orphan.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
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
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingOrphan(selectedOrphan);
                    setShowEditForm(true);
                    setSelectedOrphan(null);
                  }}
                >
                  Edit Details
                </Button>
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
