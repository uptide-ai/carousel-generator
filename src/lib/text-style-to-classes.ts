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
  const classes = [];

  classes.push(
    align == TextALignType.enum.Left
      ? "text-left"
      : align == TextALignType.enum.Center
      ? "text-center"
      : align == TextALignType.enum.Right
      ? "text-right"
      : ""
  );
  return classes.join(" ");
}
