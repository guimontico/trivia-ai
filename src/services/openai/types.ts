import { z } from "zod";

export const TriviaPromptSchema = z.object({
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const TriviaResponseSchema = z.object({
  question: z.string(),
  answer: z.string(),
  explanation: z.string(),
  tips: z.array(z.string()).optional(),
});

export type TriviaPrompt = z.infer<typeof TriviaPromptSchema>;
export type TriviaResponse = z.infer<typeof TriviaResponseSchema>;
