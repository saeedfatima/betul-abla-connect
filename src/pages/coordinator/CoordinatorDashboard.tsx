
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';
import { Link } from 'react-router-dom';

interface QuickStats {
  activeOrphans: number;
  pendingOrphans: number;
  completedBoreholes: number;
  activeBoreholes: number;
  monthlyBudget: number;
  totalBeneficiaries: number;
}

interface RecentActivity {
  id: string;
  type: 'orphan' | 'borehole' | 'report';
  description: string;
  timestamp: string;
  status: string;
}

const CoordinatorDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from your Django backend
  const [stats] = useState<QuickStats>({
    activeOrphans: 523,
    pendingOrphans: 45,
    completedBoreholes: 47,
    activeBoreholes: 12,
    monthlyBudget: 25000,
    totalBeneficiaries: 10250
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'orphan',
      description: 'New orphan registration - Amina Hassan (8 years old)',
      timestamp: '2 hours ago',
      status: 'pending'
    },
    {
      id: '2',
      type: 'borehole',
      description: 'Borehole BH-2024-003 construction completed',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'orphan',
      description: 'Monthly allowance distributed to 450 orphans',
      timestamp: '2 days ago',
      status: 'completed'
    },
    {
      id: '4',
      type: 'borehole',
      description: 'Water quality test scheduled for BH-2024-001',
      timestamp: '3 days ago',
      status: 'scheduled'
    },
    {
      id: '5',
      type: 'report',
      description: 'Monthly field report generated',
      timestamp: '1 week ago',
      status: 'generated'
    }
  ]);

  const filteredActivities = recentActivities.filter(activity =>
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'orphan': return '👶';
      case 'borehole': return '💧';
      case 'report': return '📄';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'generated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = [
    {
      title: 'Add New Orphan',
      description: 'Register a new orphan for care',
      link: '/admin/orphans',
      icon: '👶',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Borehole Project',
      description: 'Start a new borehole project',
      link: '/admin/boreholes',
      icon: '💧',
      color: 'bg-green-500'
    },
    {
      title: 'Generate Report',
      description: 'Create field activity report',
      link: '/admin/reports',
      icon: '📊',
      color: 'bg-purple-500'
    },
    {
      title: 'Field Visit',
      description: 'Schedule or record field visit',
      link: '/admin/orphans',
      icon: '🚗',
      color: 'bg-orange-500'
    }
  ];

  return (
    <DashboardLayout title="Coordinator Dashboard" userRole="coordinator">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-ngo-primary-500 to-ngo-primary-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
          <p className="text-ngo-primary-100">
            Manage orphan care and borehole projects in your assigned regions. 
            Track progress, update records, and generate field reports.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.activeOrphans}</div>
              <div className="text-sm text-gray-600">Active Orphans</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrphans}</div>
              <div className="text-sm text-gray-600">Pending Cases</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.completedBoreholes}</div>
              <div className="text-sm text-gray-600">Completed Boreholes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.activeBoreholes}</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ngo-primary-600">€{stats.monthlyBudget.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Monthly Budget</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.totalBeneficiaries.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Beneficiaries</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.link}>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white text-2xl mb-3`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orphan Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👶</span>
                Orphan Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.activeOrphans}</div>
                  <div className="text-sm text-gray-600">Total Active Cases</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-yellow-600">{stats.pendingOrphans}</div>
                  <div className="text-sm text-gray-600">Pending Review</div>
                </div>
              </div>
              <div className="space-y-2">
                <Link to="/admin/orphans">
                  <Button className="w-full" variant="outline">
                    View All Orphans
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/admin/orphans">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Add New
                    </Button>
                  </Link>
                  <Link to="/admin/reports">
                    <Button size="sm" variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Borehole Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>💧</span>
                Borehole Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.completedBoreholes}</div>
                  <div className="text-sm text-gray-600">Completed Projects</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">{stats.activeBoreholes}</div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
              </div>
              <div className="space-y-2">
                <Link to="/admin/boreholes">
                  <Button className="w-full" variant="outline">
                    View All Projects
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/admin/boreholes">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      New Project
                    </Button>
                  </Link>
                  <Link to="/admin/reports">
                    <Button size="sm" variant="outline" className="w-full">
                      Project Reports
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search activities..."
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
                      <div className="text-xs text-gray-500">{activity.timestamp}</div>
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

export default CoordinatorDashboard;
