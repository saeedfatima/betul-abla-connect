
import { useState, useEffect } from 'react';
import { orphansAPI } from '../services/api';
import { useToast } from './use-toast';

interface Orphan {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  location: string;
  guardian_name: string;
  monthly_allowance: number;
  status: 'Active' | 'Pending' | 'Inactive';
  registration_date: string;
  last_payment: string | null;
  school_status: string;
  health_status: string;
}

export const useOrphans = () => {
  const [orphans, setOrphans] = useState<Orphan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrphans = async () => {
    try {
      setLoading(true);
      const response = await orphansAPI.getAll();
      
      if (response.ok) {
        const data = await response.json();
        setOrphans(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch orphans');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Error",
        description: "Failed to load orphans data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addOrphan = async (orphanData: Omit<Orphan, 'id' | 'registration_date'>) => {
    try {
      const response = await orphansAPI.create(orphanData);
      
      if (response.ok) {
        const newOrphan = await response.json();
        setOrphans(prev => [newOrphan, ...prev]);
        toast({
          title: "Success",
          description: `${orphanData.name} has been successfully registered.`
        });
        return true;
      } else {
        throw new Error('Failed to add orphan');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add orphan. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateOrphan = async (id: string, orphanData: Partial<Orphan>) => {
    try {
      const response = await orphansAPI.update(id, orphanData);
      
      if (response.ok) {
        const updatedOrphan = await response.json();
        setOrphans(prev => prev.map(orphan => 
          orphan.id === id ? updatedOrphan : orphan
        ));
        toast({
          title: "Success",
          description: `${orphanData.name || 'Orphan'} has been successfully updated.`
        });
        return true;
      } else {
        throw new Error('Failed to update orphan');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update orphan. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteOrphan = async (id: string) => {
    try {
      const response = await orphansAPI.delete(id);
      
      if (response.ok) {
        setOrphans(prev => prev.filter(orphan => orphan.id !== id));
        toast({
          title: "Success",
          description: "Orphan has been successfully deleted."
        });
        return true;
      } else {
        throw new Error('Failed to delete orphan');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete orphan. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrphans();
  }, []);

  return {
    orphans,
    loading,
    error,
    addOrphan,
    updateOrphan,
    deleteOrphan,
    refetch: fetchOrphans
  };
};
