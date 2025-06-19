
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import AddBoreholeForm from '../../components/AddBoreholeForm';
import EditBoreholeForm from '../../components/EditBoreholeForm';
import { useBoreholes } from '../../hooks/useBoreholes';

const BoreholeManagement = () => {
  const { boreholes, loading, addBorehole, updateBorehole, deleteBorehole } = useBoreholes();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedBorehole, setSelectedBorehole] = useState<any>(null);
  const [editingBorehole, setEditingBorehole] = useState<any>(null);

  const filteredBoreholes = boreholes.filter(borehole =>
    borehole.project_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borehole.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borehole.community.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBorehole = async (boreholeData: any) => {
    const success = await addBorehole(boreholeData);
    if (success) {
      setShowAddForm(false);
    }
  };

  const handleEditBorehole = async (boreholeData: any) => {
    const success = await updateBorehole(boreholeData.id, boreholeData);
    if (success) {
      setShowEditForm(false);
      setEditingBorehole(null);
    }
  };

  const handleDeleteBorehole = async (boreholeId: string) => {
    const boreholeToDelete = boreholes.find(b => b.id === boreholeId);
    if (window.confirm(`Are you sure you want to delete project ${boreholeToDelete?.project_code}? This action cannot be undone.`)) {
      await deleteBorehole(boreholeId);
    }
  };

  const updateBoreholeStatus = async (id: string, status: 'Planning' | 'In Progress' | 'Completed' | 'Maintenance' | 'Inactive') => {
    await updateBorehole(id, { status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance': return 'bg-orange-100 text-orange-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWaterQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Borehole Management" userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ngo-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Borehole Management" userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Borehole Management</h2>
            <p className="text-gray-600">Manage borehole projects, maintenance, and monitoring</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-ngo-primary-500 hover:bg-ngo-primary-600"
          >
            Add New Project
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search by project code, location, or community..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {boreholes.filter(b => b.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {boreholes.filter(b => b.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {boreholes.filter(b => b.status === 'Planning').length}
              </div>
              <div className="text-sm text-gray-600">Planning</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ngo-primary-600">
                {boreholes.reduce((sum, b) => sum + b.beneficiaries, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Beneficiaries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-700">
                €{boreholes.reduce((sum, b) => sum + b.cost, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Investment</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Borehole Form */}
        {showAddForm && (
          <AddBoreholeForm 
            onSubmit={handleAddBorehole}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Edit Borehole Form */}
        {showEditForm && editingBorehole && (
          <EditBoreholeForm 
            borehole={editingBorehole}
            onSubmit={handleEditBorehole}
            onCancel={() => {
              setShowEditForm(false);
              setEditingBorehole(null);
            }}
          />
        )}

        {/* Borehole List */}
        <Card>
          <CardHeader>
            <CardTitle>Borehole Projects ({filteredBoreholes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBoreholes.map((borehole) => (
                <div key={borehole.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{borehole.project_code}</h3>
                        <Badge className={getStatusColor(borehole.status)}>
                          {borehole.status}
                        </Badge>
                        {borehole.water_quality !== 'Not Tested' && (
                          <Badge className={getWaterQualityColor(borehole.water_quality)}>
                            {borehole.water_quality} Water
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div><strong>Location:</strong> {borehole.location}</div>
                        <div><strong>Community:</strong> {borehole.community}</div>
                        <div><strong>Depth:</strong> {borehole.depth > 0 ? `${borehole.depth}m` : 'TBD'}</div>
                        <div><strong>Beneficiaries:</strong> {borehole.beneficiaries.toLocaleString()}</div>
                        <div><strong>Contractor:</strong> {borehole.contractor}</div>
                        <div><strong>Cost:</strong> €{borehole.cost.toLocaleString()}</div>
                        <div><strong>Construction:</strong> {borehole.construction_date || 'TBD'}</div>
                        <div><strong>Last Maintenance:</strong> {borehole.last_maintenance || 'N/A'}</div>
                      </div>
                      {borehole.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Notes:</strong> {borehole.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedBorehole(borehole)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingBorehole(borehole);
                          setShowEditForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteBorehole(borehole.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                      {borehole.status === 'Planning' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateBoreholeStatus(borehole.id, 'In Progress')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start Construction
                        </Button>
                      )}
                      {borehole.status === 'In Progress' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateBoreholeStatus(borehole.id, 'Completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Complete
                        </Button>
                      )}
                      {borehole.status === 'Completed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateBoreholeStatus(borehole.id, 'Maintenance')}
                        >
                          Schedule Maintenance
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Borehole Details Modal */}
        {selectedBorehole && (
          <Card>
            <CardHeader>
              <CardTitle>Project Details - {selectedBorehole.project_code}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div><strong>Project Code:</strong> {selectedBorehole.project_code}</div>
                  <div><strong>Location:</strong> {selectedBorehole.location}</div>
                  <div><strong>Community:</strong> {selectedBorehole.community}</div>
                  <div><strong>Status:</strong> <Badge className={getStatusColor(selectedBorehole.status)}>{selectedBorehole.status}</Badge></div>
                  <div><strong>Depth:</strong> {selectedBorehole.depth > 0 ? `${selectedBorehole.depth}m` : 'TBD'}</div>
                  <div><strong>Water Quality:</strong> <Badge className={getWaterQualityColor(selectedBorehole.water_quality)}>{selectedBorehole.water_quality}</Badge></div>
                </div>
                <div className="space-y-2">
                  <div><strong>Construction Date:</strong> {selectedBorehole.construction_date || 'TBD'}</div>
                  <div><strong>Last Maintenance:</strong> {selectedBorehole.last_maintenance || 'N/A'}</div>
                  <div><strong>Beneficiaries:</strong> {selectedBorehole.beneficiaries.toLocaleString()}</div>
                  <div><strong>Contractor:</strong> {selectedBorehole.contractor}</div>
                  <div><strong>Cost:</strong> €{selectedBorehole.cost.toLocaleString()}</div>
                  <div><strong>Coordinates:</strong> {selectedBorehole.coordinates}</div>
                </div>
              </div>
              {selectedBorehole.notes && (
                <div className="mt-4">
                  <strong>Notes:</strong>
                  <p className="mt-1 text-gray-600">{selectedBorehole.notes}</p>
                </div>
              )}
              <div className="mt-6 flex gap-2">
                <Button onClick={() => setSelectedBorehole(null)}>Close</Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingBorehole(selectedBorehole);
                    setShowEditForm(true);
                    setSelectedBorehole(null);
                  }}
                >
                  Edit Project
                </Button>
                <Button variant="outline">Print Report</Button>
                <Button variant="outline">Export Data</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BoreholeManagement;
