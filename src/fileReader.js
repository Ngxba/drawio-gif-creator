const fs = require('fs').promises;
const { existsSync } = require('fs');

/**
 * Reads and validates a draw.io file
 * @param {string} filePath - Path to the draw.io file
 * @returns {Promise<string>} The raw XML content
 */
async function readDrawioFile(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    const content = await fs.readFile(filePath, 'utf-8');

    if (!content.trim()) {
      throw new Error('File is empty');
    }

    // Validate that it looks like a draw.io file (contains mxfile or mxGraphModel)
    if (!content.includes('mxfile') && !content.includes('mxGraphModel')) {
      throw new Error('File does not appear to be a valid draw.io file');
    }

    return content;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    if (error.code === 'EACCES') {
      throw new Error(`Permission denied reading file: ${filePath}`);
    }
    throw error;
  }
}

/**
 * Extracts the diagram XML from a draw.io file
 * Draw.io files can be plain XML or compressed/encoded
 * @param {string} xmlContent - Raw file content
 * @param {number} _pageIndex - Index of the page to extract (0-based, default: 0)
 * @returns {string} The diagram XML
 */
function extractDiagramXml(xmlContent, _pageIndex = 0) {
  // For most draw.io files, the XML is already in usable format
  // The draw.io viewer can handle the various formats
  return xmlContent;
}

/**
 * Lists all pages/sheets in a draw.io file
 * @param {string} xmlContent - Raw file content
 * @returns {Array<{index: number, name: string, id: string}>} Array of page info
 */
function listPages(xmlContent) {
  try {
    // Parse XML to find all diagram elements (handle multiline)
    // The pattern needs to handle both name and id in any order
    const diagramPattern = /<diagram[^>]*>/g;
    const matches = xmlContent.match(diagramPattern);
    const pages = [];

    if (matches) {
      matches.forEach((tag, index) => {
        // Extract name and id from the tag
        const nameMatch = tag.match(/name="([^"]*)"/);
        const idMatch = tag.match(/id="([^"]*)"/);

        pages.push({
          index: index,
          name: nameMatch ? nameMatch[1] : `Page ${index + 1}`,
          id: idMatch ? idMatch[1] : `page-${index}`,
        });
      });
    }

    // If no diagrams found, return default
    if (pages.length === 0) {
      return [{ index: 0, name: 'Page 1', id: 'default' }];
    }

    return pages;
  } catch {
    // Fallback to single page
    return [{ index: 0, name: 'Page 1', id: 'default' }];
  }
}

module.exports = {
  readDrawioFile,
  extractDiagramXml,
  listPages,
};
