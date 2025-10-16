const puppeteer = require('puppeteer');

/**
 * Renders a draw.io diagram by capturing frames over time
 * @param {string} xmlContent - The draw.io XML content
 * @param {number} duration - Recording duration in seconds (default: 5)
 * @param {number} fps - Frames per second to capture (default: 10)
 * @param {number} pageIndex - Index of the page to render (0-based, default: 0)
 * @returns {Promise<Array<Buffer>>} Array of PNG frame buffers
 */
async function renderDiagram(xmlContent, duration = 5, fps = 10, pageIndex = 0) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set a reasonable viewport
    await page.setViewport({
      width: 1200,
      height: 1000,
      deviceScaleFactor: 1 // Lower for better performance with animation
    });

    // Encode the diagram for the URL
    const encodedXml = encodeURIComponent(xmlContent);
    // Add page parameter to select specific page (0-based index)
    const viewerUrl = `https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=0&page=${pageIndex}&title=diagram#R${encodedXml}`;

    // Navigate to the viewer
    await page.goto(viewerUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for the diagram to render - look for the diagram container
    await page.waitForSelector('.geDiagramContainer', { timeout: 15000 });

    // Give it a moment to start rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find the diagram element and get its bounding box
    const diagramElement = await page.$('.geDiagramContainer');

    if (!diagramElement) {
      throw new Error('Could not find diagram element');
    }

    // Get the bounding box
    const boundingBox = await diagramElement.boundingBox();

    if (!boundingBox || boundingBox.width === 0 || boundingBox.height === 0) {
      throw new Error('Invalid diagram dimensions');
    }

    // Calculate clip region with padding
    const padding = 20;
    const clipRegion = {
      x: Math.max(0, boundingBox.x - padding),
      y: Math.max(0, boundingBox.y - padding),
      width: boundingBox.width + padding * 2,
      height: boundingBox.height + padding * 2
    };

    // Capture frames over the duration
    const frames = [];
    const frameInterval = 1000 / fps; // milliseconds per frame
    const totalFrames = duration * fps;

    console.log(`Recording ${totalFrames} frames at ${fps} fps for ${duration} seconds...`);

    for (let i = 0; i < totalFrames; i++) {
      const screenshot = await page.screenshot({
        type: 'png',
        clip: clipRegion
      });

      frames.push(screenshot);

      // Wait for next frame
      if (i < totalFrames - 1) {
        await new Promise(resolve => setTimeout(resolve, frameInterval));
      }
    }

    return frames;

  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Rendering timeout: diagram took too long to render');
    }
    throw new Error(`Rendering failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  renderDiagram
};
