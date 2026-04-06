import * as z from "zod";
import { MultiSlideSchema } from "@/lib/validation/slide-schema";
import { SlideType } from "@/lib/validation/slide-schema";

import { getDefaultSlideOfType } from "@/lib/default-slides";
import { DEFAULT_IMAGE_INPUT } from "@/lib/validation/image-schema";

const defaultSlideValues: z.infer<typeof MultiSlideSchema> = [
  getDefaultSlideOfType(SlideType.enum.Intro),
  getDefaultSlideOfType(SlideType.enum.Common),
  getDefaultSlideOfType(SlideType.enum.Content),
  getDefaultSlideOfType(SlideType.enum.Content),
  getDefaultSlideOfType(SlideType.enum.Outro),
];

export const defaultValues = {
  slides: defaultSlideValues,
  config: {
    brand: {
      showBrand: false,
      avatar: DEFAULT_IMAGE_INPUT,
      name: "My name",
      handle: "@name",
    },
    theme: {
      isCustom: false,
      pallette: "black",
      primary: "#0d0d0d",
      secondary: "#161616",
      background: "#ffffff",
      padding: 40,
    },
    fonts: {
      font1: "Anton",
      font2: "Inter",
      font1Style: { lineHeight: 1.3, letterSpacing: 0, fontWeight: 500, textBalance: true, fontSize: 48 },
      font2Style: { lineHeight: 1.3, letterSpacing: -0.01, fontWeight: 500, textBalance: true, fontSize: 18 },
    },
    pageNumber: {
      showNumbers: false,
    },
  },
  filename: "My Carousel File",
};
