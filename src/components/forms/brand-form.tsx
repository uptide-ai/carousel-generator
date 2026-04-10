"use client";
import { useFormContext } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DocumentFormReturn } from "@/lib/document-form-types";
import { ImageFormField } from "@/components/forms/fields/image-form-field";
import { BrandTemplate } from "@/lib/validation/brand-schema";

const TEMPLATE_OPTIONS: { value: BrandTemplate; label: string }[] = [
  { value: "FooterHandle", label: "Footer (Handle only)" },
  { value: "FooterFull", label: "Footer (Full)" },
  { value: "Tweet", label: "Tweet (Top)" },
];

export function BrandForm({}: {}) {
  const form: DocumentFormReturn = useFormContext(); // retrieve those props
  const showBrand = form.watch("config.brand.showBrand");

  return (
    <Form {...form}>
      <form className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="config.brand.template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!showBrand}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="config.brand.showBrand"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium">Show brand</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="config.pageNumber.showNumbers"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium">Show page numbers</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="config.brand.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className=""
                  disabled={!showBrand}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="config.brand.handle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Handle</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your handle"
                  className=""
                  disabled={!showBrand}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageFormField
          form={form}
          label="Avatar Image"
          fieldName="config.brand.avatar"
        />
      </form>
    </Form>
  );
}
