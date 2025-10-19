import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PageInfo {
  index: number;
  name: string;
  id: string;
}

interface ConversionSettings {
  duration: number;
  fps: number;
  pageIndex: number;
  exportAll: boolean;
}

interface ConversionSettingsCardProps {
  settings: ConversionSettings;
  onSettingsChange: (settings: ConversionSettings) => void;
  disabled?: boolean;
  pages?: PageInfo[];
  isLoadingPages?: boolean;
}

export function ConversionSettingsCard({
  settings,
  onSettingsChange,
  disabled = false,
  pages = [],
  isLoadingPages = false,
}: ConversionSettingsCardProps) {
  const totalFrames = settings.duration * settings.fps;
  const estimatedSize = ((totalFrames * 50) / 1024).toFixed(1);
  const hasMultiplePages = pages.length > 1;

  return (
    <Card className="bg-white border-neutral-200">
      <CardHeader>
        <CardTitle className="text-neutral-900">Conversion Settings</CardTitle>
        <CardDescription className="text-neutral-600">
          Adjust duration, frame rate, and page selection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Page Selection - Only show if file is uploaded */}
        {pages.length > 0 && (
          <>
            <div className="space-y-3 flex flex-col">
              <Label
                htmlFor="page-select"
                className="text-neutral-700 font-medium"
              >
                Page Selection
              </Label>
              <Select
                value={settings.pageIndex.toString()}
                onValueChange={(value) =>
                  onSettingsChange({
                    ...settings,
                    pageIndex: parseInt(value, 10),
                  })
                }
                disabled={disabled || isLoadingPages || settings.exportAll}
              >
                <SelectTrigger id="page-select">
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select a page</SelectLabel>
                    {isLoadingPages ? (
                      <SelectItem value="loading" disabled>
                        Loading pages...
                      </SelectItem>
                    ) : (
                      pages.map((page) => (
                        <SelectItem key={page.id} value={page.index.toString()}>
                          {page.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Export All Pages Checkbox - Only show if multiple pages exist */}
            {hasMultiplePages && (
              <div className="flex items-start gap-3">
                <Checkbox
                  id="export-all"
                  checked={settings.exportAll}
                  onCheckedChange={(checked) =>
                    onSettingsChange({
                      ...settings,
                      exportAll: checked === true,
                    })
                  }
                  disabled={disabled || isLoadingPages}
                />
                <div className="grid gap-2">
                  <Label htmlFor="export-all" className="font-medium cursor-pointer">
                    Export all pages
                  </Label>
                  <p className="text-xs text-neutral-600">
                    Will create a ZIP file containing separate GIF files for
                    each page
                  </p>
                </div>
              </div>
            )}
          </>
        )}
        {/* Duration Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="duration" className="text-neutral-700 font-medium">
              Duration
            </Label>
            <span className="text-sm font-medium text-neutral-900">
              {settings.duration} seconds
            </span>
          </div>
          <Slider
            id="duration"
            min={1}
            max={60}
            step={1}
            value={[settings.duration]}
            onValueChange={([value]) =>
              onSettingsChange({ ...settings, duration: value })
            }
            disabled={disabled}
            className="w-full"
          />
        </div>

        {/* FPS Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="fps" className="text-neutral-700 font-medium">
              Frame Rate (FPS)
            </Label>
            <span className="text-sm font-medium text-neutral-900">
              {settings.fps} fps
            </span>
          </div>
          <Slider
            id="fps"
            min={1}
            max={30}
            step={1}
            value={[settings.fps]}
            onValueChange={([value]) =>
              onSettingsChange({ ...settings, fps: value })
            }
            disabled={disabled}
            className="w-full"
          />
        </div>

        {/* Info Box */}
        <div className="rounded-lg bg-neutral-100 border border-neutral-200 p-4">
          <p className="text-sm text-neutral-700 font-medium">
            Total frames:{" "}
            <span className="text-neutral-900">{totalFrames}</span>
          </p>
          <p className="text-sm text-neutral-700 font-medium">
            Estimated size:{" "}
            <span className="text-neutral-900">{estimatedSize} MB</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
