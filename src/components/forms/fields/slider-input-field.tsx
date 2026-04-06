import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { DocumentFormReturn } from "@/lib/document-form-types";

export function SliderInputField({
  fieldName,
  form,
  label,
  min,
  max,
  step,
  defaultValue,
  className = "",
}: {
  fieldName: string;
  form: DocumentFormReturn;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue?: number;
  className?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={fieldName as any}
      render={({ field: { value, onChange } }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-3">
              <Slider
                min={min}
                max={max}
                step={step}
                value={[value ?? defaultValue ?? min]}
                onValueChange={(vals) => onChange(vals[0])}
                className="flex-1"
              />
              <Input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value ?? defaultValue ?? min}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v) && v >= min && v <= max) {
                    onChange(v);
                  }
                }}
                className="w-16 h-8 text-center text-sm px-1"
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
