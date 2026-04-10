import React from "react";
import { cn } from "@/lib/utils";
import { fontIdToClassName } from "@/lib/fonts-map";
import { useFormContext } from "react-hook-form";
import { TextAreaFormField } from "@/components/forms/fields/text-area-form-field";
import {
  DocumentFormReturn,
  TextFieldPath,
  TextFieldStyle,
  StyleFieldPath,
  TextTextFieldPath,
} from "@/lib/document-form-types";

export function Description({
  fieldName,
  className = "",
}: {
  fieldName: TextFieldPath;
  className?: string;
}) {
  const form: DocumentFormReturn = useFormContext();
  const { getValues } = form;
  const config = getValues("config");
  const style = getValues(
    `${fieldName}.style` as StyleFieldPath
  ) as TextFieldStyle;
  const textFieldName = (fieldName + ".text") as TextTextFieldPath;
  const effectiveAlign =
    style.align ?? config.theme.contentAlign?.horizontal ?? "Left";

  return (
    <TextAreaFormField
      fieldName={textFieldName}
      form={form}
      label={""}
      placeholder={"Your description here"}
      className={cn(
        ``,
        fontIdToClassName(config.fonts.font2),
        className
      )}
      style={{
        color: style.color ?? config.fonts.font2Style?.color ?? config.theme.secondary,
        backgroundColor: style.backgroundColor ?? undefined,
        fontSize: `${style.fontSize ?? config.fonts.font2Style?.fontSize ?? 18}px`,
        fontWeight: config.fonts.font2Style?.fontWeight ?? 700,
        lineHeight: config.fonts.font2Style?.lineHeight ?? 1.3,
        letterSpacing: `${config.fonts.font2Style?.letterSpacing ?? 0}em`,
        marginBottom: `${style.paragraphSpacing ?? 0}em`,
        textWrap: config.fonts.font2Style?.textBalance ? "balance" : undefined,
        textAlign: effectiveAlign.toLowerCase() as "left" | "center" | "right",
      }}
    />
  );
}
