import { useSelectionContext } from "@/lib/providers/selection-context";
import { getStyleSibling } from "../lib/field-path";
import { EnumRadioGroupField } from "@/components/forms/fields/enum-radio-group-field";
import {
  DocumentFormReturn,
  ElementFieldPath,
  ImageSourceFieldPath,
  ImageSourceSrcFieldPath,
  ImageStyleObjectFitFieldPath,
  ImageStyleOpacityFieldPath,
  StyleFieldPath,
  TextStyleAlignFieldPath,
} from "@/lib/document-form-types";
import { cn } from "@/lib/utils";
import React from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Minimize2,
  Maximize2,
  MoveHorizontal,
  Expand,
  X,
} from "lucide-react";
import { TextALignType } from "@/lib/validation/text-schema";
import { OpacityFormField } from "@/components/forms/fields/opacity-form-field";
import { ImageSourceFormField } from "@/components/forms/fields/image-source-form-field";
import { SliderInputField } from "@/components/forms/fields/slider-input-field";
import { ObjectFitType } from "@/lib/validation/image-schema";
import { ElementType } from "@/lib/validation/element-type";
import {
  TypographyFieldName,
  TypographyH3,
  TypographyH4,
  TypographyLarge,
} from "@/components/typography";
import { Separator } from "@/components/ui/separator";

const textAlignMap: Record<TextALignType, React.ReactElement> = {
  [TextALignType.enum.Left]: <AlignLeft className="h-4 w-4" />,
  [TextALignType.enum.Center]: <AlignCenter className="h-4 w-4" />,
  [TextALignType.enum.Right]: <AlignRight className="h-4 w-4" />,
};

// "Fill" mode is intentionally omitted — full-slide image is configured by
// clicking the slide itself (opens slide Style panel with backgroundImage).
const objectFitMap: Partial<Record<ObjectFitType, React.ReactElement>> = {
  [ObjectFitType.enum.Contain]: <Minimize2 className="h-4 w-4" />,
  [ObjectFitType.enum.Cover]: <Maximize2 className="h-4 w-4" />,
  [ObjectFitType.enum.Expand]: <MoveHorizontal className="h-4 w-4" />,
  // [ObjectFitType.enum.Fill]: <Expand className="h-4 w-4" />,
};

