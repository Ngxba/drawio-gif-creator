/**
 * Downloads a file from a given URL
 * @param url - The blob URL or file URL to download
 * @param filename - The name to give the downloaded file
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates the output filename by replacing extensions with .gif
 * @param inputFileName - The original file name
 * @param inputExtension - The extension to replace (e.g., '.html', '.drawio')
 * @returns The output filename with .gif extension
 */
export function generateOutputFileName(
  inputFileName?: string,
  inputExtension: string = '.drawio'
): string {
  if (!inputFileName) return 'output.gif';

  // Build pattern based on input extension
  let pattern: RegExp;
  if (inputExtension === '.html') {
    pattern = /\.(html|htm)$/;
  } else {
    pattern = /\.(drawio|dio|xml)$/;
  }

  return inputFileName.replace(pattern, '.gif');
}
