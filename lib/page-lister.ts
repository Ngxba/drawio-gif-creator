/**
 * List pages from draw.io XML content
 * This is a TypeScript port of the listPages function from src/fileReader.js
 */

export interface PageInfo {
  index: number;
  name: string;
  id: string;
}

export async function listPages(xmlContent: string): Promise<PageInfo[]> {
  try {
    // Parse XML to find all diagram elements (handle multiline)
    const diagramPattern = /<diagram[^>]*>/g;
    const matches = xmlContent.match(diagramPattern);
    const pages: PageInfo[] = [];

    if (matches) {
      matches.forEach((tag, index) => {
        // Extract name and id from the tag
        const nameMatch = tag.match(/name="([^"]*)"/);
        const idMatch = tag.match(/id="([^"]*)"/);

        pages.push({
          index: index,
          name: nameMatch ? nameMatch[1] : `Page ${index + 1}`,
          id: idMatch ? idMatch[1] : `page-${index}`
        });
      });
    }

    // If no diagrams found, return default
    if (pages.length === 0) {
      return [{ index: 0, name: 'Page 1', id: 'default' }];
    }

    return pages;
  } catch (error) {
    // Fallback to single page
    return [{ index: 0, name: 'Page 1', id: 'default' }];
  }
}
