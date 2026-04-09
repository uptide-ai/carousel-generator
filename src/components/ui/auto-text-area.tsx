"use client";

import TextareaAutosize from "react-textarea-autosize";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
type InputTitleProps = {
  title?: string;
  placeholder?: string;
};

const AutoTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="w-full rounded-md ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {/* @ts-ignore Style works ok */}
        <TextareaAutosize
          className={cn(
            "w-full rounded-md bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden resize-none p-0",
            className
          )}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

AutoTextarea.displayName = "Textarea";

export { AutoTextarea };
