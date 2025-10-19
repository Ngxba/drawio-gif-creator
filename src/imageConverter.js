const sharp = require('sharp');
const fs = require('fs').promises;
const { createWriteStream } = require('fs');
const GIFEncoder = require('gif-encoder-2');

/**
 * Converts PNG frame buffers to an animated GIF and saves it
 * @param {Array<Buffer>|Buffer} pngFrames - Array of PNG frame buffers or single buffer
 * @param {string} outputPath - Path where the GIF should be saved
 * @param {number} fps - Frames per second (default: 10)
 * @returns {Promise<void>}
 */
async function convertToGif(pngFrames, outputPath, fps = 10) {
  try {
    // Handle both single frame and multi-frame inputs
    const frames = Array.isArray(pngFrames) ? pngFrames : [pngFrames];

    if (frames.length === 0) {
      throw new Error('No frames to encode');
    }

    console.log(`Converting ${frames.length} frames to GIF...`);

    // Get dimensions from the first frame
    const firstImage = sharp(frames[0]);
    const metadata = await firstImage.metadata();
    const { width, height } = metadata;

    // Create GIF encoder with proper settings
    const encoder = new GIFEncoder(width, height, 'neuquant', true);

    // Create write stream
    const stream = createWriteStream(outputPath);

    // Start encoding
    encoder.createReadStream().pipe(stream);
    encoder.start();
    encoder.setRepeat(0); // 0 for infinite loop
    encoder.setDelay(1000 / fps); // Delay between frames in milliseconds
    encoder.setQuality(10); // Quality level (1-30, lower is better)

    // Process and add each frame
    for (let i = 0; i < frames.length; i++) {
      // Convert PNG to raw RGBA pixel data
      const rawPixels = await sharp(frames[i]).ensureAlpha().raw().toBuffer();

      encoder.addFrame(rawPixels);

      if ((i + 1) % 10 === 0 || i === frames.length - 1) {
        console.log(`Processed ${i + 1}/${frames.length} frames`);
      }
    }

    encoder.finish();

    // Wait for the stream to finish writing
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    console.log('GIF encoding complete!');
  } catch (error) {
    throw new Error(`Image conversion failed: ${error.message}`);
  }
}

/**
 * Validates that the output path is writable
 * @param {string} outputPath - Path to validate
 * @returns {Promise<void>}
 */
async function validateOutputPath(outputPath) {
  const path = require('path');
  const dir = path.dirname(outputPath);

  try {
    await fs.access(dir, fs.constants.W_OK);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Output directory does not exist: ${dir}`);
    }
    if (error.code === 'EACCES') {
      throw new Error(`Permission denied writing to directory: ${dir}`);
    }
    throw error;
  }
}

module.exports = {
  convertToGif,
  validateOutputPath,
};
