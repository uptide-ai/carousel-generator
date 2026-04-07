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

import { DocumentFormReturn } from "@/lib/document-form-types";
import { ImageFormField } from "@/components/forms/fields/image-form-field";

export function BrandForm({}: {}) {
  const form: DocumentFormReturn = useFormContext(); // retrieve those props
  const showBrand = form.watch("config.brand.showBrand");

  return (
    <Form {...form}>
      <form className="space-y-6 w-full">
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
