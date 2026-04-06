import { Button } from "@/components/ui/button";
// import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { getSlideNumber } from "@/lib/field-path";
import { useFormContext, useFieldArray } from "react-hook-form";
// import { NewElementDialogContent } from "@/components/new-element-dialog-content";
import {
  DocumentFormReturn,
  ElementArrayFieldPath,
} from "@/lib/document-form-types";
import { DescriptionSchema } from "@/lib/validation/text-schema";

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
    // {/* Dialog with element type selection commented out — directly adds Description */}
    <Button
      id={"add-element-" + pageNumber}
      className="border-dashed border-2 w-full bg-transparent h-10"
      variant={"outline"}
      onClick={() => append(DescriptionSchema.parse({}))}
    >
      <div className={`flex flex-col justify-center items-center`}>
        <Plus className="w-6 h-6" />
      </div>
    </Button>
  );
}
