
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AddOrphanFormProps {
  onSubmit: (orphanData: any) => void;
  onCancel: () => void;
}

const AddOrphanForm: React.FC<AddOrphanFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    location: '',
    guardianName: '',
    monthlyAllowance: '',
    schoolStatus: '',
    healthStatus: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.location || !formData.guardianName || !formData.monthlyAllowance) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const orphanData = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      location: formData.location,
      guardianName: formData.guardianName,
      monthlyAllowance: parseInt(formData.monthlyAllowance),
      status: 'Pending' as const,
      registrationDate: new Date().toISOString().split('T')[0],
      lastPayment: 'N/A',
      schoolStatus: formData.schoolStatus || 'Not enrolled',
      healthStatus: formData.healthStatus || 'Pending medical checkup'
    };

    onSubmit(orphanData);
    
    // Reset form
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      location: '',
      guardianName: '',
      monthlyAllowance: '',
      schoolStatus: '',
      healthStatus: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Orphan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="Enter age"
                min="1"
                max="18"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value as 'Male' | 'Female'})}
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
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Kano State"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name *</label>
              <Input
                value={formData.guardianName}
                onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                placeholder="Enter guardian's name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Allowance (€) *</label>
              <Input
                type="number"
                value={formData.monthlyAllowance}
                onChange={(e) => setFormData({...formData, monthlyAllowance: e.target.value})}
                placeholder="e.g., 30"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Status</label>
              <Input
                value={formData.schoolStatus}
                onChange={(e) => setFormData({...formData, schoolStatus: e.target.value})}
                placeholder="e.g., Enrolled - Primary 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
              <Input
                value={formData.healthStatus}
                onChange={(e) => setFormData({...formData, healthStatus: e.target.value})}
                placeholder="e.g., Good, Needs medical attention"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-ngo-primary-500 hover:bg-ngo-primary-600">
              Add Orphan
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

export default AddOrphanForm;
