import { useFieldArray, useFormContext } from "react-hook-form";
import {
  DocumentFormReturn,
  SlidesFieldArrayReturn,
} from "@/lib/document-form-types";
import { Document } from "./pages/document";
import useWindowDimensions from "@/lib/hooks/use-window-dimensions";
import { SIZE } from "@/lib/page-size";
import { useEffect } from "react";
import { useStatusContext } from "@/lib/providers/editor-status-context";
import { DocumentSkeleton } from "@/components/editor-skeleton";
import { useFieldArrayValues } from "@/lib/hooks/use-field-array-values";

interface SlidesEditorProps {}

export function SlidesEditor({}: SlidesEditorProps) {
  const form: DocumentFormReturn = useFormContext();
  const { control, watch } = form;
  const document = watch();
  const { width } = useWindowDimensions();
  const windowWidth = width || 0;
  const isLoadingWidth = !windowWidth;
  const slidesFieldArray: SlidesFieldArrayReturn = useFieldArray({
    control,
    name: "slides",
  });
  const { status, setStatus } = useStatusContext();
  const { numPages } = useFieldArrayValues("slides");

  useEffect(() => {
    setStatus("ready");
  }, [setStatus]);

  const mdWindowWidthPx = 770;
  const isMobile = windowWidth <= mdWindowWidthPx;
  const sidebarWidth = isMobile ? 0 : 320;
  const availableWidth = windowWidth - sidebarWidth - 64; // 64px for padding

  const PAGE_GAP_PX = 14;
  const ADD_BUTTON_AREA = 70; // 14px gap + 56px button

  let scale: number;
  if (isMobile) {
    scale = Math.min(1, windowWidth / 1.2 / SIZE.width);
  } else {
    const cols = numPages <= 1 ? 1 : Math.ceil(numPages / 2);
    const gridWidth = cols * SIZE.width + (cols - 1) * PAGE_GAP_PX + ADD_BUTTON_AREA;
    scale = Math.min(1, availableWidth / gridWidth);
  }

  return (
    <div className="flex flex-col w-full items-center justify-start bg-muted/20 flex-1 h-full">
      <div className="flex flex-col p-4 w-full h-full items-center justify-start gap-8 font-mono text-sm bg-primary/10">
        <div className="w-full px-4 py-6">
          {isLoadingWidth || status == "loading" ? (
            <DocumentSkeleton />
          ) : (
            <Document
              document={document}
              slidesFieldArray={slidesFieldArray}
              scale={scale}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
