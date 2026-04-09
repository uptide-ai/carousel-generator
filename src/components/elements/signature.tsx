import React from "react";
import { ConfigSchema, DocumentSchema } from "@/lib/validation/document-schema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { fontIdToClassName } from "@/lib/fonts-map";

export function Signature({
  config,
  stacked,
  className,
}: {
  config: z.infer<typeof ConfigSchema>;
  stacked?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-start flex-row gap-3 items-center ${cn(
        className
      )}`}
    >
      {config.brand.avatar?.source.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={config.brand.avatar.source.src}
          alt={config.brand.name}
          className={`w-12 h-12 rounded-full`}
          style={{
            opacity: config.brand.avatar.style.opacity / 100,
          }}
        />
      )}
      <div className={stacked ? "flex flex-col items-start" : "flex items-center gap-2 flex-1 min-w-0"}>
        <p
          className={cn(`text-base truncate`, fontIdToClassName(config.fonts.font2))}
          style={{
            color: config.theme.primary,
          }}
        >
          {config.brand.name}
        </p>
        <p
          className={cn(
            `text-sm font-normal truncate`,
            fontIdToClassName(config.fonts.font2)
          )}
          style={{
            color: config.theme.secondary,
            opacity: stacked ? 0.7 : 1,
          }}
        >
          {config.brand.handle}
        </p>
      </div>
    </div>
  );
}
