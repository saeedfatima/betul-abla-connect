
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import AddOrphanForm from '../../components/AddOrphanForm';
import EditOrphanForm from '../../components/EditOrphanForm';
import { useOrphans } from '../../hooks/useOrphans';

const OrphanManagement = () => {
  const { orphans, loading, addOrphan, updateOrphan, deleteOrphan } = useOrphans();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedOrphan, setSelectedOrphan] = useState<any>(null);
  const [editingOrphan, setEditingOrphan] = useState<any>(null);

  const filteredOrphans = orphans.filter(orphan =>
    orphan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orphan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orphan.guardian_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrphan = async (orphanData: any) => {
    const success = await addOrphan(orphanData);
    if (success) {
      setShowAddForm(false);
    }
  };

  const handleEditOrphan = async (orphanData: any) => {
    const success = await updateOrphan(orphanData.id, orphanData);
    if (success) {
      setShowEditForm(false);
      setEditingOrphan(null);
    }
  };

  const handleDeleteOrphan = async (orphanId: string) => {
    const orphanToDelete = orphans.find(o => o.id === orphanId);
    if (window.confirm(`Are you sure you want to delete ${orphanToDelete?.name}? This action cannot be undone.`)) {
      await deleteOrphan(orphanId);
    }
  };

  const updateOrphanStatus = async (id: string, status: 'Active' | 'Pending' | 'Inactive') => {
    await updateOrphan(id, { status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Orphan Management" userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ngo-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

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
                €{orphans.filter(o => o.status === 'Active').reduce((sum, o) => sum + o.monthly_allowance, 0)}
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
                        <div>Guardian: {orphan.guardian_name}</div>
                        <div>Allowance: €{orphan.monthly_allowance}/month</div>
                        <div>School: {orphan.school_status}</div>
                        <div>Health: {orphan.health_status}</div>
                        <div>Registered: {orphan.registration_date}</div>
                        <div>Last Payment: {orphan.last_payment || 'N/A'}</div>
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
                  <div><strong>Guardian:</strong> {selectedOrphan.guardian_name}</div>
                </div>
                <div className="space-y-2">
                  <div><strong>Monthly Allowance:</strong> €{selectedOrphan.monthly_allowance}</div>
                  <div><strong>Status:</strong> <Badge className={getStatusColor(selectedOrphan.status)}>{selectedOrphan.status}</Badge></div>
                  <div><strong>Registration Date:</strong> {selectedOrphan.registration_date}</div>
                  <div><strong>Last Payment:</strong> {selectedOrphan.last_payment || 'N/A'}</div>
                  <div><strong>School Status:</strong> {selectedOrphan.school_status}</div>
                  <div><strong>Health Status:</strong> {selectedOrphan.health_status}</div>
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
