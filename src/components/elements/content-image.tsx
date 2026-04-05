/* eslint-disable @next/next/no-img-element */
import React from "react";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  ObjectFitType,
  ImageSchema,
  ContentImageSchema,
} from "@/lib/validation/image-schema";
import { useSelectionContext } from "@/lib/providers/selection-context";
import { getSlideNumber } from "@/lib/field-path";
import { usePagerContext } from "@/lib/providers/pager-context";
import { useFormContext } from "react-hook-form";
import {
  DocumentFormReturn,
  ElementFieldPath,
} from "@/lib/document-form-types";

export function ContentImage({
  fieldName,
  className,
  isFirst = false,
  isLast = false,
}: {
  fieldName: ElementFieldPath;
  className?: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const form: DocumentFormReturn = useFormContext();
  const { getValues } = form;
  const image = getValues(fieldName) as z.infer<typeof ContentImageSchema>;

  const { setCurrentPage } = usePagerContext();
  const { currentSelection, setCurrentSelection } = useSelectionContext();
  const pageNumber = getSlideNumber(fieldName);
  const source = image.source.src || "https://placehold.co/400x200";
  const isFill = image.style.objectFit == ObjectFitType.enum.Fill;
  const isExpand = image.style.objectFit == ObjectFitType.enum.Expand;

  return (
    <div
      id={"content-image-" + fieldName}
      className={cn(
        "flex flex-col w-full outline-transparent ring-offset-background",
        !isFill && !isExpand && "h-full rounded-md",
        currentSelection == fieldName &&
          "outline-input ring-2 ring-offset-2 ring-ring",
        !isFill && !isExpand && className
      )}
    >
      <img
        alt="slide image"
        src={source}
        className={cn(
          "overflow-hidden",
          isFill
            ? "hidden"
            : isExpand
            ? "object-cover w-full"
            : "rounded-md",
          image.style.objectFit == ObjectFitType.enum.Cover
            ? "object-cover w-full h-full"
            : image.style.objectFit == ObjectFitType.enum.Contain
            ? "object-contain w-fit h-fit"
            : ""
        )}
        style={{
          opacity: image.style.opacity / 100,
          ...(isExpand ? { height: "200px" } : {}),
        }}
        onClick={(event) => {
          setCurrentPage(pageNumber);
          setCurrentSelection(fieldName, event);
        }}
      />
      {isFill && (
        <div
          className="h-8 w-full flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-md cursor-pointer"
          onClick={(event) => {
            setCurrentPage(pageNumber);
            setCurrentSelection(fieldName, event);
          }}
        >
          Full slide image
        </div>
      )}
    </div>
  );
}

export function ContentImageFillLayer({
  fieldName,
}: {
  fieldName: ElementFieldPath;
}) {
  const form: DocumentFormReturn = useFormContext();
  const image = form.getValues(fieldName) as z.infer<typeof ContentImageSchema>;

  if (image.style.objectFit != ObjectFitType.enum.Fill) return null;
  if (!image.source.src) return null;

  return (
    <div className="w-full h-full absolute top-0 left-0 right-0 bottom-0 -z-5">
      <img
        alt="slide image"
        src={image.source.src}
        className="overflow-hidden object-cover w-full h-full"
        style={{
          opacity: image.style.opacity / 100,
        }}
      />
    </div>
  );
}
