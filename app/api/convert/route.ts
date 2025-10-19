import {
  convertDrawioToGif,
  isValidDrawioFile,
  validateConversionParams,
} from "@/lib/converter";
import { listPages } from "@/lib/page-lister";
import archiver from "archiver";
import { randomUUID } from "crypto";
import { readFile, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import { join } from "path";

export async function POST(request: NextRequest) {
  let inputPath: string | null = null;
  let outputPath: string | null = null;
  const outputPaths: string[] = [];

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const duration = parseInt(formData.get("duration") as string) || 5;
    const fps = parseInt(formData.get("fps") as string) || 10;
    const pageIndex = parseInt(formData.get("pageIndex") as string) || 0;
    const exportAll = formData.get("exportAll") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file extension
    if (!isValidDrawioFile(file.name)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload a .drawio, .dio, or .xml file",
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
          error: error instanceof Error ? error.message : "Invalid parameters",
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
      `${fileId}-input${fileName.substring(fileName.lastIndexOf("."))}`
    );
    outputPath = join(tempDir, `${fileId}-output.gif`);

    // Save uploaded file to temp location
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    if (exportAll) {
      // Export all pages and create a zip file
      const content = buffer.toString('utf-8');
      const pages = await listPages(content);

      // Convert each page
      for (const page of pages) {
        const pageOutputPath = join(
          tmpdir(),
          `${fileId}-page${page.index}.gif`
        );
        outputPaths.push(pageOutputPath);

        await convertDrawioToGif(inputPath, pageOutputPath, duration, fps, page.index);
      }

      // Create a zip file
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Uint8Array[] = [];

      archive.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      const zipPromise = new Promise<Buffer>((resolve, reject) => {
        archive.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        archive.on('error', reject);
      });

      // Add all GIF files to the archive
      for (let i = 0; i < outputPaths.length; i++) {
        const gifBuffer = await readFile(outputPaths[i]);
        const pages = await listPages(content);
        const pageName = pages[i].name.replace(/[^a-zA-Z0-9-_]/g, '_');
        archive.append(gifBuffer, { name: `${pageName}-page${i}.gif` });
      }

      archive.finalize();

      const zipBuffer = await zipPromise;

      // Clean up temp files
      await unlink(inputPath);
      for (const path of outputPaths) {
        await unlink(path);
      }

      // Return the ZIP file
      const outputFileName = file.name.replace(/\.(drawio|dio|xml)$/, "-all.zip");

      return new NextResponse(new Uint8Array(zipBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${outputFileName}"`,
        },
      });
    } else {
      // Convert single page to GIF
      await convertDrawioToGif(inputPath, outputPath, duration, fps, pageIndex);

      // Read the generated GIF
      const gifBuffer = await readFile(outputPath);

      // Clean up temp files
      await unlink(inputPath);
      await unlink(outputPath);

      // Return the GIF file
      const outputFileName = file.name.replace(/\.(drawio|dio|xml)$/, ".gif");

      return new NextResponse(new Uint8Array(gifBuffer), {
        status: 200,
        headers: {
          "Content-Type": "image/gif",
          "Content-Disposition": `attachment; filename="${outputFileName}"`,
        },
      });
    }
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
    for (const path of outputPaths) {
      try {
        await unlink(path);
      } catch {}
    }

    console.error("Conversion error:", error);
    return NextResponse.json(
      {
        error: "Failed to convert diagram",
        details: error instanceof Error ? error.message : "Unknown error",
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
