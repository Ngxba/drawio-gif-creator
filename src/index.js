#!/usr/bin/env node

const { convertDrawioToGif, listPages } = require('./converter');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);

  // Handle --list-pages flag
  if (args[0] === '--list-pages' && args.length === 2) {
    try {
      const pages = await listPages(args[1]);
      console.log('Available pages in', args[1]);
      pages.forEach((page) => {
        console.log(`  [${page.index}] ${page.name}`);
      });
      process.exit(0);
    } catch (error) {
      console.error('Error listing pages:', error.message);
      process.exit(1);
    }
  }

  if (args.length < 2) {
    console.error(
      'Usage: drawio-to-gif <input-file.drawio> <output-file.gif> [duration] [fps] [page|--all]'
    );
    console.error('');
    console.error('Arguments:');
    console.error('  input-file.drawio   Path to the draw.io diagram file');
    console.error('  output-file.gif     Path for the output GIF file');
    console.error(
      '  duration            Recording duration in seconds (default: 5)'
    );
    console.error('  fps                 Frames per second (default: 10)');
    console.error(
      '  page                Page index to export (default: 0, first page)'
    );
    console.error(
      '  --all               Export all pages (creates multiple files)'
    );
    console.error('');
    console.error('Examples:');
    console.error('  drawio-to-gif diagram.drawio output.gif');
    console.error('  drawio-to-gif diagram.drawio output.gif 10 15');
    console.error(
      '  drawio-to-gif diagram.drawio output.gif 5 10 1      # Export second page'
    );
    console.error(
      '  drawio-to-gif diagram.drawio output.gif 5 10 --all  # Export all pages'
    );
    console.error('');
    console.error('List pages:');
    console.error('  drawio-to-gif --list-pages diagram.drawio');
    process.exit(1);
  }

  const [inputFile, outputFile, durationArg, fpsArg, pageArg] = args;
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
    // Check if --all flag is present
    if (pageArg === '--all') {
      // Export all pages
      const pages = await listPages(inputFile);
      console.log(`Found ${pages.length} page(s) in ${inputFile}`);
      console.log(`Recording for ${duration} seconds at ${fps} fps per page\n`);

      const parsedPath = path.parse(outputFile);
      const outputDir = parsedPath.dir || '.';
      const outputName = parsedPath.name;
      const outputExt = parsedPath.ext;

      for (const page of pages) {
        const pageOutputFile = path.join(
          outputDir,
          `${outputName}-page${page.index}${outputExt}`
        );

        console.log(
          `[${page.index + 1}/${pages.length}] Converting page "${page.name}" (index: ${page.index})...`
        );
        await convertDrawioToGif(
          inputFile,
          pageOutputFile,
          duration,
          fps,
          page.index
        );
        console.log(`  ✓ Saved to ${pageOutputFile}\n`);
      }

      console.log(`All ${pages.length} page(s) converted successfully!`);
    } else {
      // Export single page
      const pageIndex = pageArg ? parseInt(pageArg, 10) : 0;

      if (isNaN(pageIndex) || pageIndex < 0) {
        console.error('Error: Page index must be 0 or greater');
        process.exit(1);
      }

      console.log(`Converting ${inputFile} to ${outputFile}...`);
      console.log(`Recording for ${duration} seconds at ${fps} fps`);
      if (pageIndex > 0) {
        console.log(`Exporting page ${pageIndex} (0-based index)`);
      }
      await convertDrawioToGif(inputFile, outputFile, duration, fps, pageIndex);
      console.log('Conversion completed successfully!');
    }
  } catch (error) {
    console.error('Error during conversion:', error.message);
    process.exit(1);
  }
}

main();
