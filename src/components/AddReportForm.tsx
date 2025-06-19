
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AddReportFormProps {
  onSubmit: (reportData: any) => void;
  onCancel: () => void;
}

const AddReportForm: React.FC<AddReportFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    type: 'orphan' as 'orphan' | 'borehole' | 'financial' | 'activity' | 'summary',
    period: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.period) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const reportData = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: 'Current User',
      period: formData.period,
      status: 'Processing' as const,
      fileSize: 'Processing...',
      downloadCount: 0,
      description: formData.description
    };

    onSubmit(reportData);
    
    // Reset form
    setFormData({
      title: '',
      type: 'orphan',
      period: '',
      description: ''
    });
  };

  const reportTypes = [
    { value: 'orphan', label: 'Orphan Care Report' },
    { value: 'borehole', label: 'Borehole Projects Report' },
    { value: 'financial', label: 'Financial Report' },
    { value: 'activity', label: 'Field Activities Report' },
    { value: 'summary', label: 'Executive Summary' }
  ];

  const periodOptions = [
    'Current Month',
    'Current Quarter',
    'Current Year',
    'Last Month',
    'Last Quarter',
    'Last Year',
    'Custom Period'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Monthly Orphan Care Report - December 2024"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type *</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full p-2 border rounded-md"
                required
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Period *</label>
              <select 
                value={formData.period}
                onChange={(e) => setFormData({...formData, period: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Period</option>
                {periodOptions.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Additional information about this report..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-ngo-primary-500 hover:bg-ngo-primary-600">
              Generate Report
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

export default AddReportForm;
