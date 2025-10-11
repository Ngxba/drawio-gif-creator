#!/usr/bin/env node

const { convertDrawioToGif } = require('./converter');

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: drawio-to-gif <input-file.drawio> <output-file.gif> [duration] [fps]');
    console.error('');
    console.error('Arguments:');
    console.error('  input-file.drawio   Path to the draw.io diagram file');
    console.error('  output-file.gif     Path for the output GIF file');
    console.error('  duration            Recording duration in seconds (default: 5)');
    console.error('  fps                 Frames per second (default: 10)');
    console.error('');
    console.error('Examples:');
    console.error('  drawio-to-gif diagram.drawio output.gif');
    console.error('  drawio-to-gif diagram.drawio output.gif 10 15');
    process.exit(1);
  }

  const [inputFile, outputFile, durationArg, fpsArg] = args;
  const duration = durationArg ? parseInt(durationArg, 10) : 5;
  const fps = fpsArg ? parseInt(fpsArg, 10) : 10;

  // Validate duration and fps
  if (isNaN(duration) || duration < 1 || duration > 60) {
    console.error('Error: Duration must be between 1 and 60 seconds');
    process.exit(1);
  }

  if (isNaN(fps) || fps < 1 || fps > 30) {
    console.error('Error: FPS must be between 1 and 30');
    process.exit(1);
  }

  try {
    console.log(`Converting ${inputFile} to ${outputFile}...`);
    console.log(`Recording for ${duration} seconds at ${fps} fps`);
    await convertDrawioToGif(inputFile, outputFile, duration, fps);
    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error during conversion:', error.message);
    process.exit(1);
  }
}

main();