function InlineColorPicker({
  label,
  value,
  defaultColor,
  onChange,
  onReset,
}: {
  label: string;
  value: string | undefined;
  defaultColor: string;
  onChange: (color: string) => void;
  onReset: () => void;
}) {
  const displayColor = value || defaultColor;
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={displayColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 p-0 flex-shrink-0"
        />
        <input
          type="text"
          value={value || ""}
          placeholder={defaultColor}
          onChange={(e) => onChange(e.target.value || defaultColor)}
          className="flex-1 min-w-0 text-xs px-2 py-1 border rounded bg-background"
        />
        {value && (
          <button
            className="flex items-center text-muted-foreground hover:text-foreground flex-shrink-0"
            onClick={onReset}
            title="Reset"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function StyleMenu({
  form,
  className = "",
}: {
  form: DocumentFormReturn;
  className?: string;
}) {
  const { currentSelection: elementPath } = useSelectionContext();
  const stylePath = elementPath ? elementPath + ".style" : "";
  if (!stylePath) {
    return <></>;
  }
  const values = form.getValues(elementPath as ElementFieldPath);
  const style = (values as any).style;
  const type = values.type;
  const isTextElement =
    type === ElementType.enum.Title ||
    type === ElementType.enum.Subtitle ||
    type === ElementType.enum.Description;

  // Slide-level selection: path ends with ".backgroundImage"
  const isSlideSelection = elementPath?.endsWith(".backgroundImage") ?? false;
  const slidePath = isSlideSelection
    ? (elementPath as string).replace(/\.backgroundImage$/, "")
    : "";
  // Watch the slide background image src so the gradient default flips
  // between 0 (no image → off) and -45 (image → bottom fade) live.
  const slideBgImageSrc = isSlideSelection
    ? ((form.watch(
        `${slidePath}.backgroundImage.source.src` as any
      ) as string) ?? "")
    : "";
  const gradientDefaultValue = slideBgImageSrc ? -45 : 0;

  // Compute effective fontSize default based on element type and global config
  const config = form.getValues("config");
  const globalFont1Size = config.fonts.font1Style?.fontSize ?? 48;
  const globalFont2Size = config.fonts.font2Style?.fontSize ?? 18;
  const effectiveFontSize =
    type === ElementType.enum.Title
      ? globalFont1Size
      : type === ElementType.enum.Subtitle
      ? Math.round(globalFont1Size * 0.65)
      : globalFont2Size;

  const defaultTextColor =
    type === ElementType.enum.Title
      ? config.theme.primary
      : config.theme.secondary;

  return (
    <div
      className={cn("grid gap-4", className)}
      onClick={
        // Don't propagate click to background
        (event) => event.stopPropagation()
      }
      key={elementPath}
    >
      <div className="space-y-2">
        <TypographyH3>Style</TypographyH3>
        <p className="text-sm text-muted-foreground">
          {isSlideSelection
            ? "Set the selected slide style."
            : "Set the selected element style."}
        </p>
      </div>
      <Separator orientation="horizontal"></Separator>
      <div className="flex flex-col gap-6 items-start">
        {isTextElement ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Alignment</span>
              {(style as any)?.align ? (
                <button
                  type="button"
                  className="flex items-center text-xs text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    form.setValue(
                      `${stylePath}.align` as TextStyleAlignFieldPath,
                      undefined as any
                    )
                  }
                  title="Reset to global alignment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(Object.entries(textAlignMap) as [TextALignType, React.ReactElement][]).map(
                ([value, icon]) => (
                  <button
                    key={value}
                    type="button"
                    className={cn(
                      "h-10 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent",
                      (style as any)?.align === value &&
                        "bg-accent border-primary"
                    )}
                    onClick={() =>
                      form.setValue(
                        `${stylePath}.align` as TextStyleAlignFieldPath,
                        value
                      )
                    }
                  >
                    {icon}
                  </button>
                )
              )}
            </div>
          </div>
        ) : null}
        {isTextElement ? (
          <SliderInputField
            fieldName={`${stylePath}.fontSize`}
            form={form}
            label="Font Size"
            min={8}
            max={120}
            step={1}
            defaultValue={effectiveFontSize}
            className="w-full"
          />
        ) : null}
        {isTextElement ? (
          <>
            <InlineColorPicker
              label="Text Color"
              value={(style as any).color}
              defaultColor={defaultTextColor}
              onChange={(c) => form.setValue(`${stylePath}.color` as any, c)}
              onReset={() => form.setValue(`${stylePath}.color` as any, undefined)}
            />
            <InlineColorPicker
              label="Background Color"
              value={(style as any).backgroundColor}
              defaultColor="#ffffff"
              onChange={(c) => form.setValue(`${stylePath}.backgroundColor` as any, c)}
              onReset={() => form.setValue(`${stylePath}.backgroundColor` as any, undefined)}
            />
          </>
        ) : null}
        {style && Object.hasOwn(style, "paragraphSpacing") ? (
          <SliderInputField
            fieldName={`${stylePath}.paragraphSpacing`}
            form={form}
            label="Bottom Spacing"
            min={0}
            max={3}
            step={0.1}
            className="w-full"
          />
        ) : null}
        {type == ElementType.enum.Image ||
        type == ElementType.enum.ContentImage ? (
          <>
            <div className="w-full flex flex-col gap-3">
              <h4 className="text-base font-semibold">Image</h4>
              <TypographyFieldName>Source</TypographyFieldName>
              <ImageSourceFormField
                fieldName={`${elementPath}.source` as ImageSourceFieldPath}
                form={form}
              />
            </div>
          </>
        ) : null}
        {type == ElementType.enum.XTwitter ? (
          <p className="text-sm text-muted-foreground">
            This element uses your brand settings. Edit name, handle and avatar in the Settings tab.
          </p>
        ) : null}
        {style && Object.hasOwn(style, "objectFit") ? (
          <EnumRadioGroupField
            name={"Object Fit"}
            form={form}
            fieldName={`${stylePath}.objectFit` as ImageStyleObjectFitFieldPath}
            enumValueElements={objectFitMap as Record<ObjectFitType, React.ReactElement>}
            groupClassName="grid grid-cols-3 gap-1"
            itemClassName="h-10 w-10"
          />
        ) : null}
        {type === ElementType.enum.ContentImage &&
        style && "objectFit" in style && style.objectFit !== "Fill" ? (
          <SliderInputField
            fieldName={`${stylePath}.height`}
            form={form}
            label="Height"
            min={50}
            max={500}
            step={10}
            defaultValue={200}
            className="w-full"
          />
        ) : null}
        {type === ElementType.enum.ContentImage &&
        style && "objectFit" in style && style.objectFit !== "Contain" ? (
          <SliderInputField
            fieldName={`${stylePath}.objectPosition`}
            form={form}
            label="Vertical Position"
            min={0}
            max={100}
            step={1}
            defaultValue={50}
            className="w-full"
          />
        ) : null}
        {style && Object.hasOwn(style, "opacity") ? (
          <>
            <OpacityFormField
              fieldName={`${stylePath}.opacity` as ImageStyleOpacityFieldPath}
              form={form}
              label={"Opacity"}
              className="w-full"
              disabled={
                form.getValues(
                  `${elementPath}.source.src` as ImageSourceSrcFieldPath
                ) == ""
              }
            />
          </>
        ) : null}
        {isSlideSelection ? (
          <>
            <SliderInputField
              fieldName={`${slidePath}.gradient` as any}
              form={form}
              label="Gradient"
              min={-100}
              max={100}
              step={1}
              defaultValue={gradientDefaultValue}
              className="w-full"
            />
            <InlineColorPicker
              label="Gradient Color"
              value={form.getValues(`${slidePath}.gradientColor` as any)}
              defaultColor="#000000"
              onChange={(c) =>
                form.setValue(`${slidePath}.gradientColor` as any, c)
              }
              onReset={() =>
                form.setValue(`${slidePath}.gradientColor` as any, undefined)
              }
            />
            <InlineColorPicker
              label="Background Color"
              value={form.getValues(`${slidePath}.backgroundColor` as any)}
              defaultColor={config.theme.background}
              onChange={(c) =>
                form.setValue(`${slidePath}.backgroundColor` as any, c)
              }
              onReset={() =>
                form.setValue(
                  `${slidePath}.backgroundColor` as any,
                  undefined
                )
              }
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
