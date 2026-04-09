import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  MultiSlideSchema,
} from "@/lib/validation/slide-schema";
import { UnstyledDocumentSchema } from "@/lib/validation/document-schema";
import { getModelById, DEFAULT_MODEL_ID } from "@/lib/ai-models";

// No definitions option — inlines all sub-schemas so models without $ref support work correctly
const toolJsonSchema = zodToJsonSchema(UnstyledDocumentSchema);

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
  template: string = "default",
  modelId?: string
): Promise<z.infer<typeof MultiSlideSchema> | null> {
  const model = getModelById(modelId || DEFAULT_MODEL_ID);
  if (!model) return null;

  const systemPrompt = getSystemPrompt(template);

  const body: Record<string, unknown> = {
    model: model.id,
    max_tokens: 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: topicPrompt },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "carouselCreator",
          description:
            "Creates a carousel with multiple slides for a given topic.",
          parameters: toolJsonSchema,
        },
      },
    ],
    tool_choice: {
      type: "function",
      function: { name: "carouselCreator" },
    },
    ...(model.extraBody || {}),
  };

  // --- AI Debug Logs (comment/uncomment as needed) ---
  console.groupCollapsed("[AI] Request");
  console.log("Model:", model.id);
  console.log("Template:", template);
  console.log("System:", systemPrompt);
  console.log("Tool schema:", JSON.stringify(toolJsonSchema, null, 2));
  console.log("User prompt:", topicPrompt);
  console.groupEnd();
  // --- End AI Debug Logs ---

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Carousel Generator",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[AI] Error:", response.status, errorText);
    return null;
  }

  const result = await response.json();

  const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];

  // --- AI Debug Logs (comment/uncomment as needed) ---
  console.groupCollapsed("[AI] Response");
  console.log("Usage:", result.usage);
  console.log("Stop reason:", result.choices?.[0]?.finish_reason);
  console.log(
    "Tool output:",
    toolCall?.function?.arguments
  );
  console.groupEnd();
  // --- End AI Debug Logs ---

  if (!toolCall) {
    console.log("Error: no tool call in response");
    return null;
  }

  let toolInput: unknown;
  try {
    toolInput = JSON.parse(toolCall.function.arguments);
  } catch (e) {
    console.error("Error parsing tool arguments:", e);
    return null;
  }

  const unstyledDocumentParseResult =
    UnstyledDocumentSchema.safeParse(toolInput);
  if (unstyledDocumentParseResult.success) {
    return MultiSlideSchema.parse(unstyledDocumentParseResult.data.slides);
  } else {
    console.log("Error in carousel generation schema");
    console.error(unstyledDocumentParseResult.error);
    console.log(toolInput);
    return null;
  }
}
