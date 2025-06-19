
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AddBoreholeFormProps {
  onSubmit: (boreholeData: any) => void;
  onCancel: () => void;
}

const AddBoreholeForm: React.FC<AddBoreholeFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectCode || !formData.location || !formData.community || !formData.cost || !formData.beneficiaries) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const boreholeData = {
      id: Date.now().toString(),
      projectCode: formData.projectCode,
      location: formData.location,
      community: formData.community,
      status: 'Planning' as const,
      depth: parseInt(formData.depth) || 0,
      waterQuality: 'Not Tested' as const,
      constructionDate: 'TBD',
      lastMaintenance: 'N/A',
      beneficiaries: parseInt(formData.beneficiaries),
      contractor: formData.contractor || 'TBD',
      cost: parseInt(formData.cost),
      coordinates: formData.coordinates,
      notes: formData.notes
    };

    onSubmit(boreholeData);
    
    // Reset form
    setFormData({
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Borehole Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Code *</label>
              <Input
                value={formData.projectCode}
                onChange={(e) => setFormData({...formData, projectCode: e.target.value})}
                placeholder="e.g., BH-2024-004"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Kano State - Tudun Wada"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Community *</label>
              <Input
                value={formData.community}
                onChange={(e) => setFormData({...formData, community: e.target.value})}
                placeholder="e.g., Tudun Wada Community"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Depth (meters)</label>
              <Input
                type="number"
                value={formData.depth}
                onChange={(e) => setFormData({...formData, depth: e.target.value})}
                placeholder="e.g., 45"
                min="1"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (€) *</label>
              <Input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                placeholder="e.g., 3500"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Beneficiaries *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
              <Input
                value={formData.coordinates}
                onChange={(e) => setFormData({...formData, coordinates: e.target.value})}
                placeholder="e.g., 11.9834°N, 8.5213°E"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional project details, site conditions, special requirements..."
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-ngo-primary-500 hover:bg-ngo-primary-600">
              Create Project
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

export default AddBoreholeForm;
