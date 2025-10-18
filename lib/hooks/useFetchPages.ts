"use client";

import { useQuery } from "@tanstack/react-query";

export interface PageInfo {
  index: number;
  name: string;
  id: string;
}

const DEFAULT_PAGES: PageInfo[] = [{ index: 0, name: "Page 1", id: "default" }];

/**
 * Fetch pages from a draw.io file
 * Used as the query function for React Query
 */
async function fetchPagesFromFile(file: File): Promise<PageInfo[]> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/list-pages", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }

  const data = await response.json();
  return data.pages || DEFAULT_PAGES;
}

/**
 * Custom hook to fetch pages from a draw.io file using React Query
 * Returns the full useQuery object for flexibility in consuming components
 */
export function useFetchPages(file: File | null) {
  return useQuery({
    queryKey: ["pages", file?.name, file?.size, file?.lastModified],
    queryFn: () => fetchPagesFromFile(file!),
    enabled: !!file,
    retry: 1,
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    staleTime: 1000 * 60, // Data is fresh for 1 minute
    placeholderData: DEFAULT_PAGES,
  });
}
