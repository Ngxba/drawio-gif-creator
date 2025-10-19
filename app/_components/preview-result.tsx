import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PreviewResultProps {
  outputUrl: string;
}

export function PreviewResult({ outputUrl }: PreviewResultProps) {
  return (
    <Card className="bg-white border-neutral-200 flex flex-col flex-1">
      <CardHeader>
        <CardTitle className="text-neutral-900">Preview</CardTitle>
        <CardDescription className="text-neutral-600">
          Your animated GIF is ready
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="relative rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50 flex items-center justify-center p-2 flex-1">
          <Image
            src={outputUrl}
            alt="Generated GIF"
            className="max-w-full max-h-full w-auto h-auto rounded object-contain"
            width={800}
            height={600}
            unoptimized
          />
        </div>
      </CardContent>
    </Card>
  );
}
