import { Sparkles } from "lucide-react";
import { NoApiKeysText } from "./no-api-keys-text";

import { AITextAreaForm } from "@/components/ai-textarea-form";

export function AIPanel() {
  // const { apiKey } = useKeysContext();
  const apiKey = true; // TODO: Re-enable local keys
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-row items-center gap-2">
        <Sparkles className="w-5 h-5" />
        <h4 className="text-xl font-semibold">Generate with AI</h4>
      </div>
      <p className="text-sm text-muted-foreground">
        Paste your text and let AI organize it into slides.
      </p>
      {apiKey ? (
        <AITextAreaForm />
      ) : (
        <NoApiKeysText />
      )}
    </div>
  );
}
