import { z } from "zod";

export const TriviaPromptSchema = z.object({
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const TriviaResponseSchema = z.object({
  question: z.string(),
  answer: z.string().refine((val) => val.trim().split(/\s+/).length === 1, {
    message: "Answer must be exactly one word"
  }),
  tips: z.array(z.string()).length(20),
});

export type TriviaPrompt = z.infer<typeof TriviaPromptSchema>;
export type TriviaResponse = z.infer<typeof TriviaResponseSchema>;
