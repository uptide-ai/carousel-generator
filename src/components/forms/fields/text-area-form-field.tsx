import { AutoTextarea } from "@/components/ui/auto-text-area";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DocumentFormReturn,
  TextTextFieldPath,
} from "@/lib/document-form-types";
import { getParent } from "@/lib/field-path";
import { useSelectionContext } from "@/lib/providers/selection-context";
import {
  hasInlineMarkdown,
  parseInlineMarkdown,
} from "@/lib/inline-markdown";
import { cn } from "@/lib/utils";
import { CSSProperties, useEffect, useRef, useState } from "react";

export function TextAreaFormField({
  form,
  fieldName,
  label,
  placeholder,
  className = "",
  style = {},
}: {
  form: DocumentFormReturn;
  fieldName: TextTextFieldPath;
  label: string;
  placeholder: string;
  className?: string;
  style?: CSSProperties;
}) {
  const { setCurrentSelection } = useSelectionContext();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // When switching into edit mode, move focus to the textarea.
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }, [isEditing]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        const value = (field.value as string) ?? "";
        const showRendered =
          !isEditing && value.length > 0 && hasInlineMarkdown(value);

        return (
          <FormItem className={"space-y-0"}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {showRendered ? (
                <div
                  className={cn(className, "cursor-text")}
                  style={{
                    ...style,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    setCurrentSelection(getParent(fieldName), event);
                    setIsEditing(true);
                  }}
                  dangerouslySetInnerHTML={{
                    __html: parseInlineMarkdown(value),
                  }}
                />
              ) : (
                <AutoTextarea
                  placeholder={placeholder}
                  className={className}
                  style={style}
                  {...field}
                  ref={(el) => {
                    textareaRef.current = el;
                    if (typeof field.ref === "function") {
                      field.ref(el);
                    }
                  }}
                  onFocus={(event) => {
                    setIsEditing(true);
                    setCurrentSelection(getParent(fieldName), event);
                  }}
                  onBlur={() => {
                    field.onBlur();
                    setIsEditing(false);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  value={value}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
