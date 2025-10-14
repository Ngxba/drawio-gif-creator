'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface FileUploadCardProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export function FileUploadCard({
  file,
  onFileChange,
  disabled = false,
}: FileUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file extension
      const validExtensions = ['.drawio', '.dio', '.xml'];
      const fileName = selectedFile.name.toLowerCase();
      const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

      if (isValid) {
        onFileChange(selectedFile);
      } else {
        alert('Please select a valid draw.io file (.drawio, .dio, or .xml)');
        e.target.value = '';
      }
    }
  };

  return (
    <Card className="bg-white border-neutral-200">
      <CardHeader>
        <CardTitle className="text-neutral-900">Upload Diagram</CardTitle>
        <CardDescription className="text-neutral-600">
          Select a draw.io file (.drawio, .dio, or .xml) to convert
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".drawio,.dio,.xml"
              onChange={handleFileChange}
              className="flex-1"
              disabled={disabled}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <Upload className="mr-2 h-4 w-4" />
              Browse
            </Button>
          </div>
          {file && (
            <p className="text-sm text-neutral-600">
              Selected: <span className="font-medium">{file.name}</span> (
              {(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
