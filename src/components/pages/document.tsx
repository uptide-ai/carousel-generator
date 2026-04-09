"use client";
import * as z from "zod";
import React, { useEffect } from "react";
import { DocumentSchema } from "@/lib/validation/document-schema";
import { SIZE } from "@/lib/page-size";
import { usePagerContext } from "@/lib/providers/pager-context";
import { cn } from "@/lib/utils";
import {
  SlideFieldPath,
  SlidesFieldArrayReturn,
} from "@/lib/document-form-types";
import { SlideType } from "@/lib/validation/slide-schema";
import { Plus } from "lucide-react";

import { getDefaultSlideOfType } from "@/lib/default-slides";
import { useFieldArrayValues } from "@/lib/hooks/use-field-array-values";
import { useRefContext } from "@/lib/providers/reference-context";
import { CommonPage } from "@/components/pages/common-page";
import SlideMenubarWrapper from "@/components/slide-menubar-wrapper";
import { Button } from "@/components/ui/button";

const PAGE_GAP_PX = 14;
const MENUBAR_HEIGHT = 40; // matches -top-10 (2.5rem) on menubar
const ROW_GAP_PX = 20;
const ADD_BUTTON_SIZE = 56; // w-14
const ADD_BUTTON_GAP = 14;

export function Document({
  document,
  slidesFieldArray,
  scale,
  isMobile,
}: {
  document: z.infer<typeof DocumentSchema>;
  slidesFieldArray: SlidesFieldArrayReturn;
  scale: number;
  isMobile: boolean;
}) {
  const docReference = useRefContext();

  const { currentPage, setCurrentPage } = usePagerContext();
  const { numPages } = useFieldArrayValues("slides");

  const { append } = slidesFieldArray;

  const fieldName = "slides";

  const cols = numPages <= 1 ? 1 : Math.ceil(numPages / 2);
  const rows = numPages <= 1 ? 1 : Math.min(2, numPages);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (
        tagName === "textarea" ||
        tagName === "input" ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && currentPage > 0) {
        event.preventDefault();
        setCurrentPage(currentPage - 1);
      } else if (event.key === "ArrowRight" && currentPage < numPages - 1) {
        event.preventDefault();
        setCurrentPage(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages, setCurrentPage]);

  const slideHeight = SIZE.height + MENUBAR_HEIGHT;

  if (isMobile) {
    return (
      <div className="flex flex-col items-center w-full">
        <div
          className="flex overflow-x-auto w-full items-start gap-2 pb-2"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            height: scale * (slideHeight + 8),
          }}
        >
          <div
            ref={docReference}
            id="element-to-download-as-pdf"
            className="flex gap-2"
          >
            {document.slides.map((slide, index) => (
              <div
                key={fieldName + "." + index}
                id={`carousel-item-${index}`}
              >
                <SlideMenubarWrapper
                  className="w-fit"
                  slidesFieldArray={slidesFieldArray}
                  fieldName={(fieldName + "." + index) as SlideFieldPath}
                >
                  <CommonPage
                    config={document.config}
                    slide={slide}
                    index={index}
                    size={SIZE}
                    fieldName={(fieldName + "." + index) as SlideFieldPath}
                    className={cn(
                      currentPage != index &&
                        "hover:brightness-90 hover:cursor-pointer"
                    )}
                  />
                </SlideMenubarWrapper>
              </div>
            ))}
          </div>
          <div className="flex items-center self-center" id="add-slide-1">
            <Button
              variant="outline"
              className="rounded-full w-7 h-7 p-0 bg-background/60 hover:bg-background/90 border border-border/50 shadow-sm"
              onClick={() => append(getDefaultSlideOfType(SlideType.enum.Content))}
            >
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const gridHeight =
    rows * slideHeight + (rows > 1 ? ROW_GAP_PX : 0);

  const gridWidth = cols * SIZE.width + (cols - 1) * PAGE_GAP_PX;
  const totalWidth = gridWidth + ADD_BUTTON_GAP + ADD_BUTTON_SIZE;

  // Position add button vertically centered with the 2nd row (or 1st if single row)
  const buttonTop =
    rows === 2
      ? slideHeight + ROW_GAP_PX + (slideHeight - ADD_BUTTON_SIZE) / 2
      : (slideHeight - ADD_BUTTON_SIZE) / 2;

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="relative"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          height: scale * gridHeight,
          width: totalWidth,
        }}
      >
        <div
          ref={docReference}
          id="element-to-download-as-pdf"
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${SIZE.width}px)`,
            columnGap: PAGE_GAP_PX,
            rowGap: ROW_GAP_PX,
          }}
        >
          {document.slides.map((slide, index) => (
            <div
              key={fieldName + "." + index}
              id={`carousel-item-${index}`}
              style={{ paddingTop: MENUBAR_HEIGHT }}
            >
              <SlideMenubarWrapper
                className="w-fit"
                slidesFieldArray={slidesFieldArray}
                fieldName={(fieldName + "." + index) as SlideFieldPath}
              >
                <CommonPage
                  config={document.config}
                  slide={slide}
                  index={index}
                  size={SIZE}
                  fieldName={(fieldName + "." + index) as SlideFieldPath}
                  className={cn(
                    currentPage != index && "hover:cursor-pointer"
                  )}
                />
              </SlideMenubarWrapper>
            </div>
          ))}
        </div>
        <Button
          id="add-slide-1"
          className="rounded-full w-14 h-14 p-0 bg-background/60 hover:bg-background/90 border border-border/50 shadow-sm absolute"
          style={{ right: 0, top: buttonTop }}
          variant="outline"
          onClick={() => append(getDefaultSlideOfType(SlideType.enum.Content))}
        >
          <Plus className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
