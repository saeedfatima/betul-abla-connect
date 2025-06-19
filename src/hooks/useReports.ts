
import { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import { useToast } from './use-toast';

interface Report {
  id: string;
  title: string;
  type: 'orphan' | 'borehole' | 'financial' | 'activity' | 'summary';
  generated_date: string;
  generated_by: string;
  period: string;
  status: 'Generated' | 'Processing' | 'Failed';
  file_size: string;
  download_count: number;
  description?: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getAll();
      
      if (response.ok) {
        const data = await response.json();
        setReports(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch reports');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Error",
        description: "Failed to load reports data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (reportData: Omit<Report, 'id' | 'generated_date' | 'download_count'>) => {
    try {
      const response = await reportsAPI.create(reportData);
      
      if (response.ok) {
        const newReport = await response.json();
        setReports(prev => [newReport, ...prev]);
        toast({
          title: "Success",
          description: `Report "${reportData.title}" has been successfully created.`
        });
        return true;
      } else {
        throw new Error('Failed to create report');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create report. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateReport = async (id: string, reportData: Partial<Report>) => {
    try {
      const response = await reportsAPI.update(id, reportData);
      
      if (response.ok) {
        const updatedReport = await response.json();
        setReports(prev => prev.map(report => 
          report.id === id ? updatedReport : report
        ));
        toast({
          title: "Success",
          description: `Report "${reportData.title || 'Report'}" has been successfully updated.`
        });
        return true;
      } else {
        throw new Error('Failed to update report');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update report. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const response = await reportsAPI.delete(id);
      
      if (response.ok) {
        setReports(prev => prev.filter(report => report.id !== id));
        toast({
          title: "Success",
          description: "Report has been successfully deleted."
        });
        return true;
      } else {
        throw new Error('Failed to delete report');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete report. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const downloadReport = async (id: string) => {
    try {
      const response = await reportsAPI.download(id);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Update download count
        setReports(prev => prev.map(report => 
          report.id === id 
            ? { ...report, download_count: report.download_count + 1 }
            : report
        ));
        
        toast({
          title: "Success",
          description: "Report download started successfully."
        });
        return true;
      } else {
        throw new Error('Failed to download report');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    addReport,
    updateReport,
    deleteReport,
    downloadReport,
    refetch: fetchReports
  };
};
