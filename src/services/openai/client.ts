import OpenAI from "openai";
import { TriviaPrompt, TriviaResponse, TriviaResponseSchema } from "./types";

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
    });
  }

  async generateTrivia(prompt: TriviaPrompt): Promise<TriviaResponse> {
    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a trivia question generator. Generate a single trivia question based on the given category and difficulty. The response must follow these rules:\n1. The answer must be exactly ONE word\n2. Provide between 10-20 tips in random order\n3. Each tip should start with 'Tip: ' and be concise\n4. Tips should help users guess the one-word answer",
        },
        {
          role: "user",
          content: `Generate a ${prompt.difficulty} trivia question about ${prompt.category}. The answer must be ONE word. Return in JSON format with:\n- question (string)\n- answer (one-word string)\n- tips (array of strings, each starting with 'Tip: ')`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = TriviaResponseSchema.parse(JSON.parse(completion.choices[0].message.content!));
    return parsed;
  }
}
