import * as z from "zod";
import {
  TextALignType,
  TextStyleSchema,
} from "@/lib/validation/text-schema";

export function textStyleToClasses({
  style,
}: {
  style: z.infer<typeof TextStyleSchema>;
}): string {
  const { align } = style;
  if (!align) return "";
  if (align === TextALignType.enum.Left) return "text-left";
  if (align === TextALignType.enum.Center) return "text-center";
  if (align === TextALignType.enum.Right) return "text-right";
  return "";
}
