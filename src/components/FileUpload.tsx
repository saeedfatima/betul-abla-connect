import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, File, Image } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  bucket: 'documents' | 'photos' | 'reports';
  folder?: string;
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete?: (url: string, fileName: string) => void;
  className?: string;
}

export function FileUpload({
  bucket,
  folder = '',
  accept = '*/*',
  maxSize = 10,
  onUploadComplete,
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to upload files",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${folder}${folder ? '/' : ''}${user.data.user.id}/${Date.now()}.${fileExt}`;

      // For demonstration, we'll simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 100);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      toast({
        title: "Upload successful",
        description: `${selectedFile.name} has been uploaded`,
      });

      onUploadComplete?.(publicUrl, selectedFile.name);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Label htmlFor="file-upload" className="text-sm font-medium">
          Upload File
        </Label>
        <span className="text-xs text-muted-foreground">
          (Max {maxSize}MB)
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="flex-1"
        />
        
        {selectedFile && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeFile}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            {getFileIcon(selectedFile.name)}
            <span className="text-sm font-medium truncate max-w-48">
              {selectedFile.name}
            </span>
            <span className="text-xs text-muted-foreground">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          
          <Button
            onClick={uploadFile}
            disabled={uploading}
            size="sm"
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      )}

      {uploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-xs text-muted-foreground text-center">
            {uploadProgress}% uploaded
          </p>
        </div>
      )}
    </div>
  );
}