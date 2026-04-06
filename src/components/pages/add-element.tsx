import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getSlideNumber } from "@/lib/field-path";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  DocumentFormReturn,
  ElementArrayFieldPath,
} from "@/lib/document-form-types";
import { DescriptionSchema } from "@/lib/validation/text-schema";
import { cn } from "@/lib/utils";

export function AddElement({
  className,
  fieldName,
}: {
  className?: string;
  fieldName: ElementArrayFieldPath;
}) {
  const pageNumber = getSlideNumber(fieldName);
  const form: DocumentFormReturn = useFormContext();
  const { append } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  return (
    <Button
      id={"add-element-" + pageNumber}
      className={cn(
        "rounded-full w-7 h-7 p-0 bg-background/60 hover:bg-background/90 border border-border/50 shadow-sm",
        className
      )}
      variant={"outline"}
      onClick={() => append(DescriptionSchema.parse({}))}
    >
      <Plus className="w-3.5 h-3.5 text-muted-foreground" />
    </Button>
  );
}
