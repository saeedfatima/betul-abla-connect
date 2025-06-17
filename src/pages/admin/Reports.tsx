
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';

interface Report {
  id: string;
  title: string;
  type: 'orphan' | 'borehole' | 'financial' | 'activity' | 'summary';
  generatedDate: string;
  generatedBy: string;
  period: string;
  status: 'Generated' | 'Processing' | 'Failed';
  fileSize: string;
  downloadCount: number;
}

const Reports = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('all');
  
  // Mock data - in real app, this would come from your Django backend
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Monthly Orphan Care Report - November 2024',
      type: 'orphan',
      generatedDate: '2024-11-01',
      generatedBy: 'Admin',
      period: 'November 2024',
      status: 'Generated',
      fileSize: '2.3 MB',
      downloadCount: 15
    },
    {
      id: '2',
      title: 'Borehole Status Report - Q4 2024',
      type: 'borehole',
      generatedDate: '2024-10-15',
      generatedBy: 'Ibrahim Mohammed',
      period: 'Q4 2024',
      status: 'Generated',
      fileSize: '1.8 MB',
      downloadCount: 8
    },
    {
      id: '3',
      title: 'Financial Summary - October 2024',
      type: 'financial',
      generatedDate: '2024-10-31',
      generatedBy: 'Admin',
      period: 'October 2024',
      status: 'Generated',
      fileSize: '945 KB',
      downloadCount: 22
    },
    {
      id: '4',
      title: 'Field Activities Report - September 2024',
      type: 'activity',
      generatedDate: '2024-09-30',
      generatedBy: 'Fatima Usman',
      period: 'September 2024',
      status: 'Generated',
      fileSize: '3.1 MB',
      downloadCount: 12
    },
    {
      id: '5',
      title: 'Annual Summary Report - 2024',
      type: 'summary',
      generatedDate: '2024-11-10',
      generatedBy: 'Admin',
      period: '2024',
      status: 'Processing',
      fileSize: 'N/A',
      downloadCount: 0
    }
  ]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
    return matchesSearch && matchesType;
  });

  const generateReport = (type: string, period: string) => {
    const newReport: Report = {
      id: Date.now().toString(),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${period}`,
      type: type as Report['type'],
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: 'Current User',
      period: period,
      status: 'Processing',
      fileSize: 'Processing...',
      downloadCount: 0
    };

    setReports([newReport, ...reports]);
    
    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: 'Generated' as const, fileSize: '1.5 MB' }
          : report
      ));
      toast({
        title: "Report Generated",
        description: `${newReport.title} has been successfully generated.`,
      });
    }, 3000);

    toast({
      title: "Report Generation Started",
      description: "Your report is being generated. You'll be notified when it's ready.",
    });
  };

  const downloadReport = (reportId: string) => {
    setReports(reports.map(report =>
      report.id === reportId 
        ? { ...report, downloadCount: report.downloadCount + 1 }
        : report
    ));
    toast({
      title: "Download Started",
      description: "Report download has been initiated.",
    });
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'orphan': return 'bg-blue-100 text-blue-800';
      case 'borehole': return 'bg-green-100 text-green-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      case 'activity': return 'bg-purple-100 text-purple-800';
      case 'summary': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const reportTemplates = [
    { type: 'orphan', title: 'Orphan Care Report', description: 'Comprehensive report on orphan care activities' },
    { type: 'borehole', title: 'Borehole Projects Report', description: 'Status and progress of borehole projects' },
    { type: 'financial', title: 'Financial Report', description: 'Budget allocation and expenditure report' },
    { type: 'activity', title: 'Field Activities Report', description: 'Summary of field operations and activities' },
    { type: 'summary', title: 'Executive Summary', description: 'High-level overview of all activities' }
  ];

  return (
    <DashboardLayout title="Reports & Analytics" userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Generate, view, and download reports for foundation activities</p>
        </div>

        {/* Quick Generate Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((template) => (
                <div key={template.type} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => generateReport(template.type, 'Current Month')}
                    >
                      Generate Monthly
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => generateReport(template.type, 'Current Quarter')}
                    >
                      Generate Quarterly
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <select 
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="orphan">Orphan Care</option>
                <option value="borehole">Boreholes</option>
                <option value="financial">Financial</option>
                <option value="activity">Activities</option>
                <option value="summary">Summary</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ngo-primary-600">
                {reports.length}
              </div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === 'Generated').length}
              </div>
              <div className="text-sm text-gray-600">Ready for Download</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === 'Processing').length}
              </div>
              <div className="text-sm text-gray-600">Processing</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-700">
                {reports.reduce((sum, r) => sum + r.downloadCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports ({filteredReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div><strong>Generated:</strong> {report.generatedDate}</div>
                        <div><strong>By:</strong> {report.generatedBy}</div>
                        <div><strong>Period:</strong> {report.period}</div>
                        <div><strong>Size:</strong> {report.fileSize}</div>
                        <div><strong>Downloads:</strong> {report.downloadCount}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {report.status === 'Generated' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => downloadReport(report.id)}
                            className="bg-ngo-primary-500 hover:bg-ngo-primary-600"
                          >
                            Download PDF
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadReport(report.id)}
                          >
                            Download Excel
                          </Button>
                        </>
                      )}
                      {report.status === 'Processing' && (
                        <Button size="sm" disabled>
                          Processing...
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Active Orphans</span>
                  <span className="font-bold text-blue-600">523</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">Completed Boreholes</span>
                  <span className="font-bold text-green-600">47</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">Monthly Budget</span>
                  <span className="font-bold text-purple-600">€25,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm text-gray-600">People Served</span>
                  <span className="font-bold text-orange-600">10,000+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">Monthly report generated</span>
                    <div className="text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">Borehole status updated</span>
                    <div className="text-gray-500">1 day ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">Financial report downloaded</span>
                    <div className="text-gray-500">2 days ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">New orphan registered</span>
                    <div className="text-gray-500">3 days ago</div>
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

export default Reports;
