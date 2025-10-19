/**
 * HTML to GIF converter wrapper for the Next.js frontend
 *
 * This module provides direct HTML rendering without spawning CLI process
 */

import { renderHtml } from '@/src/htmlRenderer';

/**
 * Convert an HTML file to an animated GIF
 *
 * @param inputPath - Path to the input HTML file
 * @param outputPath - Path where the output GIF should be saved
 * @param duration - Duration of the animation in seconds (1-60)
 * @param fps - Frames per second (1-30)
 * @returns Promise that resolves when conversion is complete
 */
export async function convertHtmlToGif(
  inputPath: string,
  outputPath: string,
  duration: number = 5,
  fps: number = 10
): Promise<void> {
  const frames = await renderHtml(inputPath, duration, fps);

  if (!frames || frames.length === 0) {
    throw new Error('Rendering produced no frames');
  }

  // Use require for CommonJS module (imageConverter is CommonJS)
  const { convertToGif } = require('@/src/imageConverter');
  await convertToGif(frames, outputPath, fps);
}

/**
 * Validate conversion parameters
 *
 * @param duration - Duration in seconds
 * @param fps - Frames per second
 * @throws Error if parameters are invalid
 */
export function validateConversionParams(duration: number, fps: number): void {
  if (duration < 1 || duration > 60) {
    throw new Error('Duration must be between 1 and 60 seconds');
  }

  if (fps < 1 || fps > 30) {
    throw new Error('FPS must be between 1 and 30');
  }

  if (!Number.isInteger(duration) || !Number.isInteger(fps)) {
    throw new Error('Duration and FPS must be integers');
  }
}

/**
 * Validate HTML file extension
 *
 * @param filename - Name of the file to validate
 * @returns true if the file has a valid HTML extension
 */
export function isValidHtmlFile(filename: string): boolean {
  const validExtensions = ['.html', '.htm'];
  const lowerName = filename.toLowerCase();
  return validExtensions.some((ext) => lowerName.endsWith(ext));
}
