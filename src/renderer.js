const puppeteer = require('puppeteer');

/**
 * Renders a draw.io diagram by capturing frames over time with retry logic
 * @param {string} xmlContent - The draw.io XML content
 * @param {number} duration - Recording duration in seconds (default: 5)
 * @param {number} fps - Frames per second to capture (default: 10)
 * @param {number} pageIndex - Index of the page to render (0-based, default: 0)
 * @param {number} retryCount - Number of retries (default: 3)
 * @returns {Promise<Array<Buffer>>} Array of PNG frame buffers
 */
async function renderDiagram(
  xmlContent,
  duration = 5,
  fps = 10,
  pageIndex = 0,
  retryCount = 3
) {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    let browser = null;

    try {
      console.log(
        `Rendering attempt ${attempt}/${retryCount}${attempt > 1 ? ' (retry)' : ''}...`
      );
      return await renderDiagramAttempt(
        xmlContent,
        duration,
        fps,
        pageIndex,
        browser
      );
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt === retryCount) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * Single attempt to render a diagram
 * @private
 */
async function renderDiagramAttempt(
  xmlContent,
  duration,
  fps,
  pageIndex,
  browserInstance
) {
  let browser = browserInstance;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security', // Allow cross-origin requests
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });

    const page = await browser.newPage();

    // Set a reasonable viewport
    await page.setViewport({
      width: 1200,
      height: 1000,
      deviceScaleFactor: 1, // Lower for better performance with animation
    });

    // Log console messages from the page for debugging
    page.on('console', (msg) => {
      console.log(`Browser console [${msg.type()}]:`, msg.text());
    });

    // Log page errors
    page.on('pageerror', (error) => {
      console.error('Browser page error:', error.message);
    });

    // Encode the diagram for the URL
    const encodedXml = encodeURIComponent(xmlContent);
    // Use viewer.diagrams.net with increased timeout parameters
    const viewerUrl = `https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=0&page=${pageIndex}&title=diagram#R${encodedXml}`;

    console.log('Navigating to viewer...');

    // Navigate to the viewer with longer timeout
    await page.goto(viewerUrl, {
      waitUntil: 'domcontentloaded', // Changed from networkidle2 for faster loading
      timeout: 60000, // Increased to 60 seconds
    });

    console.log('Page loaded, waiting for diagram container...');

    // Wait for the diagram to render - look for the diagram container with longer timeout
    await page.waitForSelector('.geDiagramContainer', {
      timeout: 45000, // Increased to 45 seconds
    });

    console.log('Diagram container found, waiting for content to stabilize...');

    // Give extra time for rendering to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
      height: boundingBox.height + padding * 2,
    };

    // Capture frames over the duration
    const frames = [];
    const frameInterval = 1000 / fps; // milliseconds per frame
    const totalFrames = duration * fps;

    console.log(
      `Recording ${totalFrames} frames at ${fps} fps for ${duration} seconds...`
    );

    for (let i = 0; i < totalFrames; i++) {
      const screenshot = await page.screenshot({
        type: 'png',
        clip: clipRegion,
      });

      frames.push(screenshot);

      // Wait for next frame
      if (i < totalFrames - 1) {
        await new Promise((resolve) => setTimeout(resolve, frameInterval));
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
  renderDiagram,
};
