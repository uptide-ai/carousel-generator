"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { useFieldsFileImporter } from "@/lib/hooks/use-fields-file-importer";
import { usePagerContext } from "@/lib/providers/pager-context";
import { defaultValues } from "@/lib/default-document";
import { JsonExporter } from "@/components/json-exporter";
import FileInputForm from "@/components/forms/file-input-form";
import { FilenameForm } from "@/components/forms/filename-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Upload,
  RotateCcw,
} from "lucide-react";

export function FileForm() {
  const { reset, watch }: DocumentFormReturn = useFormContext();
  const { setCurrentPage } = usePagerContext();

  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const { handleFileSubmission: handleConfigFileSubmission } =
    useFieldsFileImporter("config");
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const { handleFileSubmission: handleContentFileSubmission } =
    useFieldsFileImporter("slides");

  return (
    <div className="space-y-4 w-full">
      <FilenameForm className="text-left" />

      <Separator />

      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Settings
        </p>
        <Dialog
          open={isConfigDialogOpen}
          onOpenChange={setIsConfigDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 h-9">
              <Download className="h-4 w-4" />
              Import Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Load a file with Settings</DialogTitle>
            </DialogHeader>
            <FileInputForm
              handleSubmit={(files) => {
                handleConfigFileSubmission(files);
                setIsConfigDialogOpen(false);
              }}
              label={"Settings File"}
              description="Select a json file to load"
            />
          </DialogContent>
        </Dialog>
        <JsonExporter
          values={watch("config")}
          filename={"carousel-settings.json"}
        >
          <Button variant="ghost" className="w-full justify-start gap-2 h-9">
            <Upload className="h-4 w-4" />
            Export Settings
          </Button>
        </JsonExporter>
      </div>

      <Separator />

      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Content
        </p>
        <Dialog
          open={isContentDialogOpen}
          onOpenChange={setIsContentDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 h-9">
              <Download className="h-4 w-4" />
              Import Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Load a file with content</DialogTitle>
            </DialogHeader>
            <FileInputForm
              handleSubmit={(files) => {
                handleContentFileSubmission(files);
                setIsContentDialogOpen(false);
              }}
              label={"Content File"}
              description="Select a json file to load"
            />
          </DialogContent>
        </Dialog>
        <JsonExporter
          values={watch("slides")}
          filename={"carousel-content.json"}
        >
          <Button variant="ghost" className="w-full justify-start gap-2 h-9">
            <Upload className="h-4 w-4" />
            Export Content
          </Button>
        </JsonExporter>
      </div>

      <Separator />

      <Button
        variant="ghost"
        className="w-full justify-start gap-2 h-9 text-destructive hover:text-destructive"
        onClick={() => {
          reset(defaultValues as any);
          setCurrentPage(0);
        }}
      >
        <RotateCcw className="h-4 w-4" />
        Reset to defaults
      </Button>
    </div>
  );
}
