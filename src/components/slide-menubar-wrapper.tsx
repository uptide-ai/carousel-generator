"use client";
import {
  DocumentFormReturn,
  SlidesFieldArrayReturn,
} from "@/lib/document-form-types";
import { cn } from "@/lib/utils";

import { useSelectionContext } from "@/lib/providers/selection-context";
import SlideMenubar from "@/components/slide-menubar";

export default function SlideMenubarWrapper({
  // slidesFieldArray,
  fieldName, //TODO Maybe change with number or expose onclciks
  slidesFieldArray,
  children,
  className = "",
}: //
{
  // slidesFieldArray: SlidesFieldArrayReturn;
  fieldName: string;
  slidesFieldArray: SlidesFieldArrayReturn;
  children: React.ReactNode;
  className?: string;
}) {
  const { currentSelection } = useSelectionContext();

  // const { remove, swap, insert } = slidesFieldArray;
  return (
    <div className="relative w-fit" id={"slide-wrapper-" + fieldName}>
      <div
        id={`slide-menubar-${fieldName}`}
        className={cn(
          "absolute -top-10 left-1/2 -translate-x-1/2",
          // currentSelection != fieldName && "hidden",
          className
        )}
      >
        <SlideMenubar
          slidesFieldArray={slidesFieldArray}
          fieldName={fieldName}
        />
      </div>
      {children}
    </div>
  );
}
