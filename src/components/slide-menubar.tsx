"use client";
import { Button } from "@/components/ui/button";
import { usePagerContext } from "@/lib/providers/pager-context";
import { DocumentSchema } from "@/lib/validation/document-schema";
import { useFormContext } from "react-hook-form";
import {
  CornerUpRight,
  CornerUpLeft,
  Copy,
  ImageDown,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DocumentFormReturn,
  SlidesFieldArrayReturn,
} from "@/lib/document-form-types";
import { useFieldArrayValues } from "@/lib/hooks/use-field-array-values";
import { cn } from "@/lib/utils";
import { getSlideNumber } from "@/lib/field-path";
import { SIZE } from "@/lib/page-size";
import { toPng } from "html-to-image";
import { useHistoryContext } from "@/lib/providers/history-context";
import React, { useState } from "react";

export default function SlideMenubar({
  slidesFieldArray,
  fieldName,
  className = "",
}: {
  slidesFieldArray: SlidesFieldArrayReturn;
  fieldName: string;
  className?: string;
}) {
  const { setCurrentPage } = usePagerContext();
  const { numPages } = useFieldArrayValues("slides");
  const { watch }: DocumentFormReturn = useFormContext(); // retrieve those props
  const currentSlidesValues = watch("slides");
  const filename = watch("filename");
  const currentPage = getSlideNumber(fieldName);
  const { remove, swap, insert } = slidesFieldArray;
  const { snapshot } = useHistoryContext();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportSlide = async () => {
    const element = document.getElementById(`page-base-${currentPage}`);
    if (!element || isExporting) return;
    setIsExporting(true);
    try {
      const SCALE = 1.8;
      const dataUrl = await toPng(element, {
        canvasWidth: SIZE.width * SCALE,
        canvasHeight: SIZE.height * SCALE,
        filter: (node) => {
          if (node instanceof HTMLElement) {
            const id = node.id || "";
            if (id.startsWith("add-element-") || id.startsWith("element-menubar-")) return false;
          }
          return true;
        },
      });
      const link = document.createElement("a");
      link.download = `${filename}-slide-${currentPage + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export slide:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-row gap-0 items-center bg-background rounded-md px-1 border",
        className
      )}
    >
      <Button
        onClick={() => {
          snapshot();
          swap(currentPage, currentPage - 1);
          setCurrentPage(currentPage - 1);
        }}
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        disabled={currentPage <= 0 || currentPage > numPages - 1}
      >
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </Button>
      <Button
        onClick={() => {
          snapshot();
          const insertPosition = currentPage;
          const values = JSON.parse(
            JSON.stringify(currentSlidesValues[insertPosition])
          );
          insert(insertPosition, values);
          // TODO A clone sets focus to an input and that resets current page back to `inserposition`
          setCurrentPage(insertPosition + 1);
        }}
        disabled={currentPage == 0 && numPages == 0}
        variant="ghost"
        className="w-8 h-8"
        size="icon"
      >
        <Copy className="w-4 h-4 text-muted-foreground" />
      </Button>
      <Button
        onClick={handleExportSlide}
        disabled={isExporting}
        variant="ghost"
        className="w-8 h-8"
        size="icon"
        title="Export slide as PNG"
      >
        <ImageDown className="w-4 h-4 text-muted-foreground" />
      </Button>
      <Button
        onClick={() => {
          snapshot();
          remove(currentPage);
          if (currentPage > 0) {
            // setNumPages(numPages - 1);
            setCurrentPage(currentPage - 1);
          } else if (currentPage == 0 && numPages > 0) {
            setCurrentPage(0);
          } else if (currentPage < 0 || currentPage >= numPages) {
            console.error("Current page number not valid: ", currentPage);
          }
        }}
        disabled={currentPage == 0 && numPages == 0}
        variant="ghost"
        className="w-8 h-8"
        size="icon"
      >
        <Trash className="w-4 h-4 text-muted-foreground" />
      </Button>
      <Button
        onClick={() => {
          snapshot();
          swap(currentPage, currentPage + 1);
          setCurrentPage(currentPage + 1);
        }}
        variant="ghost"
        className="w-8 h-8"
        size="icon"
        disabled={currentPage >= numPages - 1}
      >
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
