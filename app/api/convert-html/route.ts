import {
  convertHtmlToGif,
  isValidHtmlFile,
  validateConversionParams,
} from '@/lib/html-converter';
import { randomUUID } from 'crypto';
import { readFile, unlink, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { tmpdir } from 'os';
import { join } from 'path';

export async function POST(request: NextRequest) {
  let inputPath: string | null = null;
  let outputPath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const duration = parseInt(formData.get('duration') as string) || 5;
    const fps = parseInt(formData.get('fps') as string) || 10;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file extension
    if (!isValidHtmlFile(file.name)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Please upload an .html or .htm file',
        },
        { status: 400 }
      );
    }

    // Validate conversion parameters
    try {
      validateConversionParams(duration, fps);
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'Invalid parameters',
        },
        { status: 400 }
      );
    }

    // Create temporary files
    const tempDir = tmpdir();
    const fileId = randomUUID();
    const fileName = file.name;
    inputPath = join(
      tempDir,
      `${fileId}-input${fileName.substring(fileName.lastIndexOf('.'))}`
    );
    outputPath = join(tempDir, `${fileId}-output.gif`);

    // Save uploaded file to temp location
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    // Convert HTML to GIF
    await convertHtmlToGif(inputPath, outputPath, duration, fps);

    // Read the generated GIF
    const gifBuffer = await readFile(outputPath);

    // Clean up temp files
    await unlink(inputPath);
    await unlink(outputPath);

    // Return the GIF file
    const outputFileName = file.name.replace(/\.(html|htm)$/, '.gif');

    return new NextResponse(new Uint8Array(gifBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Content-Disposition': `attachment; filename="${outputFileName}"`,
      },
    });
  } catch (error) {
    // Clean up temp files on error
    if (inputPath) {
      try {
        await unlink(inputPath);
      } catch {}
    }
    if (outputPath) {
      try {
        await unlink(outputPath);
      } catch {}
    }

    console.error('HTML conversion error:', error);
    return NextResponse.json(
      {
        error: 'Failed to convert HTML',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
