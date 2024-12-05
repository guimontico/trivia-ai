import OpenAI from "openai";
import { TriviaPrompt, TriviaResponse, TriviaResponseSchema } from "./types";
import { zodResponseFormat } from "./zodUtils";

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
            "You are a trivia question generator. Generate a single trivia question based on the given category and difficulty.",
        },
        {
          role: "user",
          content: `Generate a ${prompt.difficulty} trivia question about ${prompt.category}. Return it in JSON format with question, answer, explanation, and optionally tips (array of strings) fields.`,
        },
      ],
      response_format: zodResponseFormat(TriviaResponseSchema, "trivia"),
    });

    const parsed = TriviaResponseSchema.parse(JSON.parse(completion.choices[0].message.content!));
    return parsed;
  }
}
