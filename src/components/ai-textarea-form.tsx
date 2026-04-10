"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { useRef, useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { generateCarouselSlidesAction } from "@/app/actions";
import { usePagerContext } from "@/lib/providers/pager-context";
import { MultiSlideSchema } from "@/lib/validation/slide-schema";

const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }),
});

const WORD_DELAY = 54; // ms per word
const ELEMENT_PAUSE = 80; // ms pause between elements
const SLIDE_PAUSE = 150; // ms pause between slides
const SLIDES_PER_GROUP = 3; // navigate every N slides

export function AITextAreaForm({ modelId }: { modelId: string }) {
  const { setValue }: DocumentFormReturn = useFormContext();
  const { setCurrentPage, scrollToPage } = usePagerContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cancelRef = useRef(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function animateSlides(
    slides: z.infer<typeof MultiSlideSchema>
  ) {
    // Create empty slides (text blanked out, images kept as-is)
    const emptySlides = slides.map((slide) => ({
      ...slide,
      elements: slide.elements.map((el) =>
        "text" in el ? { ...el, text: "" } : el
      ),
    }));

    setValue("slides", emptySlides);
    setCurrentPage(0);

    const delay = (ms: number) =>
      new Promise((r) => setTimeout(r, ms));

    const finalize = () => {
      // Replace full slides array AND explicitly set each text field so every
      // field subscriber re-renders with the completed value.
      setValue("slides", slides);
      for (let s = 0; s < slides.length; s++) {
        for (let e = 0; e < slides[s].elements.length; e++) {
          const el = slides[s].elements[e];
          if ("text" in el) {
            setValue(`slides.${s}.elements.${e}.text`, el.text);
          }
        }
      }
      setCurrentPage(0);
    };

    outer: for (let s = 0; s < slides.length; s++) {
      if (cancelRef.current) break outer;

      // Navigate to first slide of each new group
      if (s % SLIDES_PER_GROUP === 0) {
        scrollToPage(s);
        await delay(600); // let carousel scroll settle
        if (cancelRef.current) break outer;
      }
      await delay(SLIDE_PAUSE);
      if (cancelRef.current) break outer;

      for (let e = 0; e < slides[s].elements.length; e++) {
        if (cancelRef.current) break outer;
        const element = slides[s].elements[e];
        if (!("text" in element)) continue;

        const fullText = element.text;
        const words = fullText.split(/(\s+)/); // split keeping whitespace
        let built = "";
        for (const word of words) {
          if (cancelRef.current) break outer;
          built += word;
          // Only delay on actual words, not whitespace
          if (word.trim()) {
            setValue(`slides.${s}.elements.${e}.text`, built);
            await delay(WORD_DELAY);
          }
        }
        await delay(ELEMENT_PAUSE);
      }
    }

    // Always finalize — covers both normal completion and skip
    finalize();
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    cancelRef.current = false;

    const generatedSlides = await generateCarouselSlidesAction(data.prompt, modelId);

    if (generatedSlides) {
      setIsLoading(false);
      setIsAnimating(true);
      await animateSlides(generatedSlides);
      setIsAnimating(false);
      toast({
        title: "New carousel generated",
      });
    } else {
      toast({
        title: "Failed to generate carousel",
      });
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2 w-full">
                  <Textarea
                    placeholder="Cole seu texto aqui para organizar em slides..."
                    className="w-full overflow-y-auto min-h-[200px]"
                    {...field}
                  />
                  {isAnimating ? (
                    <Button
                      type="button"
                      className="w-full"
                      variant="secondary"
                      onClick={() => {
                        cancelRef.current = true;
                      }}
                    >
                      Skip Animation
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <span className="flex flex-row gap-1.5">
                          <Sparkles className="w-4 h-4" /> Format
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
