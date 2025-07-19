import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { RealtimeDashboard } from '@/components/RealtimeDashboard';
import { FileUpload } from '@/components/FileUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RealtimeDashboardPage() {
  return (
    <DashboardLayout title="Real-time Dashboard" userRole="admin">
      <div className="space-y-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="upload">File Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <RealtimeDashboard />
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    bucket="documents"
                    accept=".pdf,.doc,.docx"
                    maxSize={10}
                    onUploadComplete={(url, fileName) => console.log('Document uploaded:', url, fileName)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upload Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    bucket="photos"
                    accept="image/*"
                    maxSize={5}
                    onUploadComplete={(url, fileName) => console.log('Photo uploaded:', url, fileName)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upload Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    bucket="reports"
                    accept=".pdf,.xlsx,.csv"
                    maxSize={15}
                    onUploadComplete={(url, fileName) => console.log('Report uploaded:', url, fileName)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}