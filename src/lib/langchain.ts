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
import { UnstyledContentImageSchema } from "@/lib/validation/image-schema";

const carouselToolSchema = {
  name: "carouselCreator",
  description: "Creates a carousel with multiple slides for a given topic.",
  input_schema: zodToJsonSchema(UnstyledDocumentSchema, {
    definitions: {
      UnstyledTitleSchema,
      UnstyledSubtitleSchema,
      UnstyledDescriptionSchema,
      UnstyledContentImageSchema,
    },
  }) as Anthropic.Tool["input_schema"],
};

const BASE_PROMPT = `
You are a carousel layout engine. You organize provided text (and visual hints) into structured carousel slides.

Universal rules:
 - Respect the argument schema and 'maxLength' constraints. Write less than 80% of the max.
 - Each slide can have 1-3 elements of different types.
 - Each slide should focus on one idea or section from the text.
 - Preserve the original meaning and wording as much as possible. Only rephrase when needed to fit the slide format.
 - Don't add slide numbers.
 - Don't invent new content. Only use what's in the provided text.
 - Pay attention and keep line breaks. If there is a line break (\\n) transform into two (\\n\\n) so the final text is properly spaced.

Image placeholders:
 - ContentImage is a visual placeholder (no text, no source). The user will add the actual image later.
 - Only add ContentImage when the input text explicitly suggests a visual (e.g. "sugestão visual:", "imagem:", a chart/graph description, or any visual cue).
 - Place ContentImage where the visual suggestion appears in the slide structure.
 - Do NOT include the visual suggestion text in any text element — replace it with a ContentImage placeholder.
 - Never add ContentImage speculatively — only when the text explicitly requests it.
`;

const TEMPLATE_PROMPTS: Record<string, string> = {
  default: `
Template: default
Available element types: Title, Subtitle, Description, ContentImage.
 - Title: short, impactful headline (max 160 chars). Use for the main idea of a slide.
 - Subtitle: secondary headline (max 160 chars). Use for supporting context or a sub-point.
 - Description: body text. Use for longer explanations, arguments, or narrative. Keep it short and concise.
 - ContentImage: image placeholder (see universal rules above).

Layout guidelines:
 - Split the provided text into 6-10 slides.
 - Vary slide compositions. Examples:
   Text-only: [Title], [Description], [Title, Description], [Title, Subtitle], [Subtitle, Description], [Title, Subtitle, Description].
   With image: [Title, ContentImage], [ContentImage, Description], [Title, ContentImage, Description], [ContentImage].
`,

  tweet: `
Template: tweet
Available element types: Description, ContentImage ONLY. Do NOT use Title or Subtitle under any circumstances.
 - Description: the post body. One thought per slide. Short, direct, conversational — like a real post on X/Twitter.
 - ContentImage: image placeholder (see universal rules above).

Layout guidelines:
 - Split the provided text into 6-10 slides.
 - Each slide is a standalone post — one idea, one paragraph at most.
 - Slide compositions: [Description] or [Description, ContentImage] or [ContentImage, Description].
 - Never use Title. Never use Subtitle. Only Description and ContentImage.
`,
};

function getSystemPrompt(template: string): string {
  const templateSection = TEMPLATE_PROMPTS[template] ?? TEMPLATE_PROMPTS.default;
  return `${BASE_PROMPT}\n${templateSection}`;
}

export async function generateCarouselSlides(
  topicPrompt: string,
  apiKey: string,
  template: string = "default"
): Promise<z.infer<typeof MultiSlideSchema> | null> {
  const client = new Anthropic({ apiKey });

  // --- AI Debug Logs (comment/uncomment as needed) ---
  console.groupCollapsed("[AI] Request");
  console.log("Prompt:", topicPrompt);
  console.log("Model:", "claude-haiku-4-5-20251001");
  console.log("System:", getSystemPrompt(template));
  console.log("Tool schema:", JSON.stringify(carouselToolSchema, null, 2));
  console.groupEnd();
  // --- End AI Debug Logs ---

  const result = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: getSystemPrompt(template),
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
