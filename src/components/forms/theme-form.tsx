import { useFormContext } from "react-hook-form";
import * as z from "zod";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { pallettes } from "@/lib/pallettes";
import { CustomIndicatorRadioGroupItem } from "../custom-indicator-radio-group-item";
import { ColorThemeDisplay } from "../color-theme-display";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { Checkbox } from "../ui/checkbox";
import { SliderInputField } from "@/components/forms/fields/slider-input-field";
import {
  HorizontalAlign,
  VerticalAlign,
} from "@/lib/validation/theme-schema";
import { cn } from "@/lib/utils";

function PalletteSelector({ form }: { form: DocumentFormReturn }) {
  const { control, setValue } = form;

  return (
    <FormField
      control={control}
      name="config.theme.pallette"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Select a pallette</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                const colors = pallettes[value];
                setValue("config.theme.primary", colors.primary);
                setValue("config.theme.secondary", colors.secondary);
                setValue("config.theme.background", colors.background);
                setValue("config.theme.pallette", value);
              }}
              defaultValue={field.value}
              className="grid grid-cols-3 space-y-1"
            >
              {Object.entries(pallettes).map(([palletteName, colors]) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={palletteName}
                >
                  <FormControl>
                    <CustomIndicatorRadioGroupItem value={palletteName}>
                      <ColorThemeDisplay colors={colors} />
                    </CustomIndicatorRadioGroupItem>
                  </FormControl>
                  {/* <FormLabel className="font-normal">Huemint 1</FormLabel> */}
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CustomColors({ form }: { form: DocumentFormReturn }) {
  // TODO: popover with picker from github.com/casesandberg/react-color or github.com/omgovich/react-colorful
  return (
    <>
      <FormField
        control={form.control}
        name="config.theme.primary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary</FormLabel>
            <FormControl>
              <Input placeholder="Primary color" className="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="config.theme.secondary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secondary</FormLabel>
            <FormControl>
              <Input placeholder="Secondary color" className="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="config.theme.background"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Background</FormLabel>
            <FormControl>
              <Input placeholder="Background color" className="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

const HORIZONTAL_ALIGN_ICONS: Record<HorizontalAlign, React.ReactElement> = {
  Left: <AlignLeft className="h-4 w-4" />,
  Center: <AlignCenter className="h-4 w-4" />,
  Right: <AlignRight className="h-4 w-4" />,
};

const VERTICAL_ALIGN_ICONS: Record<VerticalAlign, React.ReactElement> = {
  Top: <AlignStartHorizontal className="h-4 w-4" />,
  Center: <AlignCenterHorizontal className="h-4 w-4" />,
  Bottom: <AlignEndHorizontal className="h-4 w-4" />,
};

function AlignSelector<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Record<string, React.ReactElement>;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm font-medium">{label}</span>
      <div className="grid grid-cols-3 gap-1">
        {Object.entries(options).map(([key, icon]) => (
          <Button
            key={key}
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-full",
              value === key && "bg-accent border-primary"
            )}
            onClick={() => onChange(key as T)}
          >
            {icon}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ThemeForm({}: {}) {
  const form: DocumentFormReturn = useFormContext(); // retrieve those props
  const { watch, setValue } = form;
  const isCustom = watch("config.theme.isCustom");
  const horizontalAlign =
    (watch("config.theme.contentAlign.horizontal") as HorizontalAlign) ?? "Left";
  const verticalAlign =
    (watch("config.theme.contentAlign.vertical") as VerticalAlign) ?? "Center";
  return (
    // TODO: check on custom color to enable/disable pallette custom colors
    <Form {...form}>
      <form className="space-y-6 w-full py-4">
        <AlignSelector<HorizontalAlign>
          label="Horizontal Alignment"
          value={horizontalAlign}
          options={HORIZONTAL_ALIGN_ICONS}
          onChange={(v) =>
            setValue("config.theme.contentAlign.horizontal", v, {
              shouldDirty: true,
            })
          }
        />
        <AlignSelector<VerticalAlign>
          label="Vertical Alignment"
          value={verticalAlign}
          options={VERTICAL_ALIGN_ICONS}
          onChange={(v) =>
            setValue("config.theme.contentAlign.vertical", v, {
              shouldDirty: true,
            })
          }
        />
        <SliderInputField
          fieldName="config.theme.padding"
          form={form}
          label="Slide Padding"
          min={0}
          max={80}
          step={2}
          className="w-full"
        />
        <FormField
          control={form.control}
          name="config.theme.isCustom"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none text-base">
                <FormLabel>Use custom colors</FormLabel>
              </div>
            </FormItem>
          )}
        />
        {isCustom ? (
          <CustomColors form={form} />
        ) : (
          <PalletteSelector form={form} />
        )}
      </form>
    </Form>
  );
}
