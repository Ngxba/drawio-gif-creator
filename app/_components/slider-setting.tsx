import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export interface SliderSettingProps {
  id: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
  disabled: boolean;
}

export function SliderSetting({
  id,
  label,
  value,
  unit,
  min,
  max,
  onValueChange,
  disabled,
}: SliderSettingProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-neutral-700 font-medium">
          {label}
        </Label>
        <span className="text-sm font-medium text-neutral-900">
          {value} {unit}
        </span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={([val]) => onValueChange(val)}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}