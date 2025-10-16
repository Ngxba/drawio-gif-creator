"use client";

import { useState, useEffect } from "react";
import { FileUploadCard } from "@/components/file-upload-card";
import { ConversionSettingsCard } from "@/components/conversion-settings-card";
import { PreviewPanel } from "@/components/preview-panel";
import { ActionButtons } from "@/components/action-buttons";
import { downloadFile, generateOutputFileName } from "@/lib/download-utils";

interface PageInfo {
  index: number;
  name: string;
  id: string;
}

interface ConversionSettings {
  duration: number;
  fps: number;
  pageIndex: number;
  exportAll: boolean;
}

export function ConverterForm() {
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<ConversionSettings>({
    duration: 5,
    fps: 10,
    pageIndex: 0,
    exportAll: false,
  });
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setOutputUrl(null);
    setPages([]);
    setSettings(prev => ({ ...prev, pageIndex: 0, exportAll: false }));
  };

  // Fetch pages when file changes
  useEffect(() => {
    if (!file) {
      setPages([]);
      return;
    }

    const fetchPages = async () => {
      setIsLoadingPages(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/list-pages', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setPages(data.pages || []);
        } else {
          console.error('Failed to fetch pages');
          setPages([{ index: 0, name: 'Page 1', id: 'default' }]);
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
        setPages([{ index: 0, name: 'Page 1', id: 'default' }]);
      } finally {
        setIsLoadingPages(false);
      }
    };

    fetchPages();
  }, [file]);

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("duration", settings.duration.toString());
    formData.append("fps", settings.fps.toString());
    formData.append("pageIndex", settings.pageIndex.toString());
    formData.append("exportAll", settings.exportAll.toString());

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setOutputUrl(url);
      setIsConverting(false);

      // If exporting all pages, automatically trigger download of zip
      if (settings.exportAll) {
        const outputFileName = file.name.replace(/\.(drawio|dio|xml)$/, "-all.zip");
        downloadFile(url, outputFileName);
      }
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Failed to convert diagram. Please try again.");
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const outputFileName = generateOutputFileName(file?.name);
    downloadFile(outputUrl, outputFileName);
  };

  const outputFileName = generateOutputFileName(file?.name);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:auto-rows-auto">
      {/* File Upload Section */}
      <FileUploadCard
        file={file}
        onFileChange={handleFileChange}
        disabled={isConverting}
      />

      {/* Conversion Settings Section */}
      <ConversionSettingsCard
        settings={settings}
        onSettingsChange={setSettings}
        disabled={isConverting}
        pages={pages}
        isLoadingPages={isLoadingPages}
      />

      {/* Preview Panel */}
      <PreviewPanel isConverting={isConverting} outputUrl={outputUrl} />

      {/* Action Buttons */}
      <ActionButtons
        file={file}
        isConverting={isConverting}
        outputUrl={outputUrl}
        outputFileName={outputFileName}
        onConvert={handleConvert}
        onDownload={handleDownload}
      />
    </div>
  );
}
