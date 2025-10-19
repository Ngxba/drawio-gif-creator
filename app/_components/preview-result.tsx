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
    <Card className="flex flex-col flex-1">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Your animated GIF is ready</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="relative rounded-lg border border-border overflow-hidden bg-secondary dark:bg-muted flex items-center justify-center p-2 flex-1">
          <Image
            src={outputUrl}
            alt="Generated GIF"
            className="max-w-full max-h-full w-auto h-auto rounded object-contain dark:brightness-75"
            width={800}
            height={600}
          />
        </div>
      </CardContent>
    </Card>
  );
}
