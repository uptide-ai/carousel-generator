"use client";

import React from "react";
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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fontsMap } from "@/lib/fonts-map";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { SliderInputField } from "@/components/forms/fields/slider-input-field";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
} from "@/components/ui/form";

function InlineColorPicker({
  label,
  value,
  defaultColor,
  onChange,
  onReset,
}: {
  label: string;
  value: string | undefined;
  defaultColor: string;
  onChange: (color: string) => void;
  onReset: () => void;
}) {
  const displayColor = value || defaultColor;
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={displayColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 p-0 flex-shrink-0"
        />
        <input
          type="text"
          value={value || ""}
          placeholder={defaultColor}
          onChange={(e) => onChange(e.target.value || defaultColor)}
          className="flex-1 min-w-0 text-xs px-2 py-1 border rounded bg-background"
        />
        {value && (
          <button
            type="button"
            className="flex items-center text-muted-foreground hover:text-foreground flex-shrink-0"
            onClick={onReset}
            title="Reset"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

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
  const color = form.watch(`${prefix}.color` as any) as string | undefined;
  const defaultColor =
    prefix === "config.fonts.font1Style"
      ? form.watch("config.theme.primary")
      : form.watch("config.theme.secondary");
  return (
    <div className="flex flex-col gap-4">
      <InlineColorPicker
        label="Color"
        value={color}
        defaultColor={defaultColor}
        onChange={(c) => form.setValue(`${prefix}.color` as any, c)}
        onReset={() => form.setValue(`${prefix}.color` as any, undefined)}
      />
      <SliderInputField
        fieldName={`${prefix}.fontSize`}
        form={form}
        label="Font Size"
        min={8}
        max={120}
        step={1}
        className="w-full"
      />
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
      <FormField
        control={form.control}
        name={`${prefix}.textBalance` as any}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="text-sm font-medium">Text Balance</FormLabel>
          </FormItem>
        )}
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
