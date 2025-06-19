
import { useState, useEffect } from 'react';
import { boreholesAPI } from '../services/api';
import { useToast } from './use-toast';

interface Borehole {
  id: string;
  project_code: string;
  location: string;
  community: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'Maintenance' | 'Inactive';
  depth: number;
  water_quality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Not Tested';
  construction_date: string | null;
  last_maintenance: string | null;
  beneficiaries: number;
  contractor: string;
  cost: number;
  coordinates: string;
  notes: string;
}

export const useBoreholes = () => {
  const [boreholes, setBoreholes] = useState<Borehole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBoreholes = async () => {
    try {
      setLoading(true);
      const response = await boreholesAPI.getAll();
      
      if (response.ok) {
        const data = await response.json();
        setBoreholes(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch boreholes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Error",
        description: "Failed to load boreholes data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addBorehole = async (boreholeData: Omit<Borehole, 'id'>) => {
    try {
      const response = await boreholesAPI.create(boreholeData);
      
      if (response.ok) {
        const newBorehole = await response.json();
        setBoreholes(prev => [newBorehole, ...prev]);
        toast({
          title: "Success",
          description: `Project ${boreholeData.project_code} has been successfully created.`
        });
        return true;
      } else {
        throw new Error('Failed to add borehole');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add borehole project. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateBorehole = async (id: string, boreholeData: Partial<Borehole>) => {
    try {
      const response = await boreholesAPI.update(id, boreholeData);
      
      if (response.ok) {
        const updatedBorehole = await response.json();
        setBoreholes(prev => prev.map(borehole => 
          borehole.id === id ? updatedBorehole : borehole
        ));
        toast({
          title: "Success",
          description: `Project ${boreholeData.project_code || 'Borehole'} has been successfully updated.`
        });
        return true;
      } else {
        throw new Error('Failed to update borehole');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update borehole project. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteBorehole = async (id: string) => {
    try {
      const response = await boreholesAPI.delete(id);
      
      if (response.ok) {
        setBoreholes(prev => prev.filter(borehole => borehole.id !== id));
        toast({
          title: "Success",
          description: "Borehole project has been successfully deleted."
        });
        return true;
      } else {
        throw new Error('Failed to delete borehole');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete borehole project. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchBoreholes();
  }, []);

  return {
    boreholes,
    loading,
    error,
    addBorehole,
    updateBorehole,
    deleteBorehole,
    refetch: fetchBoreholes
  };
};
