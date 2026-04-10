import * as z from "zod";
import {
  ContentImageSchema,
  DEFAULT_BACKGROUND_IMAGE_INPUT,
  DEFAULT_CONTENT_IMAGE_INPUT,
  ImageSchema,
  UnstyledContentImageSchema,
} from "./image-schema";
import {
  TitleSchema,
  SubtitleSchema,
  DescriptionSchema,
  UnstyledTitleSchema,
  UnstyledSubtitleSchema,
  UnstyledDescriptionSchema,
} from "./text-schema";
import { XTwitterSchema } from "./xtwitter-schema";

export const SlideType = z.enum(["Intro", "Content", "Outro", "Common"]);
export type SlideType = z.infer<typeof SlideType>;

export const UnstyledElementSchema = z.discriminatedUnion("type", [
  UnstyledTitleSchema,
  UnstyledSubtitleSchema,
  UnstyledDescriptionSchema,
  UnstyledContentImageSchema,
]);

export const ElementSchema = z.discriminatedUnion("type", [
  TitleSchema,
  SubtitleSchema,
  DescriptionSchema,
  ContentImageSchema,
  ImageSchema,
  XTwitterSchema,
]);

export const UnstyledSlideSchema = z.object({
  elements: z.array(UnstyledElementSchema).max(3),
});

// TODO: Convert into: elements prop with an array of discriminated union of types
export const CommonSlideSchema = z.object({
  elements: z.array(ElementSchema).default([]),
  backgroundImage: ImageSchema.default(DEFAULT_BACKGROUND_IMAGE_INPUT),
  backgroundColor: z.string().optional(),
  // Bipolar gradient: sign = direction (negative = from bottom, positive = from top),
  // magnitude = % of slide height covered. 0 = off, ±100 = full slide.
  // undefined = defaults to -45 when a background image is present, otherwise 0.
  gradient: z.number().min(-100).max(100).optional(),
  // Gradient color (hex). undefined = default black.
  gradientColor: z.string().optional(),
});

export const UnstyledMultiSlideSchema = z.array(UnstyledSlideSchema);

export const MultiSlideSchema = z.array(CommonSlideSchema);
