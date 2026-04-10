import React from "react";
import * as z from "zod";
import { ConfigSchema } from "@/lib/validation/document-schema";
import { cn } from "@/lib/utils";
import { fontIdToClassName } from "@/lib/fonts-map";
import { TitleSchema } from "@/lib/validation/text-schema";
import { useFormContext } from "react-hook-form";
import {
  DocumentFormReturn,
  TextFieldPath,
  TextFieldStyle,
  StyleFieldPath,
  TextTextFieldPath,
} from "@/lib/document-form-types";
import { TextAreaFormField } from "@/components/forms/fields/text-area-form-field";

export function Title({
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
      placeholder={"Your title here"}
      className={cn(
        ``,
        fontIdToClassName(config.fonts.font1),
        className
      )}
      style={{
        color: style.color ?? config.fonts.font1Style?.color ?? config.theme.primary,
        backgroundColor: style.backgroundColor ?? undefined,
        fontSize: `${style.fontSize ?? config.fonts.font1Style?.fontSize ?? 48}px`,
        fontWeight: config.fonts.font1Style?.fontWeight ?? 700,
        lineHeight: config.fonts.font1Style?.lineHeight ?? 1.3,
        letterSpacing: `${config.fonts.font1Style?.letterSpacing ?? 0}em`,
        marginBottom: `calc(${style.paragraphSpacing ?? 0}em - 0.2em)`,
        textWrap: config.fonts.font1Style?.textBalance ? "balance" : undefined,
        clipPath: "inset(0 0 0.2em 0)",
        textAlign: effectiveAlign.toLowerCase() as "left" | "center" | "right",
      } as React.CSSProperties}
    />
  );
}
