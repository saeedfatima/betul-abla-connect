
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';

interface Borehole {
  id: string;
  projectCode: string;
  location: string;
  community: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'Maintenance' | 'Inactive';
  depth: number;
  waterQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Not Tested';
  constructionDate: string;
  lastMaintenance: string;
  beneficiaries: number;
  contractor: string;
  cost: number;
  coordinates: string;
  notes: string;
}

const BoreholeManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBorehole, setSelectedBorehole] = useState<Borehole | null>(null);
  
  // Mock data - in real app, this would come from your Django backend
  const [boreholes, setBoreholes] = useState<Borehole[]>([
    {
      id: '1',
      projectCode: 'BH-2024-001',
      location: 'Kano State - Ungwar Rimi',
      community: 'Ungwar Rimi Community',
      status: 'Completed',
      depth: 45,
      waterQuality: 'Good',
      constructionDate: '2024-03-15',
      lastMaintenance: '2024-10-01',
      beneficiaries: 350,
      contractor: 'Northern Drilling Co.',
      cost: 3500,
      coordinates: '11.9834°N, 8.5213°E',
      notes: 'Solar pump installed. Community trained on maintenance.'
    },
    {
      id: '2',
      projectCode: 'BH-2024-002',
      location: 'Jigawa State - Kafin Hausa',
      community: 'Kafin Hausa Village',
      status: 'In Progress',
      depth: 38,
      waterQuality: 'Not Tested',
      constructionDate: '2024-11-01',
      lastMaintenance: 'N/A',
      beneficiaries: 280,
      contractor: 'Reliable Water Solutions',
      cost: 3200,
      coordinates: '12.4567°N, 9.1234°E',
      notes: 'Construction 80% complete. Pump installation pending.'
    },
    {
      id: '3',
      projectCode: 'BH-2024-003',
      location: 'Kano State - Dorayi',
      community: 'Dorayi Community',
      status: 'Planning',
      depth: 0,
      waterQuality: 'Not Tested',
      constructionDate: 'TBD',
      lastMaintenance: 'N/A',
      beneficiaries: 420,
      contractor: 'TBD',
      cost: 3800,
      coordinates: '11.8901°N, 8.4567°E',
      notes: 'Site survey completed. Awaiting contractor selection.'
    }
  ]);

  const [newBorehole, setNewBorehole] = useState({
    projectCode: '',
    location: '',
    community: '',
    depth: '',
    contractor: '',
    cost: '',
    beneficiaries: '',
    coordinates: '',
    notes: ''
  });

  const filteredBoreholes = boreholes.filter(borehole =>
    borehole.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borehole.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borehole.community.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBorehole = (e: React.FormEvent) => {
    e.preventDefault();
    const borehole: Borehole = {
      id: Date.now().toString(),
      projectCode: newBorehole.projectCode,
      location: newBorehole.location,
      community: newBorehole.community,
      status: 'Planning',
      depth: parseInt(newBorehole.depth) || 0,
      waterQuality: 'Not Tested',
      constructionDate: 'TBD',
      lastMaintenance: 'N/A',
      beneficiaries: parseInt(newBorehole.beneficiaries) || 0,
      contractor: newBorehole.contractor || 'TBD',
      cost: parseInt(newBorehole.cost) || 0,
      coordinates: newBorehole.coordinates,
      notes: newBorehole.notes
    };

    setBoreholes([...boreholes, borehole]);
    setNewBorehole({
      projectCode: '',
      location: '',
      community: '',
      depth: '',
      contractor: '',
      cost: '',
      beneficiaries: '',
      coordinates: '',
      notes: ''
    });
    setShowAddForm(false);
    toast({
      title: "Borehole Project Added",
      description: `Project ${borehole.projectCode} has been successfully created.`,
    });
  };

  const updateBoreholeStatus = (id: string, status: Borehole['status']) => {
    setBoreholes(boreholes.map(borehole =>
      borehole.id === id ? { ...borehole, status } : borehole
    ));
    toast({
      title: "Status Updated",
      description: "Borehole status has been updated successfully.",
    });
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
                        <h3 className="text-lg font-semibold text-gray-900">{borehole.projectCode}</h3>
                        <Badge className={getStatusColor(borehole.status)}>
                          {borehole.status}
                        </Badge>
                        {borehole.waterQuality !== 'Not Tested' && (
                          <Badge className={getWaterQualityColor(borehole.waterQuality)}>
                            {borehole.waterQuality} Water
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
                        <div><strong>Construction:</strong> {borehole.constructionDate}</div>
                        <div><strong>Last Maintenance:</strong> {borehole.lastMaintenance}</div>
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
                        View Details
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

        {/* Add Borehole Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Borehole Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBorehole} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Code *</label>
                    <Input
                      value={newBorehole.projectCode}
                      onChange={(e) => setNewBorehole({...newBorehole, projectCode: e.target.value})}
                      placeholder="e.g., BH-2024-004"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <Input
                      value={newBorehole.location}
                      onChange={(e) => setNewBorehole({...newBorehole, location: e.target.value})}
                      placeholder="e.g., Kano State - Tudun Wada"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Community *</label>
                    <Input
                      value={newBorehole.community}
                      onChange={(e) => setNewBorehole({...newBorehole, community: e.target.value})}
                      placeholder="e.g., Tudun Wada Community"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Depth (meters)</label>
                    <Input
                      type="number"
                      value={newBorehole.depth}
                      onChange={(e) => setNewBorehole({...newBorehole, depth: e.target.value})}
                      placeholder="e.g., 45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contractor</label>
                    <Input
                      value={newBorehole.contractor}
                      onChange={(e) => setNewBorehole({...newBorehole, contractor: e.target.value})}
                      placeholder="e.g., Northern Drilling Co."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget (€) *</label>
                    <Input
                      type="number"
                      value={newBorehole.cost}
                      onChange={(e) => setNewBorehole({...newBorehole, cost: e.target.value})}
                      placeholder="e.g., 3500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Beneficiaries *</label>
                    <Input
                      type="number"
                      value={newBorehole.beneficiaries}
                      onChange={(e) => setNewBorehole({...newBorehole, beneficiaries: e.target.value})}
                      placeholder="e.g., 350"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                    <Input
                      value={newBorehole.coordinates}
                      onChange={(e) => setNewBorehole({...newBorehole, coordinates: e.target.value})}
                      placeholder="e.g., 11.9834°N, 8.5213°E"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Notes</label>
                  <Textarea
                    value={newBorehole.notes}
                    onChange={(e) => setNewBorehole({...newBorehole, notes: e.target.value})}
                    placeholder="Additional project details, site conditions, special requirements..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-ngo-primary-500 hover:bg-ngo-primary-600">
                    Create Project
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Borehole Details Modal */}
        {selectedBorehole && (
          <Card>
            <CardHeader>
              <CardTitle>Project Details - {selectedBorehole.projectCode}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div><strong>Project Code:</strong> {selectedBorehole.projectCode}</div>
                  <div><strong>Location:</strong> {selectedBorehole.location}</div>
                  <div><strong>Community:</strong> {selectedBorehole.community}</div>
                  <div><strong>Status:</strong> <Badge className={getStatusColor(selectedBorehole.status)}>{selectedBorehole.status}</Badge></div>
                  <div><strong>Depth:</strong> {selectedBorehole.depth > 0 ? `${selectedBorehole.depth}m` : 'TBD'}</div>
                  <div><strong>Water Quality:</strong> <Badge className={getWaterQualityColor(selectedBorehole.waterQuality)}>{selectedBorehole.waterQuality}</Badge></div>
                </div>
                <div className="space-y-2">
                  <div><strong>Construction Date:</strong> {selectedBorehole.constructionDate}</div>
                  <div><strong>Last Maintenance:</strong> {selectedBorehole.lastMaintenance}</div>
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
                <Button variant="outline">Edit Project</Button>
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
