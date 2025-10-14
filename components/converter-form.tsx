"use client";

import { useState } from "react";
import { FileUploadCard } from "@/components/file-upload-card";
import { ConversionSettingsCard } from "@/components/conversion-settings-card";
import { PreviewPanel } from "@/components/preview-panel";
import { ActionButtons } from "@/components/action-buttons";
import { downloadFile, generateOutputFileName } from "@/lib/download-utils";

interface ConversionSettings {
  duration: number;
  fps: number;
}

export function ConverterForm() {
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<ConversionSettings>({
    duration: 5,
    fps: 10,
  });
  const [isConverting, setIsConverting] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setOutputUrl(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("duration", settings.duration.toString());
    formData.append("fps", settings.fps.toString());

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
