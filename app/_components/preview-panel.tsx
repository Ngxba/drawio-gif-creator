import { ConversionProgress } from '@/app/_components/conversion-progress';
import { PreviewPlaceholder } from '@/app/_components/preview-placeholder';
import { PreviewResult } from '@/app/_components/preview-result';

interface PreviewPanelProps {
  isConverting: boolean;
  outputUrl: string | null;
}

export function PreviewPanel({ isConverting, outputUrl }: PreviewPanelProps) {
  const renderContent = () => {
    // Show progress while converting
    if (isConverting) {
      return <ConversionProgress />;
    }

    // Show preview when conversion is complete
    if (outputUrl) {
      return <PreviewResult outputUrl={outputUrl} />;
    }

    // Show placeholder when idle
    return <PreviewPlaceholder />;
  };

  return (
    <div className="row-span-2 lg:row-start-1 lg:col-start-2 flex">
      {renderContent()}
    </div>
  );
}
