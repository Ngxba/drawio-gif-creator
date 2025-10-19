'use client';

import { useQuery } from '@tanstack/react-query';
import {
  extractPagesFromHtmlFile,
  type PageInfo,
} from '@/lib/extract-pages-html';

const DEFAULT_PAGES: PageInfo[] = [{ index: 0, name: 'Page', id: '1' }];

export function useFetchPagesHtml(file: File | null) {
  return useQuery({
    queryKey: ['pages-html', file?.name, file?.size, file?.lastModified],
    queryFn: () => extractPagesFromHtmlFile(file!),
    enabled: !!file,
    retry: 1,
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    staleTime: 1000 * 60, // Data is fresh for 1 minute
    placeholderData: DEFAULT_PAGES,
  });
}
