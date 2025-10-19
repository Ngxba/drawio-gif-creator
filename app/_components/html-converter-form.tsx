'use client';

import { useState } from 'react';
import { FileUploadCard } from '@/app/_components/file-upload-card';
import { ConversionSettingsCard } from '@/app/_components/conversion-settings-card';
import { PreviewPanel } from '@/app/_components/preview-panel';
import { ActionButtons } from '@/app/_components/action-buttons';
import { downloadFile, generateOutputFileName } from '@/lib/download-utils';
import {
  useConvertHtml,
  type ConversionSettings,
} from '@/lib/hooks/useConvertHtml';
import { useFetchPagesHtml } from '@/lib/hooks/useFetchPagesHtml';

const DEFAULT_SETTINGS: ConversionSettings = {
  duration: 5,
  fps: 10,
  pageIndex: 0,
  exportAll: false,
};

export function HtmlConverterForm() {
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] =
    useState<ConversionSettings>(DEFAULT_SETTINGS);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const { mutateAsync: convertHtml, isPending: isConverting } =
    useConvertHtml();
  const { data: pages, isLoading: isLoadingPages } = useFetchPagesHtml(file);

  const updateSetting = <K extends keyof ConversionSettings>(
    key: K,
    value: ConversionSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setOutputUrl(null);
    setSettings((prev) => ({ ...prev, pageIndex: 0, exportAll: false }));
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      const blob = await convertHtml({ file, settings });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to convert HTML. Please try again.';
      console.error('Conversion error:', errorMessage);
      alert(errorMessage);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const outputFileName = generateOutputFileName(file?.name, '.html');
    downloadFile(outputUrl, outputFileName);
  };

  const outputFileName = generateOutputFileName(file?.name, '.html');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:auto-rows-auto">
      {/* File Upload Section */}
      <FileUploadCard
        file={file}
        onFileChange={handleFileChange}
        disabled={isConverting}
        acceptedExtensions={['.html', '.htm']}
        validationMessage="Select an HTML file (.html or .htm) to convert"
        cardTitle="Upload HTML File"
      />

      {/* Conversion Settings Section */}
      <ConversionSettingsCard
        settings={settings}
        updateSetting={updateSetting}
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
