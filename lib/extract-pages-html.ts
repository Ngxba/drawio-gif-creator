'use client';

export interface PageInfo {
  index: number;
  name: string;
  id: string;
}

const DEFAULT_PAGE: PageInfo = {
  index: 0,
  name: 'Page',
  id: '1',
};

/**
 * Extracts pages from HTML file content (client-side using DOMParser)
 */
export async function extractPagesFromHtmlFile(
  file: File
): Promise<PageInfo[]> {
  try {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(await file.text(), 'text/html');

    const mxgraphData = htmlDoc
      .querySelector('[data-mxgraph]')
      ?.getAttribute('data-mxgraph');
    if (!mxgraphData) return [DEFAULT_PAGE];

    let data: { xml?: string } = {};
    try {
      data = JSON.parse(mxgraphData);
    } catch {
      return [DEFAULT_PAGE];
    }

    if (!data.xml) return [DEFAULT_PAGE];

    const xmlDoc = parser.parseFromString(data.xml, 'text/xml');
    if (xmlDoc.getElementsByTagName('parsererror').length > 0)
      return [DEFAULT_PAGE];

    const diagrams = Array.from(xmlDoc.querySelectorAll('diagram'));
    return diagrams.length > 0
      ? diagrams.map((diagram, index) => ({
          index,
          name: diagram.getAttribute('name') || `Page ${index + 1}`,
          id: diagram.getAttribute('id') || `diagram-${index}`,
        }))
      : [DEFAULT_PAGE];
  } catch (error) {
    console.error('Error extracting pages from HTML:', error);
    return [DEFAULT_PAGE];
  }
}
