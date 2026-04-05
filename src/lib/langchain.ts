import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  MultiSlideSchema,
  UnstyledMultiSlideSchema,
} from "@/lib/validation/slide-schema";
import { UnstyledDocumentSchema } from "@/lib/validation/document-schema";
import {
  UnstyledTitleSchema,
  UnstyledDescriptionSchema,
  UnstyledSubtitleSchema,
} from "@/lib/validation/text-schema";

const carouselToolSchema = {
  name: "carouselCreator",
  description: "Creates a carousel with multiple slides for a given topic.",
  input_schema: zodToJsonSchema(UnstyledDocumentSchema, {
    definitions: {
      UnstyledTitleSchema,
      UnstyledSubtitleSchema,
      UnstyledDescriptionSchema,
    },
  }) as Anthropic.Tool["input_schema"],
};

const systemPrompt = `
Create a Carousel of slides following these rules

Arguments Schema Instructions:
 - Respect the argument schema and only use the allowed values for element type, which are 'Title', 'Subtitle' and 'Description'.
 - Each slide can use the multiple elements and they can be of different type or not.
 - Respect the 'maxLength' value which is the maximum number of characters in a given field. Write less than 70% of that number.

Guidelines:
 - Create 8-15 slides.
 - Each slide has 2-3 different elements. E.g. [Title, Description], or [Title, Subtitle], or [Subtitle, Description].
 - Each slide All the elements in that slide are about that idea.
 - Adapt, reorganize and rephrase the content to fit the slides format.
 - Don't add slide numbers.
 - Description element text should be short.
`;

export async function generateCarouselSlides(
  topicPrompt: string,
  apiKey: string
): Promise<z.infer<typeof MultiSlideSchema> | null> {
  const client = new Anthropic({ apiKey });

  const result = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: systemPrompt,
    tools: [carouselToolSchema],
    tool_choice: { type: "tool", name: "carouselCreator" },
    messages: [{ role: "user", content: topicPrompt }],
  });

  const toolBlock = result.content.find((block) => block.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    console.log("Error: no tool use block in response");
    return null;
  }

  const unstyledDocumentParseResult = UnstyledDocumentSchema.safeParse(
    toolBlock.input
  );
  if (unstyledDocumentParseResult.success) {
    return MultiSlideSchema.parse(unstyledDocumentParseResult.data.slides);
  } else {
    console.log("Error in carousel generation schema");
    console.error(unstyledDocumentParseResult.error);
    console.log(toolBlock.input);
    return null;
  }
}
