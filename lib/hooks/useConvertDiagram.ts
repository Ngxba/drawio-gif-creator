"use client";

import { useMutation } from "@tanstack/react-query";

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

/**
 * Convert a draw.io file to GIF
 * Used as the mutation function for React Query
 */
async function convertDiagramToGif({
  file,
  settings,
}: ConversionPayload): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("duration", settings.duration.toString());
  formData.append("fps", settings.fps.toString());
  formData.append("pageIndex", settings.pageIndex.toString());
  formData.append("exportAll", settings.exportAll.toString());

  const response = await fetch("/api/convert", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Conversion failed");
  }

  return response.blob();
}

/**
 * Custom hook for converting draw.io diagrams to GIF using React Query
 * Handles mutation state, errors, and retry logic
 */
export function useConvertDiagram() {
  return useMutation({
    mutationFn: convertDiagramToGif,
    retry: 1,
  });
}