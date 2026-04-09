"use client";

import { useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { TemplateType } from "@/lib/validation/template-schema";
import { getDefaultSlidesForTemplate } from "@/lib/default-slides";
import { cn } from "@/lib/utils";

const TEMPLATES: { value: TemplateType; label: string; description: string }[] =
  [
    {
      value: "default",
      label: "Default",
      description: "Standard layout with title, subtitle and description.",
    },
    {
      value: "tweet",
      label: "Tweet",
      description: "Profile header at the top, followed by post body.",
    },
  ];

export function TemplateForm() {
  const form: DocumentFormReturn = useFormContext();

  return (
    <Form {...form}>
      <form className="space-y-2 w-full">
        <FormField
          control={form.control}
          name="config.template"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((t) => (
                  <FormControl key={t.value}>
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(t.value);
                        form.setValue("slides", getDefaultSlidesForTemplate(t.value));
                      }}
                      className={cn(
                        "rounded-md border-2 p-3 text-left transition-colors",
                        field.value === t.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <FormLabel className="block text-sm font-semibold cursor-pointer">
                        {t.label}
                      </FormLabel>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.description}
                      </p>
                    </button>
                  </FormControl>
                ))}
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
