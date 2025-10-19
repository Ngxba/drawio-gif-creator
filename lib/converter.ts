/**
 * Converter wrapper for integrating the CLI converter with the Next.js frontend
 *
 * This module provides a bridge between the Next.js API routes and the existing
 * draw.io to GIF converter CLI tool.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { resolve } from 'path';

const execPromise = promisify(exec);

/**
 * Convert a draw.io file to an animated GIF
 *
 * @param inputPath - Path to the input draw.io file
 * @param outputPath - Path where the output GIF should be saved
 * @param duration - Duration of the animation in seconds (1-60)
 * @param fps - Frames per second (1-30)
 * @param pageIndex - Index of the page to export (0-based, default: 0)
 * @returns Promise that resolves when conversion is complete
 */
export async function convertDrawioToGif(
  inputPath: string,
  outputPath: string,
  duration: number = 5,
  fps: number = 10,
  pageIndex: number = 0
): Promise<void> {
  // Path to the CLI converter (in the same project)
  const converterPath = resolve(process.cwd(), 'src/index.js');

  // Build the command with page index
  let command = `node "${converterPath}" "${inputPath}" "${outputPath}" ${duration} ${fps}`;

  if (pageIndex > 0) {
    command += ` ${pageIndex}`;
  }

  try {
    const { stdout, stderr } = await execPromise(command, {
      timeout: 120000, // 2 minute timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    if (stderr && !stderr.includes('Warning')) {
      console.error('Converter stderr:', stderr);
    }

    if (stdout) {
      console.log('Converter stdout:', stdout);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Conversion failed: ${error.message}`);
    }
    throw error;
  }
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
 * Validate file extension
 *
 * @param filename - Name of the file to validate
 * @returns true if the file has a valid extension
 */
export function isValidDrawioFile(filename: string): boolean {
  const validExtensions = ['.drawio', '.dio', '.xml'];
  const lowerName = filename.toLowerCase();
  return validExtensions.some((ext) => lowerName.endsWith(ext));
}
