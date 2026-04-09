import { cn } from "@/lib/utils";
import { fontIdToClassName } from "@/lib/fonts-map";
import { textStyleToClasses } from "@/lib/text-style-to-classes";
import { useFormContext } from "react-hook-form";
import {
  DocumentFormReturn,
  TextFieldPath,
  TextFieldStyle,
  StyleFieldPath,
  TextTextFieldPath,
} from "@/lib/document-form-types";
import { TextAreaFormField } from "@/components/forms/fields/text-area-form-field";

export function Subtitle({
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

  return (
    <TextAreaFormField
      fieldName={textFieldName}
      form={form}
      label={""}
      placeholder={"Your subtitle here"}
      className={cn(
        ``,
        textStyleToClasses({ style }),
        fontIdToClassName(config.fonts.font1),
        className
      )}
      style={{
        color: style.color ?? config.theme.secondary,
        backgroundColor: style.backgroundColor ?? undefined,
        fontSize: `${style.fontSize ?? Math.round((config.fonts.font1Style?.fontSize ?? 48) * 0.65)}px`,
        fontWeight: config.fonts.font1Style?.fontWeight ?? 700,
        lineHeight: config.fonts.font1Style?.lineHeight ?? 1.3,
        letterSpacing: `${config.fonts.font1Style?.letterSpacing ?? 0}em`,
        marginBottom: `${style.paragraphSpacing ?? 0}em`,
        textWrap: config.fonts.font1Style?.textBalance ? "balance" : undefined,
      }}
    />
  );
}
