import * as z from "zod";

export const TemplateType = z.enum(["default", "tweet"]);
export type TemplateType = z.infer<typeof TemplateType>;
