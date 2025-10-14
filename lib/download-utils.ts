/**
 * Downloads a file from a given URL
 * @param url - The blob URL or file URL to download
 * @param filename - The name to give the downloaded file
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates the output filename by replacing draw.io extensions with .gif
 * @param inputFileName - The original file name
 * @returns The output filename with .gif extension
 */
export function generateOutputFileName(inputFileName?: string): string {
  if (!inputFileName) return "output.gif";
  return inputFileName.replace(/\.(drawio|dio|xml)$/, ".gif");
}
