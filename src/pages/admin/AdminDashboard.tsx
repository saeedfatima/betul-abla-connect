
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Orphans', value: '523', change: '+12 this month', icon: '👶' },
    { title: 'Active Boreholes', value: '47', change: '+3 this month', icon: '💧' },
    { title: 'System Users', value: '8', change: '2 coordinators, 6 staff', icon: '👥' },
    { title: 'Monthly Budget', value: '€25,000', change: 'Current allocation', icon: '💰' },
  ];

  const recentActivities = [
    { activity: 'New orphan registered: Amina Hassan (Age 8)', time: '2 hours ago', type: 'orphan' },
    { activity: 'Borehole BH-2024-15 completed in Kano', time: '1 day ago', type: 'borehole' },
    { activity: 'Monthly allowance distributed to 120 orphans', time: '3 days ago', type: 'payment' },
    { activity: 'New coordinator added: Ibrahim Mohammed', time: '1 week ago', type: 'user' },
  ];

  const quickActions = [
    { title: 'Add New Orphan', description: 'Register a new child in the orphan care program', link: '/admin/orphans', icon: '👶' },
    { title: 'Create Borehole Project', description: 'Start a new borehole construction project', link: '/admin/boreholes', icon: '💧' },
    { title: 'Generate Report', description: 'Create monthly or annual activity reports', link: '/admin/reports', icon: '📊' },
    { title: 'Manage Users', description: 'Add or modify user accounts and permissions', link: '/admin/users', icon: '⚙️' },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" userRole="admin">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <span className="text-2xl">{stat.icon}</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ngo-primary-700">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-ngo-primary-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.activity}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex items-center justify-start h-auto p-4 text-left"
                    asChild
                  >
                    <Link to={action.link}>
                      <span className="text-xl mr-3">{action.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{action.title}</div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">Orphan Care Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Cases</span>
                  <span className="font-semibold">523</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Verification</span>
                  <span className="font-semibold text-yellow-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Allowances Due</span>
                  <span className="font-semibold text-ngo-primary-600">€15,690</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">Borehole Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Planned</span>
                  <span className="font-semibold text-gray-600">8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">System Status</span>
                  <span className="font-semibold text-green-600">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Database Sync</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="font-semibold">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
