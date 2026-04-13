export type AIModel = {
  id: string;
  name: string;
  extraBody?: Record<string, unknown>;
};

export const AI_MODELS: AIModel[] = [
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
  },
  {
    id: "google/gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    extraBody: {
      reasoning: { effort: "high" },
    },
  },
];

export const DEFAULT_MODEL_ID = AI_MODELS[0].id;

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === id);
}
