const { readDrawioFile, extractDiagramXml, listPages } = require('./fileReader');
const { renderDiagram } = require('./renderer');
const { convertToGif, validateOutputPath } = require('./imageConverter');

/**
 * Main conversion function that orchestrates the entire process
 * @param {string} inputFile - Path to input draw.io file
 * @param {string} outputFile - Path to output GIF file
 * @param {number} duration - Recording duration in seconds (default: 5)
 * @param {number} fps - Frames per second (default: 10)
 * @param {number} pageIndex - Index of the page to export (0-based, default: 0)
 * @returns {Promise<void>}
 */
async function convertDrawioToGif(inputFile, outputFile, duration = 5, fps = 10, pageIndex = 0) {
  try {
    // Step 1: Validate input file extension
    if (!inputFile.match(/\.(drawio|dio|xml)$/i)) {
      throw new Error('Input file must be a draw.io file (.drawio, .dio, or .xml)');
    }

    // Step 2: Validate output file extension
    if (!outputFile.match(/\.gif$/i)) {
      throw new Error('Output file must have .gif extension');
    }

    // Step 3: Validate output path is writable
    await validateOutputPath(outputFile);

    // Step 4: Read and parse the draw.io file
    const xmlContent = await readDrawioFile(inputFile);
    const diagramXml = extractDiagramXml(xmlContent, pageIndex);

    // Step 5: Render the diagram using Puppeteer - capture frames over time
    const frames = await renderDiagram(diagramXml, duration, fps, pageIndex);

    if (!frames || frames.length === 0) {
      throw new Error('Rendering produced no frames');
    }

    // Step 6: Convert frames to animated GIF and save
    await convertToGif(frames, outputFile, fps);

  } catch (error) {
    // Re-throw with better context if needed
    if (error.message.includes('ENOENT')) {
      throw new Error(`File not found: ${inputFile}`);
    }
    throw error;
  }
}

module.exports = {
  convertDrawioToGif,
  listPages: async (inputFile) => {
    const xmlContent = await readDrawioFile(inputFile);
    return listPages(xmlContent);
  }
};
