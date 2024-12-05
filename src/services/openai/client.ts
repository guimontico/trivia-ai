import OpenAI from "openai";
import { TriviaPrompt, TriviaResponse } from "./types";

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
    });
  }

  async generateTrivia(prompt: TriviaPrompt): Promise<TriviaResponse> {
    const completion = await this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a trivia question generator. Generate a single trivia question based on the given category and difficulty.",
        },
        {
          role: "user",
          content: `Generate a ${prompt.difficulty} trivia question about ${prompt.category}. Return it in JSON format with question, answer, options (array with 4 choices including the correct answer), and explanation fields.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content!) as TriviaResponse;
  }
}
