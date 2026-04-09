import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { useState, useEffect } from "react";

function NumberInputWithLocalState({
  value,
  onChange,
  min,
  max,
  step,
  defaultValue,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  defaultValue?: number;
}) {
  const effectiveValue = value ?? defaultValue ?? min;
  const [localValue, setLocalValue] = useState(String(effectiveValue));

  useEffect(() => {
    setLocalValue(String(value ?? defaultValue ?? min));
  }, [value, defaultValue, min]);

  return (
    <Input
      type="number"
      min={min}
      max={max}
      step={step}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          const input = e.currentTarget;
          requestAnimationFrame(() => {
            const v = parseFloat(input.value);
            if (!isNaN(v)) {
              const clamped = Math.min(max, Math.max(min, v));
              onChange(clamped);
              setLocalValue(String(clamped));
            }
          });
        }
      }}
      onBlur={() => {
        const v = parseFloat(localValue);
        if (!isNaN(v)) {
          const clamped = Math.min(max, Math.max(min, v));
          onChange(clamped);
          setLocalValue(String(clamped));
        } else {
          setLocalValue(String(effectiveValue));
        }
      }}
      className="w-16 h-8 text-center text-sm px-1"
    />
  );
}

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
              <NumberInputWithLocalState
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
                defaultValue={defaultValue}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
