import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRealtimeOrphans, useRealtimeBoreholes, useRealtimeReports } from '@/hooks/useRealtimeData';
import { Users, Droplets, FileText, Heart, Wrench, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function RealtimeDashboard() {
  const { data: orphans, loading: orphansLoading } = useRealtimeOrphans();
  const { data: boreholes, loading: boreholesLoading } = useRealtimeBoreholes();
  const { data: reports, loading: reportsLoading } = useRealtimeReports();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'published':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const activeBoreholes = boreholes.filter(b => b.status === 'active').length;
  const totalBeneficiaries = boreholes.reduce((sum, b) => sum + (b.beneficiaries_count || 0), 0);
  const pendingReports = reports.filter(r => r.status === 'submitted').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orphans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {orphansLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{orphans.length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Children under care
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Boreholes</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {boreholesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{activeBoreholes}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Water sources operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {boreholesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalBeneficiaries}</div>
            )}
            <p className="text-xs text-muted-foreground">
              People served by boreholes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{pendingReports}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orphans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Recent Orphans</span>
            </CardTitle>
            <CardDescription>
              Latest children registered in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orphansLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {orphans.slice(0, 5).map((orphan) => (
                  <div key={orphan.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                        {orphan.full_name?.charAt(0).toUpperCase() || 'O'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{orphan.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {orphan.date_of_birth && format(new Date(orphan.date_of_birth), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Badge className={getHealthColor(orphan.health_status)}>
                      {orphan.health_status || 'good'}
                    </Badge>
                  </div>
                ))}
                {orphans.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No orphans registered yet
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Borehole Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="h-5 w-5" />
              <span>Borehole Status</span>
            </CardTitle>
            <CardDescription>
              Current status of water infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {boreholesLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {boreholes.slice(0, 5).map((borehole) => (
                  <div key={borehole.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {borehole.status === 'active' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : borehole.status === 'maintenance' ? (
                          <Wrench className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{borehole.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {borehole.location} • {borehole.beneficiaries_count || 0} people
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(borehole.status)}>
                      {borehole.status}
                    </Badge>
                  </div>
                ))}
                {boreholes.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No boreholes registered yet
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Recent Reports</span>
          </CardTitle>
          <CardDescription>
            Latest reports and documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{report.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.report_type} • {format(new Date(report.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
              ))}
              {reports.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No reports created yet
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}