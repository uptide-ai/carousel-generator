import React from "react";
import { cn } from "@/lib/utils";
import { usePagerContext } from "@/lib/providers/pager-context";
import { getSlideNumber } from "@/lib/field-path";
import { useSelection } from "@/lib/hooks/use-selection";
import { useSelectionContext } from "@/lib/providers/selection-context";
import {
  HorizontalAlign,
  VerticalAlign,
} from "@/lib/validation/theme-schema";

const VERTICAL_JUSTIFY: Record<VerticalAlign, string> = {
  Top: "justify-start",
  Center: "justify-center",
  Bottom: "justify-end",
};

const HORIZONTAL_TEXT_ALIGN: Record<HorizontalAlign, string> = {
  Left: "text-left",
  Center: "text-center",
  Right: "text-right",
};

export function PageLayout({
  children,
  fieldName,
  className,
  horizontalAlign = "Left",
  verticalAlign = "Center",
}: {
  children: React.ReactNode;
  fieldName: string;
  className?: string;
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
}) {
  const { setCurrentPage } = usePagerContext();
  const { setCurrentSelection } = useSelectionContext();
  const pageNumber = getSlideNumber(fieldName);

  return (
    <div
      className={cn(
        "flex flex-col grow items-stretch",
        VERTICAL_JUSTIFY[verticalAlign],
        HORIZONTAL_TEXT_ALIGN[horizontalAlign],
        className
      )}
      onClick={(event) => {
        setCurrentPage(pageNumber);
        setCurrentSelection(fieldName, event);
      }}
    >
      {children}
    </div>
  );
}
