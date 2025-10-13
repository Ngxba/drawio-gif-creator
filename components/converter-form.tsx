"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUploadCard } from "@/components/file-upload-card";
import { ConversionSettingsCard } from "@/components/conversion-settings-card";
import { ConversionProgress } from "@/components/conversion-progress";

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

    const link = document.createElement("a");
    link.href = outputUrl;
    link.download =
      file?.name.replace(/\.(drawio|dio|xml)$/, ".gif") || "output.gif";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const outputFileName =
    file?.name.replace(/\.(drawio|dio|xml)$/, ".gif") || "output.gif";

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

      {/* Preview Panel - spans 3 rows on large screens */}
      <div className="row-span-2 lg:row-start-1 lg:col-start-2 flex">
        {/* Show progress while converting */}
        {isConverting && <ConversionProgress />}

        {/* Show preview when done */}
        {outputUrl && !isConverting && (
          <Card className="bg-white border-neutral-200 flex flex-col flex-1">
            <CardHeader>
              <CardTitle className="text-neutral-900">Preview</CardTitle>
              <CardDescription className="text-neutral-600">
                Your animated GIF is ready
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="relative rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50 flex items-center justify-center p-2 flex-1">
                <img
                  src={outputUrl}
                  alt="Generated GIF"
                  className="max-w-full max-h-full w-auto h-auto rounded object-contain"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show placeholder when idle */}
        {!isConverting && !outputUrl && (
          <div className="bg-white border-neutral-200 rounded-lg p-12 flex flex-col items-center justify-center border-2 border-dashed flex-1">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-700">
                Preview Area
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm">
                Upload a draw.io file and click convert to see your animated GIF
                here
              </p>
            </div>
          </div>
        )}
      </div>

      {/*  ----------------------------- Action Buttons -----------------------------  */}
      {/* Convert Button */}
      <Button
        onClick={handleConvert}
        disabled={!file || isConverting}
        size="lg"
        className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-colors duration-150 not-lg:row-start-3"
      >
        Convert to GIF
      </Button>

      {/* Download Button */}
      {outputUrl && !isConverting && (
        <Button
          onClick={handleDownload}
          size="lg"
          className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-colors duration-150"
        >
          Download GIF as {outputFileName}
        </Button>
      )}
    </div>
  );
}
