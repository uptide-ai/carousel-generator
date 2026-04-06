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
You are a text formatter that organizes provided text into carousel slides.

Rules:
 - Respect the argument schema. Only use element types: 'Title', 'Subtitle', 'Description'.
 - Each slide can have multiple elements of different types.
 - Respect 'maxLength' constraints. Write less than 70% of the max.

Guidelines:
 - Split the provided text into 8-15 slides.
 - Each slide has 2-3 elements. E.g. [Title, Description], or [Title, Subtitle], or [Subtitle, Description], etc.
 - Each slide should focus on one idea or section from the text.
 - Preserve the original meaning and wording as much as possible. Only rephrase when needed to fit the slide format.
 - Don't add slide numbers.
 - Don't invent new content. Only use what's in the provided text.
 - Description text should be short and concise.
 - Pay attention and keep line breaks. If there is a line break (\n) transform into two (\n\n) so the final text is properly spaced.
`;

export async function generateCarouselSlides(
  topicPrompt: string,
  apiKey: string
): Promise<z.infer<typeof MultiSlideSchema> | null> {
  const client = new Anthropic({ apiKey });

  // --- AI Debug Logs (comment/uncomment as needed) ---
  console.groupCollapsed("[AI] Request");
  console.log("Prompt:", topicPrompt);
  console.log("Model:", "claude-haiku-4-5-20251001");
  console.log("System:", systemPrompt);
  console.log("Tool schema:", JSON.stringify(carouselToolSchema, null, 2));
  console.groupEnd();
  // --- End AI Debug Logs ---

  const result = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: systemPrompt,
    tools: [carouselToolSchema],
    tool_choice: { type: "tool", name: "carouselCreator" },
    messages: [{ role: "user", content: topicPrompt }],
  });

  const toolBlock = result.content.find((block) => block.type === "tool_use");

  // --- AI Debug Logs (comment/uncomment as needed) ---
  console.groupCollapsed("[AI] Response");
  console.log("Usage:", result.usage);
  console.log("Stop reason:", result.stop_reason);
  console.log("Tool output:", JSON.stringify(toolBlock?.type === "tool_use" ? toolBlock.input : null, null, 2));
  console.groupEnd();
  // --- End AI Debug Logs ---

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
