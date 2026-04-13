import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "./ui/button";
import { Download, FileImage, FileText, Loader2Icon, Undo2, Redo2 } from "lucide-react";
import Pager from "./pager";
import { FilenameForm } from "./forms/filename-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExportMode } from "@/lib/hooks/use-component-printer";
import { useHistoryContext } from "@/lib/providers/history-context";

interface MainNavProps {
  handlePrint: (mode: ExportMode) => void;
  isPrinting: boolean;
  className?: string;
}

export function MainNav({ handlePrint, isPrinting, className }: MainNavProps) {
  const [open, setOpen] = React.useState(false);
  const { undo, redo, canUndo, canRedo } = useHistoryContext();

  const handleExport = (mode: ExportMode) => {
    setOpen(false);
    handlePrint(mode);
  };

  return (
    <div
      className={cn(
        "flex gap-4 md:gap-10 justify-between items-center",
        className
      )}
    >
      <div className="flex gap-4 items-center">
        <Link href="/" className="items-center space-x-2 flex">
          <Icons.logo />
          <span className="hidden font-bold md:inline-block">
            Carousel Generator
          </span>
        </Link>
        <TooltipProvider delayDuration={300}>
          <div className="flex gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={undo}
                  disabled={!canUndo}
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={redo}
                  disabled={!canRedo}
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <div className="hidden lg:block">
        <Pager />
      </div>
      <div className="flex gap-2 items-center">
        <div className="hidden md:block">
          <FilenameForm />
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size={"icon"} disabled={isPrinting}>
              {isPrinting ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <Download />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => handleExport("pdf")}
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => handleExport("images")}
              >
                <FileImage className="h-4 w-4" />
                Images (ZIP)
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
