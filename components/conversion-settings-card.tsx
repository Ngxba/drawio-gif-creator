import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ConversionSettings {
  duration: number;
  fps: number;
}

interface ConversionSettingsCardProps {
  settings: ConversionSettings;
  onSettingsChange: (settings: ConversionSettings) => void;
  disabled?: boolean;
}

export function ConversionSettingsCard({
  settings,
  onSettingsChange,
  disabled = false,
}: ConversionSettingsCardProps) {
  const totalFrames = settings.duration * settings.fps;
  const estimatedSize = ((totalFrames * 50) / 1024).toFixed(1);

  return (
    <Card className="bg-white border-neutral-200">
      <CardHeader>
        <CardTitle className="text-neutral-900">Conversion Settings</CardTitle>
        <CardDescription className="text-neutral-600">
          Adjust duration and frame rate for the animated GIF
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
