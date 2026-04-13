import * as React from "react";

import { cn } from "@/lib/utils";

export interface FileInputButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  buttonLabel?: string;
  placeholder?: string;
}

const FileInputButton = React.forwardRef<HTMLInputElement, FileInputButtonProps>(
  ({ className, buttonLabel = "Choose File", placeholder = "No file chosen", onChange, disabled, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = React.useState<string>("");

    const setRefs = (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    return (
      <div
        className={cn(
          "flex h-10 w-full items-center rounded-md border border-input bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="mr-3 flex h-full items-center rounded-l-[calc(theme(borderRadius.md)-1px)] border-r border-input bg-muted px-4 font-medium text-foreground transition-colors hover:bg-muted/70 disabled:cursor-not-allowed"
        >
          {buttonLabel}
        </button>
        <span className="min-w-0 flex-1 truncate pr-3 text-muted-foreground">
          {fileName || placeholder}
        </span>
        <input
          {...props}
          ref={setRefs}
          type="file"
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setFileName(file?.name ?? "");
            onChange?.(e);
          }}
        />
      </div>
    );
  }
);
FileInputButton.displayName = "FileInputButton";

export { FileInputButton };
