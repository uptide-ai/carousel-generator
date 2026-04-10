import * as z from "zod";

export const ColorSchema = z.object({
  // primary: z.string().min(4).max(9).regex(/^#/),
  primary: z.string().min(7).max(7).regex(/^#/),
  secondary: z.string(),
  background: z.string(),
});

export const HorizontalAlign = z.enum(["Left", "Center", "Right"]);
export type HorizontalAlign = z.infer<typeof HorizontalAlign>;

export const VerticalAlign = z.enum(["Top", "Center", "Bottom"]);
export type VerticalAlign = z.infer<typeof VerticalAlign>;

export const ContentAlignSchema = z.object({
  horizontal: HorizontalAlign.default("Left"),
  vertical: VerticalAlign.default("Center"),
});

export const ThemeSchema = ColorSchema.extend({
  isCustom: z.boolean(),
  pallette: z.string(),
  padding: z.number().min(0).max(80).default(30),
  contentAlign: ContentAlignSchema.default({}),
});
