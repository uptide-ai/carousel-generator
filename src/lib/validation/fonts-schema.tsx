import * as z from "zod";

export const FontStyleSchema = z.object({
  lineHeight: z.number().min(0.5).max(4).default(1.3),
  letterSpacing: z.number().min(-0.1).max(0.5).default(0),
  fontWeight: z.number().min(100).max(900).step(100).default(700),
  textBalance: z.boolean().default(false),
  fontSize: z.number().min(8).max(200).default(48), // px — base size for this font
  color: z.string().optional(), // undefined = use theme primary/secondary
});

export const FontsSchema = z.object({
  font1: z.string(),
  font2: z.string(),
  font1Style: FontStyleSchema.default({}),
  font2Style: FontStyleSchema.default({}),
});
