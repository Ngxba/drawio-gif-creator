import { launch } from 'puppeteer';
import type { Browser } from 'puppeteer';

interface ClipRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Renders an HTML file by capturing frames over time
 * Optionally clicks on SVG elements to open fullscreen before capturing
 * @param htmlFilePath - The path to the HTML file
 * @param duration - Recording duration in seconds (default: 5)
 * @param fps - Frames per second to capture (default: 10)
 * @returns Array of PNG frame buffers
 */
const VIEWPORT_WIDTH = 1500;
const VIEWPORT_HEIGHT = 1200;

export async function renderHtml(
  htmlFilePath: string,
  duration: number = 5,
  fps: number = 10,
  debug: boolean = true
): Promise<Buffer[]> {
  let browser: Browser | null = null;

  try {
    browser = await launch({
      headless: !debug, // Set to false to see the browser window
      args: debug ? [] : ['--no-sandbox', '--disable-setuid-sandbox'],
      devtools: debug, // Open DevTools automatically in debug mode
    });

    const page = await browser.newPage();

    // Set a reasonable viewport
    await page.setViewport({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: 1,
    });

    // Navigate to the local HTML file
    const fileUrl = `file://${htmlFilePath}`;
    await page.goto(fileUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Give page time to load and initialize any animations
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Try to find and click on SVG element to potentially open fullscreen
    // This is optional - it may or may not exist depending on the HTML
    try {
      const svgElement = await page.$('svg');
      if (svgElement) {
        console.log('Found SVG element, attempting to open fullscreen...');
        await svgElement.click();
        // Wait a bit after click
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch {
      console.log(
        'No SVG element found or click failed, proceeding with recording'
      );
    }

    // Capture whole screen with 40px padding removed from all sides
    const padding = 40;
    const clipRegion: ClipRegion = {
      x: padding,
      y: padding,
      width: VIEWPORT_WIDTH - padding * 2,
      height: VIEWPORT_HEIGHT - padding * 2,
    };
    console.log('Capturing with clip region (40px padding):', clipRegion);

    // Capture frames over the duration
    const frames: Buffer[] = [];
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

      frames.push(screenshot as Buffer);

      // Wait for next frame
      if (i < totalFrames - 1) {
        await new Promise((resolve) => setTimeout(resolve, frameInterval));
      }
    }

    return frames;
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error('Rendering timeout: HTML took too long to render');
    }
    throw new Error(
      `Rendering failed: ${error instanceof Error ? error.message : String(error)}`
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
