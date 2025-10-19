'use client';

import { useMutation } from '@tanstack/react-query';

export interface ConversionSettings {
  duration: number;
  fps: number;
  pageIndex: number;
  exportAll: boolean;
}

interface ConversionPayload {
  file: File;
  settings: ConversionSettings;
}

async function convertHtmlToGif({
  file,
  settings,
}: ConversionPayload): Promise<Blob> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('duration', settings.duration.toString());
  formData.append('fps', settings.fps.toString());

  const response = await fetch('/api/convert-html', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.details || 'Conversion failed'
    );
  }

  return response.blob();
}

export function useConvertHtml() {
  return useMutation({
    mutationFn: convertHtmlToGif,
    retry: 1,
  });
}
