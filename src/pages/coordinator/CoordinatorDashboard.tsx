
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const CoordinatorDashboard = () => {
  const stats = [
    { title: 'Assigned Orphans', value: '156', change: 'In your region', icon: '👶' },
    { title: 'Active Boreholes', value: '18', change: 'Under your supervision', icon: '💧' },
    { title: 'Pending Reviews', value: '7', change: 'Require attention', icon: '📋' },
    { title: 'This Month Budget', value: '€8,500', change: 'Allocated funds', icon: '💰' },
  ];

  const pendingTasks = [
    { task: 'Review orphan application: Fatima Ibrahim', priority: 'High', due: 'Today' },
    { task: 'Inspect borehole BH-2024-12 in Jigawa', priority: 'Medium', due: 'Tomorrow' },
    { task: 'Submit monthly orphan care report', priority: 'High', due: '2 days' },
    { task: 'Verify new orphan documents (3 cases)', priority: 'Medium', due: '3 days' },
  ];

  const recentActions = [
    { action: 'Approved monthly allowance for 45 orphans', time: '1 hour ago' },
    { action: 'Updated orphan record: Ahmed Musa', time: '3 hours ago' },
    { action: 'Reported borehole maintenance issue', time: '1 day ago' },
    { action: 'Conducted field visit to Kano center', time: '2 days ago' },
  ];

  const quickAccess = [
    { title: 'Orphan Records', description: 'View and manage orphan information', link: '/admin/orphans', icon: '👶' },
    { title: 'Borehole Status', description: 'Monitor borehole projects and maintenance', link: '/admin/boreholes', icon: '💧' },
    { title: 'Generate Reports', description: 'Create field reports and updates', link: '/admin/reports', icon: '📊' },
  ];

  return (
    <DashboardLayout title="Coordinator Dashboard" userRole="coordinator">
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
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{task.task}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === 'High' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">Due: {task.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">Recent Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-ngo-primary-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{action.action}</p>
                      <p className="text-xs text-gray-500">{action.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-ngo-primary-700">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickAccess.map((access, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 text-center"
                  asChild
                >
                  <Link to={access.link}>
                    <span className="text-2xl mb-2">{access.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{access.title}</div>
                      <div className="text-xs text-gray-600">{access.description}</div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Field Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">Your Region Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kano State Operations</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jigawa State Operations</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Field Staff</span>
                  <span className="font-semibold">4 members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Field Visit</span>
                  <span className="font-semibold">2 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">Monthly Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Orphan Visits</span>
                    <span>32/40</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-ngo-primary-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Borehole Inspections</span>
                    <span>15/18</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-ngo-secondary-500 h-2 rounded-full" style={{width: '83%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Reports Submitted</span>
                    <span>3/4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-ngo-accent-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorDashboard;
