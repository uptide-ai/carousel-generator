"use client";

import { Sparkles } from "lucide-react";
import { NoApiKeysText } from "./no-api-keys-text";
import { useState } from "react";

import { AITextAreaForm } from "@/components/ai-textarea-form";
import { AI_MODELS, DEFAULT_MODEL_ID } from "@/lib/ai-models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AIPanel() {
  // const { apiKey } = useKeysContext();
  const apiKey = true; // TODO: Re-enable local keys
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-row items-center gap-2">
        <Sparkles className="w-5 h-5" />
        <h4 className="text-xl font-semibold">Generate with AI</h4>
      </div>
      <p className="text-sm text-muted-foreground">
        Paste your text and let AI organize it into slides.
      </p>
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {apiKey ? (
        <AITextAreaForm modelId={selectedModel} />
      ) : (
        <NoApiKeysText />
      )}
    </div>
  );
}
