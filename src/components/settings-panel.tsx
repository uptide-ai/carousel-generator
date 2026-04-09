"use client";

import Link from "next/link";
// import { SidebarNavItem } from "types/nav";

import { cn } from "@/lib/utils";
import { BrandForm } from "@/components/forms/brand-form";
import { ThemeForm } from "@/components/forms/theme-form";
import {
  VerticalTabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from "@/components/ui/vertical-tabs";
import { usePagerContext } from "@/lib/providers/pager-context";
import { Separator } from "@/components/ui/separator";
import { FontsForm } from "@/components/forms/fonts-form";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Briefcase,
  Brush,
  FileDigit,
  FolderOpen,
  LucideIcon,
  Palette,
  Plus,
  Sparkles,
  Type,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Drawer } from "vaul";
import { DrawerContent, DrawerTrigger } from "@/components/drawer";
import { ReactNode, useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { ScrollBar } from "./ui/scroll-area";
import { useSelectionContext } from "@/lib/providers/selection-context";
import { useFieldsFileImporter } from "@/lib/hooks/use-fields-file-importer";
import { defaultValues } from "@/lib/default-document";
import { StyleMenu } from "@/components/style-menu";
import { useFormContext } from "react-hook-form";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { FileForm } from "@/components/forms/file-form";
import { TemplateForm } from "@/components/forms/template-form";
import { AIPanel } from "@/components/ai-panel";

type TabInfo = {
  name: string;
  value: string;
  icon: LucideIcon;
};

const ALL_FORMS: Record<string, TabInfo> = {
  settings: {
    name: "Settings",
    value: "settings",
    icon: Briefcase,
  },
  theme: {
    name: "Theme",
    value: "theme",
    icon: Palette,
  },
  fonts: {
    name: "Fonts",
    value: "fonts",
    icon: Type,
  },
  ai: {
    name: "AI",
    value: "ai",
    icon: Sparkles,
  },
  file: {
    name: "File",
    value: "file",
    icon: FolderOpen,
  },
};

export function SidebarPanel({ className }: { className?: string }) {
  const form: DocumentFormReturn = useFormContext();
  const { currentSelection } = useSelectionContext();

  return (
    <div className={cn("h-full flex flex-1", className)}>
      <aside className="top-14 z-30 hidden h-full w-full shrink-0 md:sticky md:block border-r">
        <SidebarTabsPanel />
      </aside>
      <div className="block md:hidden h-0">
        <Drawer.Root modal={true}>
          <DrawerTrigger>
            <CircularFloatingButton className="bottom-28 left-4">
              <Plus className="w-4 h-4" />
            </CircularFloatingButton>
          </DrawerTrigger>
          <DrawerContent className="h-[60%] ">
            <DrawerFormsPanel className="mt-8" />
          </DrawerContent>
        </Drawer.Root>
      </div>
      <div className="block md:hidden h-0">
        <Drawer.Root modal={true}>
          <DrawerTrigger>
            {currentSelection ? (
              <CircularFloatingButton className="bottom-28 right-4">
                <Brush className="w-4 h-4" />
              </CircularFloatingButton>
            ) : null}
          </DrawerTrigger>
          <DrawerContent className="h-[40%] ">
            <StyleMenu form={form} className={"m-3"} />
          </DrawerContent>
        </Drawer.Root>
      </div>
    </div>
  );
}

function VerticalTabTriggerButton({ tabInfo }: { tabInfo: TabInfo }) {
  const { setCurrentSelection } = useSelectionContext();
  //  TODO Convert this comp into a forwardref like its child
  return (
    <VerticalTabsTrigger
      value={tabInfo.value}
      className="h-16 flex flex-col gap-2 items-center py-2 justify-center"
      onFocus={() => setCurrentSelection("", null)}
    >
      <tabInfo.icon className="h-4 w-4" />
      <span className="sr-only ">{tabInfo.name}</span>
      <p className="text-xs">{tabInfo.name}</p>
    </VerticalTabsTrigger>
  );
}

function HorizontalTabTriggerButton({ tabInfo }: { tabInfo: TabInfo }) {
  const { setCurrentSelection } = useSelectionContext();
  //  TODO Convert this comp into a forwardref like its child
  return (
    <TabsTrigger
      value={tabInfo.value}
      className="h-16 flex flex-col gap-2 items-center py-2 justify-center"
      onFocus={() => setCurrentSelection("", null)}
    >
      <tabInfo.icon className="h-4 w-4" />
      <span className="sr-only ">{tabInfo.name}</span>
      <p className="text-xs">{tabInfo.name}</p>
    </TabsTrigger>
  );
}

export function SidebarTabsPanel() {
  const { currentSelection } = useSelectionContext();
  const [tab, setTab] = useState(ALL_FORMS.settings.value);
  const form: DocumentFormReturn = useFormContext();

  return (
    <VerticalTabs
      value={currentSelection ? "" : tab}
      onValueChange={(val) => {
        if (val) {
          setTab(val);
        }
      }}
      className="flex-1 h-full p-0"
    >
      <div className="flex flex-row h-full w-full">
        <ScrollArea className="border-r h-full bg-muted">
          <VerticalTabsList className="grid grid-cols-1 gap-2 w-20 rounded-none">
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.settings} />
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.theme} />
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.fonts} />
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.ai} />
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.file} />
          </VerticalTabsList>
        </ScrollArea>
        <div className="p-2 flex flex-col items-stretch w-full ">
          {currentSelection ? (
            <StyleMenu form={form} className={"m-3"} />
          ) : null}
          <VerticalTabsContent
            value={ALL_FORMS.settings.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.settings.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <h5 className="text-sm font-medium mb-2">Template</h5>
            <TemplateForm />
            <Separator className="mt-6 mb-4"></Separator>
            <BrandForm />
            <Separator className="mt-6 mb-4"></Separator>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                form.reset(defaultValues);
                localStorage.removeItem("documentFormKey");
              }}
            >
              Reset all
            </Button>
          </VerticalTabsContent>
          <VerticalTabsContent
            value={ALL_FORMS.theme.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.theme.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <ThemeForm />
          </VerticalTabsContent>
          <VerticalTabsContent
            value={ALL_FORMS.fonts.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.fonts.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <FontsForm />
          </VerticalTabsContent>
          <VerticalTabsContent
            value={ALL_FORMS.ai.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <AIPanel />
          </VerticalTabsContent>
          <VerticalTabsContent
            value={ALL_FORMS.file.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.file.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <FileForm />
          </VerticalTabsContent>
        </div>
      </div>
    </VerticalTabs>
  );
}

export function DrawerFormsPanel({ className }: { className: string }) {
  const { currentSelection } = useSelectionContext();
  const [tab, setTab] = useState(ALL_FORMS.settings.value);
  const form: DocumentFormReturn = useFormContext();

  return (
    <Tabs
      value={currentSelection ? "" : tab}
      onValueChange={(val) => {
        if (val) {
          setTab(val);
        }
      }}
      className={cn("flex-1 w-full", className)}
    >
      <div className="flex flex-col h-full ">
        <ScrollArea className=" border-b h-full bg-muted">
          <TabsList className="grid grid-cols-5 gap-2 h-20 rounded-none">
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.settings} />
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.theme} />
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.fonts} />
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.ai} />
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.file} />
          </TabsList>
        </ScrollArea>
        <div className="p-2 w-[320px] m-auto">
          <TabsContent
            value={ALL_FORMS.settings.value}
            className="mt-0 border-0 p-0 m-4 "
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.settings.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <h5 className="text-sm font-medium mb-2">Template</h5>
            <TemplateForm />
            <Separator className="mt-6 mb-4"></Separator>
            <BrandForm />
          </TabsContent>
          <TabsContent
            value={ALL_FORMS.theme.value}
            className="mt-0 border-0 p-0 m-4 "
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.theme.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <ThemeForm />
          </TabsContent>
          <TabsContent
            value={ALL_FORMS.fonts.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.fonts.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <FontsForm />
          </TabsContent>
          <TabsContent
            value={ALL_FORMS.ai.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <AIPanel />
          </TabsContent>
          <TabsContent
            value={ALL_FORMS.file.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.file.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <FileForm />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}

const CircularFloatingButton = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "default",
          size: "icon",
        }),
        "fixed bottom-4 right-4 rounded-full w-12 h-12 ",
        className
      )}
    >
      {children}
    </div>
  );
};
