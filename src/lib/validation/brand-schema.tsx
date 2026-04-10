import * as z from "zod";
import { DEFAULT_IMAGE_INPUT, ImageSchema } from "./image-schema";

export const BrandTemplate = z.enum(["FooterFull", "FooterHandle", "Tweet"]);
export type BrandTemplate = z.infer<typeof BrandTemplate>;

export const BrandSchema = z.object({
  showBrand: z.boolean().default(true),
  template: BrandTemplate.default(BrandTemplate.enum.FooterHandle),
  avatar: ImageSchema.default(DEFAULT_IMAGE_INPUT),
  name: z
    .string()
    .min(2, {
      message: "Name be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  handle: z.string(),
});
