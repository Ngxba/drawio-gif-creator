import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function ConversionProgress() {
  return (
    <Card className="bg-white border-neutral-200 flex flex-col flex-1">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-neutral-600" />
          <span className="text-sm font-medium text-neutral-700">
            Processing your diagram...
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Preview Skeleton */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-neutral-500 mb-3">Generating preview...</p>
          <div className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 p-4 min-h-0">
            <Skeleton className="h-full w-full rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
