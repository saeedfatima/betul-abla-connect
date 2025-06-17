
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const StaffDashboard = () => {
  const accessibleFeatures = [
    { title: 'View Reports', description: 'Access generated reports and statistics', link: '/admin/reports', icon: '📊' },
    { title: 'Print Records', description: 'Print orphan and borehole records', link: '#', icon: '🖨️' },
    { title: 'Export Data', description: 'Export data in various formats', link: '#', icon: '📤' },
  ];

  const recentReports = [
    { title: 'Monthly Orphan Care Report - November 2024', date: '2024-11-01', status: 'Available' },
    { title: 'Borehole Status Report - Q4 2024', date: '2024-10-15', status: 'Available' },
    { title: 'Financial Summary - October 2024', date: '2024-10-31', status: 'Available' },
    { title: 'Field Activities Report - September 2024', date: '2024-09-30', status: 'Available' },
  ];

  const systemInfo = [
    { label: 'Total Active Orphans', value: '523' },
    { label: 'Total Active Boreholes', value: '47' },
    { label: 'System Users', value: '8' },
    { label: 'Last Data Update', value: '2 hours ago' },
  ];

  return (
    <DashboardLayout title="Staff Dashboard" userRole="staff">
      <div className="space-y-6">
        {/* Welcome Message */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-ngo-primary-700 mb-2">Welcome to Staff Portal</h2>
            <p className="text-gray-600">
              As a staff member, you have access to view reports, print records, and export data. 
              Use the tools below to access the information you need.
            </p>
          </CardContent>
        </Card>

        {/* Quick Access Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-ngo-primary-700">Available Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accessibleFeatures.map((feature, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 text-center"
                  asChild={feature.link !== '#'}
                  onClick={feature.link === '#' ? () => alert('Feature coming soon!') : undefined}
                >
                  {feature.link !== '#' ? (
                    <Link to={feature.link}>
                      <span className="text-2xl mb-2">{feature.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{feature.title}</div>
                        <div className="text-xs text-gray-600">{feature.description}</div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <span className="text-2xl mb-2">{feature.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{feature.title}</div>
                        <div className="text-xs text-gray-600">{feature.description}</div>
                      </div>
                    </>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{report.title}</p>
                      <p className="text-xs text-gray-500">Generated: {report.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {report.status}
                      </span>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-ngo-primary-700">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemInfo.map((info, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">{info.label}</span>
                    <span className="font-semibold text-ngo-primary-700">{info.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-ngo-primary-700">Help & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Getting Started</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use the "View Reports" section to access all available reports</li>
                  <li>• Print functionality will be available for all record types</li>
                  <li>• Export data in PDF, Excel, or CSV formats</li>
                  <li>• Contact your coordinator for additional access requests</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you need assistance or have questions about using the system, 
                  please contact your administrator or coordinator.
                </p>
                <Button size="sm" variant="outline">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
