import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export function ConversionProgress() {
  return (
    <Card className="flex flex-col flex-1">
      <CardHeader>
        <div className="flex items-center gap-3 animate-pulse">
          <Image
            src="images/claude-color.svg"
            alt="Claude Logo"
            width={20}
            height={20}
          />
          <span className="text-sm font-medium text-foreground">
            Thinking...
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Preview Skeleton */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-muted-foreground mb-3">
            Searching for a way to convert your diagram...
          </p>
          <div className="flex-1">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
