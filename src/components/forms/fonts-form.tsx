"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fontsMap } from "@/lib/fonts-map";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { SliderInputField } from "@/components/forms/fields/slider-input-field";
import { Separator } from "@/components/ui/separator";

const fontEntries = Object.entries(fontsMap).map(([id, info]) => ({
  id,
  name: info.name,
  className: info.className,
}));

function FontCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedFont = fontsMap[value];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className={selectedFont?.className}>
            {selectedFont?.name ?? "Select font..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search font..." />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup>
              {fontEntries.map((font) => (
                <CommandItem
                  key={font.id}
                  value={font.name}
                  onSelect={() => {
                    onChange(font.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === font.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className={font.className}>{font.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const fontWeightLabels: Record<number, string> = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black",
};

function FontStyleFields({
  form,
  prefix,
}: {
  form: DocumentFormReturn;
  prefix: "config.fonts.font1Style" | "config.fonts.font2Style";
}) {
  return (
    <div className="flex flex-col gap-4">
      <SliderInputField
        fieldName={`${prefix}.fontWeight`}
        form={form}
        label="Font Weight"
        min={100}
        max={900}
        step={100}
        className="w-full"
      />
      <SliderInputField
        fieldName={`${prefix}.lineHeight`}
        form={form}
        label="Line Height"
        min={0.5}
        max={4}
        step={0.1}
        className="w-full"
      />
      <SliderInputField
        fieldName={`${prefix}.letterSpacing`}
        form={form}
        label="Letter Spacing"
        min={-0.1}
        max={0.5}
        step={0.01}
        className="w-full"
      />
    </div>
  );
}

export function FontsForm({}: {}) {
  const form: DocumentFormReturn = useFormContext();

  return (
    <Form {...form}>
      <form className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="config.fonts.font1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font 1 (Titles)</FormLabel>
              <FontCombobox value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FontStyleFields form={form} prefix="config.fonts.font1Style" />

        <Separator />

        <FormField
          control={form.control}
          name="config.fonts.font2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font 2 (Body)</FormLabel>
              <FontCombobox value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FontStyleFields form={form} prefix="config.fonts.font2Style" />
      </form>
    </Form>
  );
}
