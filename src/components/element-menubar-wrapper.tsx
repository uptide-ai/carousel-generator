"use client";
import { useFormContext } from "react-hook-form";
import {
  Copy,
  Trash,
  ChevronUp,
  ChevronDown,
  ArrowRightLeft,
} from "lucide-react";
import {
  DocumentFormReturn,
  ElementFieldPath,
} from "@/lib/document-form-types";
import { useFieldArrayValues } from "@/lib/hooks/use-field-array-values";
import { cn } from "@/lib/utils";
import { useFieldArray } from "react-hook-form";
import { getParent, getElementNumber } from "@/lib/field-path";
import { useSelectionContext } from "@/lib/providers/selection-context";
import { useHistoryContext } from "@/lib/providers/history-context";
import React, { useState, useRef, useEffect } from "react";
import { ElementType } from "@/lib/validation/element-type";
import { TitleSchema, SubtitleSchema, DescriptionSchema } from "@/lib/validation/text-schema";
import { ContentImageSchema } from "@/lib/validation/image-schema";
import { XTwitterSchema } from "@/lib/validation/xtwitter-schema";

const ELEMENT_TYPE_LABELS: Record<string, string> = {
  [ElementType.enum.Title]: "Title",
  [ElementType.enum.Subtitle]: "Subtitle",
  [ElementType.enum.Description]: "Description",
  [ElementType.enum.ContentImage]: "Image",
  [ElementType.enum.XTwitter]: "X/Twitter",
};

function getDefaultForType(type: string) {
  switch (type) {
    case ElementType.enum.Title:
      return TitleSchema.parse({});
    case ElementType.enum.Subtitle:
      return SubtitleSchema.parse({});
    case ElementType.enum.Description:
      return DescriptionSchema.parse({});
    case ElementType.enum.ContentImage:
      return ContentImageSchema.parse({});
    case ElementType.enum.XTwitter:
      return XTwitterSchema.parse({});
    default:
      return TitleSchema.parse({});
  }
}

function ChangeTypeDropdown({
  currentType,
  onChangeType,
}: {
  currentType: string;
  onChangeType: (type: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="inline-flex items-center justify-center w-6 h-6 disabled:pointer-events-none disabled:opacity-50"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
      </button>
      {open && (
        <div
          className="absolute top-full right-0 mt-1 w-32 rounded-md border bg-popover p-1 shadow-md z-50"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(ELEMENT_TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              className={cn(
                "w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground",
                type === currentType && "bg-secondary text-secondary-foreground opacity-50 pointer-events-none"
              )}
              onClick={() => {
                onChangeType(type);
                setOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ElementMenubar({
  fieldName,
  className = "",
}: {
  fieldName: ElementFieldPath;
  className?: string;
}) {
  const { numPages: numElements } = useFieldArrayValues(getParent(fieldName));
  const { watch, setValue }: DocumentFormReturn = useFormContext();
  const { control } = useFormContext();
  const { swap, remove, insert } = useFieldArray({
    control,
    name: getParent(fieldName),
  });
  const { setCurrentSelection } = useSelectionContext();
  const { snapshot } = useHistoryContext();
  const currentElementNumber = getElementNumber(fieldName);
  const parentPath = getParent(fieldName);
  const currentElementValue = watch(fieldName);
  const currentType = currentElementValue?.type;

  const handleChangeType = (newType: string) => {
    snapshot();
    const newElement = getDefaultForType(newType);
    if (currentElementValue && "text" in currentElementValue && currentElementValue.text && "text" in newElement) {
      (newElement as any).text = currentElementValue.text;
    }
    setValue(fieldName, newElement as any);
  };

  return (
    <div
      className={cn(
        "flex flex-row gap-0 bg-background rounded-md px-1 border border-border",
        className
      )}
    >
      <button
        onClick={() => {
          snapshot();
          swap(currentElementNumber, currentElementNumber - 1);
          setCurrentSelection(`${parentPath}.${currentElementNumber - 1}` as ElementFieldPath, null);
        }}
        className="inline-flex items-center justify-center w-6 h-6 disabled:pointer-events-none disabled:opacity-50"
        disabled={currentElementNumber <= 0 || currentElementNumber > numElements - 1}
      >
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      </button>
      <button
        onClick={() => {
          snapshot();
          const insertPosition = currentElementNumber;
          const values = JSON.parse(JSON.stringify(currentElementValue));
          insert(insertPosition, values);
        }}
        disabled={currentElementNumber == 0 && numElements == 0}
        className="inline-flex items-center justify-center w-6 h-6 disabled:pointer-events-none disabled:opacity-50"
      >
        <Copy className="w-4 h-4 text-muted-foreground" />
      </button>
      <button
        onClick={() => {
          snapshot();
          remove(currentElementNumber);
        }}
        disabled={currentElementNumber == 0 && numElements == 0}
        className="inline-flex items-center justify-center w-6 h-6 disabled:pointer-events-none disabled:opacity-50"
      >
        <Trash className="w-4 h-4 text-muted-foreground" />
      </button>
      <ChangeTypeDropdown
        currentType={currentType}
        onChangeType={handleChangeType}
      />
      <button
        onClick={() => {
          snapshot();
          swap(currentElementNumber, currentElementNumber + 1);
          setCurrentSelection(`${parentPath}.${currentElementNumber + 1}` as ElementFieldPath, null);
        }}
        className="inline-flex items-center justify-center w-6 h-6 disabled:pointer-events-none disabled:opacity-50"
        disabled={currentElementNumber >= numElements - 1}
      >
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}

const ElementMenubarWrapper = React.forwardRef<
  HTMLDivElement,
  {
    fieldName: ElementFieldPath;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
>(function ElementMenubarWrapper(
  {
    fieldName,
    children,
    className = "",
    style,
  },
  ref
) {
  const { currentSelection } = useSelectionContext();
  return (
    <div className="relative" ref={ref} style={style}>
      <div
        id={`element-menubar-${fieldName}`}
        className={cn(
          "flex flex-row absolute -top-9 right-0 z-50",
          currentSelection != fieldName && "hidden",
          className
        )}
      >
        <ElementMenubar
          fieldName={fieldName}
          className={className}
        />
      </div>
      {children}
    </div>
  );
});

export default ElementMenubarWrapper;
