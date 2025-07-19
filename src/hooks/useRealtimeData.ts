import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealtimeDataHook<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export function useRealtimeData<T>(
  tableName: string,
  initialFetch?: () => Promise<{ data: T[] | null; error: any }>
): RealtimeDataHook<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initial data fetch
    if (initialFetch) {
      const fetchInitialData = async () => {
        try {
          const { data: initialData, error: fetchError } = await initialFetch();
          if (fetchError) {
            setError(fetchError.message);
            toast({
              variant: "destructive",
              title: "Error fetching data",
              description: fetchError.message,
            });
          } else {
            setData(initialData || []);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
          setLoading(false);
        }
      };

      fetchInitialData();
    } else {
      setLoading(false);
    }

    // Set up realtime subscription
    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log(`Realtime update for ${tableName}:`, payload);
          
          if (payload.eventType === 'INSERT') {
            setData(current => [...current, payload.new as T]);
            toast({
              title: "New record added",
              description: `A new ${tableName.slice(0, -1)} has been added.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setData(current => 
              current.map(item => 
                (item as any).id === payload.new.id ? payload.new as T : item
              )
            );
            toast({
              title: "Record updated",
              description: `A ${tableName.slice(0, -1)} has been updated.`,
            });
          } else if (payload.eventType === 'DELETE') {
            setData(current => 
              current.filter(item => (item as any).id !== payload.old.id)
            );
            toast({
              title: "Record deleted",
              description: `A ${tableName.slice(0, -1)} has been deleted.`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, initialFetch, toast]);

  return { data, loading, error };
}

// Specific hooks for each table
export function useRealtimeOrphans() {
  return useRealtimeData<any>('orphans', async () => {
    const { data, error } = await supabase.from('orphans').select('*').order('created_at', { ascending: false });
    return { data: data || [], error };
  });
}

export function useRealtimeBoreholes() {
  return useRealtimeData<any>('boreholes', async () => {
    const { data, error } = await supabase.from('boreholes').select('*').order('created_at', { ascending: false });
    return { data: data || [], error };
  });
}

export function useRealtimeReports() {
  return useRealtimeData<any>('reports', async () => {
    const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    return { data: data || [], error };
  });
}