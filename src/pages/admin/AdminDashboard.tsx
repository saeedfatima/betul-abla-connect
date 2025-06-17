
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';
import { Link } from 'react-router-dom';

interface SystemStats {
  totalOrphans: number;
  activeOrphans: number;
  pendingOrphans: number;
  totalBoreholes: number;
  completedBoreholes: number;
  activeProjects: number;
  totalUsers: number;
  activeUsers: number;
  monthlyBudget: number;
  totalBeneficiaries: number;
  reportsGenerated: number;
  lastReportDate: string;
}

interface RecentActivity {
  id: string;
  type: 'orphan' | 'borehole' | 'user' | 'report' | 'system';
  description: string;
  timestamp: string;
  user: string;
  status: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from your Django backend
  const [stats] = useState<SystemStats>({
    totalOrphans: 568,
    activeOrphans: 523,
    pendingOrphans: 45,
    totalBoreholes: 59,
    completedBoreholes: 47,
    activeProjects: 12,
    totalUsers: 15,
    activeUsers: 12,
    monthlyBudget: 25000,
    totalBeneficiaries: 10250,
    reportsGenerated: 47,
    lastReportDate: '2024-11-15'
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user',
      description: 'New coordinator account created for Ibrahim Mohammed',
      timestamp: '1 hour ago',
      user: 'Admin',
      status: 'completed'
    },
    {
      id: '2',
      type: 'orphan',
      description: 'Batch approval of 15 orphan applications',
      timestamp: '2 hours ago',
      user: 'Fatima Coordinator',
      status: 'completed'
    },
    {
      id: '3',
      type: 'borehole',
      description: 'Borehole project BH-2024-004 status updated to completed',
      timestamp: '4 hours ago',
      user: 'Ali Coordinator',
      status: 'completed'
    },
    {
      id: '4',
      type: 'report',
      description: 'Monthly financial report generated and distributed',
      timestamp: '1 day ago',
      user: 'Admin',
      status: 'generated'
    },
    {
      id: '5',
      type: 'system',
      description: 'System backup completed successfully',
      timestamp: '1 day ago',
      user: 'System',
      status: 'completed'
    },
    {
      id: '6',
      type: 'orphan',
      description: 'Monthly allowance distributed to all active orphans',
      timestamp: '2 days ago',
      user: 'Aisha Coordinator',
      status: 'completed'
    }
  ]);

  const filteredActivities = recentActivities.filter(activity =>
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'orphan': return '👶';
      case 'borehole': return '💧';
      case 'user': return '👥';
      case 'report': return '📊';
      case 'system': return '⚙️';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'generated': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = [
    {
      title: 'Manage Orphans',
      description: 'Add, edit, or review orphan records',
      link: '/admin/orphans',
      icon: '👶',
      color: 'bg-blue-500',
      count: stats.pendingOrphans
    },
    {
      title: 'Manage Boreholes',
      description: 'Oversee borehole projects',
      link: '/admin/boreholes',
      icon: '💧',
      color: 'bg-green-500',
      count: stats.activeProjects
    },
    {
      title: 'User Management',
      description: 'Manage coordinator and staff accounts',
      link: '/admin/users',
      icon: '👥',
      color: 'bg-purple-500',
      count: stats.totalUsers
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate and view system reports',
      link: '/admin/reports',
      icon: '📊',
      color: 'bg-orange-500',
      count: stats.reportsGenerated
    }
  ];

  return (
    <DashboardLayout title="Admin Dashboard" userRole="admin">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-ngo-primary-500 to-ngo-primary-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Admin Control Center</h2>
          <p className="text-ngo-primary-100">
            Comprehensive oversight of all foundation activities. Manage users, approve operations, and monitor system performance.
          </p>
        </div>

        {/* System Overview Stats */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.totalOrphans}</div>
                <div className="text-sm text-gray-600">Total Orphans</div>
                <div className="text-xs text-green-600">+{stats.activeOrphans} active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrphans}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
                <div className="text-xs text-orange-600">Needs attention</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.totalBoreholes}</div>
                <div className="text-sm text-gray-600">Total Boreholes</div>
                <div className="text-xs text-green-600">+{stats.completedBoreholes} completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">System Users</div>
                <div className="text-xs text-green-600">{stats.activeUsers} active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-ngo-primary-600">€{stats.monthlyBudget.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Monthly Budget</div>
                <div className="text-xs text-blue-600">Current allocation</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{stats.totalBeneficiaries.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Beneficiaries</div>
                <div className="text-xs text-green-600">Lives impacted</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions with Management Features */}
        <Card>
          <CardHeader>
            <CardTitle>Administrative Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.link}>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                        {action.icon}
                      </div>
                      {action.count > 0 && (
                        <Badge className="bg-red-100 text-red-800">
                          {action.count}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orphan Management Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>👶</span>
                  Orphan Management
                </span>
                <Link to="/admin/orphans">
                  <Button size="sm" variant="outline">Manage All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.activeOrphans}</div>
                  <div className="text-xs text-gray-600">Active Cases</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrphans}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.totalOrphans}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/admin/orphans">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Add New
                    </Button>
                  </Link>
                  <Link to="/admin/orphans">
                    <Button size="sm" variant="outline" className="w-full">
                      Review Pending
                    </Button>
                  </Link>
                </div>
                <Link to="/admin/reports">
                  <Button size="sm" variant="outline" className="w-full">
                    Generate Orphan Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Borehole Management Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>💧</span>
                  Borehole Management
                </span>
                <Link to="/admin/boreholes">
                  <Button size="sm" variant="outline">Manage All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.completedBoreholes}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.activeProjects}</div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.totalBoreholes}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/admin/boreholes">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      New Project
                    </Button>
                  </Link>
                  <Link to="/admin/boreholes">
                    <Button size="sm" variant="outline" className="w-full">
                      Update Status
                    </Button>
                  </Link>
                </div>
                <Link to="/admin/reports">
                  <Button size="sm" variant="outline" className="w-full">
                    Borehole Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>System Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search activities by description or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                      <div className="text-xs text-gray-500">
                        by {activity.user} • {activity.timestamp}
                      </div>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
