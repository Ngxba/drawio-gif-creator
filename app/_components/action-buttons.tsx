import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  file: File | null;
  isConverting: boolean;
  outputUrl: string | null;
  outputFileName: string;
  onConvert: () => void;
  onDownload: () => void;
}

export function ActionButtons({
  file,
  isConverting,
  outputUrl,
  outputFileName,
  onConvert,
  onDownload,
}: ActionButtonsProps) {
  return (
    <>
      {/* Convert Button */}
      <Button
        onClick={onConvert}
        disabled={!file || isConverting}
        size="lg"
        className="flex-1 font-medium transition-colors duration-150 not-lg:row-start-3"
      >
        Convert to GIF
      </Button>

      {/* Download Button */}
      {outputUrl && !isConverting && (
        <Button
          onClick={onDownload}
          size="lg"
          className="flex-1 font-medium transition-colors duration-150"
        >
          Download GIF as {outputFileName}
        </Button>
      )}
    </>
  );
}
