import { ElementType } from "@/lib/validation/element-type";
import * as z from "zod";

export const TextALignType = z.enum(["Left", "Center", "Right"]);
export type TextALignType = z.infer<typeof TextALignType>;

export const TextStyleSchema = z.object({
  fontSize: z.number().min(8).max(200).optional(), // px — undefined = computed from global font size
  align: TextALignType.default(TextALignType.enum.Left),
  lineHeight: z.number().min(0.5).max(4).default(1.3),
  letterSpacing: z.number().min(-0.1).max(0.5).default(0),
  paragraphSpacing: z.number().min(0).max(3).default(0),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
});

export const UnstyledTitleSchema = z.object({
  type: z
    .literal(ElementType.enum.Title)
    .describe(`Indicates that this is a '${ElementType.enum.Title}'.`),
  text: z
    .string()
    .max(160, {
      message: "Title must not be longer than 160 characters.",
    })
    .describe("A short title")
    .default(""),
});

// TODO use zod merge to add style
export const TitleSchema = UnstyledTitleSchema.merge(
  z.object({
    type: z.literal(ElementType.enum.Title).default(ElementType.enum.Title),
    style: TextStyleSchema.default({}),
  })
);

export const UnstyledSubtitleSchema = z.object({
  type: z
    .literal(ElementType.enum.Subtitle)
    .describe(`Indicates that this is a '${ElementType.enum.Subtitle}'.`),
  text: z
    .string()
    .max(160, {
      message: "Subtitle must not be longer than 160 characters.",
    })
    .describe("A short subtitle or secondary title")
    .default(""),
});

export const SubtitleSchema = UnstyledSubtitleSchema.merge(
  z.object({
    type: z
      .literal(ElementType.enum.Subtitle)
      .default(ElementType.enum.Subtitle),
    style: TextStyleSchema.default({}),
  })
);

export const UnstyledDescriptionSchema = z.object({
  type: z
    .literal(ElementType.enum.Description)
    .describe(`Indicates that this is a '${ElementType.enum.Description}'.`),
  text: z
    .string()
    // .max(240)
    .describe("A short description of less than 240 chars")
    .default(""),
});

export const DescriptionSchema = UnstyledDescriptionSchema.merge(
  z.object({
    type: z
      .literal(ElementType.enum.Description)
      .default(ElementType.enum.Description),
    style: TextStyleSchema.default({}),
  })
);

export const DEFAULT_TITLE: z.infer<typeof TitleSchema> = TitleSchema.parse({
  text: "YOUR TITLE",
});

export const DEFAULT_SUBTITLE: z.infer<typeof SubtitleSchema> =
  SubtitleSchema.parse({
    text: "Your awesome subtitle",
  });

export const DEFAULT_DESCRIPTION: z.infer<typeof DescriptionSchema> =
  DescriptionSchema.parse({
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, dolorum. awesome subtitle",
  });
