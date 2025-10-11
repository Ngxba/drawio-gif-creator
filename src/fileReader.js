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
 * @returns {string} The diagram XML
 */
function extractDiagramXml(xmlContent) {
  // For most draw.io files, the XML is already in usable format
  // The draw.io viewer can handle the various formats
  return xmlContent;
}

module.exports = {
  readDrawioFile,
  extractDiagramXml
};
