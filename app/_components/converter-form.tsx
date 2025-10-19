"use client";

import { useState, useCallback } from "react";
import { FileUploadCard } from "@/app/_components/file-upload-card";
import { ConversionSettingsCard } from "@/app/_components/conversion-settings-card";
import { PreviewPanel } from "@/app/_components/preview-panel";
import { ActionButtons } from "@/app/_components/action-buttons";
import { downloadFile, generateOutputFileName } from "@/lib/download-utils";
import { useFetchPages } from "@/lib/hooks/useFetchPages";
import {
  useConvertDiagram,
  type ConversionSettings,
} from "@/lib/hooks/useConvertDiagram";

const DEFAULT_SETTINGS: ConversionSettings = {
  duration: 5,
  fps: 10,
  pageIndex: 0,
  exportAll: false,
};

export function ConverterForm() {
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] =
    useState<ConversionSettings>(DEFAULT_SETTINGS);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const { data: pages, isLoading: isLoadingPages } = useFetchPages(file);
  const { mutateAsync: convertDiagram, isPending: isConverting } =
    useConvertDiagram();

  const handleFileChange = useCallback((newFile: File | null) => {
    setFile(newFile);
    setOutputUrl(null);
    setSettings((prev) => ({ ...prev, pageIndex: 0, exportAll: false }));
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;

    try {
      const blob = await convertDiagram({ file, settings });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      // If exporting all pages, automatically trigger download of zip
      if (settings.exportAll) {
        const outputFileName = file.name.replace(
          /\.(drawio|dio|xml)$/,
          "-all.zip"
        );
        downloadFile(url, outputFileName);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to convert diagram. Please try again.";
      console.error("Conversion error:", errorMessage);
      alert(errorMessage);
    }
  }, [file, settings, convertDiagram]);

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
