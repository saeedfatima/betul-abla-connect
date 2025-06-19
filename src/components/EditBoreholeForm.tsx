
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EditBoreholeFormProps {
  borehole: any;
  onSubmit: (boreholeData: any) => void;
  onCancel: () => void;
}

const EditBoreholeForm: React.FC<EditBoreholeFormProps> = ({ borehole, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    projectCode: borehole.projectCode,
    location: borehole.location,
    community: borehole.community,
    status: borehole.status,
    depth: borehole.depth.toString(),
    waterQuality: borehole.waterQuality,
    constructionDate: borehole.constructionDate,
    lastMaintenance: borehole.lastMaintenance,
    beneficiaries: borehole.beneficiaries.toString(),
    contractor: borehole.contractor,
    cost: borehole.cost.toString(),
    coordinates: borehole.coordinates,
    notes: borehole.notes
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectCode || !formData.location || !formData.community || !formData.beneficiaries || !formData.cost) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const boreholeData = {
      ...borehole,
      projectCode: formData.projectCode,
      location: formData.location,
      community: formData.community,
      status: formData.status,
      depth: parseInt(formData.depth) || 0,
      waterQuality: formData.waterQuality,
      constructionDate: formData.constructionDate,
      lastMaintenance: formData.lastMaintenance,
      beneficiaries: parseInt(formData.beneficiaries),
      contractor: formData.contractor,
      cost: parseFloat(formData.cost),
      coordinates: formData.coordinates,
      notes: formData.notes
    };

    onSubmit(boreholeData);
  };

  const statusOptions = ['Planning', 'In Progress', 'Completed', 'Maintenance', 'Inactive'];
  const waterQualityOptions = ['Excellent', 'Good', 'Fair', 'Poor', 'Not Tested'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Borehole - {borehole.projectCode}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Code *</label>
              <Input
                value={formData.projectCode}
                onChange={(e) => setFormData({...formData, projectCode: e.target.value})}
                placeholder="e.g., BH-2024-001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Kano State - Ungwar Rimi"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Community *</label>
              <Input
                value={formData.community}
                onChange={(e) => setFormData({...formData, community: e.target.value})}
                placeholder="e.g., Ungwar Rimi Community"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Depth (meters)</label>
              <Input
                type="number"
                value={formData.depth}
                onChange={(e) => setFormData({...formData, depth: e.target.value})}
                placeholder="e.g., 45"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water Quality</label>
              <select 
                value={formData.waterQuality}
                onChange={(e) => setFormData({...formData, waterQuality: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                {waterQualityOptions.map((quality) => (
                  <option key={quality} value={quality}>{quality}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Construction Date</label>
              <Input
                type="date"
                value={formData.constructionDate}
                onChange={(e) => setFormData({...formData, constructionDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance</label>
              <Input
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiaries *</label>
              <Input
                type="number"
                value={formData.beneficiaries}
                onChange={(e) => setFormData({...formData, beneficiaries: e.target.value})}
                placeholder="e.g., 350"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contractor</label>
              <Input
                value={formData.contractor}
                onChange={(e) => setFormData({...formData, contractor: e.target.value})}
                placeholder="e.g., Northern Drilling Co."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost (€) *</label>
              <Input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                placeholder="e.g., 3500"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
              <Input
                value={formData.coordinates}
                onChange={(e) => setFormData({...formData, coordinates: e.target.value})}
                placeholder="e.g., 11.9834°N, 8.5213°E"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes about this project..."
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-ngo-primary-500 hover:bg-ngo-primary-600">
              Update Borehole
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditBoreholeForm;
