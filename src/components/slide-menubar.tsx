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
  X,
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
import React, { useState, useRef, useEffect } from "react";

function SlideColorPicker({
  fieldName,
}: {
  fieldName: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { watch, setValue }: DocumentFormReturn = useFormContext();
  const bgColorPath = `${fieldName}.backgroundColor` as any;
  const currentBgColor = watch(bgColorPath);
  const globalBgColor = watch("config.theme.background");
  const displayColor = currentBgColor || globalBgColor;

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
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        title="Slide background color"
      >
        <span
          className="w-4 h-4 rounded-full flex-shrink-0 pointer-events-none"
          style={{ backgroundColor: displayColor, border: '1.75px solid hsl(var(--muted-foreground))' }}
        />
      </Button>
      {open && (
        <div
          className="absolute top-full right-0 mt-1 rounded-md border bg-popover p-3 shadow-md z-50"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={displayColor}
                onChange={(e) => setValue(bgColorPath, e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={currentBgColor || ""}
                placeholder={globalBgColor}
                onChange={(e) => setValue(bgColorPath, e.target.value || undefined)}
                className="w-20 text-xs px-2 py-1 border rounded bg-background"
              />
            </div>
            {currentBgColor && (
              <button
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setValue(bgColorPath, undefined)}
              >
                <X className="w-3 h-3" />
                Reset to global
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
      <SlideColorPicker fieldName={fieldName} />
      <Button
        onClick={() => {
          console.log({
            currentPage,
            pageValue: currentSlidesValues[currentPage],
          });
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
